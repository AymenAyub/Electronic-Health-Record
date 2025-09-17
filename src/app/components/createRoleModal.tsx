"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Check } from "lucide-react";
import toast from "react-hot-toast";

interface Permission {
  id: number;
  name: string;
  description: string;
}

interface Role {
  id?: number;
  name: string;
  description: string;
  permissions: number[];
}

interface Props {
  allPermissions: Permission[];
  editingRole?: Role | null; 
  onClose: () => void;
  onSave: (roleData: any) => void;
}

export default function CreateRoleModal({
  allPermissions,
  editingRole,
  onClose,
  onSave,
}: Props) {
  const [formData, setFormData] = useState<Role>({
    name: "",
    description: "",
    permissions: [],
  });

  // 🔹 Pre-fill if editing
  useEffect(() => {
    if (editingRole) {
      setFormData({
        id: editingRole.id,
        name: editingRole.name,
        description: editingRole.description,
        permissions: editingRole.permissions || [],
      });
    }
  }, [editingRole]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTogglePermission = (permId: number) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter((p) => p !== permId)
        : [...prev.permissions, permId],
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || formData.permissions.length === 0) {
      toast.error("Role name and at least one permission are required");
      return;
    }
    onSave(formData); // 🔹 RoleManagement will handle create/update
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-start pt-16 z-50">
      <div className="bg-transparent w-full h-full absolute top-0 left-0"></div>

      <div className="bg-white w-[600px] p-8 rounded-xl shadow-xl border z-50">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">
            {editingRole ? "Edit Role" : "Create New Role"}
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className="p-3 text-gray-500 hover:text-gray-700"
          >
            ✕
          </Button>
        </div>

        {/* Name */}
        <div className="mb-4">
          <Label>Name</Label>
          <Input
            name="name"
            value={formData.name}
            placeholder="Enter role name"
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <Label>Description</Label>
          <Input
            name="description"
            value={formData.description}
            placeholder="Enter role description"
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        {/* Permissions */}
        <div className="mb-4">
          <Label>Permissions</Label>
          <div className="grid grid-cols-2 gap-2 mt-2 max-h-72 overflow-y-auto">
            {allPermissions.map((perm) => (
              <label key={perm.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.permissions.includes(perm.id)}
                  onCheckedChange={() => handleTogglePermission(perm.id)}
                  className="checked:bg-green-500 checked:border-green-500"
                />
                <span className="text-gray-700 text-sm">
                  {perm.description}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex items-center space-x-1">
            {editingRole ? (
              <>
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Create</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
