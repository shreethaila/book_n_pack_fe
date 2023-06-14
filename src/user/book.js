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
    const [alltickets, setalltickets] = useState([]);
    const [searchDone, setSearchDone] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchData, setSearchData] = useState({
        source: '',
        destination: '',
        date: ''
    });
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = alltickets.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(alltickets.length / itemsPerPage);
   

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) {
            return; // Invalid page number, do nothing
        }
        setCurrentPage(pageNumber);
    };
    const bookpage = (event) => {
        window.location.replace('/ticketbook?schid=' + event.target.name);
    }
    const tableRows = currentItems.map((item, index) => (
        <tr key={item.schid}>
            <td>{`${item.airlinename}`}</td>
            <td>{`${item.flightnumber}`}</td>
            <td>{`${item.source}`}</td>
            <td>{`${item.destination}`}</td>
            <td>{`${item.schdate}`}</td>
            <td>{`${item.est_arrival_time}`}</td>
            <td>{`${item.depature_time}`}</td>
            <td>{`${item.aseats}`}</td>
            <td>{`${item.fare}`}</td>
            {item.aseats == 0 ? (<td><Button variant="primary" disabled="true" name={item.schid} id="bookBut" size="sm" onClick={bookpage}>
                Book
            </Button></td>) : (<td><Button variant="primary" name={item.schid} id="bookBut" size="sm" onClick={bookpage}>
                Book
            </Button></td>)}

        </tr>
    ));
    
    
    const getApiData = async () => {

        console.log(date);
        let formattedDate;
        if (date != null) {
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // Months are zero-based, so add 1
            const day = date.getDate();
            formattedDate = year + "-" + month + "-" + day;
        } else {
            formattedDate = null;
        }

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
    const getalltickets = async () => {
        const response = await fetch(
            `${baseurl}/flight/search`,
            {
                credentials: 'include'
            }
        ).then((response) => response.json());
        console.log(response);
        setalltickets(response.data);
    }
    useEffect(() => {
        getalltickets();
    }, []);

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
        setSearchDone(true);
        getApiData();
    }
    const [date, setDate] = useState(null);
    const handledate = (date) => {
        setDate(date);
    }
    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
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
                                    value={searchData.source} required />
                            </Col>
                            <Col>
                                <Form.Control type="text" placeholder="Destination" name="destination" onChange={handlechange}
                                    value={searchData.destination} required />
                            </Col>
                            <Col xs={6} md={3}>
                                <DatePicker
                                    minDate={minDate}
                                    selected={date}
                                    onChange={handledate}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Date"
                                    className="form-control"
                                />
                            </Col>
                            <Col><Button type="submit">Search</Button></Col>
                        </Row>
                    </Container>
                </Form.Group>
            </Form>

            <div>
                {tickets.length === 0 ? (
                    searchDone ? (<div><br /><h5 style={{ textAlign: 'center' }}>No flights found!</h5><p style={{ textAlign: 'center' }}>Please try a different route or date</p></div>) : (
                        <div>
                            <br />
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
                                        <th>Available Seats</th>
                                        <th>Fare</th>
                                        <th>Book</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        tableRows
                                    }
                                </tbody>
                            </Table>
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
                    )
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
                                    <th>Available Seats</th>
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
                                            <td>{`${ticket.schdate}`}</td>
                                            <td>{`${ticket.est_arrival_time}`}</td>
                                            <td>{`${ticket.depature_time}`}</td>
                                            <td>{`${ticket.aseats}`}</td>
                                            <td>{`${ticket.fare}`}</td>
                                            {ticket.aseats == 0 ? (<td><Button variant="primary" disabled="true" name={ticket.schid} id="bookBut" size="sm" onClick={bookpage}>
                                                Book
                                            </Button></td>) : (<td><Button variant="primary" name={ticket.schid} id="bookBut" size="sm" onClick={bookpage}>
                                                Book
                                            </Button></td>)}
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </div>
                )}
            </div>


            <br></br>
        </div>

    )
}
