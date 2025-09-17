// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useParams } from "next/navigation";
// import { Plus, Trash2, Edit } from "lucide-react";
// import CreateRoleModal from "@/app/components/createRoleModal";
// import toast from "react-hot-toast";

// interface Role {
//   id: number;
//   name: string;
//   description: string;
//   permissions: number[];
//   users: User[];
// }

// interface User {
//   id: number;
//   name: string;
//   email: string;
// }

// interface Permission {
//   id: number;
//   name: string;
//   description: string;
// }

// export default function RoleManagement() {
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [selectedRole, setSelectedRole] = useState<Role | null>(null);
//   const [permissions, setPermissions] = useState<number[]>([]);
//   const [roleUsers, setRoleUsers] = useState<User[]>([]);
//   const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [editingRole, setEditingRole] = useState<Role | null>(null);
//   const [allUsers, setAllUsers] = useState<User[]>([]); 

//   const params = useParams();
//   const rawHospitalId = params?.hospitalId;
//   const hospitalId = Array.isArray(rawHospitalId) ? rawHospitalId[0] : rawHospitalId;

//   const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
//     const res = await fetch(url, {
//       ...options,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
//         ...(options.headers || {}),
//       },
//     });
//     if (!res.ok) {
//       const err = await res.json().catch(() => ({}));
//       throw new Error(err.message || "API request failed");
//     }
//     return res.json();
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const permData = await fetchWithAuth(
//           `http://localhost:5000/api/permissions?hospitalId=${hospitalId}`
//         );
//         setAllPermissions(
//           permData.map((p: any) => ({
//             id: p.permission_id,
//             name: p.name,
//             description: p.description || p.name,
//           }))
//         );

//         const roleData = await fetchWithAuth(
//           `http://localhost:5000/api/roles?hospitalId=${hospitalId}`
//         );
//         const formattedRoles = roleData.map((r: any) => ({
//           id: r.role_id,
//           name: r.name,
//           description: r.description,
//           permissions: r.permissions.map((p: any) => p.permission_id),
//           users: r.users || [],
//         }));

//         setRoles(formattedRoles);
//         if (formattedRoles.length) {
//           setSelectedRole(formattedRoles[0]);
//           setPermissions(formattedRoles[0].permissions);
//           setRoleUsers(formattedRoles[0].users);
//         }
//        const usersData = await fetchWithAuth(
//         `http://localhost:5000/api/users?hospitalId=${hospitalId}`
//       );
//       setAllUsers(usersData.map((u: any) => ({
//         id: u.user_id,
//         name: u.name,
//         email: u.email
//       })));

//     } catch (error) {
//       console.error("Error fetching data:", error);
//       toast.error("Failed to load roles, permissions or users");
//     }
//   };
//   fetchData();
// }, [hospitalId]);

//   const handleRoleClick = (role: Role) => {
//     setSelectedRole(role);
//     setPermissions(role.permissions);
//     setRoleUsers(role.users);
//   };

//   const togglePermission = (permId: number, checked: boolean) => {
//     if (!selectedRole) return;
//     setPermissions((prev) =>
//       checked ? [...prev, permId] : prev.filter((id) => id !== permId)
//     );
//   };

//   // const removeUser = (userId: number) => {
//   //   if (!selectedRole) return;
//   //   const updatedUsers = roleUsers.filter((u) => u.id !== userId);
//   //   setRoleUsers(updatedUsers);
//   //   setRoles((prev) =>
//   //     prev.map((r) =>
//   //       r.id === selectedRole.id ? { ...r, users: updatedUsers } : r
//   //     )
//   //   );
//   //   setSelectedRole({ ...selectedRole, users: updatedUsers });
//   // };

//   // const assignUser = (userId: string) => {
//   //   if (!selectedRole) return;
//   //   const id = parseInt(userId);
//   //   if (roleUsers.some((u) => u.id === id)) return;

//   //   const userToAdd: User = { id, name: `User ${id}`, email: `user${id}@example.com` };
//   //   const updatedUsers = [...roleUsers, userToAdd];
//   //   setRoleUsers(updatedUsers);
//   //   setRoles((prev) =>
//   //     prev.map((r) =>
//   //       r.id === selectedRole.id ? { ...r, users: updatedUsers } : r
//   //     )
//   //   );
//   //   setSelectedRole({ ...selectedRole, users: updatedUsers });
//   // };

//   const handleSaveRole = async (roleData: Role) => {
//     try {
//       const url = editingRole
//         ? `http://localhost:5000/api/updateRole/${editingRole.id}?hospitalId=${hospitalId}`
//         : `http://localhost:5000/api/addRole?hospitalId=${hospitalId}`;
//       const method = editingRole ? "PUT" : "POST";

//       const data = await fetchWithAuth(url, {
//         method,
//         body: JSON.stringify({
//           name: roleData.name,
//           description: roleData.description,
//           permissions: roleData.permissions,
//         }),
//       });

//       if (editingRole) {
//         const updatedPermissions = data.role.permissions.map((p: any) => p.permission_id);
//         setRoles((prev) =>
//           prev.map((r) =>
//             r.id === editingRole.id
//               ? { ...r, name: data.role.name, description: data.role.description, permissions: updatedPermissions }
//               : r
//           )
//         );
//         setSelectedRole({ ...editingRole, permissions: updatedPermissions });
//         toast.success("Role updated successfully");
//       } else {
//         const newRole: Role = {
//           id: data.role_id,
//           name: data.name,
//           description: data.description,
//           permissions: data.permissions.map((p: any) => p.permission_id),
//           users: [],
//         };
//         setRoles((prev) => [...prev, newRole]);
//         toast.success("Role created successfully");
//       }

//       setShowModal(false);
//       setEditingRole(null);
//     } catch (error: any) {
//       console.error(error);
//       toast.error(error.message || "Something went wrong while saving role");
//     }
//   };


//   const handleSavePermissions = async () => {
//     if (!selectedRole) return;
//     try {
//       const data = await fetchWithAuth(
//         `http://localhost:5000/api/updateRole/${selectedRole.id}?hospitalId=${hospitalId}`,
//         {
//           method: "PUT",
//           body: JSON.stringify({
//             name: selectedRole.name,
//             description: selectedRole.description,
//             permissions,
//           }),
//         }
//       );

//       const updatedPermissions = data.role.permissions.map((p: any) => p.permission_id);
//       setRoles((prev) =>
//         prev.map((r) =>
//           r.id === selectedRole.id ? { ...r, permissions: updatedPermissions } : r
//         )
//       );
//       setSelectedRole({ ...selectedRole, permissions: updatedPermissions });
//       toast.success("Permissions updated");
//       setEditMode(false);
//     } catch (error: any) {
//       console.error(error);
//       toast.error(error.message || "Failed to update permissions");
//     }
//   };

//   return (
//     <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
//       {/* Roles List */}
//       <Card className="col-span-1">
//         <CardHeader>
//           <CardTitle className="flex justify-between items-center">
//             Roles
//             <Button size="sm" variant="default" onClick={() => setShowModal(true)}>
//               <Plus className="w-4 h-4 mr-1" /> Add
//             </Button>
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ul className="space-y-2">
//             {roles.map((role) => (
//               <li
//                 key={role.id}
//                 className={`p-3 rounded cursor-pointer flex justify-between ${
//                   selectedRole?.id === role.id ? "bg-blue-50" : "hover:bg-gray-50"
//                 }`}
//                 onClick={() => handleRoleClick(role)}
//               >
//                 <div>
//                   <p className="font-semibold text-gray-800">{role.name}</p>
//                   <p className="text-sm text-gray-500">{role.description}</p>
//                 </div>
//                 <Button
//                   size="sm"
//                   variant="ghost"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setEditingRole(role);
//                     setShowModal(true);
//                   }}
//                 >
//                   <Edit className="w-4 h-4" />
//                 </Button>
//               </li>
//             ))}
//           </ul>
//         </CardContent>
//       </Card>

//       {/* Permissions */}
//       <Card className="col-span-1">
//         <CardHeader className="flex justify-between items-center">
//           <CardTitle>
//             Permissions {selectedRole ? `for ${selectedRole.name}` : ""}
//           </CardTitle>
//           {selectedRole && (
//             <div className="space-x-2">
//               {!editMode ? (
//                 <Button size="sm" onClick={() => setEditMode(true)}>Edit</Button>
//               ) : (
//                 <>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() => {
//                       setPermissions(selectedRole.permissions);
//                       setEditMode(false);
//                     }}
//                   >
//                     Cancel
//                   </Button>
//                   <Button size="sm" variant="default" onClick={handleSavePermissions}>
//                     Save
//                   </Button>
//                 </>
//               )}
//             </div>
//           )}
//         </CardHeader>
//         <CardContent>
//           {selectedRole ? (
//             <div className="grid grid-cols-1 gap-2">
//               {allPermissions.map((perm) => (
//                 <label key={perm.id} className="flex items-center space-x-2">
//                   <Checkbox
//                     checked={permissions.includes(perm.id)}
//                     disabled={!editMode}
//                     onCheckedChange={(checked) => togglePermission(perm.id, checked === true)}
//                   />
//                   <span className="text-gray-700 text-sm">{perm.description}</span>
//                 </label>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-400">Select a role to view permissions</p>
//           )}
//         </CardContent>
//       </Card>

//       {/* Users */}
//       <Card className="col-span-1">
//         <CardHeader>
//           <CardTitle>Users in {selectedRole?.name || ""}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {selectedRole ? (
//             <>
//               <ul className="space-y-2 max-h-72 overflow-y-auto">
//                 {roleUsers.map((user) => (
//                   <li key={user.id} className="p-2 flex justify-between items-center border rounded">
//                     <div className="flex-1 min-w-0">
//                       <p className="font-medium text-gray-800 truncate">{user.name}</p>
//                       <p className="text-sm text-gray-500 truncate">{user.email}</p>
//                     </div>
//                     <Button
//                       size="sm"
//                       variant="destructive"
//                       className="flex items-center space-x-1 ml-2 flex-shrink-0"
//                       onClick={() => removeUser(user.id)}
//                     >
//                       <Trash2 className="w-4 h-4" /> Remove
//                     </Button>
//                   </li>
//                 ))}
//               </ul>
//               <div className="mt-4">
//                 <Label>Add User</Label>
//                 <select
//                 className="w-full border p-2 rounded mt-1"
//                 onChange={(e) => assignUser(e.target.value)}
//               >
//                 <option value="">Select user</option>
//                 {allUsers
//                   .filter((u) => !roleUsers.some((ru) => ru.id === u.id)) 
//                   .map((user) => (
//                     <option key={user.id} value={user.id}>
//                       {user.name} ({user.email})
//                     </option>
//                   ))}
//               </select>
//               </div>
//             </>
//           ) : (
//             <p className="text-gray-400">Select a role to view users</p>
//           )}
//         </CardContent>
//       </Card>

//       {showModal && (
//         <CreateRoleModal
//           allPermissions={allPermissions}
//           onSave={handleSaveRole}
//           onClose={() => {
//             setShowModal(false);
//             setEditingRole(null);
//           }}
//           editingRole={editingRole}
//         />
//       )}
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams } from "next/navigation";
import { Plus, Trash2, Edit } from "lucide-react";
import CreateRoleModal from "@/app/components/createRoleModal";
import toast from "react-hot-toast";

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
}

interface Permission {
  id: number;
  name: string;
  description: string;
}

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<number[]>([]);
  const [roleUsers, setRoleUsers] = useState<User[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const params = useParams();
  const rawHospitalId = params?.hospitalId;
  const hospitalId = Array.isArray(rawHospitalId)
    ? rawHospitalId[0]
    : rawHospitalId;

  // Common fetch helper
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

  // Load roles, permissions, users
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Permissions
        const permData = await fetchWithAuth(
          `http://localhost:5000/api/permissions?hospitalId=${hospitalId}`
        );
        setAllPermissions(
          permData.map((p: any) => ({
            id: p.permission_id,
            name: p.name,
            description: p.description || p.name,
          }))
        );

        // Roles
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

        if (formattedRoles.length) {
          setSelectedRole(formattedRoles[0]);
          setPermissions(formattedRoles[0].permissions);
          setRoleUsers(formattedRoles[0].users);
        }

        // Users
        const usersData = await fetchWithAuth(
          `http://localhost:5000/api/users?hospitalId=${hospitalId}`
        );
        const formattedUsers = usersData.map((row: any) => ({
          id: row.user.user_id,
          name: row.user.name,
          email: row.user.email,
        }));
        setAllUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load roles, permissions or users");
      }
    };
    fetchData();
  }, [hospitalId]);

  // Handle role switch
  const handleRoleClick = (role: Role) => {
    setSelectedRole(role);
    setPermissions(role.permissions);
    setRoleUsers(role.users);
  };

  // Toggle permission
  const togglePermission = (permId: number, checked: boolean) => {
    setPermissions((prev) =>
      checked ? [...prev, permId] : prev.filter((id) => id !== permId)
    );
  };

  // Remove user from role (frontend only for now)
  const removeUser = (userId: number) => {
    if (!selectedRole) return;
    const updatedUsers = roleUsers.filter((u) => u.id !== userId);
    setRoleUsers(updatedUsers);
    setRoles((prev) =>
      prev.map((r) =>
        r.id === selectedRole.id ? { ...r, users: updatedUsers } : r
      )
    );
    setSelectedRole({ ...selectedRole, users: updatedUsers });
  };

  // Assign user (pick from allUsers)
  const assignUser = (userId: string) => {
    if (!selectedRole) return;
    const id = parseInt(userId);
    if (!id) return;

    const userToAdd = allUsers.find((u) => u.id === id);
    if (!userToAdd) return;
    if (roleUsers.some((u) => u.id === id)) return;

    const updatedUsers = [...roleUsers, userToAdd];
    setRoleUsers(updatedUsers);
    setRoles((prev) =>
      prev.map((r) =>
        r.id === selectedRole.id ? { ...r, users: updatedUsers } : r
      )
    );
    setSelectedRole({ ...selectedRole, users: updatedUsers });
  };

  // Save new or edited role
  const handleSaveRole = async (roleData: Role) => {
    try {
      const url = editingRole
        ? `http://localhost:5000/api/updateRole/${editingRole.id}?hospitalId=${hospitalId}`
        : `http://localhost:5000/api/addRole?hospitalId=${hospitalId}`;
      const method = editingRole ? "PUT" : "POST";

      const data = await fetchWithAuth(url, {
        method,
        body: JSON.stringify({
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permissions,
        }),
      });

      if (editingRole) {
        const updatedPermissions = data.role.permissions.map(
          (p: any) => p.permission_id
        );
        setRoles((prev) =>
          prev.map((r) =>
            r.id === editingRole.id
              ? {
                  ...r,
                  name: data.role.name,
                  description: data.role.description,
                  permissions: updatedPermissions,
                }
              : r
          )
        );
        setSelectedRole({
          ...editingRole,
          name: data.role.name,
          description: data.role.description,
          permissions: updatedPermissions,
        });
        toast.success("Role updated successfully");
      } else {
        const newRole: Role = {
          id: data.role_id,
          name: data.name,
          description: data.description,
          permissions: data.permissions.map((p: any) => p.permission_id),
          users: [],
        };
        setRoles((prev) => [...prev, newRole]);
        toast.success("Role created successfully");
      }

      setShowModal(false);
      setEditingRole(null);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong while saving role");
    }
  };

  // Save permissions only
  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    try {
      const data = await fetchWithAuth(
        `http://localhost:5000/api/updateRole/${selectedRole.id}?hospitalId=${hospitalId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: selectedRole.name,
            description: selectedRole.description,
            permissions,
          }),
        }
      );

      const updatedPermissions = data.role.permissions.map(
        (p: any) => p.permission_id
      );
      setRoles((prev) =>
        prev.map((r) =>
          r.id === selectedRole.id
            ? { ...r, permissions: updatedPermissions }
            : r
        )
      );
      setSelectedRole({ ...selectedRole, permissions: updatedPermissions });
      toast.success("Permissions updated");
      setEditMode(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update permissions");
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Roles List */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Roles
            <Button
              size="sm"
              variant="default"
              onClick={() => setShowModal(true)}
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {roles.map((role) => (
              <li
                key={role.id}
                className={`p-3 rounded cursor-pointer flex justify-between ${
                  selectedRole?.id === role.id
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleRoleClick(role)}
              >
                <div>
                  <p className="font-semibold text-gray-800">{role.name}</p>
                  <p className="text-sm text-gray-500">{role.description}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingRole(role);
                    setShowModal(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card className="col-span-1">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>
            Permissions {selectedRole ? `for ${selectedRole.name}` : ""}
          </CardTitle>
          {selectedRole && (
            <div className="space-x-2">
              {!editMode ? (
                <Button size="sm" onClick={() => setEditMode(true)}>
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setPermissions(selectedRole.permissions);
                      setEditMode(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={handleSavePermissions}
                  >
                    Save
                  </Button>
                </>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {selectedRole ? (
            <div className="grid grid-cols-1 gap-2">
              {allPermissions.map((perm) => (
                <label key={perm.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={permissions.includes(perm.id)}
                    disabled={!editMode}
                    onCheckedChange={(checked) =>
                      togglePermission(perm.id, checked === true)
                    }
                  />
                  <span className="text-gray-700 text-sm">
                    {perm.description}
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Select a role to view permissions</p>
          )}
        </CardContent>
      </Card>

      {/* Users */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Users in {selectedRole?.name || ""}</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedRole ? (
            <>
              <ul className="space-y-2 max-h-72 overflow-y-auto">
                {roleUsers.map((user) => (
                  <li
                    key={user.id}
                    className="p-2 flex justify-between items-center border rounded"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex items-center space-x-1 ml-2 flex-shrink-0"
                      onClick={() => removeUser(user.id)}
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </Button>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Label>Add User</Label>
                <select
                  className="w-full border p-2 rounded mt-1"
                  onChange={(e) => assignUser(e.target.value)}
                >
                  <option value="">Select user</option>
                  {allUsers
                    .filter((u) => !roleUsers.some((ru) => ru.id === u.id))
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                </select>
              </div>
            </>
          ) : (
            <p className="text-gray-400">Select a role to view users</p>
          )}
        </CardContent>
      </Card>

      {showModal && (
        <CreateRoleModal
          allPermissions={allPermissions}
          onSave={handleSaveRole}
          onClose={() => {
            setShowModal(false);
            setEditingRole(null);
          }}
          editingRole={editingRole}
        />
      )}
    </div>
  );
}

