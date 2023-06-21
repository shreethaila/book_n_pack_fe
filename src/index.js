import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';
import Login from './loginpage';
import User from './user/home';
import Booking from './user/mybookings';
import Book from './user/book'
import Addflight from './admin/addflight';
import reportWebVitals from './reportWebVitals';
import Home from './user/home'
import Seat from './user/seat'
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from './user/profile'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App/>
    //  <Seat/>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();