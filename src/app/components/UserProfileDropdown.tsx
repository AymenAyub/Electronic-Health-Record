"use client";
import { useState } from "react";
import { LogOut, Settings, User } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

interface UserProfileDropdownProps {
  role: string | null;
  hospitalId?: string | null; // optional prop if you want to pass it from parent
}

export default function UserProfileDropdown({ role }: UserProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const rawHospitalId = params?.hospitalId;
  const hospitalId = Array.isArray(rawHospitalId) ? rawHospitalId[0] : rawHospitalId;

  return (
    <div className="relative flex items-center gap-2">
      {/* Profile Circle (clickable) */}
      <div
        className="w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-700 flex items-center justify-center text-white font-bold cursor-pointer transition-colors"
        onClick={() => setOpen(!open)}
      >
        <User size={18} />
      </div>

      {/* Role Text (not clickable) */}
      <span className="text-sm font-semibold text-gray-700 capitalize">
        {role || "User"} Panel
      </span>

      {/* Dropdown Menu */}
      {open && (
        <ul className="absolute bottom-12 left-0 bg-white shadow-lg rounded-md w-44 py-2 z-50">
          {/* Only show Settings if hospital exists */}
          {hospitalId && (
            <li
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                router.push(`/dashboard/${hospitalId}/Settings`);
                setOpen(false);
              }}
            >
              <Settings size={16} /> Settings
            </li>
          )}

          {/* Logout always visible */}
          <li
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
            onClick={() => {
              localStorage.clear();
              router.push("/Login");
            }}
          >
            <LogOut size={16} /> Logout
          </li>
        </ul>
      )}
    </div>
  );
}
