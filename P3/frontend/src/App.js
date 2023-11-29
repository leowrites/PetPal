import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Search } from './pages/Search'
import Layout from './components/layout/Layout';
import PetDetail from './pages/PetDetail';
import { setAuthToken } from './services/ApiService';
import Login from './pages/Login'
import Signup from './pages/Signup'
import NotFound from './pages/NotFound'
import PetApplication from './pages/PetApplication';
import CompletedApplicationLayout from './pages/CompletedApplicationLayout';
import Message from './pages/Message';
import Listings from './pages/Listings';
import ShelterQuestion from './pages/shelterQuestion/ShelterQuestionPage';
import Logout from './pages/Logout'

function App() {

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setAuthToken(token)
    }
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route path="" element={<Landing />} />
          <Route path="listings" element={<Listings />}>
            <Route path=":listingId" element={<PetDetail />}>
            </Route>
          </Route>
          <Route path="questions" element={<ShelterQuestion />}/>
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
  );
}

export default App;
