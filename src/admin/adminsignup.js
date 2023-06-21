import { useEffect, useState } from "react";
import baseurl from "../config";
import sorry from '../sorry.gif'
import { Button } from "react-bootstrap";
import { Form,Row,Col,Container } from "react-bootstrap";
import '../index.css'
function AdminSignup() {
    const [formFailure, setFormFailure] = useState('');
    const [signUpValues, setSignUpValues] = useState(
        {
            uid:'',
            fname: '',
            lname: '',
            password: '',
            conPassword: '',
            phoneno: '',
            address: '',
            usertype: 'user'
        }
    );

    
    const validateFormFields = () => {
        console.log("here1");
        let errors = {};

        if (!signUpValues.fname) {
            console.log("here1");
            errors.fname = "First name cannot be empty"
        }

        if (!signUpValues.password) {
            errors.password = "Password cannot be empty"
        }
        if (!signUpValues.conPassword) {
            errors.conpassword = "Confirm Password cannot be empty"
        }
        if (!signUpValues.phoneno) {
            errors.phoneno = "Phone Number cannot be empty"
        }
        if (signUpValues.phoneno.length > 10 || signUpValues.phoneno.length < 10) {
            errors.phoneno = "Phone Number must be of length 10"
        }
        if (!signUpValues.address) {
            errors.address = "Address cannot be empty"
        }
        const uppercaseRegExp = /(?=.*?[A-Z])/;
        const lowercaseRegExp = /(?=.*?[a-z])/;
        const digitsRegExp = /(?=.*?[0-9])/;
        const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
        const minLengthRegExp = /.{8,}/;
        const uppercasePassword = uppercaseRegExp.test(signUpValues.password);
        const lowercasePassword = lowercaseRegExp.test(signUpValues.password);
        const digitsPassword = digitsRegExp.test(signUpValues.password);
        const specialCharPassword = specialCharRegExp.test(signUpValues.password);
        const minLengthPassword = minLengthRegExp.test(signUpValues.password);
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



        if (signUpValues.password !== signUpValues.conPassword) {
            errors.password = "Password and confirm password must be true"
        }


        return errors;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("submit");
        const errors = validateFormFields();
        if (errors && Object.keys(errors).length > 0) {
            setFormFailure(errors);
        } else {

            console.log(signUpValues)
            fetch(`${baseurl}/user/updateadmin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(signUpValues)
            })
                .then(response => response.json())
                .then(data => {
                    alert("Signed Up Successfully, Please login to use BookNPack");
                    window.location.replace('/adminlogin');
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }

    const handleChange = (e) => {

        setSignUpValues({
            ...signUpValues,
            [e.target.name]: e.target.value
        })

    }
    const [verified, setverified] = useState(false);
    const checktoken = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');
        const response = await fetch(
            `${baseurl}/user/checktoken/${token}`,
            {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            }
        ).then((response) => response.json());
        if (response.data.length > 0) {
            setverified(true)
            signUpValues.uid=response.data[0].uid;
            signUpValues.fname=response.data[0].fname;
            signUpValues.lname=response.data[0].lname;
        }
    }
    useEffect(() => {
        checktoken();
    }, []);
    return (
        <div>
            {
                ((verified) ? (<div>
                    <div className="cont">
                        <br></br>
                        <Container>
                            <Row className="justify-content-center">
                                <Col xs={12} sm={8} md={6} lg={4} style={{
                                    background: "white", borderRadius: '10px',
                                    padding: '10px'
                                }}>
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>First Name</Form.Label>
                                            <Col sm="12">
                                                <Form.Control type="text" placeholder="First Name" name="fname" value={signUpValues.fname} onChange={handleChange} isInvalid={formFailure.fname} />
                                                <Form.Control.Feedback type="invalid">
                                                    {formFailure.fname}
                                                </Form.Control.Feedback>
                                            </Col>
                                            <br></br>
                                            <Form.Label>Last Name</Form.Label>
                                            <Col sm="12">
                                                <Form.Control type="text" placeholder="Last Name" name="lname" value={signUpValues.lname} onChange={handleChange} />
                                            </Col>
                                            <br></br>
                                            <Form.Label>Password</Form.Label>
                                            <Col sm="12">
                                                <Form.Control type="password" placeholder="Enter Password" name="password" value={signUpValues.password} onChange={handleChange} isInvalid={formFailure.password} />
                                                <Form.Control.Feedback type="invalid">
                                                    {formFailure.password}
                                                </Form.Control.Feedback>
                                            </Col>
                                            <br></br>
                                            <Form.Label>Confirm Password</Form.Label>
                                            <Col sm="12">
                                                <Form.Control type="password" placeholder="Confirm Password" name="conPassword" value={signUpValues.conPassword}
                                                    isInvalid={formFailure.conPassword} onChange={handleChange} />
                                                <Form.Control.Feedback type="invalid">
                                                    {formFailure.conpassword}
                                                </Form.Control.Feedback>
                                            </Col>
                                            <br></br>
                                            <Form.Label>Phone Number</Form.Label>
                                            <Col sm="12">
                                                <Form.Control type="text" placeholder="Phone Number" name="phoneno" value={signUpValues.phoneno} onChange={handleChange} isInvalid={formFailure.phoneno} />
                                                <Form.Control.Feedback type="invalid">
                                                    {formFailure.phoneno}
                                                </Form.Control.Feedback>
                                            </Col>
                                            <br></br>
                                            <Form.Label>Address</Form.Label>
                                            <Col sm="12">
                                                <Form.Control as="textarea" name="address" onChange={handleChange} value={signUpValues.address} rows={3} isInvalid={formFailure.address} />
                                                <Form.Control.Feedback type="invalid">
                                                    {formFailure.address}
                                                </Form.Control.Feedback>
                                            </Col>
                                        </Form.Group>
                                        <Button type="submit" style={{ background: "#009999" }} >Sign Up</Button>
                                    </Form>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </div>) :
                    (<div className="image-container"><img src={sorry} className="aligned-image" /><br /><h5>Invalid Request</h5></div>))
            }
        </div>
    )
}
export default AdminSignup;