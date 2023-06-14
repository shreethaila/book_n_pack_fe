import React, { useEffect, useState } from 'react';
import { Form ,Container,Row,Col} from 'react-bootstrap';
import baseurl from '../config';
import Button from 'react-bootstrap/Button';
function AddFlight() {
    const [formFailure, setFormFailure] = useState('');
    const [flightData, setFlightData] = useState(
        {
            'aid': 0,
            'flightnumber': 0,
            'capacity': 0
        }
    );
    const [allAirline, setallAirline] = useState([]);
    const handleChange = (event) => {
        setFormFailure('');
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
        setFlightData({
            ...flightData,
            aid: response.data[0].aid
        })

    }
    useEffect(() => {
        getApiData();
    }, []);
    const validateFormFields = async () => {
        let errors;
        const response = await fetch(
            `${baseurl}/flight/getflight?aid=` + flightData.aid,
            {
                credentials: 'include'
            }
        ).then((response) => response.json());
        let array = response.data;
        console.log(array);
        const found = array.some(obj => obj.flightnumber == flightData.flightnumber);
        console.log(found);
        if (found) {
            errors = "Flight already exists";
        } else {
            errors = '';
        }

        return errors;
    }
    const submitflight = async (event) => {
        event.preventDefault();
        const errors = await validateFormFields();
        if (errors && Object.keys(errors).length > 0) {
            console.log("error");
            setFormFailure(errors);
        } else {
            setFormFailure(errors);
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
                    window.location.replace('/addflight');
                })
                .catch(error => {
                    console.error(error);
                });
        }

    }
    return (
        <div>
            <br></br>
       
        <Container>
            <Row className="justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <Form onSubmit={submitflight}>
                        <Form.Group>
                            <Form.Label>Airline</Form.Label>
                            <Form.Select name='aid' onChange={handleChange} value={flightData.aid} required>
                                {
                                    allAirline.map((airline) => (
                                        <option key={airline.aid} value={airline.aid}><img src={airline.logo} width={10} height={10}></img>{`${airline.airlinename}`}</option>
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
                                isInvalid={formFailure}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {formFailure}
                            </Form.Control.Feedback>
                            <br></br>
                            <Form.Label>Passenger Occupancy</Form.Label>
                            <Form.Control
                                name='capacity'
                                type="number"
                                value={flightData.occupancy}
                                onChange={handleChange}
                                placeholder="Enter Capacity"
                                required
                            />
                            <br></br>
                            <Button variant="primary" type="submit" >Submit</Button>

                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
        </div>

    );
};

export default AddFlight;
