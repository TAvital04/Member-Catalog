"use client";

import React from "react";

interface ToastNotificationProps {
  toastMessage: string | null;
}

export default function ToastNotification({ toastMessage }: ToastNotificationProps) {
  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-80 bg-zinc-950/95 border border-zinc-800 text-zinc-300 px-4 py-3 rounded-xl shadow-xl flex items-center justify-between text-xs animate-scale-in z-[80]">
      <span>{toastMessage}</span>
    </div>
  );
}
