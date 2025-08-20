
import { Hospital, FileText, Lock, CalendarDays, Receipt, Stethoscope } from "lucide-react";
import Navbar from "./Navbar";

const features = [
  {
    icon: <Hospital className="text-blue-600 w-6 h-6 mb-3" />,
    title: "Multi-Hospital Support",
    desc: "Manage multiple hospitals or clinics from one account with complete data isolation.",
  },
  {
    icon: <FileText className="text-blue-600 w-6 h-6 mb-3" />,
    title: "Patient History Tracking",
    desc: "Maintain complete medical histories for quick and accurate consultations.",
  },
  {
    icon: <Lock className="text-blue-600 w-6 h-6 mb-3" />,
    title: "Role-Based Access",
    desc: "Ensure secure access with role-specific permissions for doctors, staff, and admins.",
  },
  {
    icon: <CalendarDays className="text-blue-600 w-6 h-6 mb-3" />,
    title: "Appointment Scheduling",
    desc: "Book, reschedule, and manage appointments with a user-friendly calendar system.",
  },
  {
    icon: <Receipt className="text-blue-600 w-6 h-6 mb-3" />,
    title: "Payment & Invoicing",
    desc: "Automated invoice generation and payment status tracking.",
  },
  {
    icon: <Stethoscope className="text-blue-600 w-6 h-6 mb-3" />,
    title: "Doctor's Visit Notes",
    desc: "Securely store and access medical notes for each patient consultation.",
  },
];

export default function Services() {
  return (
   <>
    <main className="min-h-screen bg-blue-50 py-16 px-6">
      <h1 className="text-4xl font-bold text-center mb-12">Our Services</h1>
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-white shadow hover:shadow-lg transition rounded-xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">{feature.icon}</div>
              <div>
                <h4 className="text-md font-bold mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main></>
  );
}
