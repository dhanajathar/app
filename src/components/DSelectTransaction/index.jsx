/*
 * Author: Rupesh Allu
 * Created: 06/01/2023
 * Last Modified: 2023-12-29
 * Description: This select transaction which shows all avaiable transaction based on profile
 * Application Release Version:1.0.0
 */

import './index.css';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  ButtonGroup,
  Card,
  CardActionArea,
  CardContent,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  TextField
} from '@mui/material';
import {
  ArrowBackIos,
  ArrowForwardIos,
  Check,
  ExpandLess,
  ExpandMore,
  KeyboardArrowRight,
  Search
} from '@mui/icons-material';
import { DEventService, DEvents } from '../../services/DEventService';
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import data from './data/api-response.json';
import newIdPNG from './assets/NewIDCard.png';
//Main function starts
export default function DSelectTransaction() {
  const [selectedCards, setSelectedCards] = useState([]);
  const [isAcknowledge, setIsAcknowledge] = useState(false);
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [isExpand, setIsExpand] = useState(false);
  const [searchableItems, setSearchableItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchMode, setSearchMode] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [finalCards, setFinalCards] = useState([]);

  const cards = data.cards;
  const tree = data.tree;
  const title = 'Surrender Tag';

  //To handle Next button functionality
  const handleNext = () => {
    // Added code for Surrender tag - Aditya Karthik Kumar
    let redirectPath = '';
    let isValue = selectedCards.filter(option => {
      if (option.title === title) {
        redirectPath = `/transaction/surrender-tag`;
      } else {
        redirectPath = `/transaction`;
      }
    });
    DEventService.dispatch(DEvents.ROUTE, {
      detail: { path: redirectPath }
    });
  };

  //To handle Back button functionality
  const handleBack = () => {
    DEventService.dispatch(DEvents.ROUTE, {
      detail: { path: `/customer-profile` }
    });
  };

  //To handle Cancel button functionality
  const handleCancel = () => {
    DEventService.dispatch(DEvents.ROUTE, {
      detail: { path: `/dashboard` }
    });
  };

  //To close acknowledge popup
  const handleAcknowledgeClose = () => {
    setIsAcknowledge(false);
  };

  //To close confirmation popup
  const handleConfirmationClose = () => {
    setIsConfirmation(false);
  };

  const collectSearchableItems = useCallback(child => {
    if (child && child.length > 0) {
      child.forEach(checkChildren => {
        if (checkChildren.isSearchable) {
          checkChildren.children.forEach(i => {
            setSearchableItems(searchableItems => [...searchableItems, i]);
          });
        }
        // next recursive call to find out searchable items
        collectSearchableItems(checkChildren.children);
      });
    }
  }, []);

  useEffect(() => {
    tree.forEach(node => {
      // traverse all the nodes to find out the searchable items
      collectSearchableItems(node.children);
    });
  }, []);

  const handleChange = e => {
    const value = e.target.value;
    if (value?.length > 1) {
      setSearchMode(true);
      // Use filter to get unique results and convert to an array
      const uniqueResultsArray = [
        ...new Set(searchableItems.filter(item => item.name?.toLowerCase().includes(value)))
      ];
      setFilteredItems(uniqueResultsArray);
    } else {
      setSearchMode(false);
    }
  };

  const handleSearchClick = () => {
    setIsSearching(!isSearching);
  };

  useEffect(() => {
    setTimeout(() => {
      if (selectedCards.length > 0) {
        setFinalCards([
          ...selectedCards.filter(card => card.isSelected),
          ...finalCards.filter(
            card =>
              !selectedCards.some(cardsel => cardsel.title === card.title && cardsel.isSelected)
          )
        ]);
      } else {
        setFinalCards(cards);
      }
    }, 100);
  }, [selectedCards, cards, finalCards]);

  // Function to handle card selection
  const handleCardSelection = card => {
    if (selectedCards.some(cardsel => cardsel.title === card.title && cardsel.isSelected)) {
      setSelectedCards(
        selectedCards.map(cardsel => {
          if (cardsel.title === card.title && cardsel.isSelected) {
            return { ...cardsel, isSelected: false, count: 0 };
          } else {
            return { ...cardsel };
          }
        })
      );
    } else {
      setSelectedCards([
        ...selectedCards,
        { title: card.title, ipath: card.ipath, isSelected: true, count: 1 }
      ]);
    }
  };

  const handleCounterUpdate = (title, count) => {
    if (count === 0) {
      setSelectedCards(prevSelectedCards => prevSelectedCards.filter(card => card.title !== title));
    } else {
      setSelectedCards(prevSelectedCards =>
        prevSelectedCards.map(cardsel => {
          if (cardsel.title === title) {
            return { ...cardsel, count: count };
          } else {
            return { ...cardsel };
          }
        })
      );
    }
  };

  const getCount = card => {
    const record = selectedCards.find(
      cardsel => cardsel.title === card.title && cardsel.isSelected
    );
    return record && record.count > 0 ? record.count : 0;
  };

  return (
    <React.Fragment>
      <Container maxWidth='xl' sx={{ py: 4 }}>
        <div className='page-title-text'>
          Select Transaction - {data.selecttransactiondetails.name}
        </div>
        <div className='selecttranc-cards-grid'>
          {finalCards.slice(0, 6).map((card, i) => (
            <div key={i}>
              <Card className='selecttranc-card' style={{ transitionDelay: `${i * 0.1}s` }}>
                <CardActionArea onClick={() => handleCardSelection(card)}>
                  <div
                    className={
                      selectedCards.some(
                        cardsel => cardsel.title === card.title && cardsel.isSelected
                      )
                        ? 'selecttranc-icon-container-active'
                        : 'selecttranc-icon-container'
                    }
                  >
                    {selectedCards.some(
                      cardsel => cardsel.title === card.title && cardsel.isSelected
                    ) && (
                      <div className='selected-text'>
                        <Check />
                        Selected
                      </div>
                    )}
                    <img width='60' src={newIdPNG} alt={card.title} />
                  </div>
                </CardActionArea>
                {card.count && getCount(card) !== 0 ? (
                  <CardContent className='selecttranc-card-text'>
                    {card.title} {getCount(card) > 1 && `(${getCount(card)})`}
                  </CardContent>
                ) : (
                  <CardContent className='selecttranc-card-text'>{card.title}</CardContent>
                )}
              </Card>
            </div>
          ))}
        </div>
      </Container>

      <Container maxWidth='xl'>
        <Accordion className='selecttranc-accordion' expanded={isExpand}>
          <AccordionSummary className='selecttranc-accordsum'>
            <div className='selecttranc-alltranc'>
              {isExpand ? (
                <ExpandLess sx={{ cursor: 'pointer' }} onClick={() => setIsExpand(false)} />
              ) : (
                <ExpandMore sx={{ cursor: 'pointer' }} onClick={() => setIsExpand(true)} />
              )}
              <div className='selecttranc-alltrans'>All Transactions</div>
            </div>
            <div className='selecttranc-searchicon'>
              <IconButton onClick={handleSearchClick}>
                <Search />
              </IconButton>
              {isSearching ? (
                <TextField
                  size='small'
                  autoComplete='off'
                  className='selecttranc-searchbar'
                  onChange={handleChange}
                  autoFocus
                  InputProps={{
                    classes: {
                      root: 'selecttranc-search-field',
                      notchedOutline: 'selecttranc-search-field-border'
                    }
                  }}
                />
              ) : (
                <div className='selecttranc-searchicon-word'>Search</div>
              )}
            </div>
          </AccordionSummary>
          <AccordionDetails className='selecttranc-accorddetailalltran'>
            <FlattenTree
              tree={searchMode ? filteredItems : tree}
              currentNodeName={tree[0].name}
              searchMode={searchMode}
              selectedCards={selectedCards}
              onSelectCard={handleCardSelection}
              onCountUpdate={handleCounterUpdate}
            ></FlattenTree>
          </AccordionDetails>
        </Accordion>
      </Container>

      <Container maxWidth='xl'>
        <Grid container spacing={1} className='selecttranc-contback'>
          <Grid item>
            <Button variant='text' color='primary' size='large' onClick={handleCancel}>
              CANCEL
            </Button>
          </Grid>
          <Grid item className='selecttranc-back-btn'>
            <Button
              variant='text'
              color='primary'
              size='large'
              startIcon={<ArrowBackIos />}
              onClick={handleBack}
            >
              BACK
            </Button>

            <Divider className='selecttranc-divider' />

            <Button
              variant='contained'
              color={'primary'}
              size='large'
              disabled={selectedCards.length === 0}
              onClick={handleNext}
              endIcon={<ArrowForwardIos />}
            >
              NEXT
            </Button>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={isConfirmation} onClose={handleConfirmationClose}>
        <DialogTitle className='selecttran-dialogconfirm'>Confirm Customer Details</DialogTitle>
        <DialogContent className='selecttranc-dialogcontenttxt'>
          Do you want to update customer details?
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Grid container spacing={2} justifyContent='center'>
            <Grid item>
              <Button variant='outlined' onClick={handleConfirmationClose}>
                No
              </Button>
            </Grid>
            <Grid item>
              <Button variant='contained' onClick={handleNext}>
                Yes
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
      <Dialog keepMounted open={isAcknowledge} onClose={handleAcknowledgeClose}>
        <DialogTitle className='selecttranc-dialogack'>Acknowledge</DialogTitle>
        <DialogContent>
          Please remember to verify the questions under the medical Fitness Section of the
          driver&apos;s license application. If the customer has answered &apos;yes&apos; to any of
          the questions, please interrupt this transaction and provide the customer with Medical/Eye
          Report. A 45 day temporary license may be issued to customer reflecting the medical
          checked on the application
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='contained' onClick={handleAcknowledgeClose}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

const Counter = props => {
  const { updateCounter, counter = 0, option } = props;

  Counter.propTypes = {
    updateCounter: PropTypes.any.isRequired,
    counter: PropTypes.any,
    option: PropTypes.any.isRequired
  };

  Counter;
  const limit = 10;

  const handleIncrement = () => {
    if (counter < limit) {
      updateCounter(option, counter + 1);
    }
  };

  const handleDecrement = () => {
    if (counter > 0) {
      updateCounter(option, counter - 1);
    }
  };

  return (
    <ButtonGroup
      variant='outlined'
      size='small'
      aria-label='small button group'
      className='selecttranc-button-parent'
    >
      <Button className='selecttranc-button-group' onClick={handleDecrement}>
        -
      </Button>
      <Button className='selecttranc-button-group'>{counter}</Button>
      <Button className='selecttranc-button-group' onClick={handleIncrement}>
        +
      </Button>
    </ButtonGroup>
  );
};

//Tree view function start - FlattenTree
export const FlattenTree = props => {
  const { tree, level = 0, check = false, selectedCards } = props;

  FlattenTree.propTypes = {
    tree: PropTypes.any.isRequired,
    level: PropTypes.any,
    check: PropTypes.any,
    selectedCards: PropTypes.any.isRequired,
    searchMode: PropTypes.any,
    onSelectCard: PropTypes.any.isRequired,
    onCountUpdate: PropTypes.any.isRequired
  };
  const [children, setChildren] = useState([]);
  const [visited, setVisited] = useState('');

  useEffect(() => {
    setChildren([]);
  }, [tree]);

  const handleExpand = (child, name) => {
    setChildren(child);
    if (tree.filter(node => node.name === name).length > 0 && child?.length > 0) {
      setVisited(name);
    }
  };

  function getCheck(children) {
    return children?.some(child => child.children?.length === 0);
  }

  const handleCheckboxChange = event => {
    const { value } = event.target;
    props.onSelectCard({ title: value, ipath: value.replaceAll(' ', '') });
  };

  return (
    <>
      <Card
        className={`${
          props.searchMode
            ? tree.length > 5
              ? 'selecttranc-column-search-grid-3 selecttranc-treecard-search'
              : 'selecttranc-treecard-search'
            : check
            ? 'selecttranc-treecard selecttranc-treecard-level-3'
            : `selecttranc-treecard selecttranc-treecard-level-${level}`
        } ${
          props.searchMode
            ? 'selecttranc-searchmode-width'
            : check
            ? 'selecttranc-searchmode-multicol-width'
            : ''
        }`}
      >
        <CardContent className='selecttranc-fix-padding'>
          <div>
            {tree.map((node, index) => (
              <Grid
                item
                xs={12}
                key={index}
                onClick={() => handleExpand(node.children, node.name)}
                className={
                  visited === node.name
                    ? 'selecttranc-cardcongrid selecttranc-cardcongrid-selected'
                    : props.searchMode
                    ? 'selecttranc-cardcongrid-searchmode'
                    : 'selecttranc-cardcongrid'
                }
              >
                {node.children && node.children.length === 0 && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={node.name}
                        checked={selectedCards?.some(
                          option => option.title === node.name && option.isSelected
                        )}
                        onChange={handleCheckboxChange}
                        className='selecttranc-checkbox'
                        disabled={node.children && node.children.length > 0}
                      />
                    }
                    className='selecttranc-formcontrlcheckbox'
                    label={!props.searchMode ? node.name : ''}
                  />
                )}
                {!props.searchMode && !check ? (
                  <div className='selecttranc-nodename'>{node.name}</div>
                ) : (
                  <>
                    {props.searchMode ? (
                      <>
                        <div
                          className={
                            props.searchMode
                              ? 'selecttranc-nodename-searchmode'
                              : 'selecttranc-nodename'
                          }
                        >
                          {node.name}
                        </div>
                        {node.visible && (
                          <Counter
                            updateCounter={props.onCountUpdate}
                            counter={
                              selectedCards.filter(
                                option => option.title === node.name && option.isSelected
                              )[0]?.count
                            }
                            option={node.name}
                          />
                        )}
                      </>
                    ) : (
                      node.visible && (
                        <Counter
                          updateCounter={props.onCountUpdate}
                          counter={
                            selectedCards.filter(
                              option => option.title === node.name && option.isSelected
                            )[0]?.count
                          }
                          option={node.name}
                        />
                      )
                    )}
                  </>
                )}
                {!check && !props.searchMode && (
                  <KeyboardArrowRight fontSize='small' sx={{ cursor: 'pointer' }} />
                )}
              </Grid>
            ))}
          </div>
        </CardContent>
      </Card>
      {!props.searchMode && children?.length > 0 && (
        <FlattenTree
          tree={children}
          level={level + 1} // Increment the level for nested components
          check={getCheck(children)}
          selectedCards={selectedCards}
          onSelectCard={props.onSelectCard}
          onCountUpdate={props.onCountUpdate}
        />
      )}
    </>
  );
};
