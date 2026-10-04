import { useEffect, useRef } from "react";

export function useFocusTrap(isActive: boolean, onClose?: () => void) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  // Keep onCloseRef updated with the latest function reference without re-running the effect
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isActive) return;

    // Save the element that was focused before the modal opened
    previousFocusRef.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) return;

    // Mark this container as an active focus trap
    container.setAttribute("data-focus-trap", "true");

    // Wait a tick for the DOM to be fully ready/rendered
    const timer = setTimeout(() => {
      const getFocusableElements = () => {
        return Array.from(
          container.querySelectorAll<HTMLElement>(
            'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
          )
        ).filter((el) => {
          return (
            el.getAttribute("tabindex") !== "-1" &&
            el.getBoundingClientRect().width > 0 &&
            el.getBoundingClientRect().height > 0
          );
        });
      };

      const focusable = getFocusableElements();
      if (focusable.length > 0) {
        // If the focused element is not already inside the container, set focus
        if (!container.contains(document.activeElement)) {
          const autoFocusEl = container.querySelector<HTMLElement>("[autofocus], [autoFocus]");
          if (autoFocusEl) {
            autoFocusEl.focus();
          } else {
            focusable[0].focus();
          }
        }
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if this container is the top-most active focus trap
      const activeTraps = Array.from(document.querySelectorAll('[data-focus-trap="true"]'));
      const topTrap = activeTraps[activeTraps.length - 1];
      if (container !== topTrap) return;

      if (e.key === "Escape" && onCloseRef.current) {
        onCloseRef.current();
        e.preventDefault();
        return;
      }

      if (e.key !== "Tab") return;

      const getFocusableElements = () => {
        return Array.from(
          container.querySelectorAll<HTMLElement>(
            'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
          )
        ).filter((el) => {
          return (
            el.getAttribute("tabindex") !== "-1" &&
            el.getBoundingClientRect().width > 0 &&
            el.getBoundingClientRect().height > 0
          );
        });
      };

      const elements = getFocusableElements();
      if (elements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstEl = elements[0];
      const lastEl = elements[elements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab: if on first element, wrap to last
        if (document.activeElement === firstEl || !container.contains(document.activeElement)) {
          lastEl.focus();
          e.preventDefault();
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === lastEl || !container.contains(document.activeElement)) {
          firstEl.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
      container.removeAttribute("data-focus-trap");
      
      const prevFocus = previousFocusRef.current;
      if (prevFocus) {
        // Restoring focus in setTimeout prevents potential issues with rendering lifecycle
        setTimeout(() => {
          prevFocus.focus();
        }, 0);
      }
    };
  }, [isActive]);

  return containerRef;
}
