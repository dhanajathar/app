import './index.css';

import { Route, Routes } from 'react-router-dom';

import React from 'react';
import { Search } from './pages/Search';
import { SearchError } from './pages/SearchError';
import { SearchHistory } from './pages/SearchHistory';
import { SearchResults } from './pages/SearchResults';

const DSearch = () => {
  return (
    <Routes>
      <Route index element={<Search />} />
      <Route path='search/' element={<Search />} />
      <Route exact path='/search-results/' element={<SearchResults />} />
      <Route path='/search-history/' element={<SearchHistory />} />
      <Route path='*' element={<SearchError />} />
    </Routes>
  );
};

export default DSearch;
