// App.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card, Alert, Button } from 'react-bootstrap';
import { Document, Page, pdfjs } from 'react-pdf';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

function App() {
  // States for CSV data and dropdown options.
  const [availablePdfs, setAvailablePdfs] = useState([]);
  const [units, setUnits] = useState([]);
  const [years, setYears] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [questionTypes, setQuestionTypes] = useState([]);

  // States for user selections.
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [questionTypeFilter, setQuestionTypeFilter] = useState(''); // if non-empty, will filter dropdown questions by `questionType`

  // States for the PDF URLs.
  const [pdfUrl, setPdfUrl] = useState(null);  // For question view
  const [pdfaUrl, setPdfaUrl] = useState(null); // For answer view

  // Other states.
  const [error, setError] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showPdfViewer, setShowPdfViewer] = useState(true); // true: question view, false: answer view

  // Load and parse the CSV file containing metadata.
  const generatePdfData = () => {
    fetch(`${process.env.PUBLIC_URL}/pdfs.csv`)
      .then((res) => res.text())
      .then((text) => {
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        // Assumes the CSV header is:
        // unit,year,type,question,fileName,questionType
        const header = lines[0].split(',').map(item => item.trim());
        const data = lines.slice(1).map(line => {
          const parts = line.split(',');
          const record = {};
          header.forEach((h, idx) => {
            record[h] = parts[idx] ? parts[idx].trim() : '';
          });
          return record;
        });

        setAvailablePdfs(data);

        // Generate dropdown options from CSV.
        const uniqueUnits = [...new Set(data.map(pdf => pdf.unit))].sort();
        const uniqueYears = [...new Set(data.map(pdf => pdf.year))].sort().reverse();
        const uniqueQuestions = [...new Set(data.map(pdf => pdf.question))].sort();
        const uniqueQuestionTypes = [...new Set(data.map(pdf => pdf.questionType))].sort();

        setUnits(uniqueUnits);
        setYears(uniqueYears);
        setQuestions(uniqueQuestions);
        setQuestionTypes(uniqueQuestionTypes);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading CSV file:', err);
        setError('Failed to load available PDFs from CSV.');
        setLoading(false);
      });
  };

  useEffect(() => {
    generatePdfData();
  }, []);

  // This effect updates the displayed PDF when selections or view mode change.
  useEffect(() => {
    // Proceed only if unit, year, and question have been selected.
    if (selectedUnit && selectedYear && selectedQuestion) {
      let match;

      // When in Question view, find a record whose type is "Q".
      if (showPdfViewer) {
        match = availablePdfs.find(
          pdf =>
            pdf.unit === selectedUnit &&
            pdf.year === selectedYear &&
            pdf.question === selectedQuestion &&
            pdf.type === "Q"
        );
      } else {
        // In Answer view, look for a record whose type is "A".
        match = availablePdfs.find(
          pdf =>
            pdf.unit === selectedUnit &&
            pdf.year === selectedYear &&
            pdf.question === selectedQuestion &&
            pdf.type === "A"
        );
      }

      if (match) {
        const fileUrl = `${process.env.PUBLIC_URL}/pdfs/${match.fileName}.pdf`;
        if (showPdfViewer) {
          setPdfUrl(fileUrl);
          // Also store an answer URL (by replacing Q with A) if available.
          setPdfaUrl(`${process.env.PUBLIC_URL}/pdfs/${match.fileName.replace("_Q_", "_A_")}.pdf`);
          setError(null);
        } else {
          setPdfaUrl(fileUrl);
          setError(null);
        }
        setPageNumber(1); // Reset page number when selection changes.
      } else {
        setPdfUrl(null);
        setPdfaUrl(null);
        setError(`PDF not available for ${selectedUnit} ${selectedYear} ${showPdfViewer ? "Question" : "Answer"} ${selectedQuestion}.`);
      }
    }
  }, [selectedUnit, selectedYear, selectedQuestion, availablePdfs, showPdfViewer]);

  // Handler functions for dropdown changes.
  const handleUnitChange = (e) => {
    setSelectedUnit(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleQuestionChange = (e) => {
    setSelectedQuestion(e.target.value);
  };

  const handleQuestionTypeFilterChange = (e) => {
    setQuestionTypeFilter(e.target.value);
  };

  // When the user clicks "Filter Questions", update the questions dropdown based on
  // selected unit, year, and the additional `questionType` column.
  const applyFilter = () => {
    let filtered = availablePdfs;
    if (selectedUnit) {
      filtered = filtered.filter(pdf => pdf.unit === selectedUnit);
    }
    if (selectedYear) {
      filtered = filtered.filter(pdf => pdf.year === selectedYear);
    }
    // Use the new "questionType" column for filtering when provided.
    if (questionTypeFilter) {
      filtered = filtered.filter(pdf => pdf.questionType === questionTypeFilter);
    }
    const filteredUniqueQuestions = [...new Set(filtered.map(pdf => pdf.question))].sort();
    setQuestions(filteredUniqueQuestions);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const changePage = (offset) => {
    setPageNumber((prevPageNumber) => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(1, newPageNumber), numPages);
    });
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const toggleView = () => {
    setShowPdfViewer((prevState) => !prevState);
    // Clear any previous error when toggling view.
    setError(null);
  };

  return (
    <Container className="mt-4 mb-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h2>IAL Physics PastPaper 2020-2023</h2>
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
          
          {/* New row for filtering questions by questionType */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Question Type Filter:</Form.Label>
                <Form.Select 
                  value={questionTypeFilter} 
                  onChange={handleQuestionTypeFilterChange}
                  disabled={loading}
                >
                  <option value="">All</option>
                  {questionTypes.map(qType => (
                    <option key={qType} value={qType}>{qType}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Button variant="primary" onClick={applyFilter}>
                Filter Questions
              </Button>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Button variant="primary" onClick={toggleView}>
                {showPdfViewer ? "Show Answers" : "Show Questions"}
              </Button>
            </Col>
          </Row>

          {error && <Alert variant="warning">{error}</Alert>}
          {loading && <Alert variant="info">Loading available PDFs from CSV...</Alert>}

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
                    Answer PDF is not available for {selectedUnit} {selectedYear} {selectedQuestion}.
                  </Alert>
                )}
              </>
            )}
          </div>
        </Card.Body>
        <Card.Footer className="text-danger">
          <small>Filter the Questions after changing the selected year.</small>
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default App;