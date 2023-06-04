import React, { useState } from 'react';
import baseurl from './config';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';


const Login = () => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });
    const [formFailure, setFormFailure] = useState('');

    const onChange = (event) => {
        setLoginData({
            ...loginData,
            [event.target.name]: event.target.value,
        });
        setFormFailure('');
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const errors = validateFormFields();
        if (errors && Object.keys(errors).length > 0) {
            setFormFailure(errors);
        } else {
            fetch(`${baseurl}/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(loginData)
            }).then(response => {
                if(response.ok) {
                console.log("Logged In successfully!!")
                window.location.replace('/')
                } else {
                    alert("Login failed")
                }
            });

        }
        console.log(loginData);
    };

    const validateFormFields = () => {
        let errors = {};

        if(!loginData.email) {
            errors.email = "Email cannot be empty"
        }

        if(!loginData.password) {
            errors.password = "Password cannot be empty"
        }

        return errors;
    }


    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <h1>Login</h1>
                    <Form onSubmit={onSubmit}>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column >
                                Email
                            </Form.Label>
                            <Col sm="12">
                                <Form.Control type="email" name="email" placeholder="Email" value={loginData.email}
                                    onChange={onChange}  isInvalid={formFailure.email}/>
                                <Form.Control.Feedback type="invalid">
                                    {formFailure.email}
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column >
                                Password
                            </Form.Label>
                            <Col sm="12">
                                <Form.Control type="password" name="password" placeholder="Password" value={loginData.password}
                                    onChange={onChange} isInvalid={formFailure.password} />
                                <Form.Control.Feedback type="invalid">
                                    {formFailure.password}
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                        <Container>
                            <Row>
                                <Col> <Button variant="primary" type="submit">
                                    Login
                                </Button></Col>
                                <Col><a href="/signup">SignUp</a></Col>
                            </Row>
                        </Container>

                    </Form>
                </Col>
            </Row>

        </Container>

    );
}

export default Login;