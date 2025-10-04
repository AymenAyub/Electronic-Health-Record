"use client";
import { useState , useEffect} from "react";
import { 
  Hospital, PlusCircle, Building2, Users, Activity, 
  X, LayoutDashboard, Search, Settings, User 
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import UserProfileDropdown from "../components/UserProfileDropdown";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  
useEffect(() => {
  const storedToken = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");
  setToken(storedToken);
  setRole(storedRole);

  if (!storedToken) {
    router.push("/Login");
  }
}, [router]);

  
  const handleAddHospital = () => {
    router.push("/AddHospital");
  };

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
        
        } catch (err) {
          console.error(err);
          router.push("/Login");
        }
      };
  
      fetchUserData();
    }, [router, token]);

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full flex flex-col transition-[width] duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-50 z-20`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          {sidebarOpen && (
             <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Logo" width={28} height={28} />
            <span className="text-lg font-bold text-blue-600">MediNex</span>
        </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-blue-600 transition"
          >
            {sidebarOpen ? <X /> : <LayoutDashboard />}
          </button>
        </div>

        {/* Add Hospital Button */}
        <div className="p-4">
          <button
            onClick={handleAddHospital}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg ${
              !sidebarOpen ? "px-2" : ""
            }`}
          >
            <PlusCircle size={20} />
            {sidebarOpen && <span>Add Hospital</span>}
          </button>
        </div>

        {/* Empty State Message in Sidebar */}
        {sidebarOpen && (
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center text-gray-400">
              <Hospital className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No hospitals added yet</p>
            </div>
          </div>
        )}

     
        <div className="p-4 border-t border-gray-200">
                  {sidebarOpen && <UserProfileDropdown role={role} />}
                </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Header */}
        <header className="w-full bg-gray-50 border-b border-gray-200 px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-gray-400" />
            <span className="text-gray-400 font-medium">No Hospital Selected</span>
          </div>

       
        </header>

        {/* Main Empty State Content */}
<div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
  <div className="w-full max-w-5xl">
    {/* Main Card */}
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full">
      <div className="p-10 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
            Get Started by Adding Your First Hospital
          </h2>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            Begin your journey by registering a hospital to unlock comprehensive
            management tools for doctors, staff, patients, and appointments.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2 text-lg">
              Manage Facilities
            </h3>
            <p className="text-sm text-gray-600">
              Track and organize multiple hospital locations with ease
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2 text-lg">
              Staff Management
            </h3>
            <p className="text-sm text-gray-600">
              Coordinate doctors, nurses, and support staff efficiently
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2 text-lg">
              Patient Care
            </h3>
            <p className="text-sm text-gray-600">
              Streamline patient records and appointment scheduling
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={handleAddHospital}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <PlusCircle size={24} />
            Add Your First Hospital
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Takes less than 2 minutes to complete setup
          </p>
        </div>
      </div>
    </div>

    {/* Bottom Info Card */}
    <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm w-full">
      <div className="flex flex-col md:flex-row items-start gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Hospital className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 mb-2 text-lg">
            What happens next?
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            After adding a hospital, you'll be able to create users assign staff members,
            manage roles and permissions, and start scheduling appointments immediately. All your
            hospital data will be securely stored and easily accessible.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>


            
         
      </main>
    </div>
  );
}