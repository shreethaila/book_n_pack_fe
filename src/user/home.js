import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import home from '../home.jpg'
import airport from '../airport.jpg'
// const HomePage = () => {
//   const images = [
//     require('../home.jpg'),
//     require('../airport.jpg'),
//   ];

//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const containerStyle = {
//     backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),url(${images[currentImageIndex]})`,
//     backgroundRepeat: 'no-repeat',
//     backgroundSize: 'cover',
//     backgroundPosition: 'center',
//     width: '100%',
//     height: '120vh',
//   };
//   const styles = {
//     container: {
//       position: 'absolute',
//       bottom: '10px',
//       left: '10px',
//     },
//     content: {
//       padding: '100px',
//     },
//   };
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prevIndex) =>
//         prevIndex === images.length - 1 ? 0 : prevIndex + 1
//       );
//     }, 3000); 
//     return () => clearInterval(interval); 
//   }, [images.length]);

//   return (
//     <div style={containerStyle}>
//     <div style={styles.container}>
//         <div style={styles.content}>
//         <h1>Adventure awaits! Book your flight and let the journey begin.</h1>
//       <Button>Book Now!</Button>
//         </div>
//     </div>
      
//     </div>
//   );
// };

// export default HomePage;
import Carousel from 'react-bootstrap/Carousel';

function UncontrolledExample() {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={airport}
          alt="First slide"
        />
        <Carousel.Caption>
          <h1 style={{color:'white'}}>Adventure awaits! Book your flight and let the journey begin.</h1>
          <Button style={{background:"#009999"}} href='/login'>Book Ticket</Button>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={home}
          alt="Second slide"
        />

        <Carousel.Caption>
        <h1 style={{color:'white'}}>Adventure awaits! Book your flight and let the journey begin.</h1>
          <Button style={{background:"#009999"}} href='/login'>Book Ticket</Button>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default UncontrolledExample;