"use client";

import { useState, useEffect, useCallback } from "react";

export type UserRole = "standard" | "sponsor" | "admin";
export type AuthAccountType = "rso_leadership" | "sponsor";

export interface AuthSession {
  accountType: AuthAccountType;
  role: Exclude<UserRole, "standard">;
  email: string;
  displayName: string;
  organization?: string;
  signedInAt: string;
}

const ROLE_STORAGE_KEY = "ieee-role";
const SESSION_STORAGE_KEY = "ieee-auth-session";
const AUTH_CHANGE_EVENT = "ieee-auth-change";

export function useRoleManager(defaultRole: UserRole = "standard") {
  const [role, setRoleState] = useState<UserRole>(defaultRole);
  const [session, setSessionState] = useState<AuthSession | null>(null);

  const syncFromStorage = useCallback(() => {
    try {
      const savedSessionRaw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (savedSessionRaw) {
        const parsed = JSON.parse(savedSessionRaw) as AuthSession;
        if (parsed && (parsed.role === "admin" || parsed.role === "sponsor")) {
          setSessionState(parsed);
          setRoleState(parsed.role);
          return;
        }
      }

      setSessionState(null);
      const savedRole = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole | null;
      if (savedRole === "standard" || savedRole === "sponsor" || savedRole === "admin") {
        setRoleState(savedRole);
      } else {
        setRoleState("standard");
      }
    } catch {
      // ignore in SSR / private browsing
    }
  }, []);

  useEffect(() => {
    syncFromStorage();
    const handleStorageChange = () => syncFromStorage();
    window.addEventListener(AUTH_CHANGE_EVENT, handleStorageChange);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [syncFromStorage]);

  const handleRoleChange = useCallback((newRole: UserRole) => {
    setRoleState(newRole);
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, newRole);
      if (newRole === "standard") {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        setSessionState(null);
      } else {
        const nextSession: AuthSession = {
          accountType: newRole === "admin" ? "rso_leadership" : "sponsor",
          role: newRole,
          email: newRole === "admin" ? "leadership@ieeeucf.org" : "partner@sponsor.com",
          displayName: newRole === "admin" ? "RSO Leadership" : "Corporate Sponsor",
          organization: newRole === "admin" ? "IEEE UCF Executive Board" : "Corporate Partner",
          signedInAt: new Date().toISOString(),
        };
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
        setSessionState(nextSession);
      }
      window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
    } catch {
      // ignore
    }
  }, []);

  const login = useCallback((newSession: AuthSession) => {
    setSessionState(newSession);
    setRoleState(newSession.role);
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, newSession.role);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
      window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
    } catch {
      // ignore
    }
  }, []);

  const logout = useCallback(() => {
    setSessionState(null);
    setRoleState("standard");
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, "standard");
      localStorage.removeItem(SESSION_STORAGE_KEY);
      window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
    } catch {
      // ignore
    }
  }, []);

  const hasFilterPermission = role !== "standard";
  const isAdmin = role === "admin";
  const isRsoLeadership = role === "admin";
  const isSponsor = role === "sponsor";
  const isAuthenticated = role !== "standard";

  return {
    role,
    session,
    setRole: handleRoleChange,
    handleRoleChange,
    login,
    logout,
    hasFilterPermission,
    isAdmin,
    isRsoLeadership,
    isSponsor,
    isAuthenticated,
  };
}
