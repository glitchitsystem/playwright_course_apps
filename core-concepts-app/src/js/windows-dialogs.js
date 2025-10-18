class WindowsDialogsApp {
  constructor() {
    this.openWindows = [];
    this.init();
  }

  init() {
    this.setupWindowControls();
    this.setupFrameControls();
    this.setupDialogControls();
    this.setupFileUpload();
    this.setupFileDownload();
    this.setupModal();
    this.setupFrameMessaging();
  }

  // Window Controls
  setupWindowControls() {
    document.getElementById("open-new-tab").addEventListener("click", () => {
      const newWindow = window.open("about:blank", "_blank");
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head><title>New Tab</title></head>
            <body>
              <h1>New Tab Opened</h1>
              <p>This is a new tab opened for testing purposes.</p>
              <p>Opened at: ${new Date().toLocaleString()}</p>
              <button onclick="window.close()">Close This Tab</button>
            </body>
          </html>
        `);
        this.trackWindow(newWindow, "tab");
      }
    });

    document.getElementById("open-new-window").addEventListener("click", () => {
      const newWindow = window.open(
        "about:blank",
        "_blank",
        "width=600,height=400"
      );
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head><title>New Window</title></head>
            <body>
              <h1>New Window Opened</h1>
              <p>This is a popup window with specific dimensions.</p>
              <p>Opened at: ${new Date().toLocaleString()}</p>
              <button onclick="window.close()">Close This Window</button>
            </body>
          </html>
        `);
        this.trackWindow(newWindow, "window");
      }
    });

    document
      .getElementById("open-external-link")
      .addEventListener("click", () => {
        window.open("https://playwright.dev", "_blank");
        this.updateWindowInfo("External site opened in new tab");
      });
  }

  trackWindow(windowRef, type) {
    this.openWindows.push({ window: windowRef, type, openedAt: new Date() });
    this.updateWindowInfo(`${type} opened successfully`);

    // Check if window is closed
    const checkClosed = setInterval(() => {
      if (windowRef.closed) {
        clearInterval(checkClosed);
        this.openWindows = this.openWindows.filter(
          (w) => w.window !== windowRef
        );
        this.updateWindowInfo(`${type} was closed`);
      }
    }, 1000);
  }

  updateWindowInfo(message) {
    const info = document.getElementById("window-info");
    const timestamp = new Date().toLocaleTimeString();
    info.innerHTML = `<p><strong>${timestamp}:</strong> ${message}</p>`;
  }

  // Frame Controls
  setupFrameControls() {
    // Frame controls removed - frames are now display-only for testing purposes
  }

  setupFrameMessaging() {
    window.addEventListener("message", (event) => {
      if (event.data && event.data.type) {
        switch (event.data.type) {
          case "frame-interaction":
            this.updateFrameInfo(
              `Frame button clicked with input: "${event.data.data}"`
            );
            break;
          case "frame-input-change":
            this.updateFrameInfo(
              `Frame input changed to: "${event.data.data}"`
            );
            break;
        }
      }
    });
  }

  updateFrameInfo(message) {
    const info = document.getElementById("frame-info");
    const timestamp = new Date().toLocaleTimeString();
    info.innerHTML = `<p><strong>${timestamp}:</strong> ${message}</p>`;
  }

  // Dialog Controls
  setupDialogControls() {
    document.getElementById("alert-dialog").addEventListener("click", () => {
      alert("This is an alert dialog for testing!");
      this.updateDialogResult("Alert dialog was shown");
    });

    document.getElementById("confirm-dialog").addEventListener("click", () => {
      const result = confirm("Do you want to proceed with this action?");
      this.updateDialogResult(
        `Confirm dialog result: ${result ? "OK" : "Cancel"}`
      );
    });

    document.getElementById("prompt-dialog").addEventListener("click", () => {
      const result = prompt("Please enter your name:", "Default Name");
      this.updateDialogResult(
        `Prompt dialog result: ${result !== null ? `"${result}"` : "Cancelled"}`
      );
    });
  }

  updateDialogResult(message) {
    const result = document.getElementById("dialog-result");
    const timestamp = new Date().toLocaleTimeString();
    result.innerHTML = `<p><strong>${timestamp}:</strong> ${message}</p>`;
  }

  // Modal Controls
  setupModal() {
    const modal = document.getElementById("custom-modal");
    const openBtn = document.getElementById("open-modal");
    const closeBtn = document.getElementById("modal-close");
    const saveBtn = document.getElementById("modal-save");
    const cancelBtn = document.getElementById("modal-cancel");

    openBtn.addEventListener("click", () => {
      modal.style.display = "flex";
      document.getElementById("modal-input").focus();
    });

    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    cancelBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    saveBtn.addEventListener("click", () => {
      const input = document.getElementById("modal-input");
      this.updateDialogResult(`Modal saved with value: "${input.value}"`);
      modal.style.display = "none";
      input.value = "";
    });

    // Close modal when clicking overlay
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });

    // Handle Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "flex") {
        modal.style.display = "none";
      }
    });
  }

  // File Upload
  setupFileUpload() {
    // Single file upload
    document.getElementById("single-file").addEventListener("change", (e) => {
      const file = e.target.files[0];
      const info = document.getElementById("single-file-info");

      if (file) {
        info.innerHTML = `
          <strong>File selected:</strong><br>
          Name: ${file.name}<br>
          Size: ${this.formatFileSize(file.size)}<br>
          Type: ${file.type}<br>
          Last Modified: ${new Date(file.lastModified).toLocaleString()}
        `;
      } else {
        info.textContent = "No file selected";
      }
    });

    // Multiple file upload
    document
      .getElementById("multiple-files")
      .addEventListener("change", (e) => {
        const files = Array.from(e.target.files);
        const info = document.getElementById("multiple-files-info");

        if (files.length > 0) {
          const fileList = files
            .map((file) => `• ${file.name} (${this.formatFileSize(file.size)})`)
            .join("<br>");

          info.innerHTML = `
          <strong>${files.length} files selected:</strong><br>
          ${fileList}
        `;
        } else {
          info.textContent = "No files selected";
        }
      });

    // Drag and drop upload
    const dropZone = document.getElementById("drop-zone");
    const dropZoneInput = document.getElementById("drop-zone-input");
    const dropZoneInfo = document.getElementById("drop-zone-info");

    dropZone.addEventListener("click", () => {
      dropZoneInput.click();
    });

    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.classList.add("drag-over");
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("drag-over");
    });

    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.classList.remove("drag-over");

      const files = Array.from(e.dataTransfer.files);
      this.handleDroppedFiles(files, dropZoneInfo);
    });

    dropZoneInput.addEventListener("change", (e) => {
      const files = Array.from(e.target.files);
      this.handleDroppedFiles(files, dropZoneInfo);
    });
  }

  handleDroppedFiles(files, infoElement) {
    if (files.length > 0) {
      const fileList = files
        .map(
          (file) =>
            `• ${file.name} (${this.formatFileSize(file.size)}, ${
              file.type || "unknown type"
            })`
        )
        .join("<br>");

      infoElement.innerHTML = `
        <strong>${files.length} files dropped:</strong><br>
        ${fileList}
      `;
    } else {
      infoElement.textContent = "No files dropped";
    }
  }

  // File Download
  setupFileDownload() {
    document.getElementById("download-json").addEventListener("click", () => {
      const data = {
        message: "Hello World!",
        timestamp: new Date().toISOString(),
        browser: navigator.userAgent,
        data: [1, 2, 3, 4, 5],
      };

      this.downloadFile(
        JSON.stringify(data, null, 2),
        "data.json",
        "application/json"
      );
      this.updateDownloadStatus("JSON file download initiated");
    });

    document.getElementById("generate-report").addEventListener("click", () => {
      const report = this.generateReport();
      this.downloadFile(report, "report.html", "text/html");
      this.updateDownloadStatus("HTML report generated and download initiated");
    });

    document.getElementById("download-image").addEventListener("click", () => {
      this.generateAndDownloadImage();
      this.updateDownloadStatus("Generated image download initiated");
    });

    // Track download clicks
    document.querySelectorAll('[data-testid^="download-"]').forEach((link) => {
      if (link.tagName === "A") {
        link.addEventListener("click", () => {
          const fileName = link.getAttribute("download");
          this.updateDownloadStatus(`Direct download initiated: ${fileName}`);
        });
      }
    });
  }

  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  generateReport() {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Generated Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 2rem; }
            .header { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 1rem; }
            .section { margin: 2rem 0; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; }
            th { background-color: #f8f9fa; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Test Report</h1>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="section">
            <h2>System Information</h2>
            <table>
              <tr><th>Property</th><th>Value</th></tr>
              <tr><td>User Agent</td><td>${navigator.userAgent}</td></tr>
              <tr><td>Language</td><td>${navigator.language}</td></tr>
              <tr><td>Platform</td><td>${navigator.platform}</td></tr>
              <tr><td>Screen Resolution</td><td>${screen.width}x${
      screen.height
    }</td></tr>
            </table>
          </div>
          
          <div class="section">
            <h2>Test Results</h2>
            <p>This is a sample generated report for testing file download functionality.</p>
          </div>
        </body>
      </html>
    `;
  }

  generateAndDownloadImage() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 400;
    canvas.height = 300;

    // Draw a simple image
    ctx.fillStyle = "#3498db";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Generated Image", canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText(
      new Date().toLocaleString(),
      canvas.width / 2,
      canvas.height / 2 + 20
    );

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "generated-image.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  updateDownloadStatus(message) {
    const status = document.getElementById("download-status");
    const timestamp = new Date().toLocaleTimeString();
    status.innerHTML = `<p><strong>${timestamp}:</strong> ${message}</p>`;
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new WindowsDialogsApp();
});
