import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import logo from './logo.jpg'
import homeimg from './home.jpg'
import Login from './loginpage';
import Cookies from 'js-cookie';
import Book from './user/book';
import Mybookings from './user/mybookings';
import Logout from './logout';
import TicketForm from './user/ticketform';
import AdminLogin from './admin/adminlogin';
import AddFlight from './admin/addflight';
import ViewFlight from './admin/viewflight';
import ViewBooking from './admin/viewsch';
import AddSch from './admin/addsch';
import SignUp from './signup';
import baseurl from './config';
import UserHome from './user/home';
import Verify from './user/verificationpage';
import AdminSignup from './admin/adminsignup';
import { useEffect } from 'react';
import { useState } from 'react';
import Addadmin from './admin/addadmin';
function App() {
  const userLoggedIn = Cookies.get('userLoggedIn');
  console.log(userLoggedIn);
  const adminLoggedIn = Cookies.get('adminLoggedIn');
  console.log(adminLoggedIn);
  const [username, setusername] = useState('')
  const getusername = async () => {
    const response = await fetch(
      `${baseurl}/user/getname`,
      {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      }
    ).then((response) => response.json());
    console.log("here")
    console.log(response);
    setusername(response.data[0].fname)
  }
  return (
    <Router>
      <div>
        <Navbar bg="light" expand="lg">
          <Container style={{ maxWidth: '90%' }}>
            <Navbar.Brand href="#home"><img src={logo} width={100} height={80}></img></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/">Home</Nav.Link>
                {(() => {
                  if (userLoggedIn) {
                    return (
                      <Nav>
                        <Nav.Link href="/book">Book Tickets</Nav.Link>
                        <Nav.Link href="/mybookings">My Bookings</Nav.Link>
                      </Nav>
                    )
                  } else if (adminLoggedIn) {
                    return (
                      <Nav>
                        <NavDropdown title="Flight" id="basic-nav-dropdown">
                          <NavDropdown.Item href="/addflight">Add Flight</NavDropdown.Item>
                          <NavDropdown.Item href="/viewflight">
                            View Flight
                          </NavDropdown.Item>
                        </NavDropdown>
                        {/* <Nav.Link href="/addflight">Add Flights</Nav.Link> */}
                        <Nav.Link href="/addsch">Add Schedule</Nav.Link>
                        {/* <Nav.Link href="/viewflight">View Flights</Nav.Link> */}
                        <Nav.Link href="/viewbooking">View Booking</Nav.Link>
                        <Nav.Link href="/addadmin">Add Admin</Nav.Link>
                      </Nav>
                    )

                  }
                })()}

              </Nav>


              {/* {!userLoggedIn ? (<Nav><NavDropdown.Item href="/login">Login/Sign up</NavDropdown.Item><NavDropdown.Item href="/adminlogin">Admin Login</NavDropdown.Item></Nav>) : (<NavDropdown.Item href="/logout">Logout</NavDropdown.Item>)}
                   */}
              {(() => {
                if (userLoggedIn || adminLoggedIn) {
                  getusername();
                  return (

                    <Navbar.Collapse className="justify-content-end">

                      <NavDropdown title={<span>
                        <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                        <span className="ml-2">{username}</span>
                      </span>} id="nav-dropdown" className="ml-auto">
                        <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
                      </NavDropdown>
                    </Navbar.Collapse>
                  )
                } else {
                  return (<div><Navbar.Collapse className="justify-content-end">

                    <NavDropdown title={<span>
                      <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                    </span>} id="nav-dropdown" className="ml-auto"><NavDropdown.Item href="/login">Login/Sign up</NavDropdown.Item><NavDropdown.Item href="/adminlogin">Admin Login</NavDropdown.Item></NavDropdown>
                  </Navbar.Collapse></div>);
                }
              })()}
            </Navbar.Collapse>


            <style>
              {`
        .navbar-nav.ml-auto > .nav-item {
          margin-left: auto;
        }
        `}
            </style>
          </Container>
        </Navbar>
        {/* A <Switch> looks through its children <Route>s and
renders the first one that matches the current URL. */}
        <Routes>
          <Route path="login" element={<Login />} />
          <Route index element={<UserHome />} />
          <Route path="book" element={<Book />} />
          <Route path="mybookings" element={<Mybookings />} />
          <Route path="logout" element={<Logout />} />
          <Route path="ticketbook" element={<TicketForm />} />
          <Route path="adminlogin" element={<AdminLogin />} />
          <Route path="addflight" element={<AddFlight />} />
          <Route path="viewflight" element={<ViewFlight />} />
          <Route path="viewbooking" element={<ViewBooking />} />
          <Route path="addsch" element={<AddSch />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="verify" element={<Verify />} />
          <Route path="addadmin" element={<Addadmin />} />
          <Route path="admininvite" element={<AdminSignup />} />
        </Routes>
      </div>
    </Router>

    // <div>
    //   <Navbar bg="light" expand="lg">
    //     <Container>
    //       <Navbar.Brand href="#home"><img src={logo} width={100} height={80}></img></Navbar.Brand>
    //       <Navbar.Collapse id="basic-navbar-nav">
    //         <Nav className="mr-auto">
    //           <Nav.Link href="/">Home</Nav.Link>
    //         </Nav>

    //         <Nav className="ml-auto">
    //           <NavDropdown title={<FontAwesomeIcon icon={faUser}></FontAwesomeIcon>} alignRight id="nav-dropdown" className="ml-auto">
    //             <NavDropdown.Item href="/login">Login/Sign up</NavDropdown.Item>
    //           </NavDropdown>
    //         </Nav>
    //       </Navbar.Collapse>
    //       <style>
    //         {`
    //     .navbar-nav.ml-auto > .nav-item {
    //       margin-left: auto;
    //     }
    //     `}
    //       </style>
    //     </Container>
    //     <Routes>
    //     <Route path="login" element={<Login />} />
    //   </Routes>
    //   </Navbar>
    //   <Routes>
    //     <Route path="login" element={<Login />} />
    //   </Routes>
    //   <img src={homeimg} style={{ width: '100%', height: '100%' }}></img>
    // </div>
  );
}

export default App;