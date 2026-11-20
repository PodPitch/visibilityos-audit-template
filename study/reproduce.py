import argparse
import csv
import json
from pathlib import Path


DATASET = Path(__file__).with_name("dataset")
OUTCOMES = {
    "presence_gained",
    "presence_lost",
    "presence_unchanged",
    "link_status_changed",
}


def read_rows(filename):
    with (DATASET / filename).open(encoding="utf-8", newline="") as source:
        return list(csv.DictReader(source))


def summarize():
    views = [
        {
            "engine_view": row["engine_view"],
            "comparisons": int(row["comparisons"]),
            "presence_changes": int(row["presence_changes"]),
        }
        for row in read_rows("engine-views.csv")
    ]
    if not views or len({view["engine_view"] for view in views}) != len(views):
        raise ValueError("Expected one row per distinct engine view")
    for view in views:
        comparisons = view["comparisons"]
        changes = view["presence_changes"]
        if comparisons <= 0 or not 0 <= changes <= comparisons:
            raise ValueError(f"Invalid counts for {view['engine_view']}")
        view["presence_change_rate"] = changes / comparisons

    total = sum(view["comparisons"] for view in views)
    changes = sum(view["presence_changes"] for view in views)
    rows = read_rows("outcomes.csv")
    outcomes = {row["measure"]: int(row["count"]) for row in rows}
    if outcomes.keys() != OUTCOMES or len(rows) != len(OUTCOMES):
        raise ValueError("Expected one row for each published outcome")
    if any(int(row["comparisons"]) != total for row in rows):
        raise ValueError("Outcome denominators do not match the engine view totals")
    if any(not 0 <= count <= total for count in outcomes.values()):
        raise ValueError("Outcome counts must be within the comparison total")
    if outcomes["presence_gained"] + outcomes["presence_lost"] != changes:
        raise ValueError("Presence gains and losses do not match the engine view changes")
    if changes + outcomes["presence_unchanged"] != total:
        raise ValueError("Changed and unchanged presence do not match the comparison total")

    return {
        "engine_views": views,
        "comparisons": total,
        "presence_changes": changes,
        "presence_change_rate": changes / total,
        "link_status_change_rate": outcomes["link_status_changed"] / total,
        **outcomes,
    }


def main():
    parser = argparse.ArgumentParser(
        description="Reproduce the aggregate AI answer study by VisibilityOS by PodPitch."
    )
    parser.add_argument("--json", action="store_true", help="Print machine-readable results")
    args = parser.parse_args()
    results = summarize()
    if args.json:
        print(json.dumps(results, indent=2))
        return

    print("VisibilityOS by PodPitch | AI answer study")
    print(f"{'Engine view':16} {'Matched':>7} {'Changed':>7} {'Rate':>7}")
    for view in results["engine_views"]:
        print(
            f"{view['engine_view']:16} {view['comparisons']:7} "
            f"{view['presence_changes']:7} {view['presence_change_rate']:7.1%}"
        )
    print(
        f"Presence changed in {results['presence_changes']} of "
        f"{results['comparisons']} comparisons ({results['presence_change_rate']:.1%})."
    )
    print(
        f"An official link appeared or disappeared in {results['link_status_changed']} "
        f"comparisons ({results['link_status_change_rate']:.1%})."
    )


if __name__ == "__main__":
    main()
