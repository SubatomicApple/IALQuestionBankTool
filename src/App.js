// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Form, Card, Alert, Button } from 'react-bootstrap';
// import { Document, Page, pdfjs } from 'react-pdf';
// // import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';

// // Configure PDF.js worker
// // pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
// // pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
// // pdfjs.GlobalWorkerOptions.workerSrc = new URL(
// //   'pdfjs-dist/legacy/build/pdf.worker.min.js',
// //   import.meta.url,
// // ).toString();
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

// function App() {
//   const [years, setYears] = useState([]);
//   const [units, setUnits] = useState([]);
//   const [questions, setQuestions] = useState([]);
//   const [selectedYear, setSelectedYear] = useState('');
//   const [selectedQuestion, setSelectedQuestion] = useState('');
//   const [selectedUnit, setSelectedUnit] = useState('');
//   const [pdfUrl, setPdfUrl] = useState(null);
//   const [availablePdfs, setAvailablePdfs] = useState([]);
//   const [error, setError] = useState(null);
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [loading, setLoading] = useState(false);

//   // Fetch available PDFs
//   const fetchPdfs = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('/api/pdfs');
//       setAvailablePdfs(response.data);
      
//       // Extract unique years and questions
//       const uniqueUnits = [...new Set(response.data.map(pdf => pdf.unit))].sort();
//       const uniqueYears = [...new Set(response.data.map(pdf => pdf.year))].sort().reverse();
//       const uniqueQuestions = [...new Set(response.data.map(pdf => pdf.question))].sort(); //3001 json 
      
//       setUnits(uniqueUnits);
//       setYears(uniqueYears);
//       setQuestions(uniqueQuestions);
      
//       // Set default selections if available
//       // if (uniqueYears.length > 0 && !selectedYear) {
//       //   setSelectedYear(uniqueYears[0]);
//       // }
      
//       // if (uniqueQuestions.length > 0 && !selectedQuestion) {
//       //   setSelectedQuestion(uniqueQuestions[0]);
//       // }
//       setLoading(false);
//     } catch (err) {
//       console.error('Error fetching PDFs:', err);
//       setError('Failed to load available PDFs. Please try again later.');
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Initial fetch when component mounts
//     fetchPdfs();
    
//     // Set up polling for new PDFs (every 30 seconds)
//     const intervalId = setInterval(fetchPdfs, 30000);
    
//     return () => clearInterval(intervalId);
//   }, []);

//   useEffect(() => {
//     // Update PDF URL when year or question selection changes
//     if (selectedYear && selectedQuestion) {
//       const pdfName = `U1_${selectedYear}_Q_${selectedQuestion}`;
//       const pdfExists = availablePdfs.some(
//         pdf => pdf.year === selectedYear && pdf.question === selectedQuestion
//       );
      
//       if (pdfExists) {
//         setPdfUrl(`/pdfs/${pdfName}`);
//         setPageNumber(1); // Reset to first page
//         setError(null);
//       } else {
//         setPdfUrl(null);
//         setError(`PDF for ${selectedYear} Q${selectedQuestion} is not available.`);
//       }
//     }
//   }, [selectedYear, selectedQuestion, availablePdfs]);

//   const handleUnitChange = (e) => {
//     setSelectedUnit(e.target.value);
//   }; 

//   const handleYearChange = (e) => {
//     setSelectedYear(e.target.value);
//   };

//   const handleQuestionChange = (e) => {
//     setSelectedQuestion(e.target.value);
//   };

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   const changePage = (offset) => {
//     setPageNumber(prevPageNumber => {
//       const newPageNumber = prevPageNumber + offset;
//       return Math.min(Math.max(1, newPageNumber), numPages);
//     });
//   };

//   const previousPage = () => changePage(-1);
//   const nextPage = () => changePage(1);

//   return (
//     <Container className="mt-4 mb-4">
//       <Card className="shadow-sm">
//         <Card.Header className="bg-primary text-white">
//           <h2>PDF Viewer</h2>
//         </Card.Header>
//         <Card.Body>
//           <Row className="mb-3">
//           <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Unit:</Form.Label>
//                 <Form.Select 
//                   value={selectedUnit} 
//                   onChange={handleUnitChange}
//                   disabled={loading}
//                 >
//                   <option value="">Select Unit</option>
//                   {units.map(unit => (
//                     <option key={unit} value={unit}>{unit}</option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Year:</Form.Label>
//                 <Form.Select 
//                   value={selectedYear} 
//                   onChange={handleYearChange}
//                   disabled={loading}
//                 >
//                   <option value="">Select Year</option>
//                   {years.map(year => (
//                     <option key={year} value={year}>{year}</option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Question:</Form.Label>
//                 <Form.Select 
//                   value={selectedQuestion} 
//                   onChange={handleQuestionChange}
//                   disabled={loading}
//                 >
//                   <option value="">Select Question</option>
//                   {questions.map(question => (
//                     <option key={question} value={question}>{question}</option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//           </Row>
          
//           {error && <Alert variant="warning">{error}</Alert>}
//           {loading && <Alert variant="info">Loading available PDFs...</Alert>}
          
//           <div className="pdf-container">
//             {pdfUrl ? (
//               <>
//                 <div className="pdf-controls mb-2">
//                   <Button 
//                     variant="secondary" 
//                     onClick={previousPage} 
//                     disabled={pageNumber <= 1}
//                   >
//                     Previous
//                   </Button>
//                   <span className="mx-2">
//                     Page {pageNumber} of {numPages || '--'}
//                   </span>
//                   <Button 
//                     variant="secondary" 
//                     onClick={nextPage} 
//                     disabled={pageNumber >= numPages}
//                   >
//                     Next
//                   </Button>
//                 </div>
//                 <Document
//                   file={pdfUrl}
//                   onLoadSuccess={onDocumentLoadSuccess}
//                   onLoadError={(error) => setError(`Error loading PDF: ${error.message}`)}
//                   loading={<div className="text-center p-5">Loading PDF...</div>}
//                 >
//                   <Page 
//                     pageNumber={pageNumber} 
//                     renderTextLayer={false}
//                     renderAnnotationLayer={false}
//                     scale={1.2}
//                     className="pdf-page"
//                   />
//                   <button>
//                     Next Question
//                   </button>
//                 </Document>
//               </>
//             ) : !error && (
//               <div className="text-center p-5 bg-light">
//                 <p>Please select a year and question to view the PDF.</p>
//               </div>
//             )}
//           </div>
//         </Card.Body>
//         <Card.Footer className="text-muted">
//           <small>Available PDFs are updated automatically.</small>
//         </Card.Footer>
//       </Card>
//     </Container>
//   );
// }

// export default App;
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card, Alert, Button } from 'react-bootstrap';
import { Document, Page, pdfjs } from 'react-pdf';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

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
  const [loading, setLoading] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(true); // toggle state

  // Fetch available PDFs
  const fetchPdfs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/pdfs');
      setAvailablePdfs(response.data);

      // Extract unique years and questions
      const uniqueUnits = [...new Set(response.data.map(pdf => pdf.unit))].sort();
      const uniqueYears = [...new Set(response.data.map(pdf => pdf.year))].sort().reverse();
      const uniqueQuestions = [...new Set(response.data.map(pdf => pdf.question))].sort();

      setUnits(uniqueUnits);
      setYears(uniqueYears);
      setQuestions(uniqueQuestions);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching PDFs:', err);
      setError('Failed to load available PDFs. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch when component mounts
    fetchPdfs();

    // Set up polling for new PDFs (every 30 seconds)
    const intervalId = setInterval(fetchPdfs, 30000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Update PDF URL when year or question selection changes
    if (selectedYear && selectedQuestion) {
      const pdfName = `U1_${selectedYear}_Q_${selectedQuestion}`;
      const pdfaName = `U1_${selectedYear}_A_${selectedQuestion}`;
      setPdfaUrl(`/pdfs/${pdfaName}`);
      const pdfExists = availablePdfs.some(
        pdf => pdf.year === selectedYear && pdf.question === selectedQuestion
      );

      if (pdfExists) {
        setPdfUrl(`/pdfs/${pdfName}`);
        setPdfaUrl(`/pdfs/${pdfaName}`);
        setPageNumber(1); // Reset to first page
        setError(null);
      } else {
        setPdfUrl(null);
        setPdfaUrl(null);
        setError(`PDF for ${selectedYear} Q${selectedQuestion} is not available.`);
      }
    }
  }, [selectedYear, selectedQuestion, availablePdfs]);

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
  };

  return (
    <Container className="mt-4 mb-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h2>PDF Viewer</h2>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
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
            <Col md={6}>
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
            <Col md={6} className="mt-3">
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
              pdfUrl ? ( //Question view
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
                    <p>Please select a year and question to view the PDF.</p>
                  </div>
                )
              )
            ) : ( //Answer view
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
                </div>
            )}
          </div>
        </Card.Body>
        <Card.Footer className="text-muted">
          <small>Available PDFs are updated automatically.</small>
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default App;