"""Shared constructor for the added USMLE cards."""

def pack(rows, url, year="2024"):
    cards = []
    for row in rows:
        if len(row) == 9:
            system, task, front, bottom, clue, treat, trap, guideline, note = row
            y = year
        else:
            system, task, front, bottom, clue, treat, trap, guideline, y, note = row
        cards.append(
            dict(
                system=system,
                task=task,
                front=front,
                bottom=bottom,
                clue=clue,
                treat=treat,
                trap=trap,
                guideline=guideline,
                year=str(y),
                url=url,
                note=note,
            )
        )
    return cards
