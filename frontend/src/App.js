import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StoresList from './components/StoresList';
import Home from './components/Home';

const BackendUrl = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [storeSelected, setStoreSelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = new URLSearchParams(window.location.search).get('token');

  useEffect(() => {
    if (!token) {
      window.location.href = `${BackendUrl}/auth`;
    } else {
      fetchStoreSelection(); 
    }
  }, []);

  const fetchStoreSelection = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/store/select?token=${token}`);
      setStoreSelected(response.data.storeSelected);
    } catch (error) {
      console.error('Error fetching store selection:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route 
            path="/dashboard" 
            element={storeSelected ? <Home /> : <StoresList setStoreSelected={setStoreSelected} />} 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
