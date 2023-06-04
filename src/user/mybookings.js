import React from 'react';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import baseurl from '../config';
export default function Mybookings() {
     const [bookings, setBookings] = useState([]);
    
    const getApiData = async () => {
        const response = await fetch(
            `${baseurl}/booking`,
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            }
        ).then((response) => response.json());
        setBookings(response.data);
    };
    useEffect(() => {
        getApiData();
    }, []);
    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Airline Name</th>
                        <th>Flight Number</th>
                        <th>Source</th>
                        <th>Destination</th>
                        <th>Date</th>
                        <th>Arrival Time</th>
                        <th>Depature Time</th>
                        <th>Booked Seats</th>
                        <th>Total amount</th>
                        <th>Date of Booking</th>
                        <th>Status</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        bookings.map((booking) => (
                            <tr key={booking.bid}>
                                <td>{`${booking.airlinename}`}</td>
                                <td>{`${booking.flightnumber}`}</td>
                                <td>{`${booking.source}`}</td>
                                <td>{`${booking.destination}`}</td>
                                <td>{`${booking.sch_date}`}</td>
                                <td>{`${booking.est_arrival_time}`}</td>
                                <td>{`${booking.depature_time}`}</td>
                                <td>{`${booking.booked_seats}`}</td>
                                <td>{`${booking.totalamt}`}</td>
                                <td>{`${booking.dateofbooking}`}</td>
                                <td>{`${booking.status}`}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        </div>
    )
}
