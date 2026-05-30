/** NGN / advanced item JSON schema injected into generation prompts. */
export const NGN_JSON_SCHEMA = `
Advanced item formats (mix ~40% classic MCQ, ~60% NGN-style for nursing; adapt per field):

1. multiple_choice — 4 options, 1 best answer
2. select_all — 5-6 options, multiple correct (correctAnswer = comma-separated best set)
3. unfolding_case — vignette with caseStep 1-3, progressive data reveals across linked items
4. bow_tie — central condition; options describe actions TO take vs conditions TO monitor
5. matrix — grid-style: rows × columns selection (represent as select_all with labeled options)
6. highlight — "highlight the findings that require follow-up" (select_all variant)
7. ordered_response — correctAnswer = comma-separated priority sequence

Each question MUST include:
- vignette (realistic patient/scenario when clinical)
- question (the ask)
- options (when applicable)
- correctAnswer
- explanation (why correct)
- clinicalReasoning (step-by-step judgment)
- distractorRationale: { "Option text": "why wrong" } for each incorrect option
- references: ["Source [n] title or URL"]
- bloomLevel: remember | understand | apply | analyze
- ngnFormat: the format id above

Return valid JSON exam with questions array using these fields.`;

export const NGN_SYSTEM_AUGMENTATION = `You write board-style items superior to commercial banks.
Study the pattern analysis and retrieved chunks — mirror distractor logic and clinical judgment flow from exemplars.
Never copy stems verbatim; create fresh variations with equal or higher realism.
Self-check: each item must be answerable from provided sources and clinically defensible.`;
