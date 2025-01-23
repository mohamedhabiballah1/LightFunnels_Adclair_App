import React, { useState, useEffect } from "react";
import '../styling/storesList.css';
import logo from '../assets/logo.png';
import { useNavigate } from "react-router-dom";

function getInitials(str) {
    const words = str.trim().split(/\s+/);
    const initials = words.slice(0, 2).map(word => word.charAt(0).toUpperCase());
    return initials.join('');
}

const StoresList = ({ setStoreSelected }) => {
    const ownerId = new URLSearchParams(window.location.search).get('ownerId');
    localStorage.setItem('ownerId', ownerId);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const BackendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BackendUrl}/store/list`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setData(data);
                } else {
                    console.warn('No data found in the response.');
                }
            } catch (error) {
                console.error('Error fetching store selection:', error.message);
            }
        };

        fetchData();
    }, [BackendUrl]);

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${BackendUrl}/store/selecting`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ store: selectedStore }),
            });

            if (response.ok) {
                setStoreSelected(selectedStore); 
                navigate('/dashboard'); 
            } else {
                const errorMessage = await response.text();
                console.warn('Failed to select store:', errorMessage);
            }
        } catch (error) {
            console.error('Error selecting store:', error.message);
        }
    };

    return (
        <div className="select-container">
            <div className="select">
                <div className="select-logo">
                    <img src={logo} alt="" className='logo'/>
                </div>
                <ul className="store-list">
                    {data.map((item, index) => (
                        <li
                            key={index}
                            className={`store-item ${selectedStore === item ? 'selected' : ''}`}
                            onClick={() => setSelectedStore(item)} 
                        >
                            <div className="store-icon">
                                {getInitials(item.name)}
                            </div>
                            <div className="store-name">
                                {item.name}
                            </div>
                        </li>
                    ))}
                </ul>
                <span className='select-describtion'>
                    Select the store you want to sync with Adclair to start using the app.
                </span>
            </div>
            <button
                className={`button ${selectedStore ? '' : 'disabled'}`}
                disabled={!selectedStore} 
                onClick={handleSubmit} 
            >
                Submit
            </button>
        </div>
    );
};

export default StoresList;
