import { Row, Container, Form, Button, Col } from "react-bootstrap";
import { useState } from "react";
import baseurl from "../config";
function Addadmin() {
    const [signUpValues, setSignUpValues] = useState(
        {
            fname: '',
            lname: '',
            email: '',
            usertype: 'admin'
        }
    );
    const handleChange = (e) => {

        setSignUpValues({
            ...signUpValues,
            [e.target.name]: e.target.value
        })

    }
    const submit = (e) => {
        e.preventDefault();
        fetch(`${baseurl}/user/adminsignup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(signUpValues)
        })
            .then(response => response.json())
            .then(data => {
                alert("Admin Invitation Sent");
                window.location.replace('/addadmin');
            })
            .catch(error => {
                console.error(error);
            });
    }
    return (
        <div className="flightcont">
        <Container>
            <Row className="justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <br />
                    <Form onSubmit={submit}>
                        <Form.Group>
                            <Form.Label>First Name<span className="required">*</span></Form.Label>
                            <Form.Control
                                name='fname'
                                type="text"
                                value={signUpValues.fname}
                                onChange={handleChange}
                                placeholder="Enter First Name"
                                required
                            />
                            <br></br>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                name='lname'
                                type="text"
                                value={signUpValues.lname}
                                onChange={handleChange}
                                placeholder="Enter Last Name"
                            />
                            <br></br>
                            <Form.Label>Email<span className="required">*</span></Form.Label>
                            <Form.Control
                                name='email'
                                type="email"
                                value={signUpValues.email}
                                onChange={handleChange}
                                placeholder="Enter Email"
                                required
                            />
                            <br></br>
                            <Button variant="primary" type="submit" style={{ background: "#009999" }}>Send Invite</Button>

                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
        </div>
    )
}
export default Addadmin;