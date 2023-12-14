/*
 * Component Name: DPdf
 * Author: Allu Rupesh Siva Krishna
 * Created: 10/02/2023
 * Modified By: Aditya Karthik Kumar V
 * Last Modified: 12/07/2023
 * Description:  Documents for users.
 * Application Release Version:1.0.0
 */

import './pdf.css';
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import * as pdfjs from 'pdfjs-dist';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { PDFDocument } from 'pdf-lib';
import { useDispatch, useSelector } from 'react-redux';
import { setPdfDetails } from '../../store/features/DPdf/pdfDetailsSlice';
import pdfUrlNew from "../../assets/img/DMV-file.pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@3.11.174/legacy/build/pdf.worker.min.js`;


const PdfjsView = ({ pdfUrl, showAddDelete, showZoom, showPagination, showFullScreen, showRotate }, ref) => {
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(0.75);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  let pageRendering = false;
  let pageNumPending = null;
  const [isLoad, setIsLoad] = useState(false);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [renderPdfUrl, setRenderPdfUrl] = useState(pdfUrl);
  const [fileSize, setFileSize] = useState(0);
  const [pdfFile, setPdfFile] = useState(null);
  const [valuePdf, setValuePdf] = useState({
    pageNum: pageNum,
    numPages: numPages,
    fileSize: fileSize
  });
  
  const  pdfDetails  = useSelector(state => state.pdfDetails);
  const dispatch = useDispatch();

  useEffect(() => {   
      loadPDF(renderPdfUrl);
  }, [pdfUrl]);

  useEffect(() => {
      if (!isLoad)
        renderPdf(renderPdfUrl);
  }, [pdfUrl, pageNum, scale, numPages, rotation]);

  useEffect(() => {   
    setValuePdf({
      pageNum: pageNum,
      numPages: numPages,
      fileSize: fileSize,
      pdfFile: pdfFile
    });
    dispatch(setPdfDetails(valuePdf));
}, [pageNum, numPages, fileSize, pdfFile]);

  const loadPDF = async (newPdf) => {
    try {
      const pdfLoad = pdfjs.getDocument(newPdf);
      const pdfInstance = await pdfLoad.promise;
      setNumPages(pdfInstance.numPages);
      const existingPdfBytes = await fetch(renderPdfUrl).then(res => res.arrayBuffer())
      const bytes = new Uint8Array(existingPdfBytes);
      const pdfDoc = await PDFDocument.load(bytes);
      const loadNewPdf = await pdfDoc.save();
      const blob = new Blob([loadNewPdf], { type: 'application/pdf' });
      setPdfFile(blob);
      const fileSize = bytesToSize(blob.size);
      setFileSize(fileSize);
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  };

  const renderPdf = (newPdf) => {
    if (numPages && canvasRef.current) {
      pdfjs
        .getDocument(newPdf)
        .promise.then(pdfInstance => {
          setPdfDocument(pdfInstance);
          pdfInstance.getPage(pageNum).then(page => {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            const viewport = page.getViewport({ scale, rotation });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            setNumPages(numPages);
            setPageNum(pageNum);
            page.render({ canvasContext: context, viewport: viewport });
          });
        })
        .catch(error => {
          console.error('Error rendering page:', error);
        });
    }
  }

  const handleZoomIn = () => {
    if (scale < 2) {
      setScale(scale + 0.1);
    }
    setIsLoad(false);
  };

  const handleZoomOut = () => {
    if (scale > 0.5) {
      setScale(scale - 0.1);
    }
    setIsLoad(false);
  };

  const handleRotateRight = () => {
    setRotation((rotation + 90) % 360);
    setIsLoad(false);
  };

  const handleRotateLeft = () => {
    setRotation((rotation - 90 + 360) % 360);
    setIsLoad(false);
  };

  const handleNextPage = () => {  
    setIsLoad(true);  
    if (pageNum >= numPages) {
      return;
    }
    setPageNum(pageNum+1);
    queueRenderPage(pageNum+1);
  };

  const handlePrevPage = () => {
    setIsLoad(true);
    if (pageNum <= 1) {
      return;
    }
    setPageNum(pageNum-1);
    queueRenderPage(pageNum-1);
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }

    setIsFullScreen(!isFullScreen);
  };

  const handleDeletePage = async () => {
      deletePage();
  };

  const deletePage = async () => {
    const selectedPages = [];
      selectedPages.push(pageNum);
      const existingPdfBytes = await fetch(renderPdfUrl).then(res => res.arrayBuffer())
      const bytes = new Uint8Array(existingPdfBytes);
      const pdfDoc = await PDFDocument.load(bytes);
      const pages = pdfDoc.getPages();
      selectedPages.forEach((page, index) => {
        pdfDoc.removePage((page-1)-index);
      });      
      const newPdf = await pdfDoc.save();
      setIsLoad(true);
      const blob = new Blob([newPdf], { type: 'application/pdf' });
      setPdfFile(blob);
      const fileSize = bytesToSize(blob.size);      
      setFileSize(fileSize);
      const url = URL.createObjectURL(blob);
      setRenderPdfUrl(url);
      let pageNumber = null;

      pdfjs.getDocument(url).promise.then(pdfInstance => {
        setPdfDocument(pdfInstance);
       (pageNum === numPages) ? (pageNumber=(pdfInstance.numPages)) : (pageNumber=(pageNum));
        pdfInstance.getPage(pageNumber).then(page =>{
          const canvas = canvasRef.current;
          const context = canvas?.getContext('2d');
          const viewport = page.getViewport({ scale, rotation });
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          if (numPages ===  pageNum) {
            setNumPages(pdfInstance.numPages);
            setPageNum(pdfInstance.numPages);
          } else {
            setNumPages(pdfInstance.numPages);
            setPageNum(pageNum);
          }
          let renderTask = page.render({canvasContext: context, viewport: viewport}); 
          setFileSize(fileSize);
          setValuePdf({
            pageNum: pageNum,
            numPages: numPages,
            fileSize: fileSize
          });
          dispatch(setPdfDetails(valuePdf));
          renderTask.promise.then(function() {
            pageRendering = false;
            if (pageNumPending !== null) {
              pageRender(pageNumPending);
              pageNumPending = null;
            }
          });
        });
      }).catch(error => {
        console.error('Error rendering page:', error);
      });    
  }

  const handleDeletePDF = async () => {

    pdfjs.getDocument(renderPdfUrl)
        .promise.then(pdfInstance => {
          setPdfDocument(pdfInstance);
          pdfInstance.getPage(pageNum).then(page => {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            const viewport = page.getViewport(canvas.width / page.getViewport(1.0).width);
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            page.fitToPage(canvas, {scale: 1.0});
            page.render({ canvasContext: context, viewport: viewport });
          });
        })
        .catch(error => {
          console.error('Error rendering page:', error);
        });

    
  };

  const handleAddPage = async() => {
    const oldPdfBytes = await fetch(renderPdfUrl).then(res => res.arrayBuffer());
    const bytesOld = new Uint8Array(oldPdfBytes);
    const oldPdfDoc = await PDFDocument.load(bytesOld);
    const pagesOld = oldPdfDoc.getPages();

    const newPdfBytes = await fetch(pdfUrlNew).then(res => res.arrayBuffer());
    const bytesNew = new Uint8Array(newPdfBytes);
    const newPdfDoc = await PDFDocument.load(bytesNew);
    const newPdfArr = await oldPdfDoc.copyPages(newPdfDoc, newPdfDoc.getPageIndices());

    for (const arr of newPdfArr) {
      oldPdfDoc.addPage(arr);
    }
    const pdfBytes = await oldPdfDoc.save();
    setIsLoad(true);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    setPdfFile(blob);
    const fileSize = bytesToSize(blob.size);
    setFileSize(fileSize);
    const url = URL.createObjectURL(blob);
    setRenderPdfUrl(url);
    pdfjs.getDocument(url).promise.then(pdfInstance => {
      setPdfDocument(pdfInstance);
      setNumPages(pdfInstance.numPages);
      setPageNum(pageNum);
      pdfInstance.getPage(pageNum).then(page =>{
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        const viewport = page.getViewport({ scale, rotation });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        setNumPages(pdfInstance.numPages);
        setPageNum(pageNum);
        let renderTask = page.render({canvasContext: context, viewport: viewport}); 
        setValuePdf({
          pageNum: pageNum,
          numPages: numPages,
          fileSize: fileSize
        });
        dispatch(setPdfDetails(valuePdf));
        renderTask.promise.then(function() {
          pageRendering = false;
          if (pageNumPending !== null) {
            pageRender(pageNumPending);
            pageNumPending = null;
          }
        });
      });
    }).catch(error => {
      console.error('Error rendering page:', error);
    });    
  }

  const pageRender = (pageNum) => {
    pdfDocument.getPage(pageNum).then(page =>{
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale, rotation });
        canvas.height = viewport.height;
        canvas.width = viewport.width;    
        let renderTask = page.render({canvasContext: context, viewport: viewport}); 
        renderTask.promise.then(function() {
          pageRendering = false;
          if (pageNumPending !== null) {
            pageRender(pageNumPending);
            pageNumPending = null;
          }
        });
      });    
  }

    /**
   * If another page rendering in progress, waits until the rendering is
   * finised. Otherwise, executes rendering immediately.
   */
    function queueRenderPage(num) {
      if (pageRendering) {
        pageNumPending = num;
      } else {
        pageRender(num);
      }
    }
  
    function bytesToSize(bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes === 0) return 'n/a'
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
      if (i === 0) return `${bytes} ${sizes[i]}`
      return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
    }
  
  useImperativeHandle(ref, () => ({
    handleZoomIn: () => {
      handleZoomIn();
    },
    handleZoomOut: () => {
      handleZoomOut();
    },
    handleRotateRight: () => {
      handleRotateRight();
    },
    handleRotateLeft: () => {
      handleRotateLeft();
    },
    handlePrevPage: () => {
      handlePrevPage();
    },
    handleNextPage: () => {
      handleNextPage()
    },
    handleAddPage: () => {
      handleAddPage()
    },
    handleDeletePage: () => {
      handleDeletePage()
    },
    getPageNum: pageNum,
    getNumPage: numPages,
    getPdfSize: fileSize,
    getPdfFile: pdfFile
  }));

  return (
    <div className={`pdf-viewer ${isFullScreen ? 'fullscreen' : ''}`}>
      <div className='controls'>
        {showZoom && (
          <>
            <ZoomInIcon onClick={handleZoomIn}>Zoom In</ZoomInIcon>
            <ZoomOutIcon onClick={handleZoomOut}>Zoom Out</ZoomOutIcon>
          </>
        )}
        {showPagination && (
          <>
            <NavigateBeforeIcon
              onClick={handlePrevPage}
              disabled={pageNum === 1 || pageNum === 0}
            />
            <div>
              {pageNum} / {numPages}
            </div>
            <NavigateNextIcon onClick={handleNextPage} disabled={pageNum === numPages} />
          </>
        )}

        {showAddDelete && (
          <>
            <button onClick={handleAddPage}>Add Page</button>
            <button onClick={handleDeletePage} disabled={pageNum === 0}>Delete Page</button>
            <button onClick={handleDeletePDF} hidden disabled={pageNum === 0}>Delete PDF</button>
          </>
        )}

        {showFullScreen && (
          <FullscreenIcon onClick={toggleFullScreen}>
            {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </FullscreenIcon>
        )}
        {showRotate && (
          <>
            <RotateRightIcon onClick={handleRotateRight}>Rotate left</RotateRightIcon>
            <RotateLeftIcon onClick={handleRotateLeft}>Rotate right</RotateLeftIcon>
          </>
        )}
      </div>
      <div className='pdf-document'>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};

export default forwardRef(PdfjsView);
