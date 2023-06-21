import React from 'react';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import baseurl from '../config';
import { Container, Form, Row, Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ListGroup, Badge } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';
import '../index.css'
function ViewBooking() {

    const [show, setShow] = useState(false);
    const [flights, setflights] = useState([]);
    const [allAirline, setallAirline] = useState([]);
    const [airline, setairline] = useState(101);
    const [allFlights, setallFlights] = useState([]);
    const [searchDone, setSearchDone] = useState(false);
    const [searchData, setSearchData] = useState({
        fid: '',
        date: ''
    });
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
    const getFlight = async () => {
        const response = await fetch(
            `${baseurl}/flight/getflight?aid=` + airline,
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            }
        ).then((response) => response.json());
        setflights(response.data);
    };

    const getAirline = async () => {
        const response = await fetch(
            `${baseurl}/flight/getairline`, {
            credentials: 'include'
        }
        ).then((response) => response.json());
        setallAirline(response.data);

    }
    const handleAirlineChange = (e) => {
        console.log(e.target.value)
        setairline(e.target.value)
        flightdata(e.target.value);
    }
    const flightdata = async (aid) => {
        const response = await fetch(
            `${baseurl}/flight/getflight?aid=` + aid, {
            credentials: 'include'
        }
        ).then((response) => response.json());
        setallFlights(response.data);
        setSearchData({
            ...searchData,
            "fid": response.data[0].fid
        })
        console.log(response.data)
    }
    useEffect(() => {
        getAirline();
        flightdata(airline);
    }, []);
    const handleChange = async (event) => {
        console.log(event.target.value)
        setSearchData({
            ...searchData,
            [event.target.name]: event.target.value
        });

    };
    const getflights = () => {
        return allFlights.map((flight, index) => (
            <option key={index} value={flight.fid}>{`${flight.flightnumber}`}</option>
        ));
    }

    const handleStDate = (date) => {
        console.log(searchData.date)
        setSearchData({
            ...searchData,
            "date": date
        });
    }
    const [bookings, setBookings] = useState([]);
    const onSubmit = async (e) => {
        e.preventDefault();
        console.log(searchData)
        let formattedDate;
        if (searchData.date != "") {
            const date = searchData.date;
            const year = date.getFullYear();
            const month = date.getMonth() + 1; 
            const day = date.getDate();
            formattedDate = year + "-" + month + "-" + day;
            console.log("formattedDate" + formattedDate);
        } else {
            formattedDate = null
        }

        const response = await fetch(`${baseurl}/booking/getbookings?fn=${searchData.fid}&date=${formattedDate}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
            .then(response => response.json());
        setBookings(response.data);
        setSearchDone(true);
    }

    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());


    const resultsPerPage = 10;
    const totalResults = bookings.length; 
    const totalPages = Math.ceil(totalResults / resultsPerPage); 

    const [activePage, setActivePage] = React.useState(1); 

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber); 
    };

    const renderResultsForPage = () => {
        
        const startIndex = (activePage - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;

        
        const currpage = bookings.slice(startIndex, endIndex);

        
        return currpage.map((booking, index) => (


                <tr key={booking.bid}>
                    <td>{`${booking.email}`}</td>
                    <td><img src={`${booking.logo}`} width={50} height={50} ></img><br />{`${booking.airlinename}`}</td>
                    <td>{`${booking.flightnumber}`}</td>
                    <td>{`${booking.source}`}</td>
                    <td>{`${booking.destination}`}</td>
                    <td>{`${booking.schdate}`}</td>
                    <td>{`${booking.est_arrival_time}`}</td>
                    <td>{`${booking.depature_time}`}</td>
                    <td>{`${booking.booked_seats}`}<br /><Link onClick={() => handleShow(booking.bid)}>View Details</Link></td>
                    <td>{`${booking.dateofbooking}`}</td>
                    <td>{`${booking.status}`}</td>
                </tr>
        ));
    };

    const items = [];

    
    items.push(
        <Pagination.First
            key="first"
            disabled={activePage === 1}
            onClick={() => handlePageChange(1)}
        />
    );

    
    items.push(
        <Pagination.Prev
            key="prev"
            disabled={activePage === 1}
            onClick={() => handlePageChange(activePage - 1)}
        />
    );

    
    for (let number = 1; number <= totalPages; number++) {
        items.push(
            <Pagination.Item
                key={number}
                active={number === activePage}
                onClick={() => handlePageChange(number)}
            >
                {number}
            </Pagination.Item>
        );
    }

    items.push(
        <Pagination.Next
            key="next"
            disabled={activePage === totalPages}
            onClick={() => handlePageChange(activePage + 1)}
        />
    );

    items.push(
        <Pagination.Last
            key="last"
            disabled={activePage === totalPages}
            onClick={() => handlePageChange(totalPages)}
        />
    );
    const paginationStyles = {
        display: 'flex',
        justifyContent: 'center',
        padding: '10px',
      };
    return (
        <div class='flightcont'>
            <br></br>
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} sm={8} md={6} lg={4} >
                        <Form onSubmit={onSubmit} >
                            <Form.Group>
                                <Form.Label>Airline</Form.Label>
                                <Form.Select name='aid' onChange={handleAirlineChange}>
                                    {
                                        allAirline.map((airline) => (
                                            <option value={airline.aid}><img src={airline.logo} width={10} height={10}></img>{`${airline.airlinename}`}</option>
                                        ))
                                    }
                                </Form.Select>
                                <br />
                                <Form.Label>Flight Number</Form.Label>
                                <Form.Select name='fid' onChange={handleChange}>
                                    {getflights()}
                                </Form.Select>
                                <br />
                                <Form.Label>Date</Form.Label>
                                <DatePicker
                                    minDate={minDate}
                                    selected={searchData.date}
                                    onChange={handleStDate}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Scheduled Date"
                                    className="form-control"
                                />
                                <br />
                                <br />
                                <Button variant="primary" type="submit" style={{ background: "#009999" }}>Submit</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>

            <div>
                {bookings.length === 0 ? (
                    searchDone ? (<div><br /><h5 style={{ textAlign: 'center' }}>No Bookings found!</h5></div>) : (<div />)
                ) : (
                    <div>
                        <br></br>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>User Email</th>
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
                        {renderResultsForPage()}
                        </tbody>
                        </Table>
                        <Pagination style={paginationStyles} className='custom-pagination'>{items}</Pagination>
                    </div>
                )}
            </div>
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

        </div>
    )
}


export default ViewBooking;