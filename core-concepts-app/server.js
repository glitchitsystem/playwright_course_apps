const express = require("express");
const path = require("path");
const open = require("open");

const app = express();
const PORT = 3000;

// Serve static files from src directory
app.use(
  express.static(path.join(__dirname, "src"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      } else if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      } else if (path.endsWith(".html")) {
        res.setHeader("Content-Type", "text/html");
      }
    },
  })
);

// Route for root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Received SIGTERM, shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

const server = app.listen(PORT, async () => {
  console.log(`🎭 Playwright Core Concepts App running at:`);
  console.log(`   Local: http://localhost:${PORT}`);

  console.log(`\n💡 Use Ctrl+C to stop the server`);

  // Auto-open browser
  try {
    await open(`http://localhost:${PORT}`);
    console.log(`🌐 Browser opened automatically`);
  } catch (error) {
    console.log(`⚠️  Could not auto-open browser: ${error.message}`);
  }
});
