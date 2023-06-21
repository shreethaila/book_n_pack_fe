import React from 'react';
import { Button } from 'react-bootstrap';
import home from '../home.jpg'
import airport from '../airport.jpg'
import Carousel from 'react-bootstrap/Carousel';
import Cookies from 'js-cookie';
function Home() {
  const userLoggedIn = Cookies.get('userLoggedIn');
  console.log(userLoggedIn);
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          style={{maxHeight:500}}
          src={airport}
          alt="Adventure awaits! Book your flight and let the journey begin."
        />
        <Carousel.Caption className='caption'>
          <h1>Adventure awaits! Book your flight and let the journey begin.</h1>
          {(userLoggedIn)?<Button style={{background:"#009999"}} href='/book'>Book Ticket</Button>:<Button style={{background:"#009999"}} href='/login'>Book Ticket</Button>}
          
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          style={{maxHeight:500}}
          src={home}
          alt="Adventure awaits! Book your flight and let the journey begin."
        />

        <Carousel.Caption className='caption'>
        <h1>Adventure awaits! Book your flight and let the journey begin.</h1>
        {(userLoggedIn)?<Button style={{background:"#009999"}} href='/book'>Book Ticket</Button>:<Button style={{background:"#009999"}} href='/login'>Book Ticket</Button>}
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default Home;