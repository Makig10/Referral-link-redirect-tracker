const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.get("/go", (req, res) => {
  const logEntry = `${new Date().toISOString()} - ${req.ip} - ${req.headers["user-agent"]}\n`;
  fs.appendFileSync("clicks.log", logEntry);
  res.redirect("https://www.soulhostels.rw/");
});

app.listen(PORT, () => console.log(`Tracker running at http://localhost:${PORT}/go`));
