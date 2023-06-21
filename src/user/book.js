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
import '../index.css'
import Pagination from 'react-bootstrap/Pagination';
export default function BookTicket() {
    const [tickets, setTickets] = useState([]);
    const [alltickets, setalltickets] = useState([]);
    const [searchDone, setSearchDone] = useState(false);
    
    const [searchData, setSearchData] = useState({
        source: '',
        destination: '',
        date: ''
    });
    
    const bookpage = (event) => {
        window.location.replace('/ticketbook?schid=' + event.target.name);
    }
    
    
    
    const getApiData = async () => {

        console.log(date);
        let formattedDate;
        if (date != null) {
            const year = date.getFullYear();
            const month = date.getMonth() + 1; 
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

    const resultsPerPage = 10;
    let totalResults;
    if (tickets.length===0){
        totalResults=alltickets.length; 
    }else{
        totalResults=tickets.length;
    }
    const totalPages = Math.ceil(totalResults / resultsPerPage); 

    const [activePage, setActivePage] = React.useState(1); 

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber); 
    };

    const renderResultsForPage = () => {
        
        const startIndex = (activePage - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;
        let currpage;
        if (tickets.length==0){
            currpage = alltickets.slice(startIndex, endIndex);
        }else{
            currpage = tickets.slice(startIndex, endIndex);
        }
        

        
        return currpage.map((item, index) => (


            <tr key={item.schid}>
            <td><img src={`${item.logo}`} width={70} height={70} ></img><br/>{`${item.airlinename}`}</td>
            <td>{`${item.flightnumber}`}</td>
            <td>{`${item.source}`}</td>
            <td>{`${item.destination}`}</td>
            <td>{`${item.schdate}`}</td>
            <td>{`${item.est_arrival_time}`}</td>
            <td>{`${item.depature_time}`}</td>
            <td><b><i>{`First Class`}</i></b>{`-${item.frem}`}<br/><b><i>{`Business Class`}</i></b>{`-${item.brem}`} <br></br><b><i> {`Economy Class`}</i></b>{`-${item.erem}`}</td>
            <td><b><i>{`First Class`}</i></b>{`-${item.firstclass}`}<br/><b><i>{`Business Class`}</i></b>{`-${item.businessclass}`} <br></br><b><i> {`Economy Class`}</i></b>{`-${item.economyclass}`}</td>

            {(item.frem == 0 && item.brem==0 && item.erem==0)? (<td><Button variant="primary" disabled="true" style={{background:"#009999"}} name={item.schid} id="bookBut" size="sm" onClick={bookpage}>
                Book
            </Button></td>) : (<td><Button variant="primary" style={{background:"#009999"}} name={item.schid} id="bookBut" size="sm" onClick={bookpage}>
                Book
            </Button></td>)}

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
        <div class='cont'>
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
                            <Col><Button type="submit" style={{background:"#009999"}}>Search</Button></Col>
                        </Row>
                    </Container>
                </Form.Group>
            </Form>

            <div>
                {tickets.length === 0 ? (
                    searchDone ? (<div><br /><h5 style={{ textAlign: 'center' }}>No flights found!</h5><p style={{ textAlign: 'center' }}>Please try a different route or date</p></div>) : (
                        <div>
                            <br />
                            <Table striped bordered hover responsive>
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
                                {renderResultsForPage()}
                        </tbody>
                        </Table>
                        <Pagination style={paginationStyles} className='custom-pagination'>{items}</Pagination>
                            
                        </div>
                    )
                ) : (
                    <div>
                        <br></br>
                        <Table striped bordered hover responsive>
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
                                {/* {
                                    tickets.map((ticket) => (
                                        
                                        <tr key={ticket.schid}>
                                            <td><img src={`${ticket.logo}`} width={50} height={50} ></img><br/>{`${ticket.airlinename}`}</td>
                                            <td>{`${ticket.flightnumber}`}</td>
                                            <td>{`${ticket.source}`}</td>
                                            <td>{`${ticket.destination}`}</td>
                                            <td>{`${ticket.schdate}`}</td>
                                            <td>{`${ticket.est_arrival_time}`}</td>
                                            <td>{`${ticket.depature_time}`}</td>
                                            <td><b><i>{`First Class`}</i></b>{`-${ticket.frem}`}<br/><b><i>{`Business Class`}</i></b>{`-${ticket.brem}`} <br></br><b><i> {`Economy Class`}</i></b>{`-${ticket.erem}`}</td>
                                            <td><b><i>{`First Class`}</i></b>{`-${ticket.firstclass}`}<br/><b><i>{`Business Class`}</i></b>{`-${ticket.businessclass}`} <br></br><b><i> {`Economy Class`}</i></b>{`-${ticket.economyclass}`}</td>
                                            {ticket.aseats == 0 ? (<td><Button variant="primary" style={{background:"#009999"}} disabled="true" name={ticket.schid} id="bookBut" size="sm" onClick={bookpage}>
                                                Book
                                            </Button></td>) : (<td><Button variant="primary" style={{background:"#009999"}} name={ticket.schid} id="bookBut" size="sm" onClick={bookpage}>
                                                Book
                                            </Button></td>)}
                                        </tr>
                                    ))
                                } */}
                            {renderResultsForPage()}
                        </tbody>
                        </Table>
                        <Pagination style={paginationStyles} className='custom-pagination'>{items}</Pagination>
                    </div>
                )}
            </div>


            <br></br>
        </div>

    )
}
