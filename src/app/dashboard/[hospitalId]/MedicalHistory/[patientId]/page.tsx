"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  PlusCircle,
  MoreVertical,
  Loader2,
  Phone,
  Droplet,
  FileText,
  User,
  X,
  Pen,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import DeleteModal from "@/app/components/Admin/DeleteModal";
import AddHistoryModal from "@/app/components/AddHistoryModal";

export default function PatientProfilePage() {
  const { hospitalId, patientId } = useParams();
  const router = useRouter();

  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [history, setHistory] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHistory, setEditingHistory] = useState<any>(null);
  const [deleteHistory, setDeleteHistory] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;


  useEffect(() => {
    const fetchPatient = async () => {
              try {
              let url = "";
        if (role === "Owner") {
          url = `http://localhost:5000/api/getPatients?hospitalId=${hospitalId}`;
        } else if (role === "Doctor") {
          url = `http://localhost:5000/api/getDoctorPatients?hospitalId=${hospitalId}`;
        } else {
          setPatient(null);
          setError("Unauthorized");
          setLoading(false);
          return;
        }

        const res = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });


        const data = await res.json();
        if (res.ok) {
          const foundPatient = data.patients?.find(
            (p: any) => String(p.patient_id) === String(patientId)
          );
          if (foundPatient) {
            setPatient(foundPatient);
          } else {
            setError("Patient not found in this hospital");
          }
        } else {
          setError(data.message || "Failed to load patient");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (hospitalId && patientId) fetchPatient();
  }, [hospitalId, patientId, token]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/${patientId}?hospitalId=${hospitalId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok) {
        setHistory(Array.isArray(data.history) ? data.history.filter(Boolean) : []);
      } else {
        console.error("Error fetching history:", data.message);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  useEffect(() => {
    if (hospitalId && patientId) fetchHistory();
  }, [hospitalId, patientId, token]);


  const handleSaveHistory = async (formData: any) => {
    try {
      const url = editingHistory
        ? `http://localhost:5000/api/updateHistory/${editingHistory.history_id}?hospitalId=${hospitalId}`
        : `http://localhost:5000/api/createHistory?hospitalId=${hospitalId}`;
      const method = editingHistory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hospital_id: hospitalId,
          patient_id: patientId,
          ...formData,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        if (editingHistory) {
          setHistory((prev) =>
            prev.map((item) =>
              item.history_id === data.history?.history_id ? data.history : item
            )
          );
          toast.success("Medical history updated");
        } else {
          if (data.history?.history_id) {
            setHistory((prev) => [data.history, ...prev]);
          }
          toast.success("Medical history added");
        }
        await fetchHistory();
        setIsModalOpen(false);
        setEditingHistory(null);
      } else {
        toast.error(data.message || "Failed to save history");
      }
    } catch (err) {
      console.error("Error adding history:", err);
      toast.error("Something went wrong");
    }
  };

  const handleDeleteHistory = async (historyId: string) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/${historyId}?hospitalId=${hospitalId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok) {
        setHistory((prev) => prev.filter((h) => h?.history_id !== historyId));
        fetchHistory();
        toast.success("History deleted");
      } else {
        toast.error(data.message || "Failed to delete history");
      }
    } catch (err: any) {
      console.error("Error deleting history:", err);
      toast.error("Error deleting history");
    } finally {
      setDeleteHistory(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="p-6">
        <p className="text-red-600 font-medium flex items-center gap-2">
          <X size={18} /> {error || "No patient found"}
        </p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push(`/dashboard/${hospitalId}/MedicalHistory`)}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={22} className="text-blue-700" />
        </button>
        <h1 className="text-3xl font-bold text-blue-700">Patient Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patient Info */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-700">
              <User size={40} />
            </div>
            <h2 className="mt-4 text-xl font-semibold">{patient?.name}</h2>
            <p className="text-gray-600">
              {patient?.age} yrs | {patient?.gender}
            </p>
            <p className="text-gray-600 flex items-center gap-2">
              <Phone size={16} /> {patient?.contact}
            </p>
            {patient?.bloodGroup && (
              <p className="text-gray-600 flex items-center gap-2">
                <Droplet size={16} /> {patient.bloodGroup}
              </p>
            )}
          </div>
        </div>

        {/* Medical History */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FileText size={20} /> Medical History
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
            >
              <PlusCircle size={18} /> Add History
            </button>
          </div>

          {/* Timeline */}
          <div className="relative border-l-2 border-blue-200 ml-4 space-y-6">
            {history.filter(Boolean).map((h) => (
              <div key={h.history_id || Math.random()} className="relative pl-8">
                <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow" />
                <div className="bg-white shadow-md rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">
                        {h?.createdAt
                          ? new Date(h.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "No date"}
                      </p>
                      <h3 className="text-lg font-semibold text-blue-700">
                        {h?.diagnosis || "No diagnosis"}
                      </h3>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-gray-500 hover:text-gray-800">
                          <MoreVertical size={18} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingHistory(h);
                            setIsModalOpen(true);
                          }}
                        >
                          <Pen size={20} /> Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => h?.history_id && setDeleteHistory(h.history_id)}
                        >
                          <Trash2 size={20} /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-2 text-gray-700 space-y-1">
                    <p>
                      <strong>Past Illnesses:</strong> {h?.past_illnesses || "N/A"}
                    </p>
                    <p>
                      <strong>Prescriptions:</strong> {h?.prescriptions || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {history.length === 0 && (
              <p className="text-gray-500">No history available yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {(isModalOpen || editingHistory) && (
        <AddHistoryModal
          onClose={() => {
            setIsModalOpen(false);
            setEditingHistory(null);
          }}
          history={editingHistory}
          onSave={handleSaveHistory}
        />
      )}
      <DeleteModal
        isOpen={!!deleteHistory}
        onClose={() => setDeleteHistory(null)}
        onConfirm={() => deleteHistory && handleDeleteHistory(deleteHistory)}
        itemName="this medical history record"
      />
    </div>
  );
}
