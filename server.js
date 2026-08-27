const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || "app";

app.use(express.static(path.join(__dirname, "public")));

app.get("/whoami", (req, res) => {
	res.json({ app: APP_NAME, port: PORT, pid: process.pid });
});

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
	console.log(`${APP_NAME} running at http://localhost:${PORT}`);
});