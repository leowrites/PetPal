import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Landing } from './pages/landing'
import { Search } from './pages/search'
import Layout from './components/layout/Layout';
import PetDetail from './pages/PetDetail';
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route path="" element={<Landing />} />
          <Route path="listings">
            <Route path=":petId" element={<PetDetail />} />
          </Route>
          <Route path="search" element={<Search />} />
          {/* <Route path="login" element={<Login />} /> */}
          {/* <Route path="signup" element={<Signup />} /> */}
          <Route path='*' element={<NotFound />}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
