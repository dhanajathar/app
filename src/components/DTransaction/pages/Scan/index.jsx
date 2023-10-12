import './index.css';

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
import {
  CheckCircleOutline,
  ChevronLeft,
  ChevronRight,
  Close,
  DeleteOutline,
  DocumentScannerOutlined,
  Loop,
  PostAdd,
  TextSnippetOutlined,
  VisibilityOutlined,
  ZoomIn
} from '@mui/icons-material';
import { DEventService, DEvents } from '../../../../services/DEventService';
import React, { useState } from 'react';

import data from './api-response';
import { useSearchParams } from 'react-router-dom';

export default function Scan() {
  const [searchParams] = useSearchParams();
  const flowId = searchParams.get('flowId');

  setTimeout(() => {
    DEventService.dispatch(DEvents.PROGRESS, {
      detail: { label: 'Scan Documents', step: 'Scan Documents', flowId: flowId, substep: true }
    });
  }, 100);

  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(data.rows);
  const [openIndex, setOpenIndex] = useState(-1);
  const [progress, setProgress] = useState(0);

  const isVerifiedRow = rows[openIndex]?.isVerified;
  const deleteScannedDocument = row => {
    let verifiedRow = [...rows];
    let findRowIndex = verifiedRow.findIndex(i => i.id === row.id);
    verifiedRow[findRowIndex].isVerified = false;
    setRows(verifiedRow);
  };

  const scanningInProgress = (i, show) => {
    let verifiedRow = [...rows];
    verifiedRow[i].isLoading = show;
    setRows(verifiedRow);
  };

  const handleFeesClick = e => {
    e.preventDefault();
    DEventService.dispatch(DEvents.ROUTE, {
      detail: { path: 'transaction-orchestrator/fees', payload: 'funk' }
    });
  };

  return (
    <React.Fragment>
      <Grid container>
        <TableContainer>
          <Table aria-label='simple table'>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell className='icon-column'>
                    <TextSnippetOutlined />
                  </TableCell>
                  <TableCell align='left' className='document-name'>
                    {row.documentName}{' '}
                    <span className='scanned-document-details'>
                      {row.isVerified ? row.scanDetails : ''}
                    </span>
                  </TableCell>
                  {row.isLoading && (
                    <TableCell>
                      <div className='progress-wrapper'>
                        <LinearProgress
                          variant='determinate'
                          color='success'
                          value={progress}
                          className='progress-bar'
                        />
                        <IconButton className='view-icon' aria-label='View' component='label'>
                          <Close />
                        </IconButton>
                      </div>
                    </TableCell>
                  )}
                  {!row.isLoading && (
                    <TableCell align='right'>
                      {row.isVerified && (
                        <>
                          <Tooltip arrow title='View' placement='top'>
                            <IconButton
                              className='view-icon'
                              aria-label='View'
                              component='label'
                              onClick={() => {
                                setOpenIndex(i);
                                setOpen(true);
                              }}
                            >
                              <VisibilityOutlined />
                            </IconButton>
                          </Tooltip>
                          <Tooltip arrow className='d-tooltip' title='Delete' placement='top'>
                            <IconButton
                              className='delete-icon'
                              aria-label='View'
                              component='label'
                              onClick={() => deleteScannedDocument(row)}
                            >
                              <DeleteOutline />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      {!row.isVerified && (
                        <Button
                          variant='outlined'
                          color='primary'
                          size='large'
                          className='back-button'
                          startIcon={<DocumentScannerOutlined />}
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
                              setOpen(true);
                              setOpenIndex(i);
                            });
                          }}
                        >
                          Scan
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} hideBackdrop={true}>
        <div className='scan-document-dialog-container'>
          <IconButton
            className='close-icon'
            aria-label='close'
            component='span'
            onClick={() => setOpen(false)}
          >
            <Close />
          </IconButton>
          {!isVerifiedRow && (
            <Tooltip arrow title='ZoomIn' placement='top'>
              <IconButton className='zoom-icon' aria-label='close' component='span'>
                <ZoomIn />
              </IconButton>
            </Tooltip>
          )}
          <img className='scanned-img' src='' height={'630px'} width={'474px'} />
          <Grid container justifyContent={'space-between'} mt={1}>
            {isVerifiedRow && (
              <div className='pagging-wrapper'>
                <Tooltip title='Previous' arrow placement='top'>
                  <IconButton className='pagging-icon' aria-label='View' component='label'>
                    <ChevronLeft />
                  </IconButton>
                </Tooltip>

                <span>1/3</span>
                <Tooltip title='Next' arrow placement='top'>
                  <IconButton className='pagging-icon' aria-label='View' component='label'>
                    <ChevronRight />
                  </IconButton>
                </Tooltip>
              </div>
            )}
            <Grid item>
              {!isVerifiedRow && (
                <Button className='text-btn-icon' variant='text' startIcon={<PostAdd />}>
                  Add Page
                </Button>
              )}
              <Button
                className='text-btn-icon'
                variant='text'
                startIcon={<Loop />}
                onClick={() => {
                  scanningInProgress(openIndex, true);
                  setOpen(false);
                  new Promise((resolve, reject) => {
                    setTimeout(() => setProgress(100), 500);
                    setTimeout(() => {
                      resolve();
                    }, 1000);
                  }).then(() => {
                    scanningInProgress(openIndex, false);
                    setOpen(true);
                    setOpenIndex(openIndex);
                    setProgress(0);
                  });
                }}
              >
                Re-Scan
              </Button>
              {isVerifiedRow && (
                <Button
                  className='text-btn-icon'
                  variant='text'
                  startIcon={<DeleteOutline className='delete-icon' />}
                  onClick={() => {
                    setOpen(false);
                    deleteScannedDocument(rows[openIndex]);
                  }}
                >
                  Delete
                </Button>
              )}
            </Grid>
            {!isVerifiedRow && (
              <Grid item>
                <Button
                  variant={'contained'}
                  color={'primary'}
                  size='large'
                  className={'button'}
                  onClick={() => {
                    let verifiedRow = [...rows];
                    verifiedRow[openIndex].isVerified = true;
                    setRows(verifiedRow);
                    setOpen(false);
                  }}
                  startIcon={<CheckCircleOutline />}
                >
                  Verified
                </Button>
              </Grid>
            )}
          </Grid>
        </div>
      </Dialog>
    </React.Fragment>
  );
}
