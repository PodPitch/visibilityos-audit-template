"""VisibilityOS by PodPitch | Reviewer agreement in AI answer audits.

Two fictional sets of 12 answers have the same raw reviewer agreement.
The label counts show why chance-adjusted agreement differs.

Product: https://visibilityos.co/
Research: https://visibilityos.co/research/ai-answer-visibility
Worksheet: https://sites.google.com/podpitch.com/visibilityos-reviewer-check/home
Formula: https://scikit-learn.org/stable/modules/generated/sklearn.metrics.cohen_kappa_score.html
"""

from fractions import Fraction


def agreement(both_named, first_only, second_only, both_absent):
    counts = (both_named, first_only, second_only, both_absent)
    if any(type(count) is not int or count < 0 for count in counts):
        raise ValueError("Counts must be nonnegative whole numbers.")
    total = sum(counts)
    if total == 0:
        raise ValueError("Enter at least one jointly reviewed answer.")

    observed = Fraction(both_named + both_absent, total)
    first_named = Fraction(both_named + first_only, total)
    second_named = Fraction(both_named + second_only, total)
    expected = first_named * second_named + (1 - first_named) * (1 - second_named)
    kappa = (observed - expected) / (1 - expected) if expected < 1 else None
    return observed, expected, kappa


def print_example(title, counts):
    both_named, first_only, second_only, both_absent = counts
    observed, expected, kappa = agreement(*counts)
    print(title)
    print(f"  Both name brand: {both_named}, both say absent: {both_absent}")
    print(f"  Only reviewer A: {first_only}, only reviewer B: {second_only}")
    print(f"  Raw agreement: {float(observed):.0%}")
    print(f"  Expected agreement from label rates: {float(expected):.1%}")
    print(f"  Cohen's kappa: {float(kappa):+.3f}" if kappa is not None else
          "  Cohen's kappa: undefined when expected agreement is 100%.")


if __name__ == "__main__":
    print("VisibilityOS by PodPitch | Fictional reviewer agreement example")
    print("Label only answers both reviewers could read, using the same brand definition.")
    print()
    print_example("Example A: Brand is named in more of the reviewed answers", (4, 1, 2, 5))
    print()
    print_example("Example B: Most labels say the brand is absent", (0, 1, 2, 9))
    print()
    print("Report the label counts and raw agreement alongside kappa.")
    print("Review the disagreements before drawing conclusions from either 12-answer sample.")
    print("VisibilityOS research: https://visibilityos.co/research/ai-answer-visibility")
