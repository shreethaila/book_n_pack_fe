import React from 'react';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import baseurl from '../config';
import { Container,Row,Col,Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

function ViewFlight() {
    const [flights, setflights] = useState([]);
    const [allAirline, setallAirline] = useState([]);
    const [airline, setairline] = useState(1);
    const [searchDone, setSearchDone] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = flights.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(flights.length / itemsPerPage);


    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) {
            return; // Invalid page number, do nothing
        }
        setCurrentPage(pageNumber);
    };
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
    const tableRows = currentItems.map((item, index) => (
        <tr key={item.fid}>
            <td>{`${item.flightnumber}`}</td>
            <td>{`${item.capacity}`}</td>
            <td>{`${item.status}`}</td>
            <td>
                {item.status == 'removed' ? (<Button variant="warning" disabled="true" name={item.fid} id={item.fid} size="sm" onClick={removeflight}>
                    Remove
                </Button>) : (<Button variant="warning" name={item.fid} id={item.fid} size="sm" onClick={removeflight}>
                    Remove
                </Button>)}</td>


        </tr>
    ));
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
        setCurrentPage(1)
        getFlight();
        setSearchDone(true)
    }



    return (
        <div>
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
                                <Button variant="primary" type="submit">Submit</Button>
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
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Flight Number</th>
                                    <th>Capacity</th>
                                    <th>Status</th>
                                    <th>Action</th>

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
                )}
            </div>


        </div>
    )
}


export default ViewFlight;