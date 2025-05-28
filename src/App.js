// export default App;
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card, Alert, Button } from 'react-bootstrap';
import { Document, Page, pdfjs } from 'react-pdf';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

/*
  IMPORTANT:
  Since the files are stored in the public/pdfs folder, we cannot read the folder's file list dynamically.
  Instead, we provide a static list of PDF file names (without the .pdf extension).
  
  The expected naming convention is:
    "U<unit>_<year>_<type>_<question number>"

  Examples (your provided samples):
    "U4_2001_A_01"
    "U4_2001_A_02"
    "U4_2001_A_03"
    "U4_2001_A_04"

  If you also have question PDFs available (with "Q" instead of "A"), add them to this list.
*/
const pdfFiles = [
"U4_2001_A_01",
"U4_2001_A_02",
"U4_2001_A_03",
"U4_2001_A_04",
"U4_2001_A_05",
"U4_2001_A_06",
"U4_2001_A_07",
"U4_2001_A_08",
"U4_2001_A_09",
"U4_2001_A_10",
"U4_2001_A_11",
"U4_2001_A_12",
"U4_2001_A_13",
"U4_2001_A_14",
"U4_2001_A_15",
"U4_2001_A_16",
"U4_2001_A_17",
"U4_2001_A_18",
"U4_2001_A_19",
"U4_2001_Q_01",
"U4_2001_Q_02",
"U4_2001_Q_03",
"U4_2001_Q_04",
"U4_2001_Q_05",
"U4_2001_Q_06",
"U4_2001_Q_07",
"U4_2001_Q_08",
"U4_2001_Q_09",
"U4_2001_Q_10",
"U4_2001_Q_11",
"U4_2001_Q_12",
"U4_2001_Q_13",
"U4_2001_Q_14",
"U4_2001_Q_15",
"U4_2001_Q_16",
"U4_2001_Q_17",
"U4_2001_Q_18",
"U4_2001_Q_19",
"U4_2006_A_01",
"U4_2006_A_02",
"U4_2006_A_03",
"U4_2006_A_04",
"U4_2006_A_05",
"U4_2006_A_06",
"U4_2006_A_07",
"U4_2006_A_08",
"U4_2006_A_09",
"U4_2006_A_10",
"U4_2006_A_11",
"U4_2006_A_12",
"U4_2006_A_13",
"U4_2006_A_14",
"U4_2006_A_15",
"U4_2006_A_16",
"U4_2006_A_17",
"U4_2006_A_18",
"U4_2006_Q_01",
"U4_2006_Q_02",
"U4_2006_Q_03",
"U4_2006_Q_04",
"U4_2006_Q_05",
"U4_2006_Q_06",
"U4_2006_Q_07",
"U4_2006_Q_08",
"U4_2006_Q_09",
"U4_2006_Q_10",
"U4_2006_Q_11",
"U4_2006_Q_12",
"U4_2006_Q_13",
"U4_2006_Q_14",
"U4_2006_Q_15",
"U4_2006_Q_16",
"U4_2006_Q_17",
"U4_2006_Q_18",
"U4_2101_A_01",
"U4_2101_A_02",
"U4_2101_A_03",
"U4_2101_A_04",
"U4_2101_A_05",
"U4_2101_A_06",
"U4_2101_A_07",
"U4_2101_A_08",
"U4_2101_A_09",
"U4_2101_A_10",
"U4_2101_A_11",
"U4_2101_A_12",
"U4_2101_A_13",
"U4_2101_A_14",
"U4_2101_A_15",
"U4_2101_A_16",
"U4_2101_A_17",
"U4_2101_A_18",
"U4_2101_A_19",
"U4_2101_Q_01",
"U4_2101_Q_02",
"U4_2101_Q_03",
"U4_2101_Q_04",
"U4_2101_Q_05",
"U4_2101_Q_06",
"U4_2101_Q_07",
"U4_2101_Q_08",
"U4_2101_Q_09",
"U4_2101_Q_10",
"U4_2101_Q_11",
"U4_2101_Q_12",
"U4_2101_Q_13",
"U4_2101_Q_14",
"U4_2101_Q_15",
"U4_2101_Q_16",
"U4_2101_Q_17",
"U4_2101_Q_18",
"U4_2201_Q_09",
"U4_2201_Q_10",
"U4_2201_Q_10",
"U4_2201_Q_11",
"U4_2201_Q_11",
"U4_2201_Q_12",
"U4_2201_Q_12",
"U4_2201_Q_13",
"U4_2201_Q_13",
"U4_2201_Q_14",
"U4_2201_Q_14",
"U4_2201_Q_15",
"U4_2201_Q_15",
"U4_2201_Q_16",
"U4_2201_Q_16",
"U4_2201_Q_17",
"U4_2201_Q_17",
"U4_2201_Q_18",
"U4_2201_Q_18",
"U4_2106_A_01",
"U4_2106_A_02",
"U4_2106_A_03",
"U4_2106_A_04",
"U4_2106_A_05",
"U4_2106_A_06",
"U4_2106_A_07",
"U4_2106_A_08",
"U4_2106_A_09",
"U4_2106_A_10",
"U4_2106_A_11",
"U4_2106_A_12",
"U4_2106_A_13",
"U4_2106_A_14",
"U4_2106_A_15",
"U4_2106_A_16",
"U4_2106_A_17",
"U4_2106_A_18",
"U4_2106_A_19",
"U4_2106_Q_01",
"U4_2106_Q_02",
"U4_2106_Q_03",
"U4_2106_Q_04",
"U4_2106_Q_05",
"U4_2106_Q_06",
"U4_2106_Q_07",
"U4_2106_Q_08",
"U4_2106_Q_09",
"U4_2106_Q_10",
"U4_2106_Q_11",
"U4_2106_Q_12",
"U4_2106_Q_13",
"U4_2106_Q_14",
"U4_2106_Q_15",
"U4_2106_Q_16",
"U4_2106_Q_17",
"U4_2106_Q_18",
"U4_2110_A_01",
"U4_2110_A_02",
"U4_2110_A_03",
"U4_2110_A_04",
"U4_2110_A_05",
"U4_2110_A_06",
"U4_2110_A_07",
"U4_2110_A_08",
"U4_2110_A_09",
"U4_2110_A_10",
"U4_2110_A_11",
"U4_2110_A_12",
"U4_2110_A_13",
"U4_2110_A_14",
"U4_2110_A_15",
"U4_2110_A_16",
"U4_2110_A_17",
"U4_2110_A_18",
"U4_2110_A_19",
"U4_2110_Q_01",
"U4_2110_Q_02",
"U4_2110_Q_03",
"U4_2110_Q_04",
"U4_2110_Q_05",
"U4_2110_Q_06",
"U4_2110_Q_07",
"U4_2110_Q_08",
"U4_2110_Q_09",
"U4_2110_Q_10",
"U4_2110_Q_11",
"U4_2110_Q_12",
"U4_2110_Q_13",
"U4_2110_Q_14",
"U4_2110_Q_15",
"U4_2110_Q_16",
"U4_2110_Q_17",
"U4_2110_Q_18",
"U4_2201_A_01",
"U4_2201_A_02",
"U4_2201_A_03",
"U4_2201_A_04",
"U4_2201_A_05",
"U4_2201_A_06",
"U4_2201_A_07",
"U4_2201_A_08",
"U4_2201_A_09",
"U4_2201_A_10",
"U4_2201_A_11",
"U4_2201_A_12",
"U4_2201_A_13",
"U4_2201_A_14",
"U4_2201_A_15",
"U4_2201_A_16",
"U4_2201_A_17",
"U4_2201_A_18",
"U4_2201_A_19",
"U4_2201_Q_01",
"U4_2201_Q_02",
"U4_2201_Q_03",
"U4_2201_Q_04",
"U4_2201_Q_05",
"U4_2201_Q_06",
"U4_2201_Q_07",
"U4_2201_Q_08",
"U4_2201_Q_09",
"U4_2201_Q_10",
"U4_2201_Q_11",
"U4_2201_Q_12",
"U4_2201_Q_13",
"U4_2201_Q_14",
"U4_2201_Q_15",
"U4_2201_Q_16",
"U4_2201_Q_17",
"U4_2201_Q_18",
"U4_2206_A_01",
"U4_2206_A_02",
"U4_2206_A_03",
"U4_2206_A_04",
"U4_2206_A_05",
"U4_2206_A_06",
"U4_2206_A_07",
"U4_2206_A_08",
"U4_2206_A_09",
"U4_2206_A_10",
"U4_2206_A_11",
"U4_2206_A_12",
"U4_2206_A_13",
"U4_2206_A_14",
"U4_2206_A_15",
"U4_2206_A_16",
"U4_2206_A_17",
"U4_2206_A_18",
"U4_2206_A_19",
"U4_2206_Q_01",
"U4_2206_Q_02",
"U4_2206_Q_03",
"U4_2206_Q_04",
"U4_2206_Q_05",
"U4_2206_Q_06",
"U4_2206_Q_07",
"U4_2206_Q_08",
"U4_2206_Q_09",
"U4_2206_Q_10",
"U4_2206_Q_11",
"U4_2206_Q_12",
"U4_2206_Q_13",
"U4_2206_Q_14",
"U4_2206_Q_15",
"U4_2206_Q_16",
"U4_2206_Q_17",
"U4_2206_Q_18",
"U4_2210_A_01",
"U4_2210_A_02",
"U4_2210_A_03",
"U4_2210_A_04",
"U4_2210_A_05",
"U4_2210_A_06",
"U4_2210_A_07",
"U4_2210_A_08",
"U4_2210_A_09",
"U4_2210_A_10",
"U4_2210_A_11",
"U4_2210_A_12",
"U4_2210_A_13",
"U4_2210_A_14",
"U4_2210_A_15",
"U4_2210_A_16",
"U4_2210_A_17",
"U4_2210_A_18",
"U4_2210_A_19",
"U4_2210_Q_01",
"U4_2210_Q_02",
"U4_2210_Q_03",
"U4_2210_Q_04",
"U4_2210_Q_05",
"U4_2210_Q_06",
"U4_2210_Q_07",
"U4_2210_Q_08",
"U4_2210_Q_09",
"U4_2210_Q_10",
"U4_2210_Q_11",
"U4_2210_Q_12",
"U4_2210_Q_13",
"U4_2210_Q_14",
"U4_2210_Q_15",
"U4_2210_Q_16",
"U4_2210_Q_17",
"U4_2210_Q_18",
"U4_2301_A_01",
"U4_2301_A_02",
"U4_2301_A_03",
"U4_2301_A_04",
"U4_2301_A_05",
"U4_2301_A_06",
"U4_2301_A_07",
"U4_2301_A_08",
"U4_2301_A_09",
"U4_2301_A_10",
"U4_2301_A_11",
"U4_2301_A_12",
"U4_2301_A_13",
"U4_2301_A_14",
"U4_2301_A_15",
"U4_2301_A_16",
"U4_2301_A_17",
"U4_2301_A_18",
"U4_2301_A_19",
"U4_2301_Q_01",
"U4_2301_Q_02",
"U4_2301_Q_03",
"U4_2301_Q_04",
"U4_2301_Q_05",
"U4_2301_Q_06",
"U4_2301_Q_07",
"U4_2301_Q_08",
"U4_2301_Q_09",
"U4_2301_Q_10",
"U4_2301_Q_11",
"U4_2301_Q_12",
"U4_2301_Q_13",
"U4_2301_Q_14",
"U4_2301_Q_15",
"U4_2301_Q_16",
"U4_2301_Q_17",
"U4_2301_Q_18",
"U4_2306_A_01",
"U4_2306_A_02",
"U4_2306_A_03",
"U4_2306_A_04",
"U4_2306_A_05",
"U4_2306_A_06",
"U4_2306_A_07",
"U4_2306_A_08",
"U4_2306_A_09",
"U4_2306_A_10",
"U4_2306_A_11",
"U4_2306_A_12",
"U4_2306_A_13",
"U4_2306_A_14",
"U4_2306_A_15",
"U4_2306_A_16",
"U4_2306_A_17",
"U4_2306_A_18",
"U4_2306_A_19",
"U4_2306_Q_01",
"U4_2306_Q_02",
"U4_2306_Q_03",
"U4_2306_Q_04",
"U4_2306_Q_05",
"U4_2306_Q_06",
"U4_2306_Q_07",
"U4_2306_Q_08",
"U4_2306_Q_09",
"U4_2306_Q_10",
"U4_2306_Q_11",
"U4_2306_Q_12",
"U4_2306_Q_13",
"U4_2306_Q_14",
"U4_2306_Q_15",
"U4_2306_Q_16",
"U4_2306_Q_17",
"U4_2306_Q_18",
"U4_2310_A_01",
"U4_2310_A_02",
"U4_2310_A_03",
"U4_2310_A_04",
"U4_2310_A_05",
"U4_2310_A_06",
"U4_2310_A_07",
"U4_2310_A_08",
"U4_2310_A_09",
"U4_2310_A_10",
"U4_2310_A_11",
"U4_2310_A_12",
"U4_2310_A_13",
"U4_2310_A_14",
"U4_2310_A_15",
"U4_2310_A_16",
"U4_2310_A_17",
"U4_2310_A_18",
"U4_2310_A_19",
"U4_2310_A_20",
"U4_2310_A_21",
"U4_2310_A_22",
"U4_2310_A_23",
"U4_2310_Q_01",
"U4_2310_Q_02",
"U4_2310_Q_03",
"U4_2310_Q_04",
"U4_2310_Q_05",
"U4_2310_Q_06",
"U4_2310_Q_07",
"U4_2310_Q_08",
"U4_2310_Q_09",
"U4_2310_Q_10",
"U4_2310_Q_11",
"U4_2310_Q_12",
"U4_2310_Q_13",
"U4_2310_Q_14",
"U4_2310_Q_15",
"U4_2310_Q_16",
"U4_2310_Q_17",
"U4_2310_Q_18",
"U4_2310_Q_19",
"U4_2310_Q_20",
"U4_2310_Q_21",
"U4_2310_Q_22",
  // To support question PDFs, add entries like "U4_2001_Q_01" etc.
];

function App() {
  const [years, setYears] = useState([]);
  const [units, setUnits] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfaUrl, setPdfaUrl] = useState(null);
  const [availablePdfs, setAvailablePdfs] = useState([]);
  const [error, setError] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showPdfViewer, setShowPdfViewer] = useState(true); // true: question view, false: answer view

  // Generate metadata from the static pdfFiles array.
  // We parse each filename into: unit, year, type, and question.
  const generatePdfData = () => {
    try {
      const pdfData = pdfFiles.map((fileName) => {
        // Example fileName: "U4_2001_A_01"
        const parts = fileName.split('_');
        // parts[0] = Unit ("U4")
        // parts[1] = Year ("2001")
        // parts[2] = Type ("A" or "Q")
        // parts[3] = Question number ("01")
        return {
          unit: parts[0] || '',
          year: parts[1] || '',
          type: parts[2] || '',
          question: parts[3] || '',
          fileName, // full file name string without .pdf extension
        };
      });
      
      setAvailablePdfs(pdfData);
      
      // Generate unique sorted dropdown values.
      const uniqueUnits = [...new Set(pdfData.map(pdf => pdf.unit))].sort();
      const uniqueYears = [...new Set(pdfData.map(pdf => pdf.year))].sort().reverse();
      const uniqueQuestions = [...new Set(pdfData.map(pdf => pdf.question))].sort();
      
      setUnits(uniqueUnits);
      setYears(uniqueYears);
      setQuestions(uniqueQuestions);
      setLoading(false);
    } catch (err) {
      console.error('Error generating PDF metadata:', err);
      setError('Failed to load available PDFs.');
      setLoading(false);
    }
  };

  useEffect(() => {
    generatePdfData();
  }, []);

  // When the selections or the toggle view option changes,
  // update the URL for the PDF viewer.
  useEffect(() => {
    // Only proceed if all dropdowns are selected.
    if (selectedUnit && selectedYear && selectedQuestion) {
      // Search for the matching PDF metadata.
      // Look in our static list for the record with matching unit, year, and question.
      const match = availablePdfs.find(pdf =>
        pdf.unit === selectedUnit &&
        pdf.year === selectedYear &&
        pdf.question === selectedQuestion
      );

      if (match) {
        // In Answer view: use the file as is (assumed to be type "A")
        if (!showPdfViewer) {
          const answerUrl = `${process.env.PUBLIC_URL}/pdfs/${match.fileName}.pdf`;
          setPdfaUrl(answerUrl);
          // Clear any error associated with question view.
          setPdfUrl(null);
          setError(null);
        } 
        // In Question view: attempt to load the question PDF.
        else {
          // Replace "_A_" with "_Q_" in order to build the question version file name.
          const questionFileName = match.fileName.replace('_A_', '_Q_');
          // Check if a question version is available in our static list.
          const qMatch = availablePdfs.find(pdf => pdf.fileName === questionFileName);
          if (qMatch) {
            const questionUrl = `${process.env.PUBLIC_URL}/pdfs/${questionFileName}.pdf`;
            setPdfUrl(questionUrl);
            setError(null);
          } else {
            // If no question PDF exists, show an error.
            setPdfUrl(null);
            setError(`Question PDF for ${selectedUnit} ${selectedYear} Q${selectedQuestion} is not available.`);
          }
          // Also save the answer URL if needed (for example, in case you want to reference it).
          setPdfaUrl(`${process.env.PUBLIC_URL}/pdfs/${match.fileName}.pdf`);
        }
        setPageNumber(1); // Reset to first page on selection change.
      } else {
        setPdfUrl(null);
        setPdfaUrl(null);
        setError(`PDF for Unit ${selectedUnit}, ${selectedYear} Q${selectedQuestion} is not available.`);
      }
    }
  }, [selectedUnit, selectedYear, selectedQuestion, availablePdfs, showPdfViewer]);

  const handleUnitChange = (e) => {
    setSelectedUnit(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleQuestionChange = (e) => {
    setSelectedQuestion(e.target.value);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(1, newPageNumber), numPages);
    });
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const toggleView = () => {
    setShowPdfViewer(prevState => !prevState);
    // Clear any previous error when view is toggled.
    setError(null);
  };

  return (
    <Container className="mt-4 mb-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h2>PDF Viewer</h2>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Unit:</Form.Label>
                <Form.Select 
                  value={selectedUnit} 
                  onChange={handleUnitChange}
                  disabled={loading}
                >
                  <option value="">Select Unit</option>
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Year:</Form.Label>
                <Form.Select 
                  value={selectedYear} 
                  onChange={handleYearChange}
                  disabled={loading}
                >
                  <option value="">Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Question:</Form.Label>
                <Form.Select 
                  value={selectedQuestion} 
                  onChange={handleQuestionChange}
                  disabled={loading}
                >
                  <option value="">Select Question</option>
                  {questions.map(question => (
                    <option key={question} value={question}>{question}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col>
              <Button variant="info" onClick={toggleView}>
                {showPdfViewer ? "Show Answers" : "Show Questions"}
              </Button>
            </Col>
          </Row>

          {error && <Alert variant="warning">{error}</Alert>}
          {loading && <Alert variant="info">Loading available PDFs...</Alert>}

          <div className="pdf-container">
            {showPdfViewer ? (
              pdfUrl ? ( // Question view
                <>
                  <div className="pdf-controls mb-2">
                    <Button 
                      variant="secondary" 
                      onClick={previousPage} 
                      disabled={pageNumber <= 1}
                    >
                      Previous
                    </Button>
                    <span className="mx-2">
                      Page {pageNumber} of {numPages || '--'}
                    </span>
                    <Button 
                      variant="secondary" 
                      onClick={nextPage} 
                      disabled={pageNumber >= numPages}
                    >
                      Next
                    </Button>
                  </div>
                  <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={(error) => setError(`Error loading PDF: ${error.message}`)}
                    loading={<div className="text-center p-5">Loading PDF...</div>}
                  >
                    <Page 
                      pageNumber={pageNumber} 
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      scale={1.2}
                      className="pdf-page"
                    />
                  </Document>
                </>
              ) : (
                !error && (
                  <div className="text-center p-5 bg-light">
                    <p>Please select a unit, year, and question to view the PDF.</p>
                  </div>
                )
              )
            ) : ( // Answer view
              <>
                <div className="pdf-controls mb-2"> 
                  <Button 
                    variant="secondary" 
                    onClick={previousPage} 
                    disabled={pageNumber <= 1}
                  >
                    Previous
                  </Button>
                  <span className="mx-2">
                    Page {pageNumber} of {numPages || '--'}
                  </span>
                  <Button 
                    variant="secondary" 
                    onClick={nextPage} 
                    disabled={pageNumber >= numPages}
                  >
                    Next
                  </Button>
                </div>
                {pdfaUrl ? (
                  <Document
                    file={pdfaUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={(error) => setError(`Error loading PDF: ${error.message}`)}
                    loading={<div className="text-center p-5">Loading PDF...</div>}
                  >
                    <Page 
                      pageNumber={pageNumber} 
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      scale={1.2}
                      className="pdf-page"
                    />
                  </Document>
                ) : (
                  <Alert variant="warning">
                    Answer PDF is not available for {selectedUnit} {selectedYear} Q{selectedQuestion}.
                  </Alert>
                )}
              </>
            )}
          </div>
        </Card.Body>
        <Card.Footer className="text-muted">
          <small>Available PDFs are sourced from the local static list.</small>
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default App;