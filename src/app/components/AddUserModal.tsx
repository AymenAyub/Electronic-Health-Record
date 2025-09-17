"use client";

import React from "react";
import {  Dialog,  DialogContent,  DialogHeader,  DialogTitle,  DialogFooter,} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select,SelectContent,  SelectItem,  SelectTrigger,  SelectValue,} from "@/components/ui/select";

interface Role {
  id: number;
  name: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  contact: string;
  roleId: string;
  specialty: string;
  designation: string;
  bio: string;
}

interface AddUserModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  roles: Role[];
  onSave: () => void;
}

export default function AddUserModal({
  open,
  setOpen,
  formData,
  setFormData,
  roles,
  onSave,
}: AddUserModalProps) {
  const selectedRole = roles.find((r) => r.id === Number(formData.roleId));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Contact</Label>
            <Input
              type="text"
              value={formData.contact}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={formData.roleId}
              onValueChange={(value) =>
                setFormData({ ...formData, roleId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={String(role.id)}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Conditional Fields */}
          {selectedRole?.name === "Doctor" && (
            <div className="space-y-2">
              <Label>Specialty</Label>
              <Input
                value={formData.specialty}
                onChange={(e) =>
                  setFormData({ ...formData, specialty: e.target.value })
                }
              />
            </div>
          )}

          {selectedRole?.name === "Staff" && (
            <div className="space-y-2">
              <Label>Designation</Label>
              <Input
                value={formData.designation}
                onChange={(e) =>
                  setFormData({ ...formData, designation: e.target.value })
                }
              />
            </div>
          )}

          {selectedRole?.name === "Admin" && (
            <div className="space-y-2">
              <Label>Bio</Label>
              <Input
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
