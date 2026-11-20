const form = document.querySelector("#record-form");
const capture = document.querySelector("#capture");
const claim = document.querySelector("#claim");
const source = document.querySelector("#source");
const excerpt = document.querySelector("#excerpt");
const verdict = document.querySelector("#verdict");
const empty = document.querySelector("#empty");
const output = document.querySelector("#output");
const actions = document.querySelector("#export-actions");
const status = document.querySelector("#status");

function clearRecord() {
  output.textContent = "";
  output.hidden = true;
  actions.hidden = true;
  empty.hidden = false;
  status.textContent = "";
}

form.addEventListener("input", () => {
  claim.setCustomValidity("");
  source.setCustomValidity("");
  clearRecord();
});

form.addEventListener("reset", () => {
  claim.setCustomValidity("");
  source.setCustomValidity("");
  clearRecord();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const claimText = claim.value.trim();
  const sourceUrl = source.value.trim();
  if (!claimText) {
    claim.setCustomValidity("Enter the exact wording of the claim.");
    claim.reportValidity();
    return;
  }
  if (sourceUrl && !/^https?:\/\//i.test(sourceUrl)) {
    source.setCustomValidity("Enter a source URL starting with https:// or http://.");
    source.reportValidity();
    return;
  }

  const fields = [
    ["Capture context", capture.value.trim()],
    ["Claim from the AI answer", claimText],
    ["Cited source URL", sourceUrl],
    ["Evidence from the source", excerpt.value.trim()],
    ["Review decision", verdict.value],
  ];
  const sections = fields.map(([label, value]) => `${label}\n${value || "Not recorded"}`);
  output.textContent = ["AI Citation Evidence Record", ...sections].join("\n\n");
  output.hidden = false;
  actions.hidden = false;
  empty.hidden = true;
  status.textContent = "Record ready.";
  output.focus();
});

document.querySelector("#example").addEventListener("click", () => {
  form.reset();
  capture.value = "Fictional example. Which inventory tools offer CSV export on their free plan?";
  claim.value = "Northline Books lets users export inventory as CSV on its free plan.";
  source.value = "https://northlinebooks.example/help/exports";
  excerpt.value = "CSV export is included on paid subscriptions.";
  verdict.value = "Does not support the claim";
});

document.querySelector("#copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(output.textContent);
    status.textContent = "Record copied.";
  } catch {
    status.textContent = "Copy is unavailable here. Download the record instead.";
  }
});

document.querySelector("#download").addEventListener("click", () => {
  const record = new Blob([output.textContent + "\n"], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(record);
  const link = document.createElement("a");
  link.href = url;
  link.download = "visibilityos-citation-evidence.txt";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = "Download started.";
});
