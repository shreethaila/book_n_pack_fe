import { useState } from 'react';

import { Form, FormGroup, FormControl, Dropdown,Col,Container,Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import baseurl from './config';
import './index.css'
function SignUp() {
  const [formFailure, setFormFailure] = useState('');
  const [signUpValues, setSignUpValues] = useState(
    {
      fname: '',
      lname: '',
      email: '',
      password: '',
      conPassword: '',
      phoneno: '',
      address: '',
      usertype:'user'
    }
  );

  const [passwordMatched, setPasswordMatched] = useState(true);

  const validateFormFields = () => {
    console.log("here1");
    let errors = {};

    if (!signUpValues.fname) {
      console.log("here1");
      errors.fname = "First name cannot be empty"
    }

    if (!signUpValues.email) {
      errors.email = "Email cannot be empty"
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
    if (signUpValues.phoneno.length>10 || signUpValues.phoneno.length<10){
      errors.phoneno ="Phone Number must be of length 10"
    }
    if (!signUpValues.address) {
      errors.address = "Address cannot be empty"
    }
    const uppercaseRegExp = /(?=.*?[A-Z])/;
    const lowercaseRegExp = /(?=.*?[a-z])/;
    const digitsRegExp = /(?=.*?[0-9])/;
    const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
    const minLengthRegExp = /.{8,}/;
    const emailaregex=/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const uppercasePassword = uppercaseRegExp.test(signUpValues.password);
    const lowercasePassword = lowercaseRegExp.test(signUpValues.password);
    const digitsPassword = digitsRegExp.test(signUpValues.password);
    const specialCharPassword = specialCharRegExp.test(signUpValues.password);
    const minLengthPassword = minLengthRegExp.test(signUpValues.password);
    const emailcheck=emailaregex.test(signUpValues.email);
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
    if (!emailcheck){
      errors.email="Enter a valid email";
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
      fetch(`${baseurl}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpValues)
      })
        .then(response => response.json())
        .then(data => {
          alert("Signed Up Successfully, Please login to use BookNPack");
          window.location.replace('/login');
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


  return (
    <div class='cont'>
    <br></br>
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4} style={{background:"white" ,borderRadius: '10px', 
        padding: '10px' }}>
        <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>First Name<span className="required">*</span></Form.Label>
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
        <Form.Label>Email address<span className="required">*</span></Form.Label>
        <Col sm="12">
        <Form.Control type="email" placeholder="name@example.com" name="email" value={signUpValues.email} onChange={handleChange} isInvalid={formFailure.email} />
        <Form.Control.Feedback type="invalid">
          {formFailure.email}
        
        </Form.Control.Feedback>
        </Col>
        <br></br>
        <Form.Label>Password<span className="required">*</span></Form.Label>
        <Col sm="12">
        <Form.Control type="password" placeholder="Enter Password" name="password" value={signUpValues.password} onChange={handleChange} isInvalid={formFailure.password} />
        <Form.Control.Feedback type="invalid">
          {formFailure.password}
        </Form.Control.Feedback>
        </Col>
        <br></br>
        <Form.Label>Confirm Password<span className="required">*</span></Form.Label>
        <Col sm="12">
        <Form.Control type="password" placeholder="Confirm Password" name="conPassword" value={signUpValues.conPassword}
          isInvalid={formFailure.conPassword} onChange={handleChange} />
        <Form.Control.Feedback type="invalid">
          {formFailure.conpassword}
        </Form.Control.Feedback>
        </Col>
        <br></br>
        <Form.Label>Phone Number<span className="required">*</span></Form.Label>
        <Col sm="12">
        <Form.Control type="text" placeholder="Phone Number" name="phoneno" value={signUpValues.phoneno} onChange={handleChange} isInvalid={formFailure.phoneno} />
        <Form.Control.Feedback type="invalid">
          {formFailure.phoneno}
        </Form.Control.Feedback>
        </Col>
        <br></br>
        <Form.Label>Address<span className="required">*</span></Form.Label>
        <Col sm="12">
        <Form.Control as="textarea" placeholder="Address" name="address" onChange={handleChange} value={signUpValues.address} rows={3} isInvalid={formFailure.address} />
        <Form.Control.Feedback type="invalid">
          {formFailure.address}
        </Form.Control.Feedback>
        </Col>
      </Form.Group>
      <Button type="submit" style={{background:"#009999"}} >Sign Up</Button>
    </Form>
        </Col>
      </Row>
    </Container>
    </div>
    
  );
}
export default SignUp;