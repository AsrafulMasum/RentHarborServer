// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Folder path
// const uploadPath = path.join(__dirname, "..", "uploads", "host-requests");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, "..", "uploads", "host-requests");

// Ensure folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export default multer({ storage });
