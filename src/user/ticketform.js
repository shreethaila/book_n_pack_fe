import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Button, Col, Container, Row } from 'react-bootstrap';
import baseurl from '../config';
import Modal from 'react-bootstrap/Modal';
import '../index.css'
import SeatPicker from './seat'
function TicketForm() {

    const [ticketData, setTicketData] = useState({
        passengersCount: '',
        seattype: 'f',
        fare: 0,
        amount: 0
    });
    const [bookedseat, setbookedseat] = useState([]);
    const [schData, setSchData] = useState(
        {
            'schid': 0,
            'fid': 0,
            'aid': 101,
            'source': '',
            'destination': '',
            'est_arrival_time': '',
            'depature_time': '',
            'schdate': '',
            'logo': '',
            'airlinename': '',
            'flightnumber': ''

        }
    );

    const [seatocc, setseatocc] = useState(
        {
            'focc': 0,
            'bocc': 0,
            'eocc': 0,
            'occ_seats': 0
        }
    )
    const [buttondisabled,setbuttondisabled]=useState(true);
    const [rows, setrows] = useState([])
    const [passengerCountDisabled, setPassengerCountDisabled] = useState(false);
    const [passengerData, setPassengerData] = useState([]);
    const setrow = (totalSeats, seatsBooked, seattype) => {
        const temprow = [];
        console.log("row");
        console.log(totalSeats)
        const occupiedSeatRows = []; 
        console.log(seatsBooked)
        seatsBooked.forEach(sn => {
            console.log(sn.seatno)
            occupiedSeatRows.push(sn.seatno)
        });

        const numRows = Math.ceil(totalSeats / 10);


        let seatNumber = 1;

        for (let i = 0; i < numRows; i++) {
            const row = [];
            for (let j = 0; j < 10; j++) {
                const isReserved = occupiedSeatRows.includes(seattype + seatNumber) && seatNumber <= totalSeats;
                row.push({ number: seattype + seatNumber, isReserved });
                seatNumber++;
            }
            temprow.push(row);
        }
        setrows(temprow);
        console.log(temprow);
        if (temprow.length==0){
            setbuttondisabled(true);
        }

    }
    const classchange = async (event) => {
        setTicketData({
            ...ticketData,
            seattype: event.target.value,
        });
        const queryParams = new URLSearchParams(window.location.search);
        const schId = queryParams.get('schid');
        await fetch(`${baseurl}/booking/occseats/${schId}/${event.target.value}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then(async (response) => {
            response = await response.json();
            setseatocc({
                ...seatocc,
                focc: response.data[0].focc,
                bocc: response.data[0].bocc,
                eocc: response.data[0].eocc,
                occ_seats: response.data[0].occ_seats
            }
            )
            if (response.data[0].occ_seats != "0") {
                await fetch(`${baseurl}/booking/getseatno/${schId}/${event.target.value}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                }).then(async (response1) => {
                    response1 = await response1.json();
                    setbookedseat(response.data);
                    if (event.target.value == 'b') {
                        setrow(response.data[0].bocc, response1.data, event.target.value);
                    } else if (event.target.value == 'e') {
                        setrow(response.data[0].eocc, response1.data, event.target.value);
                    } else if (event.target.value == 'f') {
                        setrow(response.data[0].focc, response1.data, event.target.value);
                    }
                }
                );
            } else {
                if (event.target.value == 'b') {
                    setrow(response.data[0].bocc, [], event.target.value);
                } else if (event.target.value == 'e') {
                    setrow(response.data[0].eocc, [], event.target.value);
                } else if (event.target.value == 'f') {
                    setrow(response.data[0].focc, [], event.target.value);
                }
            }
        }
        );

    }

    const [disabled, setDisabled] = useState(false);
    useEffect(() => {
        getschedule();
        const queryParams = new URLSearchParams(window.location.search);
        const schId = queryParams.get('schid');
        fetch(`${baseurl}/booking/occseats/${schId}/${ticketData.seattype}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then(async (response) => {
            response = await response.json();
            setseatocc({
                ...seatocc,
                focc: response.data[0].focc,
                bocc: response.data[0].bocc,
                eocc: response.data[0].eocc,
                occ_seats: response.data[0].occ_seats
            }
            )
            const focc = await response.data[0].focc;
            if (response.data[0].occ_seats != "0") {
                await fetch(`${baseurl}/booking/getseatno/${schId}/${ticketData.seattype}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                }).then(async (response) => {
                    response = await response.json();
                    setbookedseat(response.data);
                    setrow(focc, response.data, ticketData.seattype);
                }
                );
            } else {
                setrow(focc, [], ticketData.seattype);
            }
        }
        );

    }, []);

    const addPassengers = async () => {
        setDisabled(!disabled);
        setPassengerCountDisabled(true)
        // const response = await fetch(`${baseurl}/booking/occseats/${schId}/${ticketData.seattype}`, {
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     credentials: 'include'
        // }).then((response) => response.json());
        // console.log(response.data[0].occ_seats);
        // let errors;
        // if (ticketData.seattype == 'f') {
        //     errors = await validateFormFields(response.data[0].focc, response.data[0].occ_seats);
        // } else if (ticketData.seattype == 'b') {
        //     errors = await validateFormFields(response.data[0].bocc, response.data[0].occ_seats);
        // } else if (ticketData.seattype == 'e') {
        //     errors = await validateFormFields(response.data[0].eocc, response.data[0].occ_seats);
        // }
        // if (errors && Object.keys(errors).length > 0) {
        //     setFormFailure(errors);
        // } else {
        //     setFormFailure('');
        //     renderPassengerInputs(ticketData.passengersCount, response.data[0].occ_seats)
        //     setPassengerCountDisabled(true)
        // }
        setTicketData(
            {
                ...ticketData,
                passengersCount: bookedseat.length
            }
        )
        if (bookedseat.length > 0) {
            renderPassengerInputs(bookedseat.length)
        }else{
            setbuttondisabled(true);
        }


    }

    const renderPassengerInputs = async (count) => {
        const inp = [];
        for (let i = 0; i < count; i++) {
            inp[i] = {
                name: '',
                age: '',
                gender: 'male',
                proof_type: '',
                proof_id: '',
                seatno: bookedseat[i]
            }
        }
        setPassengerData(inp)
    };

    const handleInputChange = (index, event) => {
        const values = [...passengerData];
        values[index] = {
            ...values[index],
            [event.target.name]: event.target.value,
        };
        setPassengerData(values);
        console.log(values)
    };

    const renderInputFields = () => {
        return passengerData.map((input, index) => (
            <div key={index}>
                <h5>Passenger {index + 1}</h5>
                <ListGroup.Item>
                    <Form.Group className="mb-3">
                        <Form.Label>Name<span className="required">*</span></Form.Label>
                        <Form.Control type="text" name="name" value={input.name} onChange={(event) => handleInputChange(index, event)} required />
                        <Form.Label>Age<span className="required">*</span></Form.Label>
                        <Form.Control type="number" name="age" min="0" value={input.age} onChange={(event) => handleInputChange(index, event)} required />
                        <Form.Label>Gender<span className="required">*</span></Form.Label>
                        {/* <Form.Control type="text" name="gender" value={input.gender} onChange={(event) => handleInputChange(index, event)} required /> */}
                        <Form.Select name='gender' value={input.gender} onChange={(event) => handleInputChange(index, event)} required>
                            <option value='male'>Male</option>
                            <option value='female' >Female</option>
                            <option value='other'>Other</option>
                        </Form.Select>
                        <Form.Label>Proof Type<span className="required">*</span></Form.Label>
                        <Form.Control type="text" name="proof_type" value={input.proof_type} onChange={(event) => handleInputChange(index, event)} required />
                        <Form.Label>Proof Id<span className="required">*</span></Form.Label>
                        <Form.Control type="text" name="proof_id" value={input.proof_id} onChange={(event) => handleInputChange(index, event)} required />
                    </Form.Group>
                </ListGroup.Item>
                <br></br>
            </div>
        ));
    };
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const submitticketbooking = async (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams(window.location.search);
        const schId = queryParams.get('schid');
        console.log(schId)
        const response = await fetch(
            `${baseurl}/flight/getfare?schid=${schId}`,
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            }
        ).then((response) => response.json());
        if (ticketData.seattype == 'f') {
            console.log(response.data[0].firstclass);
            setTicketData(prevTicketData => ({
                ...prevTicketData,
                fare: parseFloat(response.data[0].firstclass).toFixed(2),
                amount: (parseFloat(prevTicketData.passengersCount) * parseFloat(response.data[0].firstclass)).toFixed(2)
            }));
        } else if (ticketData.seattype == 'b') {
            console.log(response.data[0].businessclass);
            setTicketData(prevTicketData => ({
                ...prevTicketData,
                fare: parseFloat(response.data[0].businessclass).toFixed(2),
                amount: (parseFloat(prevTicketData.passengersCount) * parseFloat(response.data[0].businessclass)).toFixed(2)
            }));

        } else if (ticketData.seattype == 'e') {
            console.log(response.data[0].economyclass);
            setTicketData(prevTicketData => ({
                ...prevTicketData,
                fare: parseFloat(response.data[0].economyclass).toFixed(2),
                amount: (parseFloat(prevTicketData.passengersCount) * parseFloat(response.data[0].economyclass)).toFixed(2)
            }));

        }
        handleShow();


        console.log("submitticketbooking");
        setShow(true);



    }
    const formatdate = (date) => {

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`
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
                schid: response.data[0].schid,
                fid: response.data[0].fid,
                source: response.data[0].source,
                destination: response.data[0].destination,
                est_arrival_time: response.data[0].est_arrival_time,
                depature_time: response.data[0].depature_time,
                schdate: formatdate(new Date(response.data[0].schdate)),
                airlinename: response.data[0].airlinename,
                flightnumber: response.data[0].flightnumber,
                logo: response.data[0].logo
            });

        }
        );
    }
    const pay = (e) => {
        const queryParams = new URLSearchParams(window.location.search);
        const schId = queryParams.get('schid');
        fetch(`${baseurl}/booking/book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ schid: schId, booked_seats: ticketData.passengersCount, seattype: ticketData.seattype, totalamount: ticketData.amount, passenger: passengerData })
        })
            .then(response => {
                if (response.ok) {
                    alert("Ticket Booked");
                    window.location.replace('/mybookings');
                } else {
                    alert("Ticket Booking failed!!")
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
    const handleSelectedSeats = (seats) => {
        console.log("Selected Seats:", seats);
        setbookedseat(seats);
        if (seats.length>0){
            setbuttondisabled(false);
        }else{
            setbuttondisabled(true);
        }
    };
    return (
        <div className='cont'>
            <br />
            <Container>
                <Row className="justify-content-center">

                    <Col xs={12} sm={8} md={6} lg={4}>

                        <ListGroup>
                            <ListGroup.Item>
                                <img src={schData.logo} width={70} height={70} style={{ alignItems: 'center' }}></img>{`${schData.airlinename}`}</ListGroup.Item>
                            <ListGroup.Item><b>Flight Number:</b> {`${schData.flightnumber}`}</ListGroup.Item>
                            <ListGroup.Item><b>Source:</b> {`${schData.source}`}</ListGroup.Item>
                            <ListGroup.Item><b>Destination:</b> {`${schData.destination}`}</ListGroup.Item>
                            <ListGroup.Item><b>Schedule Date:</b> {`${schData.schdate}`} </ListGroup.Item>
                            <ListGroup.Item><b>Arrival Time:</b> {`${schData.est_arrival_time}`}</ListGroup.Item>
                            <ListGroup.Item><b>Depature Time:</b> {`${schData.depature_time}`}</ListGroup.Item>
                        </ListGroup>
                        <Form onSubmit={submitticketbooking}>

                            <Form.Group className="mb-3">
                                <br></br>
                                <Form.Label>Seat Type</Form.Label>
                                <Form.Select name='seattype' value={ticketData.seattype} onChange={classchange} disabled={passengerCountDisabled} required>
                                    <option value='f'>First Class</option>
                                    <option value='b' >Business Class</option>
                                    <option value='e'>Economy Class</option>
                                </Form.Select>
                                <br />
                                <SeatPicker rows={rows} onSelectedSeatsChange={handleSelectedSeats} disabled={disabled} />
                                {/* <Form.Label>Number of seats</Form.Label>
                                <Form.Control type="number" min="1" name="passengersCount" value={ticketData.passengersCount} onChange={onChange} disabled={passengerCountDisabled} isInvalid={formFailure} required />
                                <Form.Control.Feedback type="invalid">
                                    {formFailure}
                                </Form.Control.Feedback> */}
                            </Form.Group>
                            <ListGroup as="ul">
                                {renderInputFields()}
                            </ListGroup>
                            {
                                (passengerCountDisabled) ?
                                    <Button variant="primary" type="submit" style={{ background: "#009999" }}>Book</Button>
                                    : <Button variant="primary" onClick={addPassengers} style={{ background: "#009999" }} disabled={buttondisabled}>Add passengers</Button>
                            }
                        </Form>
                    </Col>
                </Row>
            </Container>

            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Payment
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><b>No. of Seats </b> {ticketData.passengersCount}</p>
                    <p><b>Fare </b>{ticketData.fare}</p>
                    <p><b>Total amount </b>{ticketData.amount}</p>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} style={{ background: "#009999" }}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={pay} style={{ background: "#009999" }}>
                        Pay
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default TicketForm;