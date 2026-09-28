"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  confirmDialog: {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null;
  onClose: () => void;
}

export default function ConfirmDialog({ confirmDialog, onClose }: ConfirmDialogProps) {
  if (!confirmDialog) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-955/80 backdrop-blur-md cursor-pointer overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/95 p-6 shadow-2xl relative z-[110] animate-scale-in cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl shrink-0 bg-red-500/10 text-red-500 border border-red-500/20">
            <AlertTriangle size={20} />
          </div>
          <div className="grow">
            <h3 className="text-base font-bold text-zinc-100">{confirmDialog.title}</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              {confirmDialog.message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-6 border-t border-zinc-850 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDialog.onConfirm}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-red-500 hover:bg-red-650 text-white shadow-md shadow-red-500/10 transition-all cursor-pointer"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}
