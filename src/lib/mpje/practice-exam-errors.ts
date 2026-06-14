export class InsufficientMpjeBankError extends Error {
  readonly code = "INSUFFICIENT_MPJE_BANK" as const;

  constructor(
    readonly available: number,
    readonly required: number,
    readonly stateCode?: string
  ) {
    const scope = stateCode ? `${stateCode} ` : "federal ";
    super(
      `Only ${available} verified ${scope}MPJE questions are available (need ${required}).`
    );
    this.name = "InsufficientMpjeBankError";
  }
}
