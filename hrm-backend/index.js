const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Enable CORS for your frontend
app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
}));

// Create uploads folder if not exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Save with timestamp to avoid name conflicts
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Upload route
app.post('/upload-resume', upload.single('resume'), (req, res) => {
  console.log('Received form data:', req.body);
  console.log('Received file:', req.file);

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // You can process other form fields here from req.body

  res.json({ message: 'Upload successful!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});

