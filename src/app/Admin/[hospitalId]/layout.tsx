"use client";

import { useState, useEffect } from "react";
import {
  Home,
  UserPlus,
  Users,
  CalendarCheck,
  CreditCard,
  BarChart2,
  Settings,
  LogOut,
  User,
  X,
  LayoutDashboard,
  Search,
  Bell,
  PlusCircle,
  Building2,
} from "lucide-react";
import { useRouter, usePathname, useParams } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hospitalSubdomain, setHospitalSubdomain] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const hospitalId = params?.hospitalId; 

  console.log("Hospital ID:", hospitalId);

  // Menu items with dynamic hospitalId
  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <Home size={20} />, path: `/Admin/${hospitalId}` },
    { key: "doctors", label: "Doctors", icon: <UserPlus size={20} />, path: `/Admin/${hospitalId}/Doctor` },
    { key: "staff", label: "Staff", icon: <Users size={20} />, path: `/Admin/${hospitalId}/Staff` },
    { key: "patients", label: "Patients", icon: <User size={20} />, path: `/Admin/${hospitalId}/Patients` },
    { key: "appointments", label: "Appointments", icon: <CalendarCheck size={20} />, path: `/Admin/${hospitalId}/Appointments` },
    { key: "payments", label: "Payments & Billing", icon: <CreditCard size={20} />, path: `/Admin/${hospitalId}/payments` },
    { key: "reports", label: "Reports & Analytics", icon: <BarChart2 size={20} />, path: `/Admin/${hospitalId}/reports` },
    { key: "settings", label: "Settings", icon: <Settings size={20} />, path: `/Admin/${hospitalId}/settings` },
  ];

  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      router.push("/Login");
    } else {
      setLoading(false); 
    }
  }, [router]);


  useEffect(() => {

    if (!hospitalId) return;

    fetch(`http://localhost:5000/api/hospital/${hospitalId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data?.hospital?.subdomain) setHospitalSubdomain(data.hospital.subdomain);
      })
      .catch(err => console.error("Failed to fetch hospital domain:", err));
  }, [hospitalId]);

  const filteredItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
    
      <aside
        className={`flex flex-col transition-[width] duration-300 ${sidebarOpen ? "w-64" : "w-16"} bg-white shadow-lg border-r border-gray-200 overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {sidebarOpen && <h1 className="text-xl font-bold">Admin</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 hover:text-blue-600">
            {sidebarOpen ? <X /> : <LayoutDashboard />}
          </button>
        </div>

        <nav className="flex flex-col text-[15px] font-semibold mt-2">
          <a
            onClick={() => {
              if (!hospitalSubdomain) return alert("Hospital not found");
              window.location.href = `http://localhost:3000/hospital/${hospitalSubdomain}`;
            }}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-100"
          >
            <Building2 size={20} />
            {sidebarOpen && <span>Homepage</span>}
          </a>

          <a
            onClick={() => router.push("/AddHospital")}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-100"
          >
            <PlusCircle size={20} />
            {sidebarOpen && <span>Add Hospital</span>}
          </a>
        </nav>

        <div className="border-t border-gray-200 my-2"></div>

        {/* Main Menu Items */}
        <nav className="flex flex-col flex-grow text-[15px] font-semibold">
          {menuItems.map(({ key, label, icon, path }) => (
            <div key={key} className="relative group">
              <a
                onClick={() => router.push(path)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-100 transition-colors ${
                  pathname === path ? "bg-blue-100 font-semibold text-blue-600" : "text-gray-700"
                }`}
              >
                {icon}
                {sidebarOpen && <span>{label}</span>}
              </a>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="mt-auto p-4 border-t border-gray-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">A</div>
          {sidebarOpen && <span>Admin User</span>}
          {sidebarOpen && (
            <a
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/Login");
              }}
              className="ml-auto text-red-600 hover:text-red-800 cursor-pointer"
            >
              <LogOut size={20} />
            </a>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
        {/* Top Navbar */}
        <header className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between relative">
          {/* Title or Search */}
          {searchOpen ? (
            <div className="relative w-1/2 mx-auto">
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* Dropdown */}
              {searchQuery && (
                <ul className="absolute w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-lg z-50">
                  {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
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
            <h2 className="text-xl font-bold">Admin Panel</h2>
          )}

          <div className="flex items-center gap-4">
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
