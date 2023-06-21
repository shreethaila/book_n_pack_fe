import React, { useState, useEffect } from 'react';
import home from '../home.jpg'
import airport from '../airport.jpg'
import Carousel from 'react-bootstrap/Carousel';
function AdminHome() {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          style={{maxHeight:500}}
          src={airport}
          alt="Welcome to BookNPack Admin Portal"
        />
        <Carousel.Caption className='caption'>
          <h1>Welcome to BookNPack Admin Portal</h1>
          
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          style={{maxHeight:500}}
          src={home}
          alt="Welcome to BookNPack Admin Portal"
        />

        <Carousel.Caption className='caption'>
        <h1>Welcome to BookNPack Admin Portal</h1>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default AdminHome;