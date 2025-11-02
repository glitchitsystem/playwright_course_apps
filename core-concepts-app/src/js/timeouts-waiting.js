// Interactive logic for timeouts-waiting.html

document.addEventListener("DOMContentLoaded", function () {
  // Auto-waiting: Visible
  const showVisible = document.getElementById("show-visible");
  const visibleElement = document.getElementById("visible-element");
  if (showVisible && visibleElement) {
    showVisible.addEventListener("click", () => {
      visibleElement.style.display = "block";
    });
  }

  // Auto-waiting: Enabled
  const toggleEnabled = document.getElementById("toggle-enabled");
  const enabledInput = document.getElementById("enabled-input");
  if (toggleEnabled && enabledInput) {
    toggleEnabled.addEventListener("click", () => {
      enabledInput.disabled = false;
      enabledInput.placeholder = "Now enabled!";
    });
  }

  // Auto-waiting: Stable
  const moveStable = document.getElementById("move-stable");
  const stableElement = document.getElementById("stable-element");
  if (moveStable && stableElement) {
    moveStable.addEventListener("click", () => {
      stableElement.style.left = "120px";
      setTimeout(() => {
        stableElement.style.left = "0";
      }, 600);
    });
  }

  // Auto-waiting: Editable
  const makeEditable = document.getElementById("make-editable");
  const editableInput = document.getElementById("editable-input");
  if (makeEditable && editableInput) {
    makeEditable.addEventListener("click", () => {
      editableInput.readOnly = false;
      editableInput.placeholder = "You can edit now!";
    });
  }

  // Auto-waiting: Attached
  const attachElement = document.getElementById("attach-element");
  const attachedContainer = document.getElementById("attached-container");
  if (attachElement && attachedContainer) {
    attachElement.addEventListener("click", () => {
      if (!document.getElementById("attached-element")) {
        const el = document.createElement("div");
        el.id = "attached-element";
        el.textContent = "I'm now attached to the DOM!";
        el.setAttribute("data-testid", "attached-element");
        el.style.background = "#e8f5e9";
        el.style.padding = "0.5em 1em";
        el.style.borderRadius = "4px";
        attachedContainer.appendChild(el);
      }
    });
  }
  // Timeout demo
  const timeoutBtn = document.getElementById("timeout-btn");
  const timeoutInput = document.getElementById("timeout-input");
  const timeoutResult = document.getElementById("timeout-result");
  if (timeoutBtn && timeoutInput && timeoutResult) {
    timeoutBtn.addEventListener("click", () => {
      timeoutResult.textContent = "Waiting...";
      const ms = parseInt(timeoutInput.value, 10) || 1000;
      setTimeout(() => {
        timeoutResult.textContent = `Finished after ${ms}ms`;
      }, ms);
    });
  }

  // Auto-waiting demo
  const showDelayed = document.getElementById("show-delayed");
  const delayedElement = document.getElementById("delayed-element");
  if (showDelayed && delayedElement) {
    showDelayed.addEventListener("click", () => {
      delayedElement.style.display = "none";
      setTimeout(() => {
        delayedElement.style.display = "block";
      }, 1200);
    });
  }

  // Dynamic content demo
  const loadDynamic = document.getElementById("load-dynamic");
  const dynamicContent = document.getElementById("dynamic-content");
  if (loadDynamic && dynamicContent) {
    loadDynamic.addEventListener("click", () => {
      dynamicContent.textContent = "Loading...";
      setTimeout(() => {
        dynamicContent.innerHTML = `<span data-testid='dynamic-loaded'>Dynamic content loaded at ${new Date().toLocaleTimeString()}</span>`;
      }, Math.floor(Math.random() * 2000) + 800);
    });
  }

  // New tab demo
  const openTab = document.getElementById("open-tab");
  if (openTab) {
    openTab.addEventListener("click", () => {
      window.open("index.html", "_blank");
    });
  }
});
