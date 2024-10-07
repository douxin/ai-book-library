import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import BookReader from './components/BookReader';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/read/:bookId" element={<BookReader />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
