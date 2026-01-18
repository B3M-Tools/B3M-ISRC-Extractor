document.getElementById("extract").addEventListener("click", async () => {
  const status = document.getElementById("status");
  status.innerText = "Extracting...";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => { window.postMessage({ type: "START_ISRC_EXTRACTION" }, "*"); }
  });

  setTimeout(() => { status.innerText = "Done! Check downloads."; }, 3000);
});