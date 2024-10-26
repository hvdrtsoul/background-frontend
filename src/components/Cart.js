import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './Cart.css'

const Cart = ({isAuthenticated}) => {
    const [cartTickets, setCartTickets] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCartTickets = async () => {
            try {
                const response = await axios.get('https://api.ronchik.ru/api/cart', {withCredentials: true});
                setCartTickets(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching cart tickets');
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchCartTickets();
        }
    }, [isAuthenticated]);

    const handleRemoveFromCart = async (ticketId) => {
        try {
            await axios.delete(`https://api.ronchik.ru/api/cart/delete/${ticketId}`, {withCredentials: true});
            setCartTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== ticketId));
        } catch (err) {
            console.error('Error removing ticket from cart:', err);
            setError('Error removing ticket from cart');
        }
    };

    const handlePurchase = async () => {
        try {
            const response = await axios.post('https://api.ronchik.ru/api/cart/purchase', {}, {withCredentials: true});
            if (response.status === 200) {
                alert('Tickets purchased successfully!');
                setCartTickets([]);
            }
        } catch (err) {
            console.error('Error purchasing tickets:', err);
            alert('Failed to purchase tickets. Please try again.');
        }
    };

    if (!isAuthenticated) {
        return <p>You are not authorized!</p>;
    }

    if (loading) {
        return <p>Loading cart...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (cartTickets.length === 0) {
        return <p>Your cart is empty.</p>;
    }

    return (
        <div className="cart">
            <h1>Your Cart</h1>
            <ul>
                {cartTickets.map(ticket => (
                    <li key={ticket.id} className="cart-item">
                        <div className="ticket-info">
                            <div className="firstRow">
                                <strong>Event:</strong><p>{ticket.event_name}</p>
                                <strong>Sector:</strong><p>{ticket.sector_name}</p>
                                <strong>Hall:</strong><p>{ticket.hall_name}</p>
                            </div>
                            <div className="firstRow">
                                <strong>Price:</strong> ${ticket.price} <br/>
                                <strong>Owner:</strong> {ticket.owner_first_name} {ticket.owner_last_name}
                            </div>
                        </div>
                        <button onClick={() => handleRemoveFromCart(ticket.id)}>
                            Remove from Cart
                        </button>
                    </li>
                ))}
            </ul>
            <button className="purchaseButton" onClick={handlePurchase}>
                Purchase Cart
            </button>
        </div>
    );
};

export default Cart;
