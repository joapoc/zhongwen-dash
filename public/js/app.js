"use strict";
const statusEl = document.getElementById("api-status");
async function loadStatus() {
    try {
        const response = await fetch("/api/health");
        const data = await response.json();
        if (statusEl) {
            statusEl.textContent = data.status === "ok" ? "API Ready" : "Degraded";
        }
    }
    catch (error) {
        if (statusEl) {
            statusEl.textContent = "Offline";
        }
        console.error("Failed to reach API health endpoint.", error);
    }
}
function initShell() {
    document.documentElement.classList.add("dark");
    loadStatus();
}
initShell();
