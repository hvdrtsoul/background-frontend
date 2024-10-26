import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const PrintTicket = () => {
    const location = useLocation();
    const ticket = location.state?.ticket;

    useEffect(() => {
        window.print();
    }, []);

    if (!ticket) {
        return <p>No ticket data found.</p>;
    }

    const qrCodeData = `
        Event: ${ticket.event_name}
        Sector: ${ticket.sector_name}
        Hall: ${ticket.hall_name}
        Owner: ${ticket.owner_first_name} ${ticket.owner_last_name}
        Price: ${ticket.price}
        Ticket ID: ${ticket.id}
    `;

    return (
        <div style={{textAlign: 'center'}}>
            <h1>Ticket Details</h1>
            <p><strong>Event:</strong> {ticket.event_name}</p>
            <p><strong>Sector:</strong> {ticket.sector_name}</p>
            <p><strong>Hall:</strong> {ticket.hall_name}</p>
            <p><strong>Owner:</strong> {ticket.owner_first_name} {ticket.owner_last_name}</p>
            <p><strong>Price:</strong> ${ticket.price}</p>
            <p><strong>Ticket ID:</strong> {ticket.id}</p>
            <h2>QR Code</h2>
            <QRCodeSVG value={qrCodeData.trim()} size={128}/>
        </div>
    );
};

export default PrintTicket;
