"use client";
import { useState } from "react";
import { LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserProfileDropdown({ role }: { role: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="relative flex items-center gap-3 cursor-pointer">
      <div
        className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-700 flex items-center justify-center text-white font-bold"
        onClick={() => setOpen(!open)}
      >
        {role?.charAt(0).toUpperCase()}
      </div>
      <span className="capitalize">{role} Panel</span>

      {open && (
        <ul className="absolute bottom-12 left-0 bg-white shadow-lg rounded-md w-40 py-2 z-50">
          <li
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              router.push("/profile");
              setOpen(false);
            }}
          >
            <User size={16} /> Profile
          </li>
          <li
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              router.push("/Settings");
              setOpen(false);
            }}
          >
            <Settings size={16} /> Settings
          </li>
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
