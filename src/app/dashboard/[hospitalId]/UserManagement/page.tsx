"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash, UserPlus, User, Lock, Search } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import AddUserModal from "@/app/components/AddUserModal";
import DeleteModal from "@/app/components/Admin/DeleteModal";

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: number[];
  users: User[];
}

interface User {
  id: number;
  name: string;
  email: string;
  contact?: string;
  role?: Role | null;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  const params = useParams();
  const rawHospitalId = params?.hospitalId;
  const hospitalId = Array.isArray(rawHospitalId)
    ? rawHospitalId[0]
    : rawHospitalId;

  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const router = useRouter();

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        ...(options.headers || {}),
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast(err.message || "API request failed");
    }
    return res.json();
  };

  const fetchUsersAndRoles = async () => {
    try {
      const roleData = await fetchWithAuth(
        `http://localhost:5000/api/roles?hospitalId=${hospitalId}`
      );
      const formattedRoles = roleData.map((r: any) => ({
        id: r.role_id,
        name: r.name,
        description: r.description,
        permissions: r.permissions.map((p: any) => p.permission_id),
        users: (r.users || []).map((u: any) => ({
          id: u.user_id,
          name: u.name,
          email: u.email,
        })),
      }));
      setRoles(formattedRoles);

      const usersData = await fetchWithAuth(
        `http://localhost:5000/api/users?hospitalId=${hospitalId}`
      );
      const formattedUsers = usersData.map((row: any) => ({
        id: row.user.user_id,
        name: row.user.name,
        email: row.user.email,
        contact: row.user.contact,
        role: row.role ? { id: row.role.role_id, name: row.role.name } : null,
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load roles or users");
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/Login");
    } else {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!token || !userStr) {
      router.push("/Login");
    }
    setAuthorized(true);
    fetchUsersAndRoles();
  }, [hospitalId]);

  if (!authorized) return null;

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      selectedRole === "All" || user.role?.name === selectedRole;

    return matchesSearch && matchesRole;
  });

  const handleSave = async (formData: any) => {
    try {
      const payload = {
        ...formData,
        roleId: Number(formData.roleId),
      };

      if (editingUser) {
        await fetchWithAuth(
          `http://localhost:5000/api/updateUser/${editingUser.id}?hospitalId=${hospitalId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );
        toast.success("User updated successfully");
      } else {
        await fetchWithAuth(
          `http://localhost:5000/api/addUser?hospitalId=${hospitalId}`,
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );
        toast.success("User added successfully");
      }

      await fetchUsersAndRoles();
      setOpen(false);
      setEditingUser(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save user");
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteUserId(id);
  };

  const handleDelete = async () => {
    if (!deleteUserId) return;
    try {
      await fetchWithAuth(
        `http://localhost:5000/api/deleteUser/${deleteUserId}?hospital_id=${hospitalId}`,
        { method: "DELETE" }
      );
      toast.success("User deleted successfully");
      await fetchUsersAndRoles();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete user");
    } finally {
      setDeleteUserId(null);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 mb-3 md:mb-0">
          <User size={28} className="text-blue-600" />
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-3xl font-bold text-blue-600 tracking-tight">
              Manage Users
            </h1>
            <p className="text-sm text-gray-500">
              Overview and manage all hospital's users
            </p>
          </div>
        </div>
      </div>

      {/* 🔍 Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm font-semibold shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200"
          />
          <Search
            size={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-700"
          />
        </div>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200"
        >
          <option value="All">All Roles</option>
          {roles.map((role) => (
            <option key={role.id} value={role.name}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-blue-600">Users</CardTitle>
          <Button
            onClick={() => {
              setEditingUser(null);
              setOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <UserPlus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, i) => (
                <TableRow key={i}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.role?.name === "Owner" ? (
                      <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-600 rounded-full">
                        Owner
                      </span>
                    ) : (
                      user.role?.name || "-"
                    )}
                  </TableCell>
                  <TableCell>{user.contact || "-"}</TableCell>
                  <TableCell className="flex space-x-2">
                    {user.role?.name === "Owner" ? (
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <Lock className="h-4 w-4" /> Locked
                      </div>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingUser(user);
                            setOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => confirmDelete(user.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddUserModal
        open={open}
        setOpen={setOpen}
        roles={roles}
        onSave={handleSave}
        isEditing={!!editingUser}
        initialData={
          editingUser
            ? {
                name: editingUser.name,
                email: editingUser.email,
                password: "",
                contact: editingUser.contact || "",
                roleId: editingUser.role?.id
                  ? String(editingUser.role.id)
                  : "",
                specialty: "",
                designation: "",
                bio: "",
              }
            : undefined
        }
      />

      <DeleteModal
        isOpen={!!deleteUserId}
        onClose={() => setDeleteUserId(null)}
        onConfirm={handleDelete}
        itemName="this user"
      />
    </div>
  );
}
