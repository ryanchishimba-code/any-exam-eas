# Governing principle proposal sample

Shape example for `npm run db:propose-governing-principles`. These 25 fixtures show how a stored explanation is classified. They are not a production allowlist, and they are not the Management of Care queue.

Counts on this sample: **16 auto_extract**, **9 needs_human**.

`auto_extract` is a single quoted line of 24–200 characters. `needs_human` is a competing line, a long line, an answer-key restatement, or no usable quote. Nothing here is paraphrased.

| Id | Class | Proposed principle |
| --- | --- | --- |
| cmr0tijbt007t1yfn7cczbm8m | auto_extract | Encouraging the client to express feelings is a key component of therapeutic communication. |
| cmr11ksog00bn1y8as6my6tym | auto_extract | This low blood pressure reading indicates potential hypovolemia or bleeding, which is a priority concern following surgery. |
| cmr143vam00a31ygqy7y0c6o1 | auto_extract | Hyperkalemia is a potentially life-threatening condition that requires immediate attention. |
| cmr7g0twu007j1y59e1khmgo0 | auto_extract | Immediate safety is the priority for a client with suicidal ideation. |
| cmr7gb7d1008r1y593qcgspe3 | auto_extract | The priority intervention is to increase the oxygen flow rate to improve oxygenation. |
| shape-notify-surgeon-first | auto_extract | The nurse should first notify the surgeon about the client's concerns and questions before proceeding with the consent process. |
| shape-cultures-before-antibiotics | auto_extract | Obtaining blood cultures before starting antibiotics is critical to identify the causative organism and guide targeted therapy. |
| shape-pain-priority-line | auto_extract | Effective pain control is the priority |
| shape-fluid-priority-line | auto_extract | Fluid reduction is critical |
| shape-correct-hemorrhage | auto_extract | Active hemorrhage with hypotension is a circulation emergency and takes priority over stable tasks. |
| shape-correct-decontaminate | auto_extract | For chemical exposures, decontaminate before definitive care when feasible to protect staff and other clients |
| shape-informed-consent | auto_extract | The nurse's role in informed consent is to verify that the client understands the procedure, risks, benefits, and alternatives. |
| shape-expert-pearl | auto_extract | Restore perfusion before routine tasks when shock is present. |
| shape-delegation | auto_extract | The nurse retains accountability and delegates only stable clients within the assistive personnel's scope of practice. |
| shape-key-takeaway | auto_extract | A competent adult may refuse treatment, and the team documents that decision. |
| shape-airway-most-important | auto_extract | Airway protection is the most important action before any comfort measure in this overdose. |
| shape-two-rules | needs_human | The priority is to correct hypoxemia before comfort measures. |
| shape-answer-restatement | needs_human | The correct answer is to reassess the client with a blood pressure of 88/54 mm Hg. |
| shape-distractor-only | needs_human | (none) |
| shape-rule-out | needs_human | The team should rule out infection with a focused exam. |
| shape-long-opening | needs_human | The priority is to correct hypoxemia before routine comfort tasks for this client for this client for this client for this client for this client for this client for this client for this client for this client for this client for this client today. |
| shape-several-takeaways | needs_human | Document the refusal and stay available to answer questions about alternatives. |
| shape-too-short | needs_human | (none) |
| shape-long-correct-line | needs_human | The priority is to protect the airway and reassess oxygenation before other tasks before other tasks before other tasks before other tasks before other tasks before other tasks before other tasks before other tasks today. |
| shape-temporal-before | needs_human | The client walked before admission yesterday and then requested discharge teaching about diet. |

The first five ids match published Management of Care stems whose explanations already contain the teaching and whose principle field is empty. The quoted line is the one the extractor returns from that shape. Apply still waits for a reviewed id file.
