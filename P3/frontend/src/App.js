import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
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
import Listings from './pages/Listings';
import ShelterQuestion from './pages/shelterQuestion/ShelterQuestionPage';
import Logout from './pages/Logout'
import 'react-loading-skeleton/dist/skeleton.css'
import { UserContextProvider, useUser } from './contexts/UserContext';
import NewListing from './pages/NewListing';

const ProtectedRoute = ({ children }) => {
  const { user } = useUser()
  if (!user) {
    return <Navigate to={'/login'} />
  }

  return children
};

const ShelterProtectedRoute = ({ children }) => {
  const { user } = useUser()
  if (!user || !user.is_shelter) {
    return <Navigate to={'/login'} />
  }
  return children
}

function App() {
  return (
    <UserContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route path="" element={<Landing />} />
            <Route path="listings" element={<Listings />} />
            <Route path="listings/:listingId" element={
              <ProtectedRoute>
                <PetDetail />
              </ProtectedRoute>
            } />
            <Route path="listings/new" element={
              <ShelterProtectedRoute>
                <NewListing />
              </ShelterProtectedRoute>
            } />
            <Route path="questions" element={
              <ProtectedRoute>
                <ShelterQuestion />
              </ProtectedRoute>
            } />
            <Route path="listings/:listingId/applications" element={
              <ProtectedRoute>
                <PetApplication />
              </ProtectedRoute>
            } />
            <Route path="applications" element={
              <ProtectedRoute>
                <CompletedApplicationLayout />
              </ProtectedRoute>
            }>
              <Route path=":applicationId" element={
                <ProtectedRoute>
                  <PetApplication completed={true} />
                </ProtectedRoute>
              } />
              <Route path=':applicationId/comments' element={
                <ProtectedRoute>
                  <Message />
                </ProtectedRoute>
              } />
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
