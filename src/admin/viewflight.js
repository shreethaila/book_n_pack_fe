import React from 'react';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import baseurl from '../config';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import '../index.css'
import Pagination from 'react-bootstrap/Pagination';
function ViewFlight() {
    const [flights, setflights] = useState([]);
    const [allAirline, setallAirline] = useState([]);
    const [airline, setairline] = useState(1);
    const [searchDone, setSearchDone] = useState(false);

    const removeflight = (e) => {

        fetch(`${baseurl}/flight/remove/${e.target.name}`, {
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
    const editflight = async (e) => {
        await fetch(
            `${baseurl}/booking/getbookingcountbyfid/${e.target.name}`,
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            }
        ).then(async (response) => {
            response = await response.json();
            console.log("check res");
            console.log(response.data[0].record_exists);
            if (response.data[0].record_exists == 0) {
                window.location.replace(`/editflight?fid=${e.target.name}`);
            } else {
                alert("This flight has some bookings. Edit the flight after cancelling it")
            }
        });
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

    const getApiData = async () => {
        const response = await fetch(
            `${baseurl}/flight/getairline`, {
            credentials: 'include'
        }
        ).then((response) => response.json());
        setallAirline(response.data);
        setairline(response.data[0].aid)
    }
    const handleAirlineChange = (e) => {
        console.log(e.target.value)
        setairline(e.target.value)
    }
    useEffect(() => {
        getApiData();
    }, []);
    const submitSch = (e) => {
        e.preventDefault();
        getFlight();
        setSearchDone(true)
    }
    const resultsPerPage = 10;
    const totalResults = flights.length;
    const totalPages = Math.ceil(totalResults / resultsPerPage);

    const [activePage, setActivePage] = React.useState(1);

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
    };

    const renderResultsForPage = () => {

        const startIndex = (activePage - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;


        const currpage = flights.slice(startIndex, endIndex);


        return currpage.map((item, index) => (

            <tr key={item.fid}>
                <td>{`${item.flightnumber}`}</td>
                <td>{`${item.focc}`}</td>
                <td>{`${item.bocc}`}</td>
                <td>{`${item.eocc}`}</td>
                <td>{`${item.status}`}</td>
                <td>
                    {item.status == 'removed' ? (<div><Button style={{ backgroundColor: '#009999' }} disabled="true" className='button' name={item.fid} id={item.fid} size="sm" onClick={editflight}>
                        Edit
                    </Button><Button variant="warning" className='button' disabled="true" name={item.fid} id={item.fid} size="sm" onClick={removeflight}>
                            Remove
                        </Button></div>) : (<div><Button style={{ backgroundColor: '#009999' }} className='button' name={item.fid} id={item.fid} size="sm" onClick={editflight}>
                            Edit
                        </Button><Button variant="warning" className='button' name={item.fid} id={item.fid} size="sm" onClick={removeflight}>
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
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Form onSubmit={submitSch}>
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
                                <Button variant="primary" type="submit" style={{ background: "#009999" }}>Submit</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>

            <div>
                {flights.length === 0 ? (
                    searchDone ? (<div><br /><h5 style={{ textAlign: 'center' }}>No flights found in this airline!</h5></div>) : (<div />)
                ) : (
                    <div>
                        <br></br>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Flight Number</th>
                                    <th>First Class Capacity</th>
                                    <th>Business Class Capacity</th>
                                    <th>Economy Class Capacity</th>
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


export default ViewFlight;