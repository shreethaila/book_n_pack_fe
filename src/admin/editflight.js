import React, { useEffect, useState } from 'react';
import { Form, Container, Row, Col } from 'react-bootstrap';
import baseurl from '../config';
import Button from 'react-bootstrap/Button';
import '../index.css'
function Editflight() {
    const [formFailure, setFormFailure] = useState('');
    const [allAirline, setallAirline] = useState([]);
    const [flightData, setFlightData] = useState(
        {
            'fid':0,
            'aid': 0,
            'flightnumber': 0,
            'focc': 0,
            'bocc': 0,
            'eocc': 0
        }
    );
    const handleChange = (event) => {
        setFormFailure('');
        console.log(event.target.value)

        setFlightData({
            ...flightData,
            [event.target.name]: event.target.value,
        });
    };
    const getflight = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const qfid = queryParams.get('fid');

        fetch(
            `${baseurl}/flight/getflightbyfid/${qfid}`,
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            }
        ).then(async (response) =>{
            response=await response.json();
            console.log(response);
            setFlightData({
                ...flightData,
                fid: response.data[0].fid,
                aid:response.data[0].aid,
                flightnumber: response.data[0].flightnumber,
                focc: response.data[0].focc,
                bocc: response.data[0].bocc,
                eocc: response.data[0].eocc
            });
            
        }
        );

}
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
    getflight();
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
    const found = array.some(obj => obj.flightnumber == flightData.flightnumber && obj.fid!=flightData.fid);
    console.log(found);
    if (found) {
        errors = "Flight already exists";
    } else {
        errors = '';
    }

    return errors;
}
const updateflight = async (event) => {
    event.preventDefault();
    const errors = await validateFormFields();
    if (errors && Object.keys(errors).length > 0) {
        console.log("error");
        setFormFailure(errors);
    } else {
        setFormFailure(errors);
        console.log(flightData);
        fetch(`${baseurl}/flight/updateflight`, {
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
                alert("Flight Details Updated");
                window.location.replace('/viewflight');
            })
            .catch(error => {
                console.error(error);
            });
    }

}
return (
    <div className='flightcont'>
        <br></br>

        <Container>
            <Row className="justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <Form onSubmit={updateflight}>
                        <Form.Group>
                        <Form.Label>Airline<span className="required">*</span></Form.Label>
                            <Form.Select name='aid' onChange={handleChange} value={flightData.aid} required>
                                {
                                    allAirline.map((airline) => (
                                        <option key={airline.aid} value={airline.aid}><img src={airline.logo} width={10} height={10}></img>{`${airline.airlinename}`}</option>
                                    ))
                                }
                            </Form.Select>
                            <br></br>
                            <Form.Label>Flight Number<span className="required">*</span></Form.Label>
                            <Form.Control
                                name='flightnumber'
                                type="number"
                                value={flightData.flightnumber}
                                onChange={handleChange}
                                placeholder="Enter Flight Number"
                                isInvalid={formFailure}
                                min="0"
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {formFailure}
                            </Form.Control.Feedback>
                            <br></br>
                            <Form.Label>First Class Occupancy<span className="required">*</span></Form.Label>
                            <Form.Control
                                name='focc'
                                type="number"
                                value={flightData.focc}
                                onChange={handleChange}
                                placeholder="Enter Capacity"
                                min="0"
                                required
                            />
                            <br></br>
                            <Form.Label>Business Class Occupancy<span className="required">*</span></Form.Label>
                            <Form.Control
                                name='bocc'
                                type="number"
                                value={flightData.bocc}
                                onChange={handleChange}
                                placeholder="Enter Capacity"
                                min="0"
                                required
                            />
                            <br></br>
                            <Form.Label>Economy Class Occupancy<span className="required">*</span></Form.Label>
                            <Form.Control
                                name='eocc'
                                type="number"
                                value={flightData.eocc}
                                onChange={handleChange}
                                placeholder="Enter Capacity"
                                min="0"
                                required
                            />
                            <br></br>
                            <Button variant="primary" type="submit" style={{ background: "#009999" }}>Update</Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    </div>

);
};

export default Editflight;
