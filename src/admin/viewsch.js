import React from 'react';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import baseurl from '../config';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

function ViewBooking() {
    const [flights, setflights] = useState([]);
    const [allAirline, setallAirline] = useState([]);
    const [airline, setairline] = useState(1);
    const [allFlights, setallFlights] = useState([]);
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

    const getApiData = async () => {
        const response = await fetch(
            `${baseurl}/flight/getairline`, {
                credentials: 'include'
            }
        ).then((response) => response.json());
        setallAirline(response.data);
    }
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
    const submitSch = (e) => {
        e.preventDefault();
        getFlight();
    }
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
    const [bookings,setBookings]=useState([]);
    const onSubmit = async (e) => {
        e.preventDefault();
        console.log(searchData)
        const date=searchData.date;
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Months are zero-based, so add 1
        const day = date.getDate();
        const formattedDate = year + "-" + month + "-" + day;
        console.log("formattedDate" + formattedDate);
        const response=await fetch(`${baseurl}/booking/getbookings?fn=${searchData.fid}&date=${formattedDate}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        .then(response => response.json());
        setBookings(response.data);
    }

    const removeflight = (e) => {

        fetch(`${baseurl}/flight/remove/${e.target.name}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
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
                    <br /><br/>
                    <Form.Label>Date</Form.Label>
                    <DatePicker
                        selected={searchData.date}
                        onChange={handleStDate}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Scheduled Date"
                        className="form-control"
                        required
                    />
                    <Button variant="primary" type="submit">Submit</Button>
                </Form.Group>
            </Form>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Airline Name</th>
                        <th>Flight Number</th>
                        <th>Source</th>
                        <th>Destination</th>
                        <th>Date</th>
                        <th>Arrival Time</th>
                        <th>Depature Time</th>
                        <th>Booked Seats</th>
                        <th>Total amount</th>
                        <th>Date of Booking</th>
                        <th>Status</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        bookings.map((booking) => (
                            <tr key={booking.bid}>
                                <td>{`${booking.airlinename}`}</td>
                                <td>{`${booking.flightnumber}`}</td>
                                <td>{`${booking.source}`}</td>
                                <td>{`${booking.destination}`}</td>
                                <td>{`${booking.sch_date}`}</td>
                                <td>{`${booking.est_arrival_time}`}</td>
                                <td>{`${booking.depature_time}`}</td>
                                <td>{`${booking.booked_seats}`}</td>
                                <td>{`${booking.totalamt}`}</td>
                                <td>{`${booking.dateofbooking}`}</td>
                                <td>{`${booking.status}`}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
            
        </div>
    )
}


export default ViewBooking;