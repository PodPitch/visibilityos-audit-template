import csv
from argparse import ArgumentParser
from collections import defaultdict
from datetime import date
from itertools import pairwise
from pathlib import Path

CONDITIONS = ("prompt", "engine", "model", "mode", "country", "language", "location", "brand")
REQUIRED_COLUMNS = {"date", "mentioned", "linked", *CONDITIONS}
FLAGS = {"yes": True, "no": False}


def compare(path: Path) -> None:
    observations = defaultdict(dict)
    with path.open(encoding="utf-8-sig", newline="") as source:
        reader = csv.DictReader(source)
        missing = REQUIRED_COLUMNS.difference(reader.fieldnames or [])
        if missing:
            raise ValueError(f"Missing columns: {', '.join(sorted(missing))}")
        for line, row in enumerate(reader, start=2):
            if None in row or any(row[column] is None for column in REQUIRED_COLUMNS):
                raise ValueError(f"Row {line}: number of values does not match the headers.")
            if row["mentioned"] not in FLAGS or row["linked"] not in FLAGS:
                raise ValueError(f"Row {line}: mentioned and linked must be yes or no.")
            recorded_on = date.fromisoformat(row["date"])
            conditions = tuple(row[column].strip() for column in CONDITIONS)
            if any(not value for column, value in zip(CONDITIONS, conditions) if column != "location"):
                raise ValueError(f"Row {line}: every matching field except location is required.")
            checks = observations[conditions]
            if recorded_on in checks:
                raise ValueError(f"Row {line}: duplicate question and configuration on {recorded_on}.")
            is_linked = FLAGS[row["linked"]]
            checks[recorded_on] = (FLAGS[row["mentioned"]] or is_linked, is_linked)

    total = presence_changes = link_changes = 0
    for conditions, checks in sorted(observations.items()):
        for earlier, later in pairwise(sorted(checks)):
            total += 1
            was_present, was_linked = checks[earlier]
            is_present, is_linked = checks[later]
            presence_changes += was_present != is_present
            link_changes += was_linked != is_linked
            if checks[earlier] != checks[later]:
                prompt, engine, model, mode, country, language, location, brand = conditions
                print(f"{earlier} to {later} | {brand} | {engine}/{model}/{mode} | {country}/{language} {location}")
                print(f"  {prompt}")
                print(f"  Presence: {was_present} -> {is_present} | Link: {was_linked} -> {is_linked}")

    print(f"Matched comparisons: {total}")
    print(f"Presence changes: {presence_changes}")
    print(f"Link changes: {link_changes}")


if __name__ == "__main__":
    parser = ArgumentParser(description="Compare matched AI answer audit checks across dates.")
    parser.add_argument("audit_csv", type=Path)
    arguments = parser.parse_args()
    try:
        compare(arguments.audit_csv)
    except (OSError, ValueError) as error:
        parser.exit(2, f"{error}\n")
