const fs = require("fs");
const http = require("http");
const path = require("path");

const PORT = Number(process.env.PORT) || 8000;
const HOST = process.env.HOST || "127.0.0.1";
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const REGISTRATIONS_FILE = path.join(DATA_DIR, "registrations.csv");

const csvHeaders = [
  "submittedAt",
  "fullName",
  "email",
  "affiliation",
  "role",
  "primaryLanguages",
  "otherLanguages",
  "aiEvaluationExperience",
  "areasOfInterest",
  "expectations",
];

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const requiredFields = [
  "fullName",
  "email",
  "affiliation",
  "role",
  "primaryLanguages",
  "aiEvaluationExperience",
  "expectations",
];

const ensureRegistrationFile = () => {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  if (!fs.existsSync(REGISTRATIONS_FILE)) {
    fs.writeFileSync(REGISTRATIONS_FILE, `${csvHeaders.join(",")}\n`);
  }
};

const sendJson = (res, statusCode, body) => {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
};

const parseRequestBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;

      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Request body is too large."));
      }
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON request."));
      }
    });

    req.on("error", reject);
  });

const escapeCsvValue = (value) => {
  const normalizedValue = Array.isArray(value) ? value.join("; ") : String(value || "");
  return `"${normalizedValue.replaceAll('"', '""')}"`;
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const handleRegistration = async (req, res) => {
  try {
    const payload = await parseRequestBody(req);
    const missingField = requiredFields.find((field) => !String(payload[field] || "").trim());

    if (missingField) {
      sendJson(res, 400, { error: "Please complete all required fields." });
      return;
    }

    if (!isValidEmail(payload.email)) {
      sendJson(res, 400, { error: "Please enter a valid email address." });
      return;
    }

    ensureRegistrationFile();

    const row = csvHeaders.map((header) => {
      if (header === "submittedAt") return escapeCsvValue(new Date().toISOString());
      return escapeCsvValue(payload[header]);
    });

    fs.appendFileSync(REGISTRATIONS_FILE, `${row.join(",")}\n`);
    sendJson(res, 201, { ok: true });
  } catch (error) {
    sendJson(res, 400, { error: error.message || "Unable to save registration." });
  }
};

const serveStaticFile = (req, res) => {
  const requestPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  const safePath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(ROOT, safePath === "/" ? "index.html" : safePath);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const contentType = mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
};

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/register") {
    handleRegistration(req, res);
    return;
  }

  if (req.method === "GET") {
    serveStaticFile(req, res);
    return;
  }

  res.writeHead(405, { Allow: "GET, POST" });
  res.end("Method not allowed");
});

ensureRegistrationFile();
server.listen(PORT, HOST, () => {
  console.log(`Workshop site running at http://${HOST}:${PORT}`);
  console.log(`Registrations will be saved to ${REGISTRATIONS_FILE}`);
});
