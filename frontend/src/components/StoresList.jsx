import React, { useState, useEffect } from "react";
import '../styling/storesList.css';
import logo from '../assets/logo.png';
import { useNavigate } from "react-router-dom";

function getInitials(str) {
    const words = str.trim().split(/\s+/);
    return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('');
}

const StoresList = ({ setStoreSelected }) => {
    const token = new URLSearchParams(window.location.search).get('token');
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const BackendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BackendUrl}/store/list?token=${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                } else {
                    console.warn('No data found in the response.');
                }
            } catch (error) {
                console.error('Error fetching store selection:', error.message);
            }
        };

        fetchData();
    }, [BackendUrl, token]);

    const handleSubmit = async () => {
        if (!selectedStore) return;

        try {
            const response = await fetch(`${BackendUrl}/store/selecting?token=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ store: selectedStore }),
            });

            if (response.ok) {
                setStoreSelected(selectedStore);
                navigate(`/dashboard?token=${token}`);
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
                    {data.map((item) => (
                        <li
                            key={item.id}
                            className={`store-item ${selectedStore?.id === item.id ? 'selected' : ''}`}
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
                <span className='select-description'>
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
