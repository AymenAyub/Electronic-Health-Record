"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Clock, Calendar, Pen, Trash2 } from "lucide-react";

// Better: store day as number (DB compatible)
const daysOfWeek = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

export default function DoctorAvailability() {
  const [slots, setSlots] = useState<
    { id?: number; day: number; startTime: string; endTime: string; slotDuration: number }[]
  >([]);
  const [currentSlot, setCurrentSlot] = useState({
    day: 1, // Monday default
    startTime: "",
    endTime: "",
    slotDuration: 30,
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const params = useParams();
  const hospitalId = params?.hospitalId;
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/getMyAvailability", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setSlots(
            data.availabilities.map((a: any) => ({
              id: a.availability_id,
              day: a.day_of_week,
              startTime: a.start_time,
              endTime: a.end_time,
              slotDuration: a.slot_duration,
            }))
          );
        } else {
          setMessage(data.message);
          setTimeout(() => setMessage(""), 3000);
        }
      } catch (err) {
        console.error(err);
        setMessage("Error fetching availability");
        setTimeout(() => setMessage(""), 3000);
      }
    };

    fetchAvailability();
  }, []);

  // const handleSaveAvailability = async () => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     const url =
  //       editIndex !== null
  //         ? `http://localhost:5000/api/updateAvailability/${slots[editIndex].id}`
  //         : "http://localhost:5000/api/addAvailability";

  //     const method = editIndex !== null ? "PUT" : "POST";

  //     const res = await fetch(url, {
  //       method,
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         day_of_week: currentSlot.day,
  //         start_time: currentSlot.startTime,
  //         end_time: currentSlot.endTime,
  //         slot_duration: currentSlot.slotDuration,
  //         hospital_id: hospitalId,
  //       }),
  //     });

  //     const data = await res.json();

  //     if (res.ok) {
  //       if (editIndex !== null) {
  //         setSlots((prev) =>
  //           prev.map((s, idx) => (idx === editIndex ? { ...s, ...currentSlot } : s))
  //         );
  //         setMessage("Availability updated successfully");
  //       } else {
  //         setSlots((prev) => [
  //           ...prev,
  //           { ...currentSlot, id: data.availability.availability_id },
  //         ]);
  //         setMessage("Availability added successfully");
  //       }

  //       setEditIndex(null);
  //       setCurrentSlot({ day: 1, startTime: "", endTime: "", slotDuration: 30 });
  //     } else {
  //       setMessage(data.message || "Failed to save availability");
  //     }

  //     setTimeout(() => setMessage(""), 3000);
  //   } catch (err) {
  //     console.error(err);
  //     setMessage("Error saving availability");
  //     setTimeout(() => setMessage(""), 3000);
  //   }
  // };

  const handleSaveAvailability = async () => {
    try {
      const token = localStorage.getItem("token");
  
      const url = "http://localhost:5000/api/addAvailability"; // Always POST
  
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          day_of_week: currentSlot.day,
          start_time: currentSlot.startTime,
          end_time: currentSlot.endTime,
          slot_duration: currentSlot.slotDuration,
          hospital_id: hospitalId,
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        // If exists, replace it in slots array
        setSlots((prev) => {
          const index = prev.findIndex((s) => s.day === currentSlot.day);
          if (index !== -1) {
            // Replace existing
            prev[index] = {
              ...prev[index],
              ...currentSlot,
              id: data.availability.availability_id,
            };
            return [...prev];
          } else {
            // Add new
            return [...prev, { ...currentSlot, id: data.availability.availability_id }];
          }
        });
  
        setMessage(data.message);
        setCurrentSlot({ day: 1, startTime: "", endTime: "", slotDuration: 30 });
      } else {
        setMessage(data.message || "Failed to save availability");
      }
  
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Error saving availability");
      setTimeout(() => setMessage(""), 3000);
    }
  };
  
  const handleEdit = (index: number) => {
    setCurrentSlot(slots[index]);
    setEditIndex(index);
  };

  const handleDelete = async (index: number) => {
    try {
      const token = localStorage.getItem("token");
      const slotId = slots[index].id;

      if (!slotId) {
        setSlots((prev) => prev.filter((_, i) => i !== index));
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/deleteAvailability/${slotId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSlots((prev) => prev.filter((_, i) => i !== index));
        setMessage("Availability deleted successfully");
      } else {
        setMessage(data.message || "Failed to delete availability");
      }

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Error deleting availability");
      setTimeout(() => setMessage(""), 3000);
    }

    if (editIndex === index) setEditIndex(null);
  };

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 flex items-center gap-2">
        <Calendar size={28} /> Set Your Availability
      </h1>

      {message && (
        <div className="bg-green-100 text-green-700 font-semibold px-4 py-3 rounded-lg mb-2">
          {message}
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4 items-end">
          {/* Day */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Day
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currentSlot.day}
              onChange={(e) =>
                setCurrentSlot({ ...currentSlot, day: Number(e.target.value) })
              }
            >
              {daysOfWeek.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Start Time
            </label>
            <input
              type="time"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currentSlot.startTime}
              onChange={(e) =>
                setCurrentSlot({ ...currentSlot, startTime: e.target.value })
              }
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              End Time
            </label>
            <input
              title="time"
              type="time"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currentSlot.endTime}
              onChange={(e) =>
                setCurrentSlot({ ...currentSlot, endTime: e.target.value })
              }
            />
          </div>

          {/* Slot Duration */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Slot Duration (mins)
            </label>
            <select
            title="slots"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currentSlot.slotDuration}
              onChange={(e) =>
                setCurrentSlot({
                  ...currentSlot,
                  slotDuration: Number(e.target.value),
                })
              }
            >
              {[15, 20, 30, 45, 60].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 font-semibold"
          onClick={handleSaveAvailability}
        >
          {editIndex !== null ? "Update Availability" : "Add Availability"}
        </button>
      </div>

      {/* Slots Table */}
      <div className="overflow-x-auto bg-white rounded-lg">
        <h2 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2 p-4">
          <Clock size={20} /> Your Availability
        </h2>

        {slots.length === 0 ? (
          <p className="text-gray-400 text-center pb-4">
            No availability set yet.
          </p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-md shadow border border-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                <tr>
                  <th className="px-6 py-3">Day</th>
                  <th className="px-6 py-3">Start Time</th>
                  <th className="px-6 py-3">End Time</th>
                  <th className="px-6 py-3">Slot Duration</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot, idx) => (
                  <tr
                    key={idx}
                    className="border border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-3">
                      {daysOfWeek.find((d) => d.value === slot.day)?.label}
                    </td>
                    <td className="px-6 py-3">{slot.startTime}</td>
                    <td className="px-6 py-3">{slot.endTime}</td>
                    <td className="px-6 py-3">{slot.slotDuration} min</td>
                    <td className="px-6 py-3 flex gap-2">
                      <div className="relative">
                        <a
                          onClick={() => handleEdit(idx)}
                          onMouseEnter={() => setHoveredIcon(`edit-${idx}`)}
                          onMouseLeave={() => setHoveredIcon(null)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Pen size={18} className="text-blue-600" />
                        </a>
                        {hoveredIcon === `edit-${idx}` && (
                          <div className="absolute -top-7 left-0 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-lg">
                            Edit
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <a
                          onClick={() => handleDelete(idx)}
                          onMouseEnter={() => setHoveredIcon(`delete-${idx}`)}
                          onMouseLeave={() => setHoveredIcon(null)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </a>
                        {hoveredIcon === `delete-${idx}` && (
                          <div className="absolute -top-7 left-0 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-lg">
                            Delete
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
