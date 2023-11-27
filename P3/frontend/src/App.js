import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Search } from './pages/Search'
import Layout from './components/layout/Layout';
import { setAuthToken } from './services/ApiService';
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import NotFound from './pages/NotFound'

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
