
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import baseurl from '../config';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Form } from 'react-bootstrap';
export default function ProfilePage() {
    const [show, setShow] = useState(false);
    const [showuser, setShowuser] = useState(false);
    const [formFailure, setFormFailure] = useState('');
    const [userformFailure, setuserFormFailure] = useState('');
    const [passvalue, setpassvalue] = useState(
        {
            oldpassword: '',
            password: '',
            conpassword: ''
        }
    );
    const handleClose = () => {
        setShow(false);
        setFormFailure('');
        setpassvalue({
            ...passvalue,
            oldpassword: '',
            password: '',
            conpassword: ''
        })
    }
    const [userdetail, setUserdetail] = useState([]);
    const [userFormdetail, setuserFormdetail] = useState([]);
    const getApiData = async () => {
        const response = await fetch(
            `${baseurl}/user/getuserdetails`,
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            }
        ).then((response) => response.json());
        // console.log(response.data);
        setUserdetail(response.data[0]);
        setuserFormdetail(response.data[0]);
    };
    useEffect(() => {
        getApiData();
    }, []);
    const handleShow = () => {
        setShow(true);
    }
    const handleShowuser = () => {
        setShowuser(true);
    }
    const handleCloseuser = () => {
        setShowuser(false);
    }



    const validateFormFields = () => {
        console.log("here1");
        let errors = {};
        if (!passvalue.oldpassword) {
            errors.oldpassword = "Old Password cannot be empty"
        }

        if (!passvalue.password) {
            errors.password = "New Password cannot be empty"
        }
        if (!passvalue.conpassword) {
            errors.conpassword = "Confirm Password cannot be empty"
        }

        const uppercaseRegExp = /(?=.*?[A-Z])/;
        const lowercaseRegExp = /(?=.*?[a-z])/;
        const digitsRegExp = /(?=.*?[0-9])/;
        const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
        const minLengthRegExp = /.{8,}/;
        const uppercasePassword = uppercaseRegExp.test(passvalue.password);
        const lowercasePassword = lowercaseRegExp.test(passvalue.password);
        const digitsPassword = digitsRegExp.test(passvalue.password);
        const specialCharPassword = specialCharRegExp.test(passvalue.password);
        const minLengthPassword = minLengthRegExp.test(passvalue.password);
        if (!uppercasePassword) {
            errors.password = "At least one Uppercase";
        } else if (!lowercasePassword) {
            errors.password = "At least one Lowercase";
        } else if (!digitsPassword) {
            errors.password = "At least one digit";
        } else if (!specialCharPassword) {
            errors.password = "At least one Special Characters";
        } else if (!minLengthPassword) {
            errors.password = "At least minumum 8 characters";
        }




        if (passvalue.password !== passvalue.conpassword) {
            errors.password = "Password and confirm password must be same"
        }


        return errors;
    }

    const changepass = (e) => {
        e.preventDefault();
        console.log("submit");
        const errors = validateFormFields();
        if (errors && Object.keys(errors).length > 0) {
            setFormFailure(errors);
        } else {
            setFormFailure('');
            console.log(passvalue);

            fetch(`${baseurl}/user/changepassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(passvalue)
            }).then(async response => {
                response = await response.json();
                console.log(response);
                if (response.data.result == 'password changed') {
                    handleClose();
                    alert("Password Changed Successfully");
                } else {
                    handleClose();
                    alert("Old Password is Incorrect");
                }
            })
        }
    }

    const handleChange = (e) => {

        setpassvalue({
            ...passvalue,
            [e.target.name]: e.target.value
        })

    }
    const handleChangeuser = (e) => {

        setuserFormdetail({
            ...userFormdetail,
            [e.target.name]: e.target.value
        })

    }
    const validateuserdetails = () => {
        
        let errors = {};
    
        if (!userFormdetail.fname) {
          console.log("here1");
          errors.fname = "First name cannot be empty"
        }
    
        if (!userFormdetail.email) {
          errors.email = "Email cannot be empty"
        }
        if (!userFormdetail.phoneno) {
          errors.phoneno = "Phone Number cannot be empty"
        }
        if (userFormdetail.phoneno.length>10 || userFormdetail.phoneno.length<10){
          errors.phoneno ="Phone Number must be of length 10"
        }
        if (!userFormdetail.address) {
          errors.address = "Address cannot be empty"
        }
    
        return errors;
      }

      const changeprofile = (e) => {
        e.preventDefault();
        const errors = validateuserdetails();
        if (errors && Object.keys(errors).length > 0) {
            setuserFormFailure(errors);
        } else {
            setuserFormFailure('');
            console.log(userFormdetail);

            fetch(`${baseurl}/user/updateprofile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(userFormdetail)
            }).then(async response => {
                response = await response.json();
                console.log(response);
                if (response.success==1) {
                    handleCloseuser();
                    alert("Profile updated successfully");
                    window.location.replace('/profile');
                } else {
                    handleCloseuser();
                    alert("Profile can't updated");
                }
            })
        }
    }
    return (
        <section style={{ backgroundColor: '#eee' }}>
            <Container className="py-5">
                <Row>
                    <Col lg="4">
                        <Card className="mb-4">
                            <Card.Body className="text-center">
                                <Card.Img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/800px-User_icon_2.svg.png"
                                    className="rounded-circle"
                                    style={{ width: '150px' }}
                                    fluid
                                />
                                <p className="text-muted mb-1">{userdetail.fname} {userdetail.lname}</p>
                                <p className="text-muted mb-4">{userdetail.address}</p>
                                <div className="d-flex justify-content-center mb-2">
                                    <Button style={{ background: "#009999" }} onClick={() => handleShowuser()}>Edit</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg="8">
                        <Card className="mb-4">
                            <Card.Body>
                                <Card.Title>Person Details</Card.Title>
                                <br />
                                <Row>
                                    <Col sm="3">
                                        <p>First Name</p>
                                    </Col>
                                    <Col sm="9">
                                        <p className="text-muted">{userdetail.fname}</p>
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="3">
                                        <p>Last Name</p>
                                    </Col>
                                    <Col sm="9">
                                        <p className="text-muted">{userdetail.lname}</p>
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="3">
                                        <p>Email</p>
                                    </Col>
                                    <Col sm="9">
                                        <p className="text-muted">{userdetail.email}</p>
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="3">
                                        <p>Phone no</p>
                                    </Col>
                                    <Col sm="9">
                                        <p className="text-muted">{userdetail.phoneno}</p>
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="3">
                                        <p>Address</p>
                                    </Col>
                                    <Col sm="9">
                                        <p className="text-muted">{userdetail.address}</p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        <Card className="mb-4">
                            <Card.Body>
                                <Card.Title>Login Details</Card.Title>
                                <br />
                                <Row>
                                    <Col sm="3">
                                        <p>Email</p>
                                    </Col>
                                    <Col sm="9">
                                        <p className="text-muted">{userdetail.email}</p>
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm="3">
                                        <p>Password</p>
                                    </Col>
                                    <Col sm="9">
                                        <p className="text-muted" style={{ display: 'flex', justifyContent: 'space-between' }}><span>*****</span><span><Link onClick={() => handleShow()}>Change Password?</Link></span></p>
                                    </Col>
                                </Row>

                            </Card.Body>
                        </Card>


                    </Col>
                </Row>
            </Container>

            <Modal
                show={show}
                onHide={handleClose}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Change Password?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row className="justify-content-md-center">
                            <Col md="auto" style={{
                                background: "white", borderRadius: '20px',
                                padding: '20px'
                            }}>
                                <Form>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column >
                                            Old Password<span className="required">*</span>
                                        </Form.Label>
                                        <Col sm="12">
                                            <Form.Control type="password" name="oldpassword" placeholder="Old Password" value={passvalue.oldpassword} onChange={handleChange} isInvalid={formFailure.oldpassword}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formFailure.oldpassword}
                                            </Form.Control.Feedback>

                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column >
                                            New Password<span className="required">*</span>
                                        </Form.Label>
                                        <Col sm="12">
                                            <Form.Control type="password" name="password" placeholder="New Password" value={passvalue.password} onChange={handleChange} isInvalid={formFailure.password}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formFailure.password}
                                            </Form.Control.Feedback>

                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column >
                                            Confirm Password<span className="required">*</span>
                                        </Form.Label>
                                        <Col sm="12">
                                            <Form.Control type="password" name="conpassword" placeholder="Confirm Password" value={passvalue.conpassword} onChange={handleChange} isInvalid={formFailure.conpassword}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formFailure.conpassword}
                                            </Form.Control.Feedback>

                                        </Col>
                                    </Form.Group>
                                    <Container>
                                    </Container>

                                </Form>
                            </Col>
                        </Row>

                    </Container>


                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} style={{ background: "#009999" }}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={changepass} style={{ background: "#009999" }}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showuser}
                onHide={handleCloseuser}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Profile Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <Container>
                        <Row className="justify-content-md-center">
                            <Col md="auto" style={{
                                background: "white", borderRadius: '20px',
                                padding: '20px'
                            }}>
                            
                            </Col>
                        </Row>

                    </Container> */}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name<span className="required">*</span></Form.Label>
                            <Col sm="12">
                                <Form.Control type="text" placeholder="First Name" name="fname" value={userFormdetail.fname} onChange={handleChangeuser} isInvalid={userformFailure.fname} />
                                <Form.Control.Feedback type="invalid">
                                    {userformFailure.fname}
                                </Form.Control.Feedback>
                            </Col>
                            <br></br>
                            <Form.Label>Last Name</Form.Label>
                            <Col sm="12">
                                <Form.Control type="text" placeholder="Last Name" name="lname" value={userFormdetail.lname} onChange={handleChangeuser} />
                            </Col>
                            <br></br>
                            <Form.Label>Email address<span className="required">*</span></Form.Label>
                            <Col sm="12">
                                <Form.Control type="email" placeholder="name@example.com" name="email" value={userFormdetail.email} onChange={handleChangeuser} isInvalid={userformFailure.email} />
                                <Form.Control.Feedback type="invalid">
                                    {userformFailure.email}

                                </Form.Control.Feedback>
                            </Col>
                            <br></br>
                            <Form.Label>Phone Number<span className="required">*</span></Form.Label>
                            <Col sm="12">
                                <Form.Control type="text" placeholder="Phone Number" name="phoneno" value={userFormdetail.phoneno} onChange={handleChangeuser} isInvalid={userformFailure.phoneno} />
                                <Form.Control.Feedback type="invalid">
                                    {userformFailure.phoneno}
                                </Form.Control.Feedback>
                            </Col>
                            <br></br>
                            <Form.Label>Address<span className="required">*</span></Form.Label>
                            <Col sm="12">
                                <Form.Control as="textarea" name="address" onChange={handleChangeuser} value={userFormdetail.address} rows={3} isInvalid={userformFailure.address} />
                                <Form.Control.Feedback type="invalid">
                                    {userformFailure.address}
                                </Form.Control.Feedback>
                            </Col>
                        </Form.Group>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseuser} style={{ background: "#009999" }}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={changeprofile} style={{ background: "#009999" }}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </section>
    );
}
