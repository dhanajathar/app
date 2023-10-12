import './index.css';

import { Breadcrumbs, Button, Dialog, Divider, IconButton, Slider, Tooltip } from '@mui/material';
import { DEventService, DEvents } from '../../../../services/DEventService';
import React, { useEffect, useRef, useState } from 'react';
import { TreeItem, TreeView } from '@mui/lab';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ContactMailOutlinedIcon from './assets/DL_Icon.png';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import PropTypes from 'prop-types';
import RemoveIcon from '@mui/icons-material/Remove';
import SvgIcon from '@mui/material/SvgIcon';
import defaultimage from './assets/def_image.PNG';
import passport from './assets/passport.png';
import { styled } from '@mui/material/styles';

//Sample functionusage with props
// const breadcrumbelements = [individual, SelectTransaction];
// <DBreadcrumb items={breadcrumbelements, transactionInfo}></DBreadcrumb>

//TODO:
//Document list from show documents button on dropdown

export default function DBreadcrumb({ items, transactionInfo }) {
  const [dropOpen, setDropOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  //Treeview JSON
  const dynamicNodeData = [
    {
      id: '1c',
      label: 'NEW ID CARD: (TRAN ID: 2121232)',
      addIcon: true,
      styles: '',
      children: [
        {
          id: '2c',
          label: 'Application',
          children: [
            { id: '3a', label: 'Mandatory', className: 'optm', children: [] },
            {
              id: '3b',
              label: 'DL / ID Card Application',
              className: 'link',
              document: 'Doc1',
              children: []
            },
            {
              id: '5b',
              label: 'Scanned By: John Micheal, Scanned Date:09/03/2023',
              className: 'no',
              document: 'Doc1',
              children: []
            }
          ]
        },
        {
          id: '4c',
          label: 'Proof of Documents',

          children: [
            { id: '5a', label: 'Mandatory', className: 'optm', children: [] },
            {
              id: '5b',
              label: 'Proof of Identity',
              className: 'link',
              document: 'Doc1',
              children: []
            },
            {
              id: '5b',
              label: 'Scanned By: John Micheal, Scanned Date: 09/03/2023',
              className: 'no',
              document: 'Doc1',
              children: []
            },
            { id: '5a', label: 'Mandatory', className: 'optm', children: [] },
            {
              id: '5b',
              label: 'Proof of Ability to Drive',
              className: 'link',
              document: 'Doc1',
              children: []
            },
            {
              id: '5b',
              label: 'Scanned By: John Micheal, Scanned Date: 09/03/2023',
              className: 'no',
              document: 'Doc1',
              children: []
            },
            { id: '5a', label: 'Mandatory', className: 'optm', children: [] },
            {
              id: '5b',
              label: 'Proof of Current DC Residency (2)',
              className: 'link',
              document: 'Doc1',
              children: []
            },
            {
              id: '5b',
              label: 'Scanned By: John Micheal, Scanned Date: 09/03/2023',
              className: 'no',
              document: 'Doc1',
              children: []
            }
          ]
        }
      ]
    },
    {
      id: '1b',
      label: 'INTERNET VEHICLE REGISTRATION RENEWAL: (TRAN ID: 2324343)',
      addIcon: true,
      children: [
        {
          id: '2b',
          label: 'Application',
          children: [
            { id: '3a', label: 'Mandatory', className: 'optm', children: [] },
            {
              id: '3b',
              label: 'Document Name',
              className: 'link',
              document: 'Doc1',
              children: []
            },
            {
              id: '3c',
              label: 'Scanned by: John Micheal, Scanned Date: 03/07/2023',
              className: 'no',
              children: []
            }
          ]
        },
        {
          id: '4b',
          label: 'Proof of Documents',
          children: [
            {
              id: '5b',
              label: 'No Documents were Scanned',
              className: 'no',
              document: 'Doc1',
              children: []
            },
            {
              id: '3c',
              label:
                'Proof of Identity - Not Applicable (Overridden By: John Michael, Override Date: 03/07/2023)',
              className: 'no',
              children: []
            },
            { id: '5a', label: 'Optional', className: 'optm', children: [] },
            {
              id: '5c',
              label: 'Document Name (2)',
              className: 'link',
              document: 'Doc1',
              children: []
            },
            {
              id: '3c',
              label: 'Scanned by: John Micheal, Scanned Date: 03/07/2023',
              className: 'no',
              children: []
            }
          ]
        }
      ]
    },
    {
      id: '1a',
      label: 'DUPLICATE DRIVER LICENSE: (TRAN ID: 27747500)',
      addIcon: true,
      children: [
        {
          id: '2a',
          label: 'Application',
          children: [
            {
              id: '3a',
              label: 'No Documents were Scanned',
              className: 'no',
              children: []
            },
            {
              id: '3b',
              label:
                'Comments: Application - Not Applicable (Entered By: John Micheal, Entered Date: 11/07/2022)',
              className: 'no',
              children: []
            }
          ]
        },
        {
          id: '4a',
          label: 'Proof of Documents',
          children: [
            {
              id: '5a',
              label: 'No Documents were Scanned',
              className: 'no',
              children: []
            },
            {
              id: '5b',
              label:
                'Comments: Proof of Identity - Not Applicable (Entered By: John Micheal, Entered Date: 11/07/2022)',
              className: 'no',
              children: []
            }
          ]
        }
      ]
    }
  ];

  const toggleDrop = () => {
    setDropOpen(!dropOpen);
  };

  const toggleDocs = () => {
    setIsDialogOpen(true);
  };

  const copyTransactionId = async () => {
    let text = document.getElementById('transId').textContent;
    try {
      await navigator.clipboard.writeText(text);
      alert(`The Transaction ID: ${text} has been copied to the clipboard`);
    } catch (err) {
      alert('Failed to copy: ', err);
    }
  };

  const updateCurrentBreadcrumb = e => {
    let field = document.getElementById('breadcrumbCurrent');
    field.innerHTML = e.detail.label;
  };

  useEffect(() => {
    DEventService.subscribe(DEvents.PROGRESS, updateCurrentBreadcrumb);
    return () => {
      DEventService.unsubscribe(DEvents.PROGRESS, updateCurrentBreadcrumb);
    };
  }, [updateCurrentBreadcrumb]);

  if (items.length < 2) {
    return null; // if there one item, It wil not display
  }

  return (
    <>
      <Breadcrumbs separator='/' aria-label='breadcrumb'>
        {items.map((item, index) => (
          <div
            key={index}
            id={index === 0 ? 'breadcrumbRoot' : 'breadcrumbCurrent'}
            className={index === 0 ? 'DBreadcrumb-item-index' : 'DBreadcrumb-item'}
          >
            {item}
            {index === 0 && (
              <Tooltip arrow title='Supertransaction Info' placement='top'>
                <InfoRoundedIcon
                  onClick={() => {
                    toggleDrop();
                  }}
                  className='DBreadcrumb-icon'
                />
              </Tooltip>
            )}
          </div>
        ))}
      </Breadcrumbs>
      {dropOpen === true && (
        <div className='breadcrumb-dropdown'>
          <CloseOutlinedIcon
            onClick={() => {
              toggleDrop();
            }}
            className='breadcrumb-dropdown-close'
          />
          <div className='breadcrumb-dropdown-container'>
            {transactionInfo.transactionData.map((item, idx) => (
              <div key={idx}>
                <div className='breadcrumb-dropdown-label'>{item.label}</div>
                <div id={idx === 0 ? 'transId' : ''} className='breadcrumb-dropdown-content'>
                  {item.value}
                  {idx === 0 && (
                    <Tooltip arrow title='Clipboard' placement='top'>
                      {' '}
                      <ContentCopyOutlinedIcon
                        onClick={() => {
                          copyTransactionId();
                        }}
                        className='breadcrumb-dropdown-copy'
                      />
                    </Tooltip>
                  )}
                </div>
              </div>
            ))}
          </div>
          <hr className='breadcrumb-dropdown-divider' />
          <Button
            className='breadcrumb-dropdown-button'
            onClick={() => {
              toggleDocs();
            }}
          >
            Show Documents
          </Button>
        </div>
      )}
      <Dialog //Treeview dialog - CustomizedTree initialized
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        fullWidth
        maxWidth='lg' // Adjust this value based on your preference
        PaperProps={{
          style: {
            margin: 0,
            overflow: 'hidden'
          }
        }}
      >
        <div className='breadcrumb-border'>
          <div
            aria-label='close'
            onClick={() => setIsDialogOpen(false)}
            className='breadcrumb-dialog-close'
          >
            <span className='breadcrumb-dialog-close-top'>Close</span>{' '}
            <Tooltip title='Close' arrow placement='top'>
              <CloseIcon className='breadcrumb-closeicon' />
            </Tooltip>
          </div>
          <div>
            <CustomizedTree treeData={dynamicNodeData} />
          </div>
        </div>
      </Dialog>
    </>
  );
}

DBreadcrumb.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired
};

function MinusSquare(props) {
  return (
    <SvgIcon fontSize='inherit' className='breadcrumb-minus-icon' {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d='M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z' />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize='inherit' className='breadcrumb-plus-icon' {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d='M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z' />
    </SvgIcon>
  );
}

const StyledTreeItem = styled(props => <TreeItem {...props} />)(({ theme }) => ({
  [`& .MuiTreeItem-group`]: {
    marginLeft: 15,
    paddingLeft: 18
  },
  [`&.MuiTreeItem-root`]: {},
  [`& .MuiTreeItem-content`]: {
    paddingTop: '18px',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap', // Prevent wrapping of text
    font: 'normal bold 18px/30px Open Sans',
    letterSpacing: '0px',
    color: '#1860B5',
    textTransform: 'uppercase',
    opacity: 1
  },
  [`& MuiTreeItem-content.Mui-selected`]: {
    backgroundColor: 'none'
  }
}));

function CustomizedTree({ treeData }) {
  CustomizedTree.propTypes = {
    treeData: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        children: PropTypes.array, // You can refine this further based on your object structure
        document: PropTypes.string
      })
    ).isRequired
  };

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState([]); // New state for expanded nodes
  const [isCollapse, setIsCollapse] = useState(false);
  const [width, setWidth] = useState(540); // Initial width
  const [isResizing, setIsResizing] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1); //Initial scale zoom for image
  const initialWidth = useRef(0);

  //Expanded first node & children default
  useEffect(() => {
    if (treeData.length > 0) {
      const firstNode = treeData[0];
      const expandedIds = [firstNode.id, ...getAllNodeIds(firstNode.children)];
      setExpandedNodes(expandedIds);
    }
  }, [treeData]);

  const handleExpanAll = () => {
    if (!isCollapse) {
      const allNodeIds = getAllNodeIds(treeData);
      setExpandedNodes(allNodeIds);
    } else {
      setExpandedNodes([]);
    }
    setIsCollapse(!isCollapse);
  };

  const handleMouseDown = e => {
    //border drag functions
    setIsResizing(true);
    initialWidth.current = width;
  };

  const handleMouseMove = e => {
    if (!isResizing) return;

    const newWidth = initialWidth.current + e.clientX - initialWidth.current;
    setWidth(newWidth);
  };

  const handleMouseUp = e => {
    setIsResizing(false);
  };

  const handleIncrease = () => {
    if (zoomLevel < 5) {
      setZoomLevel(zoomLevel + 1); // Increase the value (adjust as needed)
    }
  };

  const handleDecrease = () => {
    if (zoomLevel > 1) {
      setZoomLevel(zoomLevel - 1); // Decrease the value (adjust as needed)
    }
  };

  const handleZoomImg = (event, newValue) => {
    setZoomLevel(newValue);
  };

  const getAllNodeIds = nodes => {
    return nodes.reduce((ids, node) => {
      return [...ids, node.id, ...(node.children ? getAllNodeIds(node.children) : [])];
    }, []);
  };

  const handleNodeToggle = (event, nodeIds) => {
    setExpandedNodes(nodeIds);
  };

  const handleDocumentClick = document => {
    setSelectedDocument(document);
  };

  const renderTreeItems = (nodes, depth = 0) => {
    return nodes.map(node => (
      <StyledTreeItem
        key={node.id}
        nodeId={node.id}
        expanded={expandedNodes.includes(node.id)}
        label={
          <div className='breadcrumb-document'>
            {node.addIcon && <img src={ContactMailOutlinedIcon} />}
            <span
              className={`tree-item-label-level-${node.className ? node.className : depth}`}
              onClick={() => handleDocumentClick(node.document)}
            >
              {node.label}
            </span>
          </div>
        }
      >
        {node.children.length > 0 ? renderTreeItems(node.children, depth + 1) : null}
      </StyledTreeItem>
    ));
  };

  return (
    <div className='breadcrumb-dialog-container'>
      <div
        style={{
          width: `${width}px`,
          cursor: isResizing ? 'col-resize' : 'auto'
        }}
        className={`breadcrumb-left-pane${isResizing ? ' resizing' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
      >
        <div className='DBreadcrumb-header-text'>
          <div className='DBreadcrumb-scan-text'>Scanned Document List</div>
          <Button variant='text' className='DBreadcrumb-treev-button' onClick={handleExpanAll}>
            {isCollapse ? 'Collapse All' : 'Expand All'}
          </Button>
        </div>
        <Divider variant='fullWidth' />
        <TreeView
          aria-label='customized'
          expanded={expandedNodes}
          onNodeToggle={handleNodeToggle}
          defaultCollapseIcon={<MinusSquare sx={{ cursor: 'pointer' }} />}
          defaultExpandIcon={<PlusSquare />}
          className='l-shaped-border'
        >
          {renderTreeItems(treeData)}
        </TreeView>
      </div>
      <div className='breadcrumb-right-pane'>
        {selectedDocument ? (
          <div className='breadcrumb-document'>
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                overflow: 'hidden',
                transformOrigin: 'top left'
              }}
            >
              <img src={passport} className='breadcrumb-img' />
            </div>
            <div className='breadcrumb-slider-container'>
              <IconButton onClick={handleDecrease}>
                <RemoveIcon />
              </IconButton>
              <Slider
                orientation='vertical'
                value={zoomLevel}
                min={1}
                max={5}
                step={zoomLevel} // Adjust the step as needed
                onChange={handleZoomImg}
                aria-labelledby='vertical-slider'
                className='breadcrumb-slider'
              />
              <IconButton onClick={handleIncrease}>
                <AddIcon />
              </IconButton>
            </div>
          </div>
        ) : (
          <img src={defaultimage} className='breadcrumb-img-default' />
        )}
      </div>
    </div>
  );
}
