"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { AppSidebar } from "@/components/app/AppSidebar";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AppMobileDrawer({ open, onClose }: Props) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        className="fixed inset-0 z-[60] bg-slate-900/30 backdrop-blur-[2px] lg:hidden"
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[70] w-[min(18rem,88vw)] overflow-y-auto border-r border-black/[0.06] bg-white p-4 pt-[calc(var(--nav-height)+0.75rem)] shadow-xl lg:hidden"
        )}
        aria-label="Mobile study menu"
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--color-ink)]">Study menu</p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[var(--color-ink-muted)] hover:bg-black/[0.04]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <AppSidebar embedded onNavigate={onClose} />
      </aside>
    </>
  );
}
