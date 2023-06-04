import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Button } from 'react-bootstrap';
import baseurl from '../config';
function TextControlsExample() {
    const [ticketData, setTicketData] = useState({
        passengersCount: ''
    });

    const [passengerCountDisabled, setPassengerCountDisabled] = useState(false);

    const [passengerData, setPassengerData] = useState([]);

    const onChange = (event) => {
        setTicketData({
            ...ticketData,
            [event.target.name]: event.target.value,
        });
    };

    const addPassengers = () => {
        renderPassengerInputs(ticketData.passengersCount)
        setPassengerCountDisabled(true)
    }

    const renderPassengerInputs = (count) => {
        const inp = [];
        for (let i = 0; i < count; i++) {
            inp[i] = {
                name: '',
                age: '',
                gender: '',
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
                        <Form.Control type="text" name="gender" value={input.gender} onChange={(event) => handleInputChange(index, event)} required />
                        <Form.Label>Proof Type</Form.Label>
                        <Form.Control type="text" name="proof_type" value={input.proof_type} onChange={(event) => handleInputChange(index, event)} required />
                        <Form.Label>Proof Id</Form.Label>
                        <Form.Control type="text" name="proof_id" value={input.proof_id} onChange={(event) => handleInputChange(index, event)} required />
                    </Form.Group>
                </ListGroup.Item>
            </div>
        ));
    };


    const submitticketbooking = (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams(window.location.search);
        const schId = queryParams.get('schid');
        //api
        fetch(`${baseurl}/booking/book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ schid: schId, booked_seats: ticketData.passengersCount })
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
        <Form onSubmit={submitticketbooking}>
            <Form.Group className="mb-3">
                <Form.Label>Number of seats</Form.Label>
                <Form.Control type="number" name="passengersCount" value={ticketData.passengersCount} onChange={onChange} disabled={passengerCountDisabled} required />
            </Form.Group>
            <ListGroup as="ul">
                {renderInputFields()}
            </ListGroup>
            {
                (passengerCountDisabled) ?
                    <Button variant="primary" type="submit">Book</Button>
                    : <Button variant="primary" onClick={addPassengers}>Add passengers</Button>
            }
        </Form>
    );
}

export default TextControlsExample;