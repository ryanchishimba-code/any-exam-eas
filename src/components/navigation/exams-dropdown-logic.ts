export type ExamsMenuState = {
  open: boolean;
  pinned: boolean;
};

export function examsMenuAfterClick(state: ExamsMenuState): ExamsMenuState {
  if (!state.open) return { open: true, pinned: true };
  if (state.pinned) return { open: false, pinned: false };
  return { open: true, pinned: true };
}

export function examsMenuAfterPointerEnter(state: ExamsMenuState): ExamsMenuState {
  return { open: true, pinned: state.pinned };
}

/** Returns the next state when the hover close timer fires, or null to leave state unchanged. */
export function examsMenuAfterHoverClose(state: ExamsMenuState): ExamsMenuState | null {
  if (state.pinned) return null;
  return { open: false, pinned: false };
}

export function examsMenuAfterDismiss(): ExamsMenuState {
  return { open: false, pinned: false };
}
