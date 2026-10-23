"use client";

import { useState, useEffect, useCallback } from "react";

export type UserRole = "standard" | "sponsor" | "admin";

export function useRoleManager(defaultRole: UserRole = "standard") {
  const [role, setRoleState] = useState<UserRole>(defaultRole);

  useEffect(() => {
    try {
      const savedRole = localStorage.getItem("ieee-role") as UserRole | null;
      if (savedRole === "standard" || savedRole === "sponsor" || savedRole === "admin") {
        setRoleState(savedRole);
      }
    } catch {
      // ignore in SSR / private browsing
    }
  }, []);

  const handleRoleChange = useCallback((newRole: UserRole) => {
    setRoleState(newRole);
    try {
      localStorage.setItem("ieee-role", newRole);
    } catch {
      // ignore
    }
  }, []);

  const hasFilterPermission = role !== "standard";
  const isAdmin = role === "admin";

  return {
    role,
    setRole: handleRoleChange,
    handleRoleChange,
    hasFilterPermission,
    isAdmin,
  };
}
