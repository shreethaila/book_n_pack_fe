import React from 'react';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import baseurl from '../config';
export default function Mybookings() {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0];
    const [bookings, setBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = bookings.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(bookings.length / itemsPerPage);
    
    
    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) {
            return; // Invalid page number, do nothing
        }
        setCurrentPage(pageNumber);
    };
    const tableRows = currentItems.map((item, index) => (
        <tr key={index}>

            <td>{`${item.airlinename}`}</td>
            <td>{`${item.flightnumber}`}</td>
            <td>{`${item.source}`}</td>
            <td>{`${item.destination}`}</td>
            <td>{`${item.schdate}`}</td>
            <td>{`${item.est_arrival_time}`}</td>
            <td>{`${item.depature_time}`}</td>
            <td>{`${item.booked_seats}`}</td>
            <td>{`${item.dateofbooking}`}</td>
            {(item.status == 'active' && currentDateString > item.schdate) ? (<td>
                completed</td>) : ((item.status == 'cancelled') ? (<td><div style={{ color: 'red' }}>cancelled</div>(refund completed)</td>) : (<td>
                    {item.status}</td>))}

        </tr>
    ));
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
            {(bookings.length == 0) ? (
                <p style={{ textAlign: 'center' }}>No bookings found</p>
            ) : (
                <div>
                    <br></br>
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
                                <th>Date of Booking</th>
                                <th>Status</th>

                            </tr>
                        </thead>
                        <tbody>
                            {tableRows}
                        </tbody>
                    </Table>
                    <div>
                        <Button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1} // Disable the button if already on the first page
                        >
                            Previous
                        </Button>
                        {currentPage}/{totalPages}
                        <Button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages} // Disable the button if already on the last page
                        >
                            Next
                        </Button>
                    </div>
                
                </div>
    )
}
        </div >
    )
}
