// VisibilityOS by PodPitch | Paired AI mention audit
// https://visibilityos.co/
// https://visibilityos.co/research/ai-answer-visibility
//
// Edit the four counts below, then press Run. Each pair is the same
// buyer question tested under the same engine, market, and search settings.
package main

import (
	"fmt"
	"math"
)

type PairedMentions struct {
	PresentBoth int
	Gained      int
	Lost        int
	AbsentBoth  int
}

func main() {
	// Fictional example. A gain goes from absent to present.
	example := PairedMentions{PresentBoth: 32, Gained: 25, Lost: 10, AbsentBoth: 33}
	printReport(example)
}

func printReport(counts PairedMentions) {
	if counts.PresentBoth < 0 || counts.Gained < 0 || counts.Lost < 0 || counts.AbsentBoth < 0 {
		fmt.Println("Enter nonnegative counts.")
		return
	}

	total := counts.PresentBoth + counts.Gained + counts.Lost + counts.AbsentBoth
	if total == 0 {
		fmt.Println("Enter at least one completed pair.")
		return
	}

	before := counts.PresentBoth + counts.Lost
	after := counts.PresentBoth + counts.Gained
	percentage := 100 / float64(total)
	fmt.Println("VisibilityOS by PodPitch | Paired AI mention audit")
	fmt.Printf("Matched pairs: %d\n", total)
	fmt.Printf("Before: %d (%.1f%%)\n", before, float64(before)*percentage)
	fmt.Printf("After:  %d (%.1f%%)\n", after, float64(after)*percentage)
	fmt.Printf("Change: %+.1f percentage points\n", float64(counts.Gained-counts.Lost)*percentage)
	fmt.Printf("Gains: %d   Losses: %d   Unchanged: %d\n",
		counts.Gained, counts.Lost, counts.PresentBoth+counts.AbsentBoth)
	fmt.Printf("Exact paired test, if pairs are independent: p = %.6g\n",
		pairedPValue(counts.Gained, counts.Lost))
	fmt.Println("Repeated observations from one question can be dependent. Report the counts and use a method that accounts for dependence before drawing statistical conclusions.")
	fmt.Println("Study and matching method: https://visibilityos.co/research/ai-answer-visibility")
}

// pairedPValue is the two-sided exact McNemar test. Conditional on a
// change, the null hypothesis gives each direction probability 1/2.
func pairedPValue(gains, losses int) float64 {
	discordant := gains + losses
	tail := min(gains, losses)
	if discordant == 0 || gains == losses {
		return 1
	}

	// Start at the most likely outcome in the lower tail, then work down.
	allLog, _ := math.Lgamma(float64(discordant) + 1)
	tailLog, _ := math.Lgamma(float64(tail) + 1)
	otherLog, _ := math.Lgamma(float64(discordant-tail) + 1)
	probability := math.Exp(allLog - tailLog - otherLog - float64(discordant)*math.Ln2)
	summed := probability
	for index := tail; index > 0; index-- {
		probability *= float64(index) / (float64(discordant-index) + 1)
		summed += probability
	}
	return min(1, 2*summed)
}
