import type { BankItem } from "@/lib/question-bank";
import type { ExamSlug } from "@/types/edtech";
import { clampPresetExamNumber } from "./preset-exam-config";
import { loadNclexPresetExamItems, listNclexFullPracticeExams } from "./nclex/load-preset-exam";
import { loadNaplexPresetExamItems, listNaplexFullPracticeExams } from "./naplex/load-preset-exam";
import { loadUsmlePresetExamItems, listUsmleFullPracticeExams } from "./usmle/load-preset-exam";
import { loadNptePtPresetExamItems, listNptePtFullPracticeExams } from "./npte-pt/load-preset-exam";
import { loadPancePresetExamItems, listPanceFullPracticeExams } from "./pance/load-preset-exam";
import { loadAanpFnpPresetExamItems, listAanpFnpFullPracticeExams } from "./aanp-fnp/load-preset-exam";

export type LoadedPresetExam = {
  examSlug: ExamSlug;
  examNumber: number;
  title: string;
  questionCount: number;
  items: BankItem[];
  fieldId?: string;
};

export async function loadPresetExamItems(
  examSlug: ExamSlug,
  rawExamNumber: number
): Promise<LoadedPresetExam | null> {
  const examNumber = clampPresetExamNumber(rawExamNumber);

  switch (examSlug) {
    case "nclex": {
      const preset = await loadNclexPresetExamItems(examNumber);
      if (!preset) return null;
      return {
        examSlug,
        examNumber,
        title: preset.exam.title,
        questionCount: preset.exam.questionCount,
        items: preset.items,
        fieldId: "nursing",
      };
    }
    case "naplex": {
      const preset = await loadNaplexPresetExamItems(examNumber);
      if (!preset) return null;
      return {
        examSlug,
        examNumber,
        title: preset.exam.title,
        questionCount: preset.exam.questionCount,
        items: preset.items,
        fieldId: "pharmacy",
      };
    }
    case "usmle": {
      const preset = await loadUsmlePresetExamItems(examNumber);
      if (!preset) return null;
      return {
        examSlug,
        examNumber,
        title: preset.exam.title,
        questionCount: preset.exam.questionCount,
        items: preset.items,
        fieldId: preset.fieldId,
      };
    }
    case "npte-pt": {
      const preset = await loadNptePtPresetExamItems(examNumber);
      if (!preset) return null;
      return {
        examSlug,
        examNumber,
        title: preset.exam.title,
        questionCount: preset.exam.questionCount,
        items: preset.items,
        fieldId: "npte-pt",
      };
    }
    case "pance": {
      const preset = await loadPancePresetExamItems(examNumber);
      if (!preset) return null;
      return {
        examSlug,
        examNumber,
        title: preset.exam.title,
        questionCount: preset.exam.questionCount,
        items: preset.items,
        fieldId: "pance",
      };
    }
    case "aanp-fnp": {
      const preset = await loadAanpFnpPresetExamItems(examNumber);
      if (!preset) return null;
      return {
        examSlug,
        examNumber,
        title: preset.exam.title,
        questionCount: preset.exam.questionCount,
        items: preset.items,
        fieldId: "aanp-fnp",
      };
    }
    default:
      return null;
  }
}

export async function listPresetExamsForSlug(examSlug: ExamSlug) {
  switch (examSlug) {
    case "nclex":
      return listNclexFullPracticeExams();
    case "naplex":
      return listNaplexFullPracticeExams();
    case "usmle":
      return listUsmleFullPracticeExams();
    case "npte-pt":
      return listNptePtFullPracticeExams();
    case "pance":
      return listPanceFullPracticeExams();
    case "aanp-fnp":
      return listAanpFnpFullPracticeExams();
    default:
      return [];
  }
}

export {
  listNclexFullPracticeExams,
  listNaplexFullPracticeExams,
  listUsmleFullPracticeExams,
  listNptePtFullPracticeExams,
  listPanceFullPracticeExams,
  listAanpFnpFullPracticeExams,
};
