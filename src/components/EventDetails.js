import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './Modal.css';
import './EventDetails.css';

const EventDetail = ({ isAuthenticated }) => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [sectors, setSectors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [selectedSector, setSelectedSector] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [sectorsImage, setSectorsImage] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`https://api.ronchik.ru/api/events/${id}`);
                setEvent(response.data);
                setSectorsImage(response.data.sectors_image);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        const fetchSectors = async () => {
            try {
                const response = await axios.get(`https://api.ronchik.ru/api/event/${id}/sectors`);
                setSectors(response.data);
            } catch (err) {
                console.error('Error fetching sectors:', err.message);
            }
        };

        fetchEvent();
        fetchSectors();
    }, [id]);

    const handleBuyClick = (sector, sectorPrice) => {
        if (!isAuthenticated) {
            alert("Please log in to buy tickets.");
            return;
        }

        setSelectedSector(sector);
        setSelectedPrice(sectorPrice);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async () => {
        try {
            const ticketData = {
                owner_first_name: firstName,
                owner_last_name: lastName,
                event: event.id,
                sector: selectedSector.sector,
                price: selectedPrice,
            };
            const response = await axios.post('https://api.ronchik.ru/api/cart/add', ticketData, { withCredentials: true });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error adding ticket to cart:', error);
        }
    };

    if (loading) return <p>Loading event details...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!event) return <p>No event found</p>;

    return (
        <div className="event-details-container">
            <h1>{event.name}</h1>
            <div className="event-images">
                <img
                    src={`https://api.ronchik.ru${event.image}`}
                    alt={event.name}
                    className="event-image"
                />
                {sectorsImage && (
                    <img
                        src={`https://api.ronchik.ru${sectorsImage}`}
                        alt="Sectors Layout"
                        className="sectors-image"
                    />
                )}
            </div>
            <p className="event-description">{event.description}</p>
            <p className="event-date">Date: {new Date(event.date).toLocaleString()}</p>
            <p className="event-venue">Venue: {event.hall_name}</p>

            <h3>Sectors</h3>
            <ul className="sectors-list">
                {sectors.map(sector => (
                    <li key={sector.id} className="sector-item">
                        <div>
                            <strong>{sector.sector_name}</strong>
                            <p>Price: ${sector.price}</p>
                            <p>Available Places: {sector.empty_places}</p>
                            {isAuthenticated ? (
                                <button className="buy-button" onClick={() => handleBuyClick(sector, sector.price)}>
                                    Buy
                                </button>
                            ) : (
                                <Link to="/login" className="login-prompt">
                                    Please log in to buy tickets
                                </Link>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            {isModalOpen && (
                <div className={`modal-overlay ${isModalOpen ? 'open' : ''}`}>
                    <div className="modal-content">
                        <h3>Enter your details</h3>
                        <div>Ticket for {event.name}</div>
                        <div>Selected sector: {selectedSector.sector_name}</div>
                        <div>Price: {selectedPrice}</div>
                        <form>
                            <div>
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={handleSubmit} className="submit-button">
                                    Add to Cart
                                </button>
                                <button type="button" onClick={handleModalClose} className="close-button">
                                    Close
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventDetail;
