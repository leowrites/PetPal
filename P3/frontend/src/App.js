import './App.css';
import React from 'react';
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
import Shelters from './pages/Shelters';
import SeekerDetail from './pages/SeekerDetail';
import ShelterDetail from './pages/ShelterDetail';
import Logout from './pages/Logout'
import ProfileUpdate from './pages/ProfileUpdate'
import 'react-loading-skeleton/dist/skeleton.css'
import { UserContextProvider, useUser } from './contexts/UserContext';
import NewListing from './pages/NewListing';
import EditListing from './pages/EditListing';
import ChangePassword from './pages/ChangePassword';
import PetApplicationList from './pages/PetApplicationList';

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
            <Route path="listings/:listingId/edit" element={
              <ProtectedRoute>
                <EditListing />
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
                <PetApplicationList />
              </ProtectedRoute>
            }>
            </Route>
            <Route path="applications/:applicationId" element={
              <ProtectedRoute>
                <CompletedApplicationLayout>
                  <PetApplication completed={true} />
                </CompletedApplicationLayout>
              </ProtectedRoute>
            } />
            <Route path='applications/:applicationId/comments' element={
              <ProtectedRoute>
                <CompletedApplicationLayout>
                  <Message />
                </CompletedApplicationLayout>
              </ProtectedRoute>
            } />
            <Route path="profile" element={
                <ProtectedRoute>
                    <ProfileUpdate />
                </ProtectedRoute>
              }/>
            <Route path="profile/password/change" element= {
                <ProtectedRoute>
                    <ChangePassword />
                </ProtectedRoute>
            }/>
            <Route path="/users/:userId" element={
                <ProtectedRoute>
                    <SeekerDetail />
                </ProtectedRoute>
            } />
            <Route path="search" element={<Search />} />
            <Route path="shelters" element={<Shelters />} />
            <Route path="shelters/:shelterId" element={<ShelterDetail />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="404" element={<NotFound />} />
            <Route path='*' element={<NotFound />} />
            <Route path="logout" element={<Logout />} />
          </Route>
        </Routes>
      </Router>
    </UserContextProvider>
  );
}

export default App;
