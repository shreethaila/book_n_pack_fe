import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import baseurl from '../config';
import Button from 'react-bootstrap/Button';
function AddFlight() {
    const [flightData, setFlightData] = useState(
        {
            'aid': 1,
            'flightnumber': 0,
            'capacity': 0
        }
    );
    const [allAirline, setallAirline] = useState([]);
    const handleChange = (event) => {
        console.log(event.target.value)
        setFlightData({
            ...flightData,
            [event.target.name]: event.target.value,
        });
    };
    const getApiData = async () => {
        const response = await fetch(
            `${baseurl}/flight/getairline`,
            {
                credentials: 'include'
            }
        ).then((response) => response.json());
        setallAirline(response.data);

    }
    useEffect(() => {
        getApiData();
    }, []);

    const submitflight = (event) => {
        event.preventDefault();
        console.log(flightData);
        fetch(`${baseurl}/flight/addflight`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(flightData)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
               alert("Flight Added");
            })
            .catch(error => {
                console.error(error);
            });
        
    }
    return (
        <Form onSubmit={submitflight}>
            <Form.Group>
                <Form.Label>Airline</Form.Label>
                <Form.Select name='aid' onChange={handleChange}>
                    {
                        allAirline.map((airline) => (
                            <option value={airline.aid}><img src={airline.logo} width={10} height={10}></img>{`${airline.airlinename}`}</option>
                        ))
                    }
                </Form.Select>
                <br></br>
                <Form.Label>Flight Number</Form.Label>
                <Form.Control
                    name='flightnumber'
                    type="number"
                    value={flightData.fn}
                    onChange={handleChange}
                    placeholder="Enter Flight Number"
                />
                <br></br>
                <Form.Label>Passenger Occupancy</Form.Label>
                <Form.Control
                    name='capacity'
                    type="number"
                    value={flightData.occupancy}
                    onChange={handleChange}
                    placeholder="Enter Capacity"
                />
                <br></br>
                <Button variant="primary" type="submit">Submit</Button>

            </Form.Group>
        </Form>
    );
};

export default AddFlight;
