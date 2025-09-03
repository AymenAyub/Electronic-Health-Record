import { Phone, Stethoscope, Pen, Trash2 } from "lucide-react";
import { useState } from "react";

export default function DoctorCard({ doctor, onEdit, onDelete }: { doctor: any, onEdit?: () => void, onDelete?: () => void }) {
  const [hoveredIcon, setHoveredIcon] = useState<null | "edit" | "delete">(null);

  return (
    <div className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 p-4 flex flex-col justify-between">
      
      <div className="absolute top-3 right-3 flex gap-2">
        <div className="relative">
          <button
            onClick={onEdit}
            onMouseEnter={() => setHoveredIcon("edit")}
            onMouseLeave={() => setHoveredIcon(null)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <Pen size={16} className="text-blue-600" />
          </button>
          {hoveredIcon === "edit" && (
            <div className="absolute -top-7 right-0 bg-gray-700 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
              Edit
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={onDelete}
            onMouseEnter={() => setHoveredIcon("delete")}
            onMouseLeave={() => setHoveredIcon(null)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
          {hoveredIcon === "delete" && (
            <div className="absolute -top-7 right-0 bg-gray-700 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
              Delete
            </div>
          )}
        </div>
      </div>

      {/* Doctor info */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{doctor.name}</h2>
        <div className="flex items-center text-sm font-semibold text-gray-600 mt-2">
          <Stethoscope size={18} className="mr-2 text-blue-600" />
          <span>{doctor.specialty}</span>
        </div>

        {/* Bio */}
        {doctor.bio && (
          <p className="mt-3 text-gray-700 text-sm line-clamp-3">
            {doctor.bio}
          </p>
        )}
      </div>

      {/* Contact */}
      <div className="flex items-center text-sm font-semibold text-gray-600 mt-4">
        <Phone size={18} className="mr-2 text-green-600" />
        <span>{doctor.contact}</span>
      </div>
    </div>
  );
}
