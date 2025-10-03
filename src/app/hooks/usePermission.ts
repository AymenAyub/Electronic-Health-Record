"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface Permission {
  permission_id: number;
  name: string;
  description?: string;
}

interface UsePermissionsProps {
  requiredPagePermission?: string;
}

export default function usePermissions({ requiredPagePermission }: UsePermissionsProps = {}) {
  const [permissions, setPermissions] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const permsStr = localStorage.getItem("permissions");
    if (permsStr) {
      try {
        const parsed: Permission[] = JSON.parse(permsStr);
        setPermissions(parsed.map((p) => p.name));
      } catch (err) {
        console.error("Failed to parse permissions from localStorage", err);
        setPermissions([]);
      }
    } else {
      setPermissions([]);
    }
  }, []);

  useEffect(() => {
    if (requiredPagePermission && permissions.length > 0 && !permissions.includes(requiredPagePermission)) {
      router.push("/unauthorized");
    }
  }, [requiredPagePermission, permissions, router]);

  const hasPermission = (permName: string) => {
    return permissions.includes(permName);
  };

  return { permissions, hasPermission };
}
