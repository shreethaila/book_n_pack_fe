import React from 'react';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import baseurl from '../config';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ListGroup, Badge } from 'react-bootstrap';
import '../index.css'
export default function Mybookings() {
    const [show, setShow] = useState(false);
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0];
    const [bookings, setBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = bookings.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(bookings.length / itemsPerPage);
    const handleClose = () => setShow(false);
    const [passenger, setpassenger] = useState([]);
    const getpassenger = async (bid) => {
        const response = await fetch(
            `${baseurl}/booking/getpassengers/${bid}`,
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            }
        ).then((response) => response.json());
        setpassenger(response.data);

    }
    const handleShow = (bid) => {
        getpassenger(bid);
        setShow(true);
    }
    const cancelticket = async (e) => {
        if (window.confirm("Are you sure want to cancel")) {
            console.log(e.target.name);
            const response = await fetch(
                `${baseurl}/booking/cancelbooking/${e.target.name}`,
                {
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                }
            ).then((response) => response.json());

        }
        window.location.replace('/mybookings')

    }
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
            <td>{`${item.booked_seats}`}<br /><Link onClick={() => handleShow(item.bid)}>View Details</Link></td>
            {(item.seattype == 'f') ? (<td>First Class</td>) : (item.seattype == 'b') ? (<td>Business Class</td>) : (<td>Economy Class</td>)}
            <td>{`${item.totalamt}`}</td>
            <td>{`${item.dateofbooking}`}</td>
            {/* {(item.status == 'active' && currentDateString > item.schdate) ? (<td>
                completed</td>) : ((item.status == 'cancelled') ? (<td><div style={{ color: 'red' }}>cancelled</div>(refund completed)</td>) : (<td>
                    {item.status}</td>))} */}
            {(item.status == 'active' && currentDateString > item.schdate) ? (<Button variant="primary" style={{ background: "#009999" }} disabled={true} name="completed" id="completed" size="sm" >
                Completed
            </Button>) : ((item.status == 'cancelled') ? (<td><Button variant="primary" style={{ background: "#009999" }} disabled={true} name="cancelled" id="cancelled" size="sm" >
                Cancelled
            </Button><br />(refund completed)</td>) : (<td>
                <Button variant="primary" style={{ background: "#009999" }} name={item.bid} id="cancel" size="sm" onClick={cancelticket}>
                    Cancel
                </Button></td>))}

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
        <div class='cont'>
            {(bookings.length == 0) ? (
                <p style={{ textAlign: 'center' }}>No bookings found</p>
            ) : (
                <div>
                    <br></br>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th className='clllll'>Airline Name</th>
                                <th>Flight Number</th>
                                <th>Source</th>
                                <th>Destination</th>
                                <th>TravelDate</th>
                                <th>Arrival Time</th>
                                <th>Depature Time</th>
                                <th>Booked Seats</th>
                                <th>Seat Type</th>
                                <th>Total Amount</th>
                                <th>Date of Booking</th>
                                {/* <th>Status</th> */}
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
                            disabled={currentPage === 1} style={{ background: "#009999" }}// Disable the button if already on the first page
                        >
                            Previous
                        </Button>
                        {currentPage}/{totalPages}
                        <Button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            style={{ background: "#009999" }}// Disable the button if already on the last page
                        >
                            Next
                        </Button>
                    </div>

                </div>
            )
            }
            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Passenger Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <ListGroup as="ol" numbered>
                        {
                            passenger.map((p, index) => (
                                <ListGroup.Item
                                    as="li"
                                    className="d-flex justify-content-between align-items-start"
                                >
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold">{`${p.name}`}</div>
                                        {`${p.age} ${p.gender}`}
                                        <br></br>
                                        {`${p.proof_type}: ${p.proofid}`}
                                    </div>
                                    <Badge style={{ background: "#009999" }}>
                                        {`${p.seatno}`}
                                    </Badge>
                                </ListGroup.Item>
                            ))
                        }
                    </ListGroup>
                </Modal.Body>
            </Modal>
        </div >
    )
}
