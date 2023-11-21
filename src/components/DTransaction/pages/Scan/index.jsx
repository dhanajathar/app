import './index.css';
import { useState, useEffect, useRef } from 'react';
import * as _ from 'lodash';

import {
  Button,
  Dialog,
  Grid,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip
} from '@mui/material';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RotateLeftRoundedIcon from '@mui/icons-material/RotateLeftRounded';
import RotateRightRoundedIcon from '@mui/icons-material/RotateRightRounded';
import {
  CheckCircleOutline,
  ChevronLeft,
  ChevronRight,
  Close,
  DeleteOutline,
  DocumentScannerOutlined,
  Loop,
  PostAdd,
  VisibilityOutlined,
  ZoomIn
} from '@mui/icons-material';

import { DEventService, DEvents } from '../../../../services/DEventService';
import supData from './api-sup-reasons-list.json';
import SupOverrideDialog from '../../../DDialog/components/SupOverrideDialog';
import DeleteConfirmDialog from '../../../DDialog/components/DeleteConfirmDialog';
import SupReasonsDialog from '../../../DDialog/components/SupReasonsDialog';
import userData from '../IndividualDetails/api-individual-details.json';

import data from './api-scan-documents-list.json';

import { useSearchParams } from 'react-router-dom';
import DPdf from '../../../DPdf';
import pdfUrl from './assets/pdf/my-pdf-file.pdf';

const Scan = () => {
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId');
  const pdfRef = useRef(null);

  setTimeout(() => {
    DEventService.dispatch(DEvents.PROGRESS, {
      detail: { label: 'Scan Documents', step: 'Scan Documents', flowId: flowId, substep: true }
    });
  }, 100);

  const [pdfUrlLink, setPdfUrlLink] = useState(pdfUrl);
  const [open, setOpen] = useState(false);
  const [openSup, setOpenSup] = useState(false);
  const [openCon, setOpenCon] = useState(false);
  const [openSupCom, setOpenSupCom] = useState(false);
  const [view, setView] = useState(false);
  const [rows, setRows] = useState(data.rows);
  const [openIndex, setOpenIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [scannedOrComment, setScannedOrComment] = useState(''); 
  const [closeDoc, setCloseDoc] = useState(false);
  const [numOfPages, setNumOfPages] = useState(0); 
  const [pageNum, setPageNum] = useState(1); 
  const [fileSize, setFileSize] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const getDateAndTime = () => {
    const date = new Date().toLocaleString('en-US', { hour12: true });
    return date;
  };

  const [zoomLevel, setZoomLevel] = useState(1); //Initial scale zoom for image

  const onZoomIncrease = () => {
    if(pdfRef.current){
      pdfRef.current.handleZoomIn();
    }
  }

  const onZoomDecrease = () => {
    if(pdfRef.current){
      pdfRef.current.handleZoomOut();
    }
  }

  const onRotateLeft = () => {
    if(pdfRef.current){
      pdfRef.current.handleRotateLeft();
    }
  }

  const onRotateRight = () => {
    if(pdfRef.current){
      pdfRef.current.handleRotateRight();
    }
  }

  const onPrevPage = () => {
    if(pdfRef.current){
      pdfRef.current.handlePrevPage();
      setPageNum(pdfRef.current.getPageNum.pageNum-1);
      setNumOfPages(pdfRef.current.getNumPage.numPages);
    }
  }

  const onNextPage = () => {
    if(pdfRef.current){
      pdfRef.current.handleNextPage();
      setPageNum(pdfRef.current.getPageNum.pageNum+1);
      setNumOfPages(pdfRef.current.getNumPage.numPages);
    }
  }

  const onAddPage = () => {
    if(pdfRef.current){
      pdfRef.current.handleAddPage();
    }
  }

  const onDeletePage = () => {
    if(numOfPages === 1){
      setScannedOrComment('delete the current scanned documents');
      setOpenCon(true); 
    } else if (pdfRef.current){
      setScannedOrComment('delete the current scanned documents');
      setOpenCon(true); 
    }
  }

  const isVerifiedRow = rows[openIndex]?.isVerified;
  const deleteScannedDocument = (index) => {
    let verifiedRow = [...rows];
    verifiedRow[index].isVerified = false;
    verifiedRow[index].pdfFile = null;
    setRows(verifiedRow);
    setOpen(false);
  };

  const deleteCommentedDocument = (index) => {
    let verifiedRow = [...rows];
    verifiedRow[index].isCommented = false;
    setRows(verifiedRow);
  };

  const deleteCurrentScannedDocument = () => {
    if(closeDoc){
      setOpen(false); 
      setCloseDoc(false);
    }

    if(numOfPages === 1){
      setOpen(false); 
    } else if(pdfRef.current){
      pdfRef.current.handleDeletePage();
    }
  };

  const rescanDocument = (index) => {
    scanningInProgress(index, true);
    setOpen(false);
    new Promise((resolve, reject) => {
      setTimeout(() => setProgress(100), 500);
      setTimeout(() => {
        resolve();
      }, 1000);
    }).then(() => {
      scanningInProgress(index, false);
      setOpen(true);
      setOpenIndex(index);
      setProgress(0);
    });
  };

  const closeScanDoc = () => {
    setCloseDoc(false);
  }

  const scanningInProgress = (i, show) => {
    let verifiedRow = [...rows];
    verifiedRow[i].isLoading = show;
    setRows(verifiedRow);
  };

useEffect(() => {
  setPageNum(pdfRef.current?.getPageNum?.pageNum);
  setNumOfPages(pdfRef.current?.getNumPage?.numPages);
}, [open]);


  const handleReasonOthers = (e, value) => {
    (value === "OTHERS") ? setShowComments(true) : setShowComments(false);
  }

  const handleFeesClick = e => {
    e.preventDefault();
    DEventService.dispatch(DEvents.ROUTE, {
      detail: { path: 'transaction-orchestrator/fees', payload: 'funk' }
    });
  };
  
  const [sortData, setSortData] = useState({
    column: null,
    sorting: null
  });

  const [columns, setColumns] = useState(supData.columns);
  const [profileData, setProfileData] = useState([...supData.profileData]);

  const handleColumnSort = columnKey => {
    const selectedColumn = columns.find(column => column.key === columnKey);

    if (!selectedColumn['allowedToSort']) {
      return;
    }
    let _sortData;
    if (columnKey == sortData.column) {
      _sortData = {
        ...sortData,
        sorting: sortData.sorting === 'asc' ? 'desc' : !sortData.sorting ? 'asc' : null
      };
    } else {
      _sortData = { column: columnKey, sorting: 'asc' };
    }

    if (_sortData.column) {
      switch (_sortData.sorting) {
        case 'asc':
          if (selectedColumn['dataType'] === 'date') {
            setProfileData(profileData => _.orderBy(profileData, [_sortData.column], ['asc']));
          } else {
            setProfileData(profileData => _.orderBy(profileData, [_sortData.column]), ['asc']);
          }
          break;
        case 'desc':
          if (selectedColumn['dataType'] === 'date') {
            setProfileData(profileData => _.orderBy(profileData, [_sortData.column], ['desc']));
          } else {
            setProfileData(profileData => _.orderBy(profileData, [_sortData.column], ['desc']));
          }

          break;
        default:
          setProfileData([...Data.profileData]);
      }
    }
    setSortData({ ..._sortData });
  };

  const deleteScannedOrDocument = () => {
    if(scannedOrComment === 'delete scanned documents') {
      deleteScannedDocument(openIndex);
    } else if(scannedOrComment === 'delete commented details'){
      deleteCommentedDocument(openIndex);
    } else if(scannedOrComment === 'rescan the documents'){
      rescanDocument(openIndex);
    } else {
      deleteCurrentScannedDocument();
    }
  }

  const submitDocument = () => {
    const dateTime = getDateAndTime();
    let verifiedRow = [...rows];
    verifiedRow[openIndex].isCommented = true;
    verifiedRow[openIndex].scanDetails = `${dateTime}`;
    setRows(verifiedRow);
  }  

  const handlePDFPages = (data) => {
    setNumOfPages(data);
  }

  const handlePDFPageNum = (data) => {
    setPageNum(data);
  }

  const handlePdfSize = (data) => {
    setFileSize(data);
  }  

  const handlePdfFile = (file) => {
    setPdfFile(file);
  } 

  return (
    <>
      <Grid container>
        <TableContainer>
          <Table aria-label='simple table'>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell className='scan-icon-column'>
                    <ArticleOutlinedIcon />
                  </TableCell>
                  <TableCell align='left' className='scan-document-name'>
                    {row.documentName}{' '}
                    <span className='scanned-document-details'>
                      {row.isVerified ?  row.scanDetails : ''}
                    </span>
                    <span className='scanned-document-details'>
                      {row.isCommented ? row.scanDetails : ''}
                    </span>
                  </TableCell>
                  {row.isLoading && (
                    <TableCell>
                      <div className='scan-progress-wrapper'>
                        <LinearProgress
                          variant='determinate'
                          color='success'
                          value={progress}
                          className='scan-progress-bar'
                        />
                        <IconButton className='scan-view-icon' aria-label='View' component='label'>
                          <Close />
                        </IconButton>
                      </div>
                    </TableCell>
                  )}
                  {!row.isLoading && (
                    <TableCell align='right' className='scan-btn-name'>
                      {row.isVerified && !row.isCommented && (
                        <>
                          <Tooltip arrow title='View' placement='top'>
                            <IconButton
                              className='scan-view-icon'
                              aria-label='View'
                              component='label'
                              onClick={() => {
                                setOpenIndex(i);                                
                                let verifiedRow = [...rows];
                                const url = URL.createObjectURL(verifiedRow[i].pdfFile);
                                setPdfUrlLink(url);
                                setView(true);
                                setOpen(true);
                              }}
                            >
                              <VisibilityOutlined />
                            </IconButton>
                          </Tooltip>
                          <Tooltip arrow className='d-tooltip' title='Delete' placement='top'>
                            <IconButton
                              className='scan-delete-icon'
                              aria-label='delete'
                              component='label'
                              onClick={() => {
                                setOpenIndex(i);
                                setScannedOrComment('delete scanned documents');
                                setOpenCon(true);
                              }}
                            >
                              <DeleteOutline />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      {!row.isVerified && row.isCommented && (    
                        <>                    
                          <Tooltip arrow className='d-tooltip' title='Comment' placement='top'>
                            <IconButton
                              className='scan-comment-icon'
                              aria-label='comment'
                              component='label'
                              onClick={() => {
                                setOpenIndex(i);
                                setOpenSupCom(true);
                              }}
                            >
                              <CommentOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip arrow className='d-tooltip' title='Delete' placement='top'>
                            <IconButton
                              className='scan-delete-icon'
                              aria-label='delete'
                              component='label'
                              onClick={() => {
                                setOpenIndex(i);
                                setScannedOrComment('delete commented details');
                                setOpenCon(true);
                              }}
                            >
                              <DeleteOutline />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      {!row.isVerified && !row.isCommented && (
                        <div className={`${row.isMandate ? "" : "scan-only-scan-btn"}`}> 
                        <Button
                          variant='outlined'
                          color='primary'
                          size='large'
                          className='scan-back-button scan-button'
                          ref={pdfRef} 
                          onClick={() => {
                            scanningInProgress(i, true);
                            new Promise((resolve, reject) => {
                              setTimeout(() => setProgress(100), 500);
                              setTimeout(() => {
                                resolve();
                              }, 1000);
                            }).then(() => {
                              scanningInProgress(i, false);
                              setProgress(0);
                              let verifiedRow = [...rows];
                              if(verifiedRow[i].pdfFile === null){
                                setPdfUrlLink(pdfUrl);
                              }
                              setOpenIndex(i);
                              setOpen(true);
                            });
                          }}
                        >
                          <DocumentScannerOutlined className="scan-options-btn" /> SCAN
                        </Button>
                        {row.isMandate && (<Button
                          variant='outlined'
                          color='primary'
                          size='large'
                          className='scan-back-button scan-override-button'
                          onClick={() => {       
                            setOpenIndex(i);
                            setOpenSup(true);                              
                          }}
                        >
                          OVERRIDE
                        </Button>)}
                        </div>
                      )}                      
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Dialog sx={{ "& .MuiDialog-paper": { width: "60%", height: "auto"} }} maxWidth="100rem" open={open}>
        <div className='scan-document-dialog-container'>            
        <p className="scan-dialog-heading">{rows[openIndex]?.documentName}</p> 
          <IconButton
            className='scan-close-icon'
            aria-label='close'
            component='span'
            onClick={() => {
                  if(view === false){
                    setScannedOrComment('delete the current scanned documents');
                    setOpenCon(true); 
                    setCloseDoc(true);  
                  } else {
                    setView(false);
                    setOpen(false);
                  }                    
            }}
          >
           Close <Close className="scan-close-icon-pdf" />
          </IconButton>              
          <div className='scan-breadcrumb-right-pane'>
            <div className='scan-breadcrumb-document'>
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  overflow: 'hidden',
                  transformOrigin: 'top left'
                }}
              >
                {/* <img src={passport} /> */}
                <DPdf
                  className='scan-breadcrumb-img'
                  pdfUrl={pdfUrlLink}
                  ref={pdfRef}
                  showAddDelete={false} 
                  onPdfNumOfPages={handlePDFPages}
                  onPdfPageNum={handlePDFPageNum} 
                  onPdfSize = {handlePdfSize} 
                  onPdfFile = {handlePdfFile}
                  showZoom={false}
                  showPagination={false}
                  showFullScreen={false}
                  showRotate={false}
                ></DPdf>
              </div>
              <div className='scan-breadcrumb-slider-container'>
                <>
                  <Tooltip arrow title='ZoomIn' placement='top'>
                    <IconButton onClick={onZoomIncrease} className='scan-zoom-icon-in' aria-label='close' component='span'>
                      <ZoomIn />
                    </IconButton>
                  </Tooltip>
                  <Tooltip arrow title='ZoomOut' placement='top'>
                  <IconButton onClick={onZoomDecrease} className='scan-zoom-icon-out' aria-label='close' component='span'>
                    <ZoomOutIcon />
                  </IconButton>
                </Tooltip>    
                </>
              </div>

              <div className='scan-breadcrumb-slider-container'>
                <>
                  <Tooltip arrow title='Rotate Right' placement='top'>
                    <IconButton onClick={onRotateRight} className='scan-rotate-right' aria-label='close' component='span'>
                      <RotateRightRoundedIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip arrow title='Rotate Left' placement='top'>
                  <IconButton onClick={onRotateLeft} className='scan-rotate-left' aria-label='close' component='span'>
                    <RotateLeftRoundedIcon />
                  </IconButton>
                </Tooltip>    
                </>
              </div>
            </div>
          </div>
          
          <Grid container justifyContent={'space-between'} mt={1}>
           
              <div className='scan-pagging-wrapper'>
                <Tooltip title='Previous' arrow placement='top'>
                  <IconButton onClick={onPrevPage} className='scan-pagging-icon' aria-label='View' component='label' disabled={pageNum === 1 || pageNum === 0}>
                    <ChevronLeft />
                  </IconButton>
                </Tooltip>

                <p>{pageNum} / {numOfPages} </p>

                <Tooltip title='Next' arrow placement='top'>
                  <IconButton onClick={onNextPage} className='scan-pagging-icon' aria-label='View' component='label' disabled={pageNum === numOfPages || pageNum === 0 || numOfPages === 0}>
                    <ChevronRight />
                  </IconButton>
                </Tooltip>
              </div>
           
            <Grid item className='scan-dialog-btns' >
              {!isVerifiedRow && (
                <>
                <Button onClick={onAddPage} className='scan-text-btn-icon' variant='text' >
                  <PostAdd className="scan-options-btn" /> Add Page
                </Button>
              
              <Button
                className='scan-text-btn-icon'
                variant='text'
                onClick={() => {
                  setScannedOrComment('rescan the documents');
                  setOpenCon(true);   
                }}
              >
               <Loop className="scan-options-btn" /> Re-Scan
              </Button>
              <Button
                  className='scan-text-btn-icon scan-delete-icon'
                  variant='text'
                  onClick={onDeletePage} 
                >
                 <DeleteOutline className="scan-options-btn" /> Delete
                </Button>
                </>
              )}
            </Grid>
            {!isVerifiedRow && (
              <Grid item className='scan-dialog-btns' >
                <Button
                  variant={'contained'}
                  color={'primary'}
                  size='large'
                  className={'button'}
                  onClick={() => {
                    const dateTime = getDateAndTime();
                    let verifiedRow = [...rows];
                    verifiedRow[openIndex].pdfFile = pdfFile;
                    verifiedRow[openIndex].isVerified = true;
                    verifiedRow[openIndex].scanDetails = (`${numOfPages} Pages` +' '+ `${fileSize}` +' '+ `${dateTime}`); 
                    setRows(verifiedRow);
                    setOpen(false);
                  }} 
                >
                  <CheckCircleOutline className="scan-options-btn" /> Verified
                </Button>
              </Grid>
            )}
          </Grid>
        </div>
      </Dialog>
      <>

      <SupOverrideDialog open={openSup} close={() => setOpenSup(false)} data={'skip document scans'} onSubmitClick={submitDocument} />
     
      <DeleteConfirmDialog open={openCon} close={() => setOpenCon(false)} data={scannedOrComment} onCloseButtonClick={closeScanDoc} onConfirmClick={deleteScannedOrDocument} />

      <SupReasonsDialog open={openSupCom} close={() => setOpenSupCom(false)} />
    
        </>
    </>
  );
}

export default Scan;
