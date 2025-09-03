"use client";

import { useState, useEffect } from "react";
import { format, isSameDay, isThisWeek, isThisMonth } from "date-fns";
import { UserPlus, Calendar, Search, ArrowLeft, ArrowRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import AddAppointmentModal from "@/app/components/AddAppointmentModal";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [statusFilter, setStatusFilter] = useState<"All" | "Scheduled" | "Completed" | "Cancelled">("All");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingAppointment, setEditingAppointment] = useState<any | null>(null);


  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;

  const router = useRouter();
  const params = useParams();
const hospitalId = params?.hospitalId;
console.log("hospitalId from useParams:", hospitalId);


  const fetchAppointments = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments?hospital_id=${hospitalId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await res.json();
      console.log('hospitalId', hospitalId);

      if (res.ok) {
        setAppointments(
          data.appointments.map((a: any) => ({
            ...a,
            appointment_date: new Date(a.appointment_date + "T00:00:00") // force local midnight
          }))
        );
      }
      else {
        alert(data.message || "Failed to fetch appointments");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching appointments");
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/getPatients?hospital_id=${hospitalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setPatients(data.patients);
      else alert(data.message || "Failed to fetch patients");
    } catch (err) {
      console.error(err);
      alert("Error fetching patients");
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/getDoctors?hospital_id=${hospitalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setDoctors(data.doctors);
      else alert(data.message || "Failed to fetch doctors");
    } catch (err) {
      console.error(err);
      alert("Error fetching doctors");
    }
  };

  useEffect(() => {
    if (!token || !userStr) {
      router.push("/Login");
      return;
    } else {
      setLoading(false);
      setAuthorized(true);
      fetchDoctors();
    }
  }, [router]);

  useEffect(() => {
    if (hospitalId && token) {
      fetchAppointments();
      fetchPatients();
      fetchDoctors();
    }
  }, [hospitalId, token]);

  const handleSaveAppointment = async (appointmentData: any) => {
  try {
    console.log(editingAppointment.id);
    const url = editingAppointment
      ? `http://localhost:5000/api/updateAppointment/${editingAppointment.id}`
      : "http://localhost:5000/api/scheduleAppointment";
    const method = editingAppointment ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...appointmentData, hospital_id: hospitalId }),
    });

    const data = await res.json();
    if (res.ok) {
      if (editingAppointment) {
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.appointment_id === editingAppointment.id
              ? { ...apt, ...data.data }
              : apt
          )
        );
      } else {
        setAppointments([
          ...appointments,
          {
            ...data.data,
            appointment_date: new Date(data.data.appointment_date),
            start_time: data.data.start_time,
            end_time: data.data.end_time,
          },
        ]);
      }
      fetchAppointments();
      setIsModalOpen(false);
      setEditingAppointment(null);
    } else {
      alert(data.message || "Failed to save appointment");
    }
  } catch (err) {
    console.error(err);
    alert("Error saving appointment");
  }
};

  const filteredAppointments = appointments
  .map(a => ({ ...a, appointment_date: new Date(a.appointment_date) }))
  .filter((apt) => {

    let matchDate = true;
    if (selectedDate) matchDate = isSameDay(apt.appointment_date, selectedDate);
    else if (dateFilter === "today") matchDate = isSameDay(apt.appointment_date, new Date());
    else if (dateFilter === "week") matchDate = isThisWeek(apt.appointment_date);
    else if (dateFilter === "month") matchDate = isThisMonth(apt.appointment_date);

    let matchStatus = statusFilter === "All" ? true : apt.status === statusFilter;

    const patientName = apt.patient_name ? apt.patient_name.toLowerCase() : "";
    const doctorName = apt.doctor_name ? apt.doctor_name.toLowerCase() : "";
    const matchSearch =
      patientName.includes(searchTerm.toLowerCase()) ||
      doctorName.includes(searchTerm.toLowerCase());

    return matchDate && matchStatus && matchSearch;
  });

  const getDatesInMonth = (month: Date) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => new Date(year, monthIndex, i + 1));
  };

  const datesInMonth = getDatesInMonth(currentMonth);

  const handlePrevMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  if (!authorized) return null;
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="flex max-w-7xl mx-auto p-6 gap-6 flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 mb-3 md:mb-0">
          <Calendar size={28} className="text-blue-600" />
          <h1 className="text-3xl md:text-3xl font-bold text-blue-600 tracking-tight">
            Schedule Appointments
          </h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 font-semibold"
        >
          <UserPlus size={20} />
          Add Appointment
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow relative">
          <input
            type="text"
            placeholder="Search by patient or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-200 rounded-lg font-semibold px-4 py-3 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200 "
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-700">
            <Search size={20} />
          </span>
        </div>

        <select
          name="dateFilter"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value as "all" | "today" | "week" | "month");
            setSelectedDate(null);
          }}
          className="w-full md:w-56 border border-gray-200 rounded-lg font-semibold px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200 hover:shadow-md"
        >
         <option value="all">All</option>

          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className="flex gap-3 mb-4">
      {["All", "Scheduled", "Completed", "Cancelled"].map((status) => (
        <button
          key={status}
          onClick={() => setStatusFilter(status as any)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            statusFilter === status
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-blue-50"
          }`}
        >
          {status}
        </button>
      ))}
    </div>

      {/* Appointments Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg mb-6">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-6 py-3">Patient</th>
              <th className="px-6 py-3">Doctor</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>

              
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((apt, i) => (
                <tr key={i} className="border border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3">{apt.patient_name}</td>
                  <td className="px-6 py-3">{apt.doctor_name}</td>
                  <td className="px-6 py-3">{format(apt.appointment_date, "dd MMM yyyy")}</td>
                  <td className="px-6 py-3">
                    {apt.start_time} - {apt.end_time}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        apt.status === "Scheduled" || apt.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 flex gap-2">
                <button
                  onClick={() => {
                        setEditingAppointment(apt);
                        setIsModalOpen(true);
                      }}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-yellow-600 text-xs"
                >
                  Edit
                </button>
              </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Calendar */}
      <div className="flex justify-between items-center mb-4 w-11/12 mx-auto">
        <button
          onClick={handlePrevMonth}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
        >
          <ArrowLeft size={18} />
          Prev
        </button>

        <div className="text-xl font-semibold text-gray-800">
          {format(currentMonth, "MMMM yyyy")}
        </div>

        <button
          onClick={handleNextMonth}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
        >
          Next
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 bg-white p-6 rounded-2xl shadow-xl w-[95%] md:w-[85%] lg:w-[95%] mx-auto">
        {datesInMonth.map((date) => (
          <div
            key={date.toISOString()}
            onClick={() => setSelectedDate(date)}
            className={`relative h-16 px-2 py-1 text-sm font-semibold cursor-pointer transition-all duration-200 ease-in-out rounded-lg
              ${
                selectedDate && isSameDay(date, selectedDate)
                  ? "bg-blue-600 text-white shadow-md scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-50 shadow-sm hover:shadow-md hover:scale-105"
              }`}
          >
            <span className="absolute top-1 left-2">{format(date, "d")}</span>
          </div>
        ))}
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="w-11/12 mx-auto bg-white rounded-2xl p-4 shadow flex flex-col gap-2 mt-4">
          <h4 className="text-gray-700 font-semibold">
            {format(selectedDate, "EEEE, dd MMM")}
          </h4>
          {appointments
            .filter((apt) => isSameDay(apt.appointment_date, selectedDate))
            .map((apt, i) => (
              <button
                key={i}
                className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100"
              >
                {apt.start_time} - {apt.end_time}
              </button>
            ))}
        </div>
      )}

      {(isModalOpen || editingAppointment) && (
        <AddAppointmentModal
          onClose={() => {
            setIsModalOpen(false);
            setEditingAppointment(null);
          }}
          appointment={editingAppointment}  
          onSave={handleSaveAppointment}
          hospitalId={hospitalId}
          patients={patients}
          doctors={doctors}
          token={token}
        />
      )}

    </div>
  );
}
