"use client";

import { useState, useEffect } from "react";
import {
  Home, UserPlus, Users, CalendarCheck, CreditCard, Settings,
  X, LayoutDashboard, Search, Bell, Building2,
  FileText, Clock, ChevronDown, User, PlusCircle
} from "lucide-react";
import { useRouter, usePathname, useParams } from "next/navigation";
import UserProfileDropdown from "@/app/components/UserProfileDropdown";
import Image from "next/image";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hospitalName, setHospitalName] = useState<string>("Hospital");
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  const [permissions, setPermissions] = useState<string[]>([]);

  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [hospitalDropdownOpen, setHospitalDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const rawHospitalId = params?.hospitalId;
  const hospitalId = Array.isArray(rawHospitalId) ? rawHospitalId[0] : rawHospitalId;

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        router.push("/Login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/permissions/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          router.push("/Login");
          return;
        }

        const data = await res.json();
        setRole(data.role);
        setUserEmail(data.email || "user@email.com");
        setPermissions((data.permissions || []).map(p => p.name));
        setLoading(false);
      } catch (err) {
        console.error(err);
        router.push("/Login");
      }
    };

    fetchUserData();
  }, [router, token]);


  useEffect(() => {
    const storedHospitals = JSON.parse(localStorage.getItem("hospitals") || "[]");
    if (storedHospitals?.length > 0) {
      const normalizedHospitals = storedHospitals
        .filter((h: any) => h.hospital)
        .map((h: any) => ({
          id: h.hospital._id || h.hospital.id,
          name: h.hospital.name,
          subdomain: h.hospital.subdomain,
        }));

      setHospitals(normalizedHospitals);

      const lastHospitalId = localStorage.getItem("lastHospitalId");
      const defaultHospitalId = lastHospitalId || normalizedHospitals[0]?.id;

      setSelectedHospital(defaultHospitalId);
      const found = normalizedHospitals.find((h: any) => h.id === defaultHospitalId);
      if (found) setHospitalName(found.name);
    }
  }, []);

  const handleHospitalSwitch = (id: string) => {
    if (id === "add") {
      router.push("/AddHospital");
      return;
    }
    localStorage.setItem("lastHospitalId", id);
    router.push(`/dashboard/${id}`);
  };


  useEffect(() => {
    if (!token || !hospitalId) return;
    const fetchHospital = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/hospital/${hospitalId}`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setHospitalName(data.hospital.name);
        setSelectedHospital(data.hospital._id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHospital();
  }, [hospitalId]);


  const menuItemsConfig = [
    { key: "dashboard", label: "Dashboard", icon: <Home size={20} />, path: `/dashboard/${hospitalId}`, permission: "view_dashboard" },
    { key: "roleManagement", label: "Role Management", icon: <UserPlus size={20} />, path: `/dashboard/${hospitalId}/RoleManagement`, permission: "view_roles" },
    { key: "userManagement", label: "User Management", icon: <Users size={20} />, path: `/dashboard/${hospitalId}/UserManagement`, permission: "view_users" },
    { key: "patients", label: "Patients", icon: <User size={20} />, path: `/dashboard/${hospitalId}/Patients`, permission: "view_patients" },
    { key: "appointments", label: "Appointments", icon: <CalendarCheck size={20} />, path: `/dashboard/${hospitalId}/Appointments`, permission: "view_appointments" },
    { key: "payments", label: "Payments & Billing", icon: <CreditCard size={20} />, path: `/dashboard/${hospitalId}/Payments`, permission: "view_payments" },
    { key: "availability", label: "Doctor's Availability", icon: <Clock size={20} />, path: `/dashboard/${hospitalId}/availability`,  permission: "view_availability" },
    { key: "medicalHistory", label: "Medical History", icon: <FileText size={20} />, path: `/dashboard/${hospitalId}/MedicalHistory`,  permission: "view_medical_history"},
  ];

  
  const menuItems = menuItemsConfig.filter(item => permissions.includes(item.permission));

  const filteredItems = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      <aside
        className={`fixed top-0 left-0 h-full flex flex-col transition-[width] duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-50 z-20`}
      >
        <div className="flex items-center justify-between p-5">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <Image src="/logo.png" alt="Logo" width={28} height={28} />
              <span className="text-lg font-bold text-blue-600">MediNex</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-blue-600"
          >
            {sidebarOpen ? <X /> : <LayoutDashboard />}
          </button>
        </div>

      
        <nav className="flex flex-col flex-grow mt-2">
  {role === "Owner" && permissions.includes("add_hospital") && (
    <button
      onClick={() => router.push("/AddHospital")}
      className="m-3 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
    >
      <PlusCircle size={18} />
      {sidebarOpen && <span>Add Hospital</span>}
    </button>
  )}

  {hospitals.length > 0 &&
    menuItems.map(({ key, label, icon, path }) => {
        if (key === "userManagement") {
          return (
            <div key={key} className="flex flex-col">
              <button
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  router.push(path);
                }}
                className={`flex items-center justify-between px-5 py-3 hover:bg-blue-50 transition-colors ${
                  pathname.includes("UserManagement")
                    ? "bg-blue-100 text-blue-600 font-semibold border-l-4 border-blue-600"
                    : "text-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  {icon}
                  {sidebarOpen && <span className="font-semibold">{label}</span>}
                </div>
                {sidebarOpen && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      userDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Dropdown */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  userDropdownOpen ? "max-h-40" : "max-h-0"
                }`}
              >
                <a
                  onClick={() => router.push(`/dashboard/${hospitalId}/Doctor`)}
                  className={`block ml-10 px-3 py-2 cursor-pointer hover:bg-blue-50 rounded transition-colors ${
                    pathname.includes("Doctor")
                      ? "text-blue-600 font-semibold"
                      : "text-gray-600"
                  }`}
                >
                  Doctors
                </a>
              </div>
            </div>
          );
        }

        return (
          <a
            key={key}
            onClick={() => router.push(path)}
            className={`flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-blue-50 transition-colors ${
              pathname === path
                ? "bg-blue-100 text-blue-600 font-semibold border-l-4 border-blue-600"
                : "text-gray-700"
            }`}
          >
            {icon}
            {sidebarOpen && <span className="font-semibold">{label}</span>}
          </a>
        );
      })}

</nav>


        
        <div className="p-4 border-t border-gray-200">
          {sidebarOpen && <UserProfileDropdown role={role} />}
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col bg-white transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <header className="w-full bg-gray-50 border-b border-white px-6 py-4 flex items-center justify-between">
         
       <div className="flex items-center gap-4">
  {hospitals.length > 0 && (
    <>
      {role === "Owner" ? (
        <div className="relative">
          <button
            onClick={() => setHospitalDropdownOpen(!hospitalDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:border-blue-400 transition"
          >
            <Building2 size={18} className="text-gray-500" />
            <span className="truncate font-semibold">{hospitalName}</span>
            <ChevronDown
              size={16}
              className={`transition-transform ${
                hospitalDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {hospitalDropdownOpen && (
            <div className="absolute left-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-50 animate-fadeIn">
              <ul className="max-h-48 overflow-y-auto">
                {hospitals.map((h) => (
                  <li
                    key={h.id}
                    onClick={() => {
                      handleHospitalSwitch(h.id);
                      setHospitalDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                      hospitalId === h.id
                        ? "bg-blue-100 font-semibold text-blue-600"
                        : ""
                    }`}
                  >
                    {h.name}
                  </li>
                ))}
                <li
                  onClick={() => handleHospitalSwitch("add")}
                  className="px-4 py-2 cursor-pointer text-blue-600 font-semibold hover:bg-green-50 border-t"
                >
                  + Add Hospital
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg">
          <Building2 size={18} className="text-gray-500" />
          <span className="truncate font-semibold">{hospitalName}</span>
        </div>
      )}
    </>
  )}
</div>


      
          <div className="flex-1 flex justify-center mx-4">
            {searchOpen && (
              <div className="relative w-1/2">
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                  <ul className="absolute w-full bg-white border mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <li
                          key={item.key}
                          onClick={() => {
                            router.push(item.path);
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="px-4 py-2 cursor-pointer hover:bg-blue-50"
                        >
                          {item.label}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-gray-500">No matches found</li>
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>

       
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Search size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => {
              router.push(`/dashboard/${hospitalId}/Settings`);}}>
              <Settings size={20} className="text-gray-600" />
            </button>
          </div>
        </header>

        <div className="rounded-xl overflow-auto flex-1 p-8 bg-white">{children}</div>
      </main>
    </div>
  );
}
