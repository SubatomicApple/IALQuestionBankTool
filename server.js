const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Serve PDF files
app.use('/pdfs', express.static(path.join(__dirname, 'public/pdfs')));

// API endpoint to get available PDFs
app.get('/api/pdfs', (req, res) => {
  try {
    const pdfDir = path.join(__dirname, 'public/pdfs');
    const files = fs.readdirSync(pdfDir);
    
    const pdfFiles = files
      .filter(file => file.endsWith('.pdf')) //&& /^U\d{4}_Q\d+\.pdf$/.test(file))
      .map(file => {
        const [unitStr, yearStr, qaStr,questionStr] = file.split('_');
        return {
          filename: file,
          unit: unitStr,
          year: yearStr,
          qa: qaStr,
          question: questionStr//.replace('Q', '').replace('.pdf', '')
        };
      });
    
    res.json(pdfFiles);
  } catch (error) {
    console.error('Error reading PDF directory:', error);
    res.status(500).json({ error: 'Failed to read PDF directory' });
  }
});

// All other GET requests not handled before will return the React app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});