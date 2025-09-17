"use client";

import { useState, useEffect } from "react";
import {
  Home, UserPlus, Users, CalendarCheck, CreditCard, BarChart2,
  Settings, LogOut, User, X, LayoutDashboard, Search, Bell,
  PlusCircle, Building2, FileText, Clock
} from "lucide-react";
import { useRouter, usePathname, useParams } from "next/navigation";
import UserProfileDropdown from "@/app/components/UserProfileDropdown";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // const [hospitalSubdomain, setHospitalSubdomain] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hospitalName, setHospitalName] = useState<string>("Hospital");
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [hospitalDropdownOpen, setHospitalDropdownOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const rawHospitalId = params?.hospitalId;
  const hospitalId = Array.isArray(rawHospitalId) ? rawHospitalId[0] : rawHospitalId;

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (!token || !storedRole) {
      router.push("/Login");
    } else {
      setRole(storedRole);
      setLoading(false);
    }
  }, [router]);

useEffect(() => {
  const storedHospitals = JSON.parse(localStorage.getItem("hospitals") || "[]");

  if (storedHospitals?.length > 0) {
    // Normalize hospitals to have `id` field
    // const normalizedHospitals = storedHospitals.map((h: any) => ({
    //   id: h.hospital?._id || h.hospital?.id,
    //   name: h.hospital?.name,
    //   subdomain: h.hospital?.subdomain,
    // }));
    const normalizedHospitals = storedHospitals
  .filter((h: any) => h.hospital) 
  .map((h: any) => ({
    id: h.hospital._id || h.hospital.id,
    name: h.hospital.name,
    subdomain: h.hospital.subdomain,
  }));


    setHospitals(normalizedHospitals);

    // Set selected hospital
    const lastHospitalId = localStorage.getItem("lastHospitalId");
    const defaultHospitalId = lastHospitalId || normalizedHospitals[0]?.id;

    setSelectedHospital(defaultHospitalId);

    const found = normalizedHospitals.find((h:any) => h.id === defaultHospitalId);
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

  // useEffect(() => {
  //   if (!hospitalId) return;
  //   fetch(`http://localhost:5000/api/hospital/${hospitalId}`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data?.hospital?.subdomain) setHospitalSubdomain(data.hospital.subdomain);
  //     })
  //     .catch((err) => console.error("Failed to fetch hospital domain:", err));
  // }, [hospitalId]);

  useEffect(() => {
    if (role !== "Owner" || !token) return;
    const fetchHospitals = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/hospital", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setHospitals(data.hospitals || []);
      } catch (err) {
        console.error("Failed to fetch hospitals:", err);
      }
    };
    fetchHospitals();
  }, [role, token]);

  useEffect(() => {
  
  if (!hospitalId || hospitals.length === 0) return;

  const found = hospitals.find((h) => h.id === hospitalId);
  if (found) setHospitalName(found.name);

  setSelectedHospital(hospitalId);
}, [hospitalId, hospitals]);

  const menuConfig: Record<string, any[]> = {
    Owner: [
      { key: "dashboard", label: "Dashboard", icon: <Home size={20} />, path: `/dashboard/${hospitalId}` },
      { key: "roleManagement", label: "Role Management", icon: <UserPlus size={20} />, path: `/dashboard/${hospitalId}/RoleManagement` },
      { key: "userManagement", label: "User Management", icon: <User size={20} />, path: `/dashboard/${hospitalId}/UserManagement` },
      { key: "doctors", label: "Doctors", icon: <UserPlus size={20} />, path: `/dashboard/${hospitalId}/Doctor` },
      { key: "staff", label: "Staff", icon: <Users size={20} />, path: `/dashboard/${hospitalId}/Staff` },
      { key: "patients", label: "Patients", icon: <User size={20} />, path: `/dashboard/${hospitalId}/Patients` },
      { key: "appointments", label: "Appointments", icon: <CalendarCheck size={20} />, path: `/dashboard/${hospitalId}/Appointments` },
      { key: "payments", label: "Payments & Billing", icon: <CreditCard size={20} />, path: `/dashboard/${hospitalId}/Payments` },
      { key: "settings", label: "Settings", icon: <Settings size={20} />, path: `/dashboard/${hospitalId}/Settings` },
    ],
    Doctor: [
      { key: "dashboard", label: "Dashboard", icon: <Home size={20} />, path: `/dashboard/${hospitalId}` },
      { key: "availability", label: "My Availability", icon: <Clock size={20} />, path: `/dashboard/${hospitalId}/availability` },
      { key: "appointments", label: "Appointments", icon: <CalendarCheck size={20} />, path: `/dashboard/${hospitalId}/Appointments` },
      { key: "medicalHistory", label: "Medical History", icon: <FileText size={20} />, path: `/dashboard/${hospitalId}/MedicalHistory` },
      { key: "settings", label: "Settings", icon: <Settings size={20} />, path: `/dashboard/${hospitalId}/Settings` },
    ],
    staff: [
      { key: "dashboard", label: "Dashboard", icon: <Home size={20} />, path: `/dashboard/${hospitalId}` },
      // { key: "doctors", label: "Doctors", icon: <UserPlus size={20} />, path: `/dashboard/${hospitalId}/Doctor` },
      { key: "patients", label: "Patients", icon: <User size={20} />, path: `/dashboard/${hospitalId}/Patients` },
      { key: "appointments", label: "Appointments", icon: <CalendarCheck size={20} />, path: `/dashboard/${hospitalId}/Appointments` },
      { key: "settings", label: "Settings", icon: <Settings size={20} />, path: `/dashboard/${hospitalId}/Settings` },
    ],
  };

    let menuItems: any[] = [];

      console.log('length',hospitals.length);


    if (role === "Owner") {
      if (hospitals.length === 0) {
        menuItems = [];
      } else {
        menuItems = menuConfig["Owner"] || [];
      }
    } else if (role) {
      menuItems = menuConfig[role] || [];
    }

  const filteredItems = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <aside
        className={`fixed top-0 left-0 h-full flex flex-col transition-[width] duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        } bg-gray-50 shadow-lg border-r border-gray-200 overflow-y-auto z-20`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {sidebarOpen && <h1 className="text-xl text-blue-600 font-bold">{hospitalName}</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-blue-600"
          >
            {sidebarOpen ? <X /> : <LayoutDashboard />}
          </button>
        </div>

          {hospitals.length !== 0 && (
             <>
          <nav className="flex flex-col text-[15px] font-semibold mt-2">
           {/* <a
            onClick={() => {
              if (!hospitalSubdomain) return alert("Hospital not found");
              window.location.href = `http://localhost:3000/hospital/${hospitalSubdomain}`;
            }}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-100"
          >
            <Building2 size={20} />
            {sidebarOpen && <span>Homepage</span>}
          </a> */}

          {role === "Owner" && hospitals.length !== 0 && (
            <a
              onClick={() => router.push("/AddHospital")}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-100"
            >
              <PlusCircle size={20} />
              {sidebarOpen && <span>Add Hospital</span>}
            </a>
          )}
        </nav>

        <div className="border-t border-gray-200 my-2"></div>
         
</>
 )}

      <nav className="flex flex-col flex-grow text-[15px] font-semibold">
        {role === "Owner" && hospitals.length === 0 ? (
          <>
            <a
              onClick={() => router.push("/AddHospital")}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-100 transition-colors text-gray-700"
            >
              <PlusCircle size={20} />
              {sidebarOpen && <span>Add Hospital</span>}
            </a>

            <a
              onClick={() => router.push(`/dashboard/settings`)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-100 transition-colors text-gray-700"
            >
              <Settings size={20} />
              {sidebarOpen && <span>Settings</span>}
            </a>
          </>
        ) : (
          // Normal role-based menu
          menuItems.map(({ key, label, icon, path }) => (
            <a
              key={key}
              onClick={() => router.push(path)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-100 transition-colors ${
                pathname === path ? "bg-blue-100 font-semibold text-blue-600" : "text-gray-700"
              }`}
            >
              {icon}
              {sidebarOpen && <span>{label}</span>}
            </a>
          ))
        )}
      </nav>

        <div className="mt-auto p-4 border-t border-gray-200 flex items-center gap-3">
        {sidebarOpen && <UserProfileDropdown role={role} />}
      </div>
      </aside>


      <main className={`flex-1 flex flex-col bg-gray-50 overflow-hidden transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        {/* Top Navbar */}
        <header className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between relative">
          {/* Title / Search */}
          {searchOpen ? (
            <div className="relative w-1/2 mx-auto">
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <ul className="absolute w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <li
                        key={item.key}
                        onClick={() => {
                          router.push(item.path);
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="px-4 py-2 cursor-pointer hover:bg-blue-100"
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
          ) : (
            <h2 className="text-xl font-bold capitalize">{role} Panel</h2>
          )}

          <div className="flex items-center gap-4">
        {role === "Owner" && hospitals.length > 0 && (
      <div className="relative">
          <button
            onClick={() => setHospitalDropdownOpen(!hospitalDropdownOpen)}
            className="p-2 rounded hover:bg-gray-100 transition"
          >
            <Building2 size={20} className="text-gray-600" />
          </button>

          {hospitalDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <ul className="max-h-60 overflow-y-auto">
                {hospitals.map((h) => (
                  <li
                    key={h.id}
                    onClick={() => {
                      handleHospitalSwitch(h.id);
                      setHospitalDropdownOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                      hospitalId === h.id ? "bg-blue-50 font-semibold text-blue-600" : "text-gray-700"
                    }`}
                  >
                    {h.name}
                  </li>
                ))}
                <li
                  onClick={() => {
                    handleHospitalSwitch("add");
                    setHospitalDropdownOpen(false);
                  }}
                  className="px-4 py-2 cursor-pointer text-green-600 font-semibold hover:bg-green-100 border-t border-gray-200"
                >
                  + Add Hospital
                </li>
              </ul>
            </div>
          )}
        </div>


      )}
             <button onClick={() => setSearchOpen(!searchOpen)}>
              <Search size={20} className="text-gray-600" />
            </button>
            <Bell size={20} className="text-gray-600" />
            <Settings size={20} className="text-gray-600" />
          </div>
        </header>

        <div className="p-8 overflow-auto bg-white flex-1">{children}</div>
      </main>
    </div>
  );
}
