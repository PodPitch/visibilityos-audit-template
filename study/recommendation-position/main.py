# VisibilityOS by PodPitch | AI recommendation position audit
# Official site: https://visibilityos.co/
# Matching method: https://visibilityos.co/research/ai-answer-visibility
#
# This worked example uses fictional positions.
# Use the same completed questions and settings in each round.
# Enter the first numbered list position for your brand, or None if absent.

from statistics import mean

before = [1, 3, 5, 4, None, None, None, None]
after = [1, None, None, None, None, None, None, None]


def summarize(positions):
    if not positions:
        raise ValueError("Use at least one completed answer.")
    if any(
        position is not None and (type(position) is not int or position < 1)
        for position in positions
    ):
        raise ValueError("Use positive whole positions or None for answers without the brand.")

    ranked = [position for position in positions if position is not None]
    total = len(positions)
    in_top_three = sum(position <= 3 for position in ranked)
    return (
        total,
        len(ranked),
        100 * len(ranked) / total,
        100 * in_top_three / total,
        mean(ranked) if ranked else None,
    )


def show(round_name, positions):
    total, mentions, mention_rate, top_three_rate, average_position = summarize(positions)
    position_label = "N/A" if average_position is None else f"{average_position:.2f}"
    print(f"{round_name}: {mentions} of {total} answers name the brand ({mention_rate:.1f}%)")
    print(f"  Top-three coverage across all answers: {top_three_rate:.1f}%")
    print(f"  Average position when named: {position_label}")


def main():
    if len(before) != len(after):
        raise ValueError("Use the same number of matched answers in both rounds.")

    print("VisibilityOS by PodPitch | AI recommendation position audit")
    print()
    show("Before", before)
    show("After", after)
    print()
    print("Report how often the brand appears alongside its average position.")
    print("Keep absent brands in the denominator for both coverage rates.")
    print("Official study: https://visibilityos.co/research/ai-answer-visibility")


if __name__ == "__main__":
    main()
