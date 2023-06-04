import React from 'react';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import baseurl from '../config';
import DatePicker from 'react-datepicker';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'react-datepicker/dist/react-datepicker.css';
import { Form } from 'react-bootstrap';
import TicketForm from './ticketform';
import Modal from 'react-bootstrap/Modal';
export default function BookTicket() {
    const [tickets, setTickets] = useState([]);
    const [searchData, setSearchData] = useState({
        source: '',
        destination: '',
        date: ''
    });
    const bookpage = (event) => {
        window.location.replace('/ticketbook?schid='+event.target.name);
    }
    const getApiData = async () => {

        console.log(date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Months are zero-based, so add 1
        const day = date.getDate();
        const formattedDate = year + "-" + month + "-" + day;
        console.log(formattedDate);

        const response = await fetch(
            `${baseurl}/flight/search?source=${searchData.source}&destination=${searchData.destination}&date=${formattedDate}`,
            {
                credentials: 'include'
            }
        ).then((response) => response.json());
        console.log(response);
        setTickets(response.data);

    };



    const handlechange = (event) => {
        console.log(event.target.name)
        setSearchData({
            ...searchData,
            [event.target.name]: event.target.value,
        });

    };
    const handlesubmit = (event) => {
        event.preventDefault();
        console.log("heere");
        getApiData();
    }
    const [date, setDate] = useState(null);
    const handledate = (date) => {
        setDate(date);
    }
    return (
        <div>
            <br>
            </br>



            <Form onSubmit={handlesubmit}>
                <Form.Group>
                    <Container>
                        <Row>
                            <Col>
                                <Form.Control type="text" placeholder="Source" name="source" onChange={handlechange}
                                    value={searchData.source} required/>
                            </Col>
                            <Col>
                                <Form.Control type="text" placeholder="Destination" name="destination" onChange={handlechange}
                                    value={searchData.destination} required/>
                            </Col>
                            <Col xs={6} md={3}>
                                <DatePicker
                                    selected={date}
                                    onChange={handledate}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Date"
                                    className="form-control"
                                    required
                                />
                            </Col>
                            <Col><Button type="submit">Search</Button></Col>
                        </Row>
                    </Container>
                </Form.Group>
            </Form>




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
                        <th>Fare</th>
                        <th>Book</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        tickets.map((ticket) => (
                            <tr key={ticket.schid}>
                                <td>{`${ticket.airlinename}`}</td>
                                <td>{`${ticket.flightnumber}`}</td>
                                <td>{`${ticket.source}`}</td>
                                <td>{`${ticket.destination}`}</td>
                                <td>{`${ticket.sch_date}`}</td>
                                <td>{`${ticket.est_arrival_time}`}</td>
                                <td>{`${ticket.depature_time}`}</td>
                                <td>{`${ticket.fare}`}</td>
                                <td><Button variant="primary" name={ticket.schid} id = "bookBut" size="sm" onClick={bookpage}>
                                    Book
                                </Button></td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        </div>
    )
}
