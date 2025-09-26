"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { User, Calendar, Clock, Users, Plus } from "lucide-react";
import AddPatientModal from "@/app/components/AddPatientModal";

export default function AddAppointmentModal({
  onClose,
  onSave,
  hospitalId,
  patients: initialPatients,
  doctors,
  token,
  appointment,
}: any) {
  const [formData, setFormData] = useState({
    hospital_id: hospitalId || "",
    patient_id: "",
    doctor_id: "",
    appointment_date: "", 
    start_time: "",       
    status: "Scheduled",
  });

  const [patients, setPatients] = useState(initialPatients || []);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  
  useEffect(() => {
    const fetchSlots = async () => {
      if (!formData.doctor_id || !selectedDate) return;
      setLoadingSlots(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/doctors/${formData.doctor_id}/availability?date=${selectedDate}&hospital_id=${hospitalId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (res.ok) setAvailableSlots(data.slots || []);
        else {
          alert(data.message || "Failed to fetch slots");
          setAvailableSlots([]);
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching slots");
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [formData.doctor_id, selectedDate, hospitalId, token]);

  useEffect(() => {
  if (appointment) {
     const formattedDate = format(new Date(appointment.appointment_date), "yyyy-MM-dd");
    setFormData({
      hospital_id: appointment.hospital_id,
      patient_id: appointment.patient_id,
      doctor_id: appointment.doctor_id,
      appointment_date: formattedDate,
      start_time: appointment.start_time,
      status: appointment.status || "Scheduled",
    });
    setSelectedDate(formattedDate);
  } else {
    setFormData(prev => ({ ...prev, hospital_id: hospitalId || "" }));
  }
}, [appointment, hospitalId]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSlotSelect = (slot: string) => {
    setFormData({
      ...formData,
      appointment_date: selectedDate,
      start_time: slot,
    });
  };
  const handleSubmit = async () => {
    const { patient_id, doctor_id, appointment_date, start_time } = formData;
    if (!patient_id || !doctor_id || !appointment_date || !start_time) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await onSave(formData, appointment);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save appointment");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="relative bg-white rounded-xl max-w-2xl w-full p-6 border border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
           {appointment ? "Edit Appointment" : "Schedule Appointment"}
        </h2>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          {/* Patient */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">Patient</label>
            <Users className="absolute left-3 top-10 text-gray-400" size={18} />
            <div className="flex gap-2">
              <select
                name="patient_id"
                value={formData.patient_id}
                onChange={handleChange}
                className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              >
                <option value="">Select Patient</option>
                {patients?.map((p: any) => (
                  <option key={p.patient_id} value={p.patient_id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Doctor */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">Doctor</label>
            <User className="absolute left-3 top-10 text-gray-400" size={18} />
            <select
              name="doctor_id"
              value={formData.doctor_id}
              onChange={handleChange}
              className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            >
              <option value="">Select Doctor</option>
              {doctors?.map((d: any) => (
                <option key={d.user_id} value={d.user_id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">Date</label>
            <Calendar className="absolute left-3 top-10 text-gray-400" size={18} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>

          {/* Available Slots */}
          {selectedDate && formData.doctor_id && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">Available Slots</label>
              {loadingSlots ? (
                <p className="text-gray-500">Loading slots...</p>
              ) : availableSlots.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                 {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => handleSlotSelect(slot)}
                      disabled={loadingSlots}
                      className={`px-3 py-2 rounded-md border transition ${
                        formData.start_time === slot ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100"
                      }`}
                    >
                      {slot.slice(0,5)} {/* show HH:MM */}
                    </button>
                  ))}


                </div>
              ) : (
                <p className="text-gray-500">No slots available</p>
              )}
            </div>
          )}

          {/* Status */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>


          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-blue-500 rounded-md text-gray-700 hover:bg-blue-500 hover:text-white transition"
            >
              Cancel
            </button>
           <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow transition duration-300 hover:shadow-purple-500/30 text-sm"
          >
            {appointment ? "Save Changes" : "Schedule"}
          </button>
          </div>
        </form>
      </div>
    </div>
  );
}
