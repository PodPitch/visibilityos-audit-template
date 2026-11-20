const quantile = {
  90: 1.6448536269514722,
  95: 1.959963984540054,
  99: 2.5758293035489004,
};

export function calculatePairs(changeRate, margin, confidenceLevel) {
  const rate = changeRate / 100;
  const error = margin / 100;
  return Math.ceil((quantile[confidenceLevel] / error) ** 2 * rate * (1 - rate));
}

if (typeof document !== "undefined") {
  const form = document.querySelector("#assumptions");
  const rate = document.querySelector("#rate");
  const margin = document.querySelector("#margin");
  const confidence = document.querySelector("#confidence");
  const target = document.querySelector("#target");
  const unit = document.querySelector("#unit");
  const interpretation = document.querySelector("#interpretation");
  const comparison = document.querySelector("#comparison");
  const caution = document.querySelector("#caution");
  const estimateLabel = document.querySelector("#estimate-label");
  const baselineLabel = document.querySelector("#baseline-label");
  const estimateBar = document.querySelector("#estimate-bar");
  const baselineBar = document.querySelector("#baseline-bar");
  const format = new Intl.NumberFormat("en");

  function update() {
    const valid = rate.validity.valid && margin.validity.valid;
    comparison.hidden = !valid;
    caution.hidden = !valid;

    if (!valid) {
      target.textContent = "…";
      unit.textContent = "Check your assumptions";
      interpretation.textContent = "Enter a change rate from 1% to 99% and a margin from 1 to 30 points, with up to one decimal place.";
      return;
    }

    const expectedPercent = rate.valueAsNumber;
    const error = margin.valueAsNumber;
    const pairs = calculatePairs(expectedPercent, error, confidence.value);
    const baseline = calculatePairs(50, error, confidence.value);
    const smallerOutcome = Math.min(expectedPercent, 100 - expectedPercent) / 100;

    target.textContent = format.format(pairs);
    unit.textContent = "matched pairs";
    interpretation.textContent = `That’s ${format.format(2 * pairs)} saved answers if each answer is used in only one pair.`;
    estimateLabel.textContent = format.format(pairs);
    baselineLabel.textContent = format.format(baseline);
    estimateBar.max = baseline;
    estimateBar.value = pairs;
    baselineBar.max = baseline;
    baselineBar.value = baseline;

    caution.textContent = pairs * smallerOutcome < 10
      ? "This plan expects fewer than 10 pairs in one outcome. Try a tighter margin or use a method designed for rare events."
      : "Budget for more runs if you expect missing answers or will repeat the same prompts.";
  }

  form.addEventListener("input", update);
  form.addEventListener("submit", event => event.preventDefault());
  form.addEventListener("reset", () => setTimeout(update, 0));
  update();
}
