import React from 'react';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import baseurl from '../config';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

function ViewFlight() {
    const [flights, setflights] = useState([]);
    const [allAirline, setallAirline] = useState([]);
    const [airline, setairline] = useState(1);
    const [searchDone, setSearchDone] = useState(false);
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
                // let tempflights=[...flights]
                //         // tempflights[index].status='removed';
                //         // setflights(tempflights)
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <div>
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
                                    flights.map((flight, index) => (
                                        <tr key={flight.fid}>
                                            <td>{`${flight.flightnumber}`}</td>
                                            <td>{`${flight.capacity}`}</td>
                                            <td>{`${flight.status}`}</td>
                                            <td><Button variant="warning" name={flight.fid} id={flight.fid} size="sm" onClick={removeflight}>
                                                Remove
                                            </Button></td>
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


export default ViewFlight;