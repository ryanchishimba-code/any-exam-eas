"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { ExamQuestionBankCards } from "@/components/study-hub/ExamQuestionBankCards";
import { Top500DrugsCard } from "@/components/study-hub/Top500DrugsCard";
import { firstName } from "@/lib/client/returning-user";
import { STUDY_HUB_PATH } from "@/lib/study-hub/config";

export function SubscriberHome() {
  const { data: session } = useSession();
  const name = session?.user?.name ? firstName(session.user.name) : null;

  return (
    <section className="aee-subscriber-home" aria-labelledby="subscriber-home-heading">
      <div className="mx-auto max-w-[1140px] px-5 py-14 sm:px-6 sm:py-16">
        <div className="max-w-2xl">
          <p className="aee-subscriber-home-eyebrow">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Study Hub
          </p>
          <h2 id="subscriber-home-heading" className="aee-subscriber-home-title">
            {name ? `Ready to study, ${name}?` : "Ready to study?"}
          </h2>
          <p className="aee-subscriber-home-lead">
            Question banks for NCLEX NGN, USMLE, and NAPLEX — plus one Top 500 drug deck for every
            exam.
          </p>
          <Link href={STUDY_HUB_PATH} className="aee-subscriber-home-dashboard-link group">
            Open Study Hub
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>

        <div className="mt-10 space-y-8">
          <ExamQuestionBankCards />
          <Top500DrugsCard />
        </div>
      </div>
    </section>
  );
}
