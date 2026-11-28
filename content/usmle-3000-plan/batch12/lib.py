"""Shared constructor. Correct answer position rotates so letter is not a clue."""


def item(n, field, step, system, weight, topic, domain, diff, subject, takeaway, citation, scenario, question, correct, wrongs):
    slot = (n - 1) % 5
    options = []
    wrong_i = 0
    text, why = correct
    for i in range(5):
        if i == slot:
            options.append({"text": text, "why": why, "correct": True})
        else:
            wtext, wwhy = wrongs[wrong_i]
            wrong_i += 1
            options.append({"text": wtext, "why": wwhy, "correct": False})
    prefix = "b12-s1-" if step == "step1" else "b12-s2-"
    return {
        "id": f"{prefix}{n:02d}",
        "fieldId": field,
        "stepLevel": step,
        "outlineSystem": system,
        "outlineWeight": weight,
        "blueprintTopic": topic,
        "blueprintDomain": domain,
        "difficulty": diff,
        "subjectId": subject,
        "takeaway": takeaway,
        "citation": citation,
        "scenario": scenario,
        "question": question,
        "options": options,
    }


def s2(n, **kwargs):
    return item(n, "usmle-step-2", "step2", **kwargs)


def s1(n, **kwargs):
    return item(n, "usmle-step-1", "step1", **kwargs)
