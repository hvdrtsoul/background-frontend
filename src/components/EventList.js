import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import './EventList.css'

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('https://api.ronchik.ru/api/events');
                setEvents(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) return <p>Loading events...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Upcoming Events</h1>
            <ul>
                {events.map(event => (
                    <Link to={`/event/${event.id}`} key={event.id}>
                        <li className="event-item">
                            <div className="event_picture">
                                <h2>{event.name}</h2>
                                <img
                                    src={`https://api.ronchik.ru${event.image}`}
                                    alt={event.name}
                                    style={{width: '300px', height: '150px'}}
                                />
                            </div>
                            <div className="event_details">
                                <p>{event.description}</p>
                                <p>Date: {new Date(event.date).toLocaleString()}</p>
                                <p>Hall: {event.hall_name}</p>
                            </div>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
};

export default EventList;
