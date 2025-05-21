const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

// Enable CORS for your frontend URL or all origins
app.use(cors());

// Create 'uploads' folder if not exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Use original file name + timestamp for uniqueness
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// POST endpoint to receive form data and file upload
app.post('/', upload.single('resume'), (req, res) => {
  const { name, email, phone, experience, role } = req.body;
  const resumeFile = req.file;

  if (!resumeFile) {
    return res.status(400).json({ message: 'Resume file missing!' });
  }

  // Log form data and file info
  console.log('--- New Resume Upload ---');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Phone:', phone);
  console.log('Experience:', experience);
  console.log('Role:', role);
  console.log('File saved at:', resumeFile.path);
  console.log('Original filename:', resumeFile.originalname);
  console.log('Stored filename:', resumeFile.filename);
  console.log('MIME type:', resumeFile.mimetype);
  console.log('Size (bytes):', resumeFile.size);

  // Send success response
  res.json({ message: 'Resume uploaded and saved successfully!' });
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
