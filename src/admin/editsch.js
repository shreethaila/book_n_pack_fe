import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Container } from 'react-bootstrap';
import baseurl from '../config';
import Button from 'react-bootstrap/Button';
import DatePicker from 'react-datepicker';
import '../index.css'
function Editsch() {

    const [allAirline, setallAirline] = useState([]);
    const [allFlights, setallFlights] = useState([]);
    const [schData, setSchData] = useState(
        {
            'schid':0,
            'fid': 0,
            'aid': 101,
            'source': '',
            'destination': '',
            'est_arrival_time': '',
            'depature_time': '',
            'schdate': '',
            'firstclass': 0,
            'businessclass': 0,
            'economyclass': 0
        }
    );


    const handleChange = async (event) => {
        console.log(event.target.value)
        setSchData({
            ...schData,
            [event.target.name]: event.target.value,
        });
    };

    const getAirline = async () => {
        const response = await fetch(
            `${baseurl}/flight/getairline`,
            {
                credentials: 'include'
            }
        ).then(async (response) => {
            response = await response.json();
            setallAirline(response.data);
            setSchData({
                ...schData,
                aid: response.data[0].aid
            });
        });

    }
    const flightdata = async (aid) => {
        const response = await fetch(
            `${baseurl}/flight/getflight?aid=` + aid,
            {
                credentials: 'include'
            }
        ).then(async (response) => {
            response = await response.json();
            console.log("flight dropdown data");
            console.log(response.data)
            setallFlights(response.data);
            setSchData({
                ...schData,
                "fid": response.data[0].fid,
            });
        });


    }
    const getschedule = () => {
        const queryParams = new URLSearchParams(window.location.search);
        const qschid = queryParams.get('schid');

        fetch(
            `${baseurl}/flight/getschedule/${qschid}`,
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            }
        ).then(async (response) => {
            response = await response.json();
            console.log(response);
            setSchData({
                ...schData,
                schid:response.data[0].schid,
                fid: response.data[0].fid,
                source: response.data[0].source,
                destination: response.data[0].destination,
                est_arrival_time: response.data[0].est_arrival_time,
                depature_time: response.data[0].depature_time,
                schdate:new Date(response.data[0].schdate),
                firstclass:response.data[0].firstclass,
                businessclass:response.data[0].businessclass,
                economyclass:response.data[0].economyclass
            });

        }
        );
    }
    useEffect(() => {
        getAirline();
        flightdata(schData.aid);
        getschedule();
    }, []);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const formattedDate = year + "-" + month + "-" + day;
        console.log("formattedDate" + formattedDate);
        return formattedDate;
    }
    const handleAirlineChange = async (event) => {
        setSchData({
            ...schData,
            [event.target.name]: event.target.value,
        });

        console.log(event.target.value);

        flightdata(event.target.value);
    };
    const submitSch = async (e) => {
        e.preventDefault();
        const input = {
            ...schData,
            schdate: formatDate(new Date(schData.schdate))
        };
        fetch(`${baseurl}/flight/updateschedule`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(input)
        })
            .then(response => response.json())
            .then(data => {
                alert("Travel Schedule updated");
                window.location.replace('/viewsch');
            })
            .catch(error => {
                console.error(error);
            });

    }

    const getflights = () => {
        return allFlights.map((flight, index) => (
            <option key={index} value={flight.fid}>{`${flight.flightnumber}`}</option>
        ));
    }

    const handledate = (date) => {
        console.log(date)
        setSchData({
            ...schData,
            schdate: date
        }

        )
    }

    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return (
        <div class='flightcont'>
            <br></br>
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Form onSubmit={submitSch}>
                            <Form.Group>
                                <Form.Label>Airline<span className="required">*</span></Form.Label>
                                <Form.Select name='aid' onChange={handleAirlineChange} required>
                                    {
                                        allAirline.map((airline) => (
                                            <option value={airline.aid} key={airline.aid}><img src={airline.logo} width={10} height={10}></img>{`${airline.airlinename}`}</option>
                                        ))
                                    }
                                </Form.Select>
                                <br />
                                <Form.Label>Flight Number<span className="required">*</span></Form.Label>
                                <Form.Select name='fid' onChange={handleChange} required>
                                    {getflights()}
                                </Form.Select>
                                <br />
                                <Form.Label>Source<span className="required">*</span></Form.Label>
                                <Form.Control type="text" placeholder="Source" name="source" value={schData.source} onChange={handleChange} required />
                                <br />
                                <Form.Label>Destination<span className="required">*</span></Form.Label>
                                <Form.Control type="text" placeholder="Destination" name="destination" value={schData.destination} onChange={handleChange} required />
                                <br />
                                <Form.Label>Estimated Arrival Time<span className="required">*</span></Form.Label>
                                <Form.Control
                                    type="time"
                                    value={schData.est_arrival_time}
                                    name="est_arrival_time"
                                    onChange={handleChange}
                                    required
                                />
                                <br />
                                <Form.Label>Depature Time<span className="required">*</span></Form.Label>
                                <Form.Control
                                    type="time"
                                    value={schData.depature_time}
                                    name="depature_time"
                                    onChange={handleChange}
                                    required
                                />
                                <br />
                                <Form.Label>First Class Fare<span className="required">*</span></Form.Label>
                                <Form.Control type="number" placeholder="Fare" name="firstclass" min="0" value={schData.firstclass} onChange={handleChange} required />
                                <br />
                                <Form.Label>Business Class Fare<span className="required">*</span></Form.Label>
                                <Form.Control type="number" placeholder="Fare" name="businessclass" min="0" value={schData.businessclass} onChange={handleChange} required />
                                <br />
                                <Form.Label>Economy Class Fare<span className="required">*</span></Form.Label>
                                <Form.Control type="number" placeholder="Fare" name="economyclass" min="0" value={schData.economyclass} onChange={handleChange} required />
                                <br />
                                <Form.Label>Schedule Date<span className="required">*</span></Form.Label>
                                <DatePicker
                                    selected={schData.schdate}
                                    onChange={handledate}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Date"
                                    className="form-control"
                                    required
                                />
                                <br />
                                <br/>
                                <Button variant="primary" type="submit" style={{ background: "#009999" }}>Update</Button>

                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>

    );
};

export default Editsch;
