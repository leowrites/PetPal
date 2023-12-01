import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Search } from './pages/Search'
import Layout from './components/layout/Layout';
import PetDetail from './pages/PetDetail';
import Login from './pages/Login'
import Signup from './pages/Signup'
import NotFound from './pages/NotFound'
import PetApplication from './pages/PetApplication';
import CompletedApplicationLayout from './pages/CompletedApplicationLayout';
import Message from './pages/Message';
import Logout from './pages/Logout'
import { UserContextProvider } from './contexts/UserContext';

function App() {
  return (
    <UserContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route path="" element={<Landing />} />
            <Route path="listings">
              <Route path=":listingId" element={<PetDetail />}>
              </Route>
            </Route>
            <Route path="listings/:listingId/applications" element={<PetApplication />} />
            <Route path="applications" element={<CompletedApplicationLayout />}>
              <Route path=":applicationId" element={<PetApplication completed={true}/>} />
              <Route path=':applicationId/comments' element={<Message />} />
            </Route>
            <Route path="search" element={<Search />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path='*' element={<NotFound />} />
            <Route path="logout" element={<Logout />} />
          </Route>
        </Routes>
      </Router>
    </UserContextProvider>
  );
}

export default App;
