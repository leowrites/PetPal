import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Landing } from './pages/landing'
import { Search } from './pages/search'
import Layout from './components/layout/Layout';
import { setAuthToken } from './services/ApiService';

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
            </Route>
        </Routes>
        </Router>
    );
}

export default App;
