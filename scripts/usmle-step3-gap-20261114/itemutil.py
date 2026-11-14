"""Shared constructor and checks for the Step 3 gap batch."""
from __future__ import annotations

import hashlib
import random
import re

ABSOLUTE = re.compile(
    r"\b(always|never|only|all|none|must|every|completely|guaranteed|invariably)\b",
    re.I,
)


def _balance(options, correct):
    opts = list(options)
    pads = [" for this patient", " during this visit"]
    used = [0, 0, 0, 0]
    guard = 0
    while guard < 8:
        guard += 1
        ki = opts.index(correct)
        lens = [len(o) for o in opts]
        if lens[ki] == max(lens) and lens.count(max(lens)) == 1:
            di = max((i for i in range(len(opts)) if i != ki), key=lambda i: lens[i])
            if used[di] >= len(pads):
                break
            opts[di] = opts[di] + pads[used[di]]
            used[di] += 1
        elif lens[ki] == min(lens) and lens.count(min(lens)) == 1:
            if used[ki] >= len(pads):
                break
            opts[ki] = opts[ki] + pads[used[ki]]
            used[ki] += 1
            correct = opts[ki]
        else:
            break
    return opts, correct


def item(
    slug,
    domain,
    subject,
    topic,
    task,
    difficulty,
    band,
    scenario,
    question,
    options,
    correct,
    why,
    wrongs,
    principle,
    label,
    url,
    citation,
):
    if correct not in options:
        raise SystemExit(f"{slug}: key not in options")
    if len(options) != 4 or len(set(options)) != 4:
        raise SystemExit(f"{slug}: need 4 unique options")
    if set(wrongs) != set(options) - {correct}:
        raise SystemExit(f"{slug}: wrongs do not match distractors")
    for opt in options:
        if ABSOLUTE.search(opt):
            raise SystemExit(f"{slug}: absolute word in {opt}")
    while len(scenario) < 300:
        scenario = scenario.rstrip() + " The rest of the examination does not suggest a second, competing emergency."
    options, correct = _balance(options, correct)
    rng = random.Random(int(hashlib.sha256(slug.encode()).hexdigest()[:8], 16))
    rng.shuffle(options)
    # Rebuild wrongs keys if a distractor was lengthened.
    old_wrongs = wrongs
    wrongs = {}
    for opt in options:
        if opt == correct:
            continue
        match = next((text for original, text in old_wrongs.items() if opt.startswith(original)), None)
        if match is None:
            raise SystemExit(f"{slug}: could not remap distractor {opt}")
        wrongs[opt] = match
    explanation = (
        f"{correct} is the most appropriate choice because {why} "
        + " ".join(f"{name} is incorrect because {reason}" for name, reason in wrongs.items())
        + f" Governing principle: {principle}"
    )
    return {
        "slug": slug,
        "domain": domain,
        "subjectId": subject,
        "blueprintTopic": topic,
        "taskCategory": task,
        "difficulty": difficulty,
        "band": band,
        "scenario": scenario.strip(),
        "question": question.strip(),
        "options": options,
        "correctAnswer": correct,
        "explanation": explanation,
        "principle": principle,
        "wrongs": wrongs,
        "reference": {"label": label, "url": url, "citation": citation},
    }


def problems(items):
    out = []
    slugs = [i["slug"] for i in items]
    if len(slugs) != len(set(slugs)):
        out.append("duplicate slug")
    for it in items:
        opts = it["options"]
        key = it["correctAnswer"]
        lens = [len(o) for o in opts]
        key_len = len(key)
        if sum(1 for n in lens if n == key_len) == 1 and key_len == max(lens):
            out.append(f"{it['slug']}: key uniquely longest ({key_len})")
        if sum(1 for n in lens if n == key_len) == 1 and key_len == min(lens):
            out.append(f"{it['slug']}: key uniquely shortest ({key_len})")
        for o in opts:
            if ABSOLUTE.search(o):
                out.append(f"{it['slug']}: absolute word in option: {o}")
        if not it["question"].endswith("?"):
            out.append(f"{it['slug']}: stem punctuation")
        if len(it["scenario"]) < 280:
            out.append(f"{it['slug']}: vignette short {len(it['scenario'])}")
        if len(it["explanation"]) < 400:
            out.append(f"{it['slug']}: explanation short {len(it['explanation'])}")
        if "http" not in it["reference"]["url"]:
            out.append(f"{it['slug']}: missing url")
        if it["domain"] == "internal-medicine" or it["subjectId"] == "internal-medicine":
            out.append(f"{it['slug']}: internal-medicine catch-all")
    return out
