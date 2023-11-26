import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Landing } from './pages/landing'
import { Search } from './pages/search'
import Layout from './components/layout/Layout';
import { Login } from './pages/login'
import { Signup } from './pages/signup'
import NotFound from './pages/notFound'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path='*' element={<NotFound />}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
