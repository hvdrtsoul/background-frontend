import React, {useState, useEffect} from 'react';
import './App.css';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import axios from 'axios';
import Cart from "./components/Cart";
import Profile from "./components/Profile";
import PrintTicket from "./components/PrintTicket";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('https://api.ronchik.ru/api/user', {withCredentials: true});
                const userData = response.data;

                if (userData && userData.name) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.log('Error fetching user data:', error);
                setIsAuthenticated(false);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('https://api.ronchik.ru/api/logout', {}, {withCredentials: true});
            setIsAuthenticated(false);
        } catch (error) {
            console.log('Logout failed:', error);
        }
    };

    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <Link to="/" className="title">BACKGROUND</Link>
                    <div className="actions">
                        {isAuthenticated ? (
                            <>
                                <Link to="/user">Profile</Link>
                                <Link to="/cart">Cart</Link>
                                <Link to="/login" onClick={handleLogout}>Logout</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login">Login</Link>
                                <Link to="/register">Register</Link>
                            </>
                        )}
                    </div>
                </header>
                <main>
                    <Routes>
                        <Route path="/" element={<EventList/>}/>
                        <Route path="/event/:id" element={<EventDetails isAuthenticated={isAuthenticated}/>}/>
                        <Route path="/login" element={<LoginForm setIsAuthenticated={setIsAuthenticated}/>}/>
                        <Route path="/register" element={<RegisterForm/>}/>
                        <Route path="/cart" element={<Cart isAuthenticated={isAuthenticated}/>}/>
                        <Route path="/user" element={<Profile isAuthenticated={isAuthenticated}/>}/>
                        <Route path="/print-ticket" element={<PrintTicket/>}/>
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
