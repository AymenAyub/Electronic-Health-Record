"use client";

import { useState, useEffect } from "react";
import {
  Home,
  CalendarCheck,
  FileText,
  Edit3,
  Settings,
  LogOut,
  User,
  X,
  LayoutDashboard,
  Search,
  Bell,
  Clock
} from "lucide-react";
import { useRouter, usePathname, useParams } from "next/navigation";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const hospitalId = params?.hospitalId; // dynamic param
  const [loading, setLoading] = useState(true);
  const [hospitalName, setHospitalName] = useState<string>("Hospital");

  // Check token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    const fetchHospital = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/hospital/${hospitalId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) return;
        const data = await res.json();
        console.log(data);
        
        setHospitalName(data.hospital.name);
        console.log(hospitalName);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchHospital();
  }, [hospitalId]);

  // Doctor menu items
  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <Home size={20} />, path: `/doctor/${hospitalId}` },
    { key: "availability", label: "My Availability", icon: <Clock size={20} />, path: `/doctor/${hospitalId}/availability` },
    { key: "appointments", label: "Appointments", icon: <CalendarCheck size={20} />, path: `/doctor/${hospitalId}/appointments` },
    { key: "medicalHistory", label: "Add Medical History", icon: <FileText size={20} />, path: `/doctor/${hospitalId}/medical-history` },
    // { key: "visitNotes", label: "Add Visit Notes", icon: <Edit3 size={20} />, path: `/doctor/${hospitalId}/visit-notes` },
    { key: "settings", label: "Settings", icon: <Settings size={20} />, path: `/doctor/${hospitalId}/settings` },
  ];

  const filteredItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside
        className={`flex flex-col transition-[width] duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        } bg-white shadow-lg border-r border-gray-200 overflow-y-auto`}
      >
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {sidebarOpen && <h1 className="text-xl text-blue-600 font-bold">{hospitalName}</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-blue-600"
          >
            {sidebarOpen ? <X /> : <LayoutDashboard />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col flex-grow text-[15px] font-semibold mt-2">
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
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">D</div>
          {sidebarOpen && <h1 className="text-lg font-bold">Doctor Panel</h1>}
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
          {searchOpen ? (
            <div className="relative w-1/2 mx-auto">
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
            <h2 className="text-xl font-bold">Doctor Panel</h2>
          )}

          <div className="flex items-center gap-4">
            <button onClick={() => setSearchOpen(!searchOpen)}>
              <Search size={20} className="text-gray-600" />
            </button>
            <Bell size={20} className="text-gray-600" />
            <Settings size={20} className="text-gray-600" />
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 overflow-auto bg-white flex-1">{children}</div>
      </main>
    </div>
  );
}
