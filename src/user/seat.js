import React, { useState,useEffect } from "react";
import "./seatbooking.css";

function SeatPicker({ rows, onSelectedSeatsChange,disabled}) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (rowIndex, seatIndex,seatId) => {
    if (disabled) {
      return;
    }
    const seat = rows[rowIndex][seatIndex];

    if (seat.isReserved) {
      return; 
    }

    const isSelected = selectedSeats.includes(seatId);

    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };
  useEffect(() => {
    onSelectedSeatsChange(selectedSeats);
  }, [selectedSeats, onSelectedSeatsChange]);

  return (
    <div className="seat-picker">
      {
        (rows.length>0)?((rows.map((row, rowIndex) => (
          <div className="seat-picker__row" key={rowIndex}>
            <div className="seat-picker__row__seats">
              {row.map((seat, seatIndex) => (
                <div
                  key={seatIndex}
                  className={`seat ${seat.isReserved ? "seat--reserved" : ""} ${
                    selectedSeats.includes(`${seat.number}`)
                      ? "seat--selected"
                      : ""
                  }`}
                  onClick={() => toggleSeat(rowIndex, seatIndex,seat.number)}
                >
                  {seat.number}
                </div>
              ))}
            </div>
          </div>
        )))):(<div>No seats available for this class</div>)
      }
    </div>
  );
}

// function App() {
//   const rows = [
//     [
//       { number: 1 },
//       { number: 2 },
//       { number: 3, isReserved: true },
//       { number: 4 },
//       { number: 5 },
//       { number: 6 },
//       { number: 7 },
//       { number: 8 },
//       { number: 9 },
//       { number: 10 }
//     ],
//     // Rest of the rows...
//   ];

//   return (
//     <div className="App">
//       <h1>Seat Picker</h1>
//       <SeatPicker rows={rows} maxReservableSeats={3} />
//     </div>
//   );
// }

export default SeatPicker;