import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import { pages } from './pages.config';
import PageNotFound from './lib/PageNotFound';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {pages.map((page) => (
            <Route key={page.path} path={page.path} element={<page.component />} />
          ))}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;