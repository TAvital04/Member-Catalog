"use client";

import React, { useEffect, useCallback } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  ariaLabel?: string;
}

const sizeClasses: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
  full: "max-w-6xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "lg",
  className = "",
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  ariaLabel,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape") {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      onClick={closeOnBackdropClick ? onClose : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs cursor-pointer animate-fade-in"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title || "Dialog window"}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${sizeClasses[size]} max-h-[92vh] bg-white border border-neutral-300 rounded-2xl shadow-xl flex flex-col overflow-hidden cursor-default animate-scale-in ${className}`.trim()}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-600 hover:text-black transition-all cursor-pointer active:scale-95"
          >
            <X size={16} />
          </button>
        )}

        {(title || description) && (
          <div className="p-6 border-b border-neutral-200 bg-neutral-50/60 pr-14 shrink-0">
            {title && (
              <h2 className="text-xl sm:text-2xl font-black text-black leading-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

export default Modal;
