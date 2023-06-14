import React from 'react';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import baseurl from '../config';
import { Container, Form,Row,Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

function ViewBooking() {
    const [flights, setflights] = useState([]);
    const [allAirline, setallAirline] = useState([]);
    const [airline, setairline] = useState(101);
    const [allFlights, setallFlights] = useState([]);
    const [searchDone, setSearchDone] = useState(false);
    const [searchData, setSearchData] = useState({
        fid: '',
        date: ''
    });
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

    const getApiData = async () => {
        const response = await fetch(
            `${baseurl}/flight/getairline`, {
            credentials: 'include'
        }
        ).then((response) => response.json());
        setallAirline(response.data);
    }
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
    const submitSch = (e) => {
        e.preventDefault();
        getFlight();
    }
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
            const month = date.getMonth() + 1; // Months are zero-based, so add 1
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
    return (
        <div>
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
                                <Button variant="primary" type="submit">Submit</Button>
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
                        <Table striped bordered hover>
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
                                {
                                    bookings.map((booking) => (
                                        <tr key={booking.bid}>
                                            <td>{`${booking.email}`}</td>
                                            <td>{`${booking.airlinename}`}</td>
                                            <td>{`${booking.flightnumber}`}</td>
                                            <td>{`${booking.source}`}</td>
                                            <td>{`${booking.destination}`}</td>
                                            <td>{`${booking.schdate}`}</td>
                                            <td>{`${booking.est_arrival_time}`}</td>
                                            <td>{`${booking.depature_time}`}</td>
                                            <td>{`${booking.booked_seats}`}</td>
                                            <td>{`${booking.dateofbooking}`}</td>
                                            <td>{`${booking.status}`}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </div>
                )}
            </div>


        </div>
    )
}


export default ViewBooking;