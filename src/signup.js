import { useState } from 'react';

import { Form, FormGroup, FormControl, Dropdown } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import baseurl from './config';
function SignUp(){
    const [signUpValues, setSignUpValues] = useState(
        {
          fname: '',
          lname: '',
          email: '',
          password: '',
          conPassword: '',
          phoneno: '',
          address: ''
        }
      );
    
      const [passwordMatched, setPasswordMatched] = useState(true);
    
      const handleSubmit = (e) => {
        e.preventDefault();
        if(signUpValues.password != signUpValues.conPassword) {
          setPasswordMatched(false);
          return;
        } else {
          setPasswordMatched(true);
        }
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
    
      const handleChange = (e) => {
    
        setSignUpValues({
          ...signUpValues,
          [e.target.name]: e.target.value
        })
    
      }
    
    
      return (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" placeholder="First Name" name="fname" value={signUpValues.fname} required onChange={handleChange} />
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" placeholder="Last Name" name="lname" value={signUpValues.lname} required onChange={handleChange} />
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="name@example.com" name="email" value={signUpValues.email} required onChange={handleChange} />
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter Password" name="password" value={signUpValues.password} required onChange={handleChange} />
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" placeholder="Confirm Password" name="conPassword" value={signUpValues.conPassword}
            isInvalid={!passwordMatched} required onChange={handleChange} />
            <Form.Control.Feedback>"Password Mismatch!!"</Form.Control.Feedback>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="text" placeholder="Phone Number" name="phoneno" value={signUpValues.phoneno} required onChange={handleChange} />
    
            <Form.Label>Address</Form.Label>
            <Form.Control as="textarea" name="address" required onChange={handleChange} value={signUpValues.address} rows={3} />
          </Form.Group>
          <Button type="submit">Sign Up</Button>
        </Form>
      );
}
export default SignUp;