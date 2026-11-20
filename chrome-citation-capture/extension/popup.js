const captureButton = document.querySelector("#capture");
const form = document.querySelector("#evidence-form");
const source = document.querySelector("#source");
const passage = document.querySelector("#passage");
const claim = document.querySelector("#claim");
const status = document.querySelector("#status");

function readSelectedEvidence() {
  return {
    source: location.href,
    passage: window.getSelection()?.toString() || "",
  };
}

captureButton.addEventListener("click", async () => {
  captureButton.disabled = true;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab?.id },
      func: readSelectedEvidence,
    });
    if (!/^https?:\/\//i.test(result.source)) {
      status.textContent = "Capture works on web pages. You can paste the URL and passage here.";
      return;
    }
    if (result.passage.length > passage.maxLength) {
      status.textContent = "Select a shorter passage of up to 16,000 characters.";
      return;
    }

    if (!result.passage.trim()) {
      status.textContent = "Select a passage in the tab first, or paste the URL and passage here.";
      return;
    }
    source.value = result.source;
    source.setCustomValidity("");
    passage.value = result.passage;
    passage.setCustomValidity("");
    status.textContent = "Passage captured.";
  } catch {
    status.textContent = "This page could not be read. You can paste the URL and passage here.";
  } finally {
    captureButton.disabled = false;
  }
});

source.addEventListener("input", () => source.setCustomValidity(""));
passage.addEventListener("input", () => passage.setCustomValidity(""));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const sourceUrl = source.value.trim();
  if (!/^https?:\/\//i.test(sourceUrl)) {
    source.setCustomValidity("Enter a URL starting with https:// or http://.");
    source.reportValidity();
    return;
  }
  if (!passage.value.trim()) {
    passage.setCustomValidity("Enter a passage from the source.");
    passage.reportValidity();
    return;
  }

  const lines = [
    "VisibilityOS Citation Capture",
    "",
    "Saved at (UTC)",
    new Date().toISOString(),
    "",
    "Source URL",
    sourceUrl,
    "",
    "Source passage",
    passage.value,
  ];
  if (claim.value.trim()) {
    lines.push("", "AI claim", claim.value.trim());
  }
  const file = new Blob([lines.join("\n") + "\n"], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const download = document.createElement("a");
  download.href = url;
  download.download = "visibilityos-citation-capture.txt";
  download.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = "Download started.";
});
