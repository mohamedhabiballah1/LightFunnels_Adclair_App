import logo from '../assets/logo.png';
import Switch from '@mui/material/Switch';
import { MdOutlineDashboard } from "react-icons/md";
import { SiWikibooks } from "react-icons/si";
import "../styling/home.css";
import axios from 'axios';
import { useState, useEffect } from 'react';

const Home = () => {
    const [status, setStatus] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const token = new URLSearchParams(window.location.search).get("token");
    const BASE_URL = process.env.REACT_APP_BACKEND_URL;

    const fetchStatus = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/status/getStatus`, {
                params: { token: token },
            });
            if (response.data && response.data.status !== undefined) {
                setStatus(response.data.status); 
            }
        } catch (error) {
            console.error("Error fetching status:", error);
        }
    };

    const updateStatus = async (newStatus) => {
        setIsLoading(true);
        try {
            await axios.post(`${BASE_URL}/status/updateStatus`, {
                token: token,
                status: newStatus,
            });
            setStatus(newStatus);
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSwitchChange = (event) => {
        const newStatus = event.target.checked;
        updateStatus(newStatus);
    };

    useEffect(() => {
        fetchStatus();
    }, [token]);

    return (
        <div>
            <div className="switch-container">
                <Switch
                    className="switch"
                    checked={status}  
                    onChange={handleSwitchChange}
                    inputProps={{ "aria-label": "controlled" }}
                    disabled={isLoading}
                />
            </div>
            <div className="header-container">
                <span className="left-line"></span>
                <img src={logo} className="logo" alt="logo" />
                <span className="right-line"></span>
            </div>

            <div className="body-container">
                <h2 className="welcome-title">Welcome to the AdClair Connector 🎉!</h2>
                <p className="description">
                    Ready to get started? Begin syncing your products with the app to launch campaigns with just a few clicks. <br />
                    Your store is seamlessly integrated with the app, allowing you to effortlessly monitor the performance of your orders and campaigns directly from the button.<br />
                    Learn more about syncing products by clicking the button 📚. <br />
                </p>

                <div className="buttons-container">
                    <button className="button">
                        <MdOutlineDashboard />
                        Dashboard
                    </button>
                    <button className="button">
                        <SiWikibooks />
                        Tutorial
                    </button>
                </div>
            </div>

            <div className="footer-container">
                <p>
                    Activate the app embed in your theme editor to add the widget to the live theme. This will enable syncing with the app.
                </p>
            </div>
        </div>
    );
};

export default Home;
