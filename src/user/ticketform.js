import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Button, Col, Container, Row } from 'react-bootstrap';
import baseurl from '../config';
import Modal from 'react-bootstrap/Modal';
function TextControlsExample() {

    const [ticketData, setTicketData] = useState({
        passengersCount: '',
        fare: 0,
        amount: 0
    });


    const [occ_seats, setocc_seats] = useState(0);
    const [passengerCountDisabled, setPassengerCountDisabled] = useState(false);
    const [formFailure, setFormFailure] = useState(0);
    const [passengerData, setPassengerData] = useState([]);

    const onChange = (event) => {
        setTicketData({
            ...ticketData,
            [event.target.name]: event.target.value,
        });
    };

    const addPassengers = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const schId = queryParams.get('schid');
        const response = await fetch(`${baseurl}/booking/occseats/${schId}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then((response) => response.json());
        console.log(response.data[0].occ_seats);
        await setocc_seats(response.data[0].occ_seats);
        console.log(occ_seats);
        const errors = await validateFormFields(response.data[0].occ_seats);
        if (errors && Object.keys(errors).length > 0) {
            setFormFailure(errors);
        } else {
            setFormFailure('');
            renderPassengerInputs(ticketData.passengersCount)
            setPassengerCountDisabled(true)
        }


    }

    const renderPassengerInputs = (count) => {
        const inp = [];
        for (let i = 0; i < count; i++) {
            inp[i] = {
                name: '',
                age: '',
                gender: 'male',
                proof_type: '',
                proof_id: ''
            }
        }
        setPassengerData(inp)
    };

    const handleInputChange = (index, event) => {
        const values = [...passengerData];
        values[index] = {
            ...values[index],
            [event.target.name]: event.target.value
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
                        <Form.Control type="number" name="age" value={input.age} onChange={(event) => handleInputChange(index, event)} required />
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
    const validateFormFields = (occ) => {

        let errors;
        console.log(occ);
        if ((60 - occ) < ticketData.passengersCount) {
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
        console.log(response.data[0].fare);
        setTicketData(prevTicketData => ({
            ...prevTicketData,
            fare: parseFloat(response.data[0].fare).toFixed(2),
            amount: (parseFloat(prevTicketData.passengersCount) * parseFloat(response.data[0].fare)).toFixed(2)
        }));


        console.log("submitticketbooking");
        setShow(true);



    }
    const pay = (e) => {
        const queryParams = new URLSearchParams(window.location.search);
        const schId = queryParams.get('schid');
        //api
        fetch(`${baseurl}/booking/book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ schid: schId, booked_seats: ticketData.passengersCount, passenger: passengerData })
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
        <div>
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Form onSubmit={submitticketbooking}>
                            <Form.Group className="mb-3">
                                <Form.Label>Number of seats</Form.Label>
                                <Form.Control type="number" name="passengersCount" value={ticketData.passengersCount} onChange={onChange} disabled={passengerCountDisabled} isInvalid={formFailure} required />
                                <Form.Control.Feedback type="invalid">
                                    {formFailure}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <ListGroup as="ul">
                                {renderInputFields()}
                            </ListGroup>
                            {
                                (passengerCountDisabled) ?
                                    <Button variant="primary" type="submit" onClick={handleShow}>Book</Button>
                                    : <Button variant="primary" onClick={addPassengers}>Add passengers</Button>
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
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={pay}>
                        Pay
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default TextControlsExample;