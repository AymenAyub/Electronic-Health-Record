import { Phone, Stethoscope } from "lucide-react";

export default function DoctorCard({ doctor }: { doctor: any }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 p-4 flex flex-col justify-between">
      {/* Doctor info */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{doctor.name}</h2>

        <div className="flex items-center text-sm text-gray-600 mt-2">
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
      <div className="flex items-center text-sm text-gray-600 mt-4">
        <Phone size={18} className="mr-2 text-green-600" />
        <span>{doctor.contact}</span>
      </div>

      {/* Status badge */}
      <div className="mt-5">
        <span
          className={`inline-block px-4 py-1 text-xs font-semibold rounded-full ${
            doctor.status === "Active"
              ? "bg-blue-100 text-blue-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {doctor.status}
        </span>
      </div>
    </div>
  );
}
