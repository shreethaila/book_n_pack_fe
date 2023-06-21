import React from 'react';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import baseurl from '../config';
import { Container, Form, Row, Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Pagination from 'react-bootstrap/Pagination';
import '../index.css'
function ViewSch() {
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
        setSearchData({
            ...searchData,
            "date": date
        });
    }
    const [tsch, settsch] = useState([]);
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

        const response = await fetch(`${baseurl}/flight/getsch?aid=${airline}&fid=${searchData.fid}&date=${formattedDate}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
            .then(response => response.json());
        console.log(response.data);
        settsch(response.data);
        setSearchDone(true);
    }

    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const removeschedule = async (e) => {
        console.log("schid");
        console.log(e.target.name);
        await fetch(`${baseurl}/flight/removesch/${e.target.name}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
            .then(response => {
                alert("Flight Removed");
                window.location.replace('/viewflight');
                // let tempflights=[...flights]
                //         // tempflights[index].status='removed';
                //         // setflights(tempflights)
            })
            .catch(error => {
                console.error(error);
            });
    }
    const editschedule = async (e) => {
        await fetch(
            `${baseurl}/booking/getbookingcountbyschid/${e.target.name}`,
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            }
        ).then(async (response) => {
            response = await response.json();
            console.log("check res");
            console.log(response.data[0].record_exists);
            if (response.data[0].record_exists == 0) {
                window.location.replace(`/editsch?schid=${e.target.name}`);
            } else {
                alert("This schedule has some bookings. Edit the schedule after cancelling it")
            }
        });
        // window.location.replace(`/editsch?schid=${e.target.name}`);
    }
    const resultsPerPage = 10;
    const totalResults = tsch.length;
    const totalPages = Math.ceil(totalResults / resultsPerPage);

    const [activePage, setActivePage] = React.useState(1);

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
    };

    const renderResultsForPage = () => {

        const startIndex = (activePage - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;


        const currpage = tsch.slice(startIndex, endIndex);


        return currpage.map((sch, index) => (
            <tr key={sch.schid}>
                <td><img src={`${sch.logo}`} width={50} height={50} ></img><br />{`${sch.airlinename}`}</td>
                <td>{`${sch.flightnumber}`}</td>
                <td>{`${sch.source}`}</td>
                <td>{`${sch.destination}`}</td>
                <td>{`${sch.schdate}`}</td>
                <td>{`${sch.est_arrival_time}`}</td>
                <td>{`${sch.depature_time}`}</td>
                <td><b><i>{`First Class`}</i></b>{`-${sch.firstclass}`}<br /><b><i>{`Business Class`}</i></b>{`-${sch.businessclass}`} <br></br><b><i> {`Economy Class`}</i></b>{`-${sch.economyclass}`}</td>
                {/* <td>{`${sch.businessclass}`}</td>
                                            <td>{`${sch.economyclass}`}</td> */}
                <td>{`${sch.status}`}</td>
                <td>
                    {sch.status == 'cancelled' ? (<div><Button style={{ backgroundColor: '#009999' }} disabled="true" className='button' name={sch.schid} id={sch.schid} size="sm" onClick={editschedule}>
                        Edit
                    </Button><Button variant="warning" className='button' disabled="true" name={sch.schid} id={sch.schid} size="sm" onClick={removeschedule}>
                            Remove
                        </Button></div>) : (<div><Button style={{ backgroundColor: '#009999' }} className='button' name={sch.schid} id={sch.schid} size="sm" onClick={editschedule}>
                            Edit
                        </Button><Button variant="warning" className='button' name={sch.schid} id={sch.schid} size="sm" onClick={removeschedule}>
                                Remove
                            </Button></div>)}</td>
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
                {tsch.length === 0 ? (
                    searchDone ? (<div><br /><h5 style={{ textAlign: 'center' }}>No Schedules found!</h5></div>) : (<div />)
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
                                    <th>Schedule date</th>
                                    <th>Arrival Time</th>
                                    <th>Depature Time</th>
                                    <th>Fare</th>
                                    {/* <th>Business Class Fare</th>
                                    <th>Economy Class Fare</th> */}
                                    <th>Status</th>
                                    <th>Action</th>

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


        </div>
    )
}


export default ViewSch;