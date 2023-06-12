import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import baseurl from '../config';
import Button from 'react-bootstrap/Button';
import TimePicker from 'react-time-picker';
import DatePicker from 'react-datepicker';
function AddSch() {

    const [allAirline, setallAirline] = useState([]);
    const [allFlights, setallFlights] = useState([]);

    const [schData, setSchData] = useState(
        {
            'aid': 1,
            'fid': 0,
            'source': '',
            'destination': '',
            'est_arrival_time': '',
            'depature_time': '',
            'stdate': '',
            'enddate': '',
            'schdate': '',
            'fare': 0
        }
    );
    const handleAirlineChange = async (event) => {
        console.log(event.target.value)
        setSchData({
            ...schData,
            [event.target.name]: event.target.value,
        });

        flightdata(event.target.value);
    };

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
        ).then((response) => response.json());
        setallAirline(response.data);

    }
    const flightdata = async (aid) => {
        const response = await fetch(
            `${baseurl}/flight/getflight?aid=` + aid,
            {
                credentials: 'include'
            }
        ).then((response) => response.json());
        setallFlights(response.data);
        setSchData({
            ...schData,
            "fid": response.data[0].fid,
        });
        console.log(response.data)
    }
    useEffect(() => {
        getAirline();
        flightdata(schData.aid);
    }, []);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Months are zero-based, so add 1
        const day = date.getDate();
        const formattedDate = year + "-" + month + "-" + day;
        console.log("formattedDate" + formattedDate);
        return formattedDate;
    }
    const submitSch = async (e) => {
        e.preventDefault();
        const input = {
            ...schData,
            "stFormattedData": formatDate(new Date(schData.stdate)),
            "endFormattedDate": formatDate(new Date(schData.enddate))
        };
        fetch(`${baseurl}/flight/addsch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(input)
        })
            .then(response => response.json())
            .then(data => {
                alert("Travel Schedule added");
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
    const [selectedTime, setSelectedTime] = useState('10:10');

    const handleEndDate = (date) => {
        console.log(date)
        setSchData({
            ...schData,
            "enddate": date
        }

        )
    }

    const handleStDate = (date) => {
        console.log(date)
        setSchData({
            ...schData,
            "stdate": date
        }

        )
    }

    return (
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
                <Form.Label>Flight Number</Form.Label>
                <Form.Select name='fid' onChange={handleChange}>
                    {getflights()}
                </Form.Select>
                <br />
                <Form.Label>Source</Form.Label>
                <Form.Control type="text" placeholder="Source" name="source" value={schData.source} onChange={handleChange} />
                <br />
                <Form.Label>Destination</Form.Label>
                <Form.Control type="text" placeholder="Destination" name="destination" value={schData.destination} onChange={handleChange} />
                <br />
                <Form.Label>Estimated Arrival Time</Form.Label>
                <Form.Control
                    type="time"
                    value={schData.est_arrival_time}
                    name="est_arrival_time"
                    onChange={handleChange}
                />
                <br />
                <Form.Label>Depature Time</Form.Label>
                <Form.Control
                    type="time"
                    value={schData.depature_time}
                    name="depature_time"
                    onChange={handleChange}
                />
                <br />
                <Form.Label>Fare</Form.Label>
                <Form.Control type="number" placeholder="Fare" name="fare" value={schData.fare} onChange={handleChange} />
                <br />
                <Form.Label>Starts From</Form.Label>
                <DatePicker
                    selected={schData.stdate}
                    onChange={handleStDate}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="From"
                    className="form-control"
                    required
                />
                <br />
                <Form.Label>Runs upto</Form.Label>
                <DatePicker
                    selected={schData.enddate}
                    onChange={handleEndDate}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="To"
                    className="form-control"
                    required
                />
                <br />
                <br />
                <Button variant="primary" type="submit">Submit</Button>

            </Form.Group>
        </Form>
    );
};

export default AddSch;
