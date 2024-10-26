import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = ({ isAuthenticated }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchUserTickets = async () => {
            if (!isAuthenticated) {
                setLoading(false);
                return;
            }

            try {
                const userResponse = await axios.get('https://api.ronchik.ru/api/user', { withCredentials: true });
                const userData = userResponse.data;
                setUserName(userData.name);

                const ticketsResponse = await axios.get('https://api.ronchik.ru/api/tickets', { withCredentials: true });
                setTickets(ticketsResponse.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUserTickets();
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <p>You are not authorized. Please log in to view your profile.</p>;
    }

    if (loading) return <p>Loading tickets...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!tickets.length) return <p>No tickets found.</p>;

    return (
        <div className="profile-container">
            <h1>Your Profile</h1>
            <h2>Welcome, {userName}!</h2>
            <h3>Your Tickets</h3>
            <div className="tickets-container">
                {tickets.map(ticket => (
                    <div key={ticket.id} className="ticket-card">
                        <div className="ticket-info">
                            <strong>{ticket.event_name}</strong> - {ticket.sector_name}<br />
                            Hall: {ticket.hall_name}<br />
                            Owner: {ticket.owner_first_name} {ticket.owner_last_name}<br />
                            Price: ${ticket.price}<br />
                        </div>
                        <Link to={`/print-ticket`} state={{ ticket }}>
                            <button className="print-button">Print Ticket</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;
