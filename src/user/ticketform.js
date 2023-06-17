import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Button, Col, Container, Row } from 'react-bootstrap';
import baseurl from '../config';
import Modal from 'react-bootstrap/Modal';
import '../index.css'
function TextControlsExample() {

    const [ticketData, setTicketData] = useState({
        passengersCount: '',
        seattype: 'f',
        fare: 0,
        amount: 0
    });


    const [occ_seats, setocc_seats] = useState(0);
    const [passengerCountDisabled, setPassengerCountDisabled] = useState(false);
    const [formFailure, setFormFailure] = useState(0);
    const [passengerData, setPassengerData] = useState([]);
    const [seat, setseat] = useState(0);
    const onChange = (event) => {
        setTicketData({
            ...ticketData,
            [event.target.name]: event.target.value,
        });
    };

    const addPassengers = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const schId = queryParams.get('schid');
        const response = await fetch(`${baseurl}/booking/occseats/${schId}/${ticketData.seattype}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then((response) => response.json());
        console.log(response.data[0].occ_seats);
        let errors;
        if (ticketData.seattype == 'f') {
            errors = await validateFormFields(response.data[0].focc, response.data[0].occ_seats);
        } else if (ticketData.seattype == 'b') {
            errors = await validateFormFields(response.data[0].bocc, response.data[0].occ_seats);
        } else if (ticketData.seattype == 'e') {
            errors = await validateFormFields(response.data[0].eocc, response.data[0].occ_seats);
        }
        if (errors && Object.keys(errors).length > 0) {
            setFormFailure(errors);
        } else {
            setFormFailure('');
            renderPassengerInputs(ticketData.passengersCount, response.data[0].occ_seats)
            setPassengerCountDisabled(true)
        }


    }

    const renderPassengerInputs = async (count, startseat) => {
        const inp = [];
        for (let i = 0; i < count; i++) {
            startseat++;
            inp[i] = {
                name: '',
                age: '',
                gender: 'male',
                proof_type: '',
                proof_id: '',
                seatno: ticketData.seattype+startseat
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
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="name" value={input.name} onChange={(event) => handleInputChange(index, event)} required />
                        <Form.Label>Age</Form.Label>
                        <Form.Control type="number" name="age" min="0" value={input.age} onChange={(event) => handleInputChange(index, event)} required />
                        <Form.Label>Gender</Form.Label>
                        {/* <Form.Control type="text" name="gender" value={input.gender} onChange={(event) => handleInputChange(index, event)} required /> */}
                        <Form.Select name='gender' value={input.gender} onChange={(event) => handleInputChange(index, event)} required>
                            <option value='male'>Male</option>
                            <option value='female' >Female</option>
                            <option value='other'>Other</option>
                        </Form.Select>
                        <Form.Label>Proof Type</Form.Label>
                        <Form.Control type="text" name="proof_type" value={input.proof_type} onChange={(event) => handleInputChange(index, event)} required />
                        <Form.Label>Proof Id</Form.Label>
                        <Form.Control type="text" name="proof_id" value={input.proof_id} onChange={(event) => handleInputChange(index, event)} required />
                    </Form.Group>
                </ListGroup.Item>
                <br></br>
            </div>
        ));
    };
    const validateFormFields = (total, occ) => {

        let errors;
        console.log(occ);
        if ((total - occ) < ticketData.passengersCount) {
            errors = `${ticketData.passengersCount} seats not available`
        }
        return errors;
    }
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
    const pay = (e) => {
        const queryParams = new URLSearchParams(window.location.search);
        const schId = queryParams.get('schid');
        fetch(`${baseurl}/booking/book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ schid: schId, booked_seats: ticketData.passengersCount,seattype:ticketData.seattype,totalamount:ticketData.amount, passenger: passengerData })
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
    return (
        <div class='cont'>
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Form onSubmit={submitticketbooking}>

                            <Form.Group className="mb-3">
                                <br></br>
                                <Form.Label>Seat Type</Form.Label>
                                <Form.Select name='seattype' value={ticketData.seattype} onChange={onChange} disabled={passengerCountDisabled} required>
                                    <option value='f'>First Class</option>
                                    <option value='b' >Business Class</option>
                                    <option value='e'>Economy Class</option>
                                </Form.Select>
                                <br />
                                <Form.Label>Number of seats</Form.Label>
                                <Form.Control type="number" min="1" name="passengersCount" value={ticketData.passengersCount} onChange={onChange} disabled={passengerCountDisabled} isInvalid={formFailure} required />
                                <Form.Control.Feedback type="invalid">
                                    {formFailure}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <ListGroup as="ul">
                                {renderInputFields()}
                            </ListGroup>
                            {
                                (passengerCountDisabled) ?
                                    <Button variant="primary" type="submit" style={{ background: "#009999" }}>Book</Button>
                                    : <Button variant="primary" onClick={addPassengers} style={{ background: "#009999" }}>Add passengers</Button>
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

export default TextControlsExample;