"use client";

import { useEffect } from "react";
import { Facebook, Linkedin, MessageCircle, X } from "lucide-react";

const SITE = "https://www.anyexameasy.com";

type ShareModalProps = {
  open: boolean;
  onClose: () => void;
  examLabel?: string;
};

function shareText(examLabel: string) {
  return `I'm mastering my ${examLabel} prep with AnyExamEasy's AI engine! 130K+ questions & personalized practice. Join me → ${SITE}`;
}

export function ShareModal({ open, onClose, examLabel = "board" }: ShareModalProps) {
  const text = shareText(examLabel);
  const encoded = encodeURIComponent(text);
  const url = encodeURIComponent(SITE);

  useEffect(() => {
    if (!open) return;
    void import("canvas-confetti").then((confetti) => {
      confetti.default({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#0071e3", "#5856d6", "#30d158"],
      });
    });
  }, [open]);

  if (!open) return null;

  const links = [
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encoded}`,
      icon: X,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encoded}`,
      icon: Facebook,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encoded}`,
      icon: MessageCircle,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      icon: Linkedin,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-sky-600 via-[var(--color-accent)] to-indigo-700 p-[1px] shadow-2xl">
        <div className="rounded-2xl bg-white p-6">
          <h2 id="share-title" className="text-lg font-semibold text-slate-900">
            Share your progress
          </h2>
          <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{text}</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {links.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-medium hover:bg-sky-50"
                onClick={() => onClose()}
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            ))}
          </div>
          <button
            type="button"
            className="mt-4 w-full text-sm text-slate-500 hover:text-slate-800"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
