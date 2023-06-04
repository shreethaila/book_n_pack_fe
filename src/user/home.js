import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import App from '../App';
import Book from './book';
import Mybookings from './mybookings';
class Home extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Navbar bg="light" expand="lg">
                        <Container>
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto">
                                    <Nav.Link href="/">Home</Nav.Link>
                                    <Nav.Link href="/book">Book Ticket</Nav.Link>
                                    <Nav.Link href="/mybookings">Bookings</Nav.Link>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                    {/* A <Switch> looks through its children <Route>s and
renders the first one that matches the current URL. */}
                    <Routes>
                        <Route path="book" element={<Book />}>
                        </Route>
                        <Route path="mybookings" element={<Mybookings />}>
                        </Route>
                        <Route index element={<App />} />
                    </Routes>
                </div>
            </Router>
        );
    }
}
export default Home;
