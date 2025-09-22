import { Phone, Stethoscope, Pen, Trash2 } from "lucide-react";
import { useState } from "react";

const gradients = [
  "from-blue-400 to-blue-600",
  "from-green-400 to-green-600",
  "from-purple-400 to-purple-600",
  "from-pink-400 to-pink-600",
  "from-yellow-400 to-orange-500",
  "from-teal-400 to-cyan-600",
  "from-red-400 to-rose-600",
];

function getGradient(name: string) {
  if (!name) return gradients[0];
  const codeSum = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return gradients[codeSum % gradients.length];
}

export default function DoctorCard({
  doctor,
  onEdit,
  onDelete,
}: {
  doctor: any;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const [hoveredIcon, setHoveredIcon] = useState<null | "edit" | "delete">(null);
  const gradient = getGradient(doctor.name);

  return (
    <div className="relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 flex flex-col group">
      
      {/* Floating Action Icons */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="relative">
          <button
            onClick={onEdit}
            onMouseEnter={() => setHoveredIcon("edit")}
            onMouseLeave={() => setHoveredIcon(null)}
            className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <Pen size={16} className="text-blue-600" />
          </button>
          {hoveredIcon === "edit" && (
            <div className="absolute -top-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-md shadow-lg">
              Edit
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={onDelete}
            onMouseEnter={() => setHoveredIcon("delete")}
            onMouseLeave={() => setHoveredIcon(null)}
            className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
          {hoveredIcon === "delete" && (
            <div className="absolute -top-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-md shadow-lg">
              Delete
            </div>
          )}
        </div>
      </div>

      {/* Avatar + Info */}
      <div className="flex items-center gap-4">
        <div
          className={`h-14 w-14 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center text-white font-semibold text-lg shadow-md`}
        >
          {doctor.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{doctor.name}</h2>
          <div className="flex items-center gap-2 text-sm font-medium text-blue-600 mt-1">
            <Stethoscope size={16} />
            <span>{doctor.specialty || "General Practitioner"}</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      {doctor.bio && (
        <p className="mt-4 text-gray-700 text-sm leading-relaxed line-clamp-3">
          {doctor.bio}
        </p>
      )}

      {/* Contact */}
      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium mt-4">
        <Phone size={16} className="text-green-600" />
        <span>{doctor.contact || "Not Provided"}</span>
      </div>
    </div>
  );
}
