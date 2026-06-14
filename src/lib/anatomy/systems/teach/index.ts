/**
 * Teach system — guided tours and structure quiz.
 * Independent of any viewer surface.
 */

import type { ExamSlug } from "@/types/edtech";
import {
  ANATOMY_QUIZ_QUESTIONS,
  ANATOMY_TOURS,
  getTourById,
  getToursForExam,
} from "../../tours";
import type { AnatomyQuizQuestion, AnatomyTour } from "../../types";
import { getAnatomyStructure } from "../catalog";

export {
  advanceTeachTour,
  buildTeachViewModel,
  clearTeachQuizFeedback,
  createInitialTeachState,
  finishTeachTour,
  getTeachCurrentQuiz,
  getTeachCurrentStep,
  getTeachTour,
  handleTeachQuizAttempt,
  handleTeachStructureSelect,
  isTeachModeActive,
  resetTeachSession,
  startTeachQuiz,
  startTeachTour,
} from "./session";

export type {
  StructureSelectResult,
  TeachMode,
  TeachState,
  TeachViewModel,
} from "./types";

export { ANATOMY_QUIZ_QUESTIONS, ANATOMY_TOURS, getTourById, getToursForExam };

export function assertTeachContentIntegrity(): string[] {
  const issues: string[] = [];
  for (const tour of ANATOMY_TOURS) {
    for (const step of tour.steps) {
      if (!getAnatomyStructure(step.structureId)) {
        issues.push(`tour:${tour.id}:${step.structureId}`);
      }
      if (step.subregionId && !getAnatomyStructure(step.subregionId)) {
        issues.push(`tour:${tour.id}:subregion:${step.subregionId}`);
      }
    }
  }
  for (const q of ANATOMY_QUIZ_QUESTIONS) {
    if (!getAnatomyStructure(q.structureId)) {
      issues.push(`quiz:${q.id}:${q.structureId}`);
    }
  }
  return issues;
}

export function getDefaultTourForExam(examSlug: ExamSlug): AnatomyTour | undefined {
  return getToursForExam(examSlug)[0];
}

export function getQuizQuestions(): AnatomyQuizQuestion[] {
  return ANATOMY_QUIZ_QUESTIONS;
}
