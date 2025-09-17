"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash, UserPlus } from "lucide-react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import AddUserModal from "@/app/components/AddUserModal";

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
  role?: Role;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    roleId: "", 
    specialty: "",
    designation: "",
    bio: "",
  });

  const params = useParams();
  const rawHospitalId = params?.hospitalId;
  const hospitalId = Array.isArray(rawHospitalId) ? rawHospitalId[0] : rawHospitalId;

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
      throw new Error(err.message || "API request failed");
    }
    return res.json();
  };

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, [hospitalId]);

  const handleSave = async () => {
  try {
    const payload = {
      ...formData,
      roleId: Number(formData.roleId),
    };

    await fetchWithAuth(
      `http://localhost:5000/api/addUser?hospitalId=${hospitalId}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

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

    setOpen(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      contact: "",
      roleId: "",
      specialty: "",
      designation: "",
      bio: "",
    });
    toast.success("User added successfully");
  } catch (err: any) {
    console.error(err);
    toast.error(err.message || "Failed to add user");
  }
};

  const selectedRole = roles.find((r) => r.id === Number(formData.roleId));

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-blue-600">User Management</CardTitle>
          <Button
            onClick={() => setOpen(true)}
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
              {users.map((user, i) => (
                <TableRow key={i}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role?.name || "-"}</TableCell>
                  <TableCell>{user.contact || "-"}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash className="h-4 w-4" />
                    </Button>
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
        formData={formData}
        setFormData={setFormData}
        roles={roles}
        onSave={handleSave}
      />
    </div>
  );
}
