import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/Page1';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Page1 from './pages/Page1';
import ChartPage from './pages/ChartPage';
import Error404 from './pages/Error404';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Page1 />}/>
          <Route path="/chart" element={<ChartPage />}/>
          <Route path="*" element={<Error404 />}/>
        </Routes>
    </BrowserRouter>
);

reportWebVitals();
