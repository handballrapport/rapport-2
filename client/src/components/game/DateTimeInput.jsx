import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { setHours, setMinutes } from 'date-fns';

const DateTimeInput = ({ gameData, setGameData }) => {
  const handleDateChange = (date) => {
    // Convert selected date back to ISO string format for gameData
    setGameData({ ...gameData, match_date: date.toISOString() });
  };

  const selectedDate = gameData.match_date ? new Date(gameData.match_date) : new Date();

  return (
    <div className="mb-4 w-full flex justify-center items-center space-x-2 ">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="yyyy-MM-dd HH:mm"
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3451a8]"
        popperPlacement="bottom"
        required
      />
    </div>
  );
};

export default DateTimeInput;





/* eslint-disable react/prop-types */
// import Input from "../Input";

// const DateTimeInput = ({ gameData, setGameData }) => (
//   <div className="mb-4 w-full flex justify-center items-center space-x-2">
//     <Input
//       type="date"
//       id="match_date"
//       name="match_date"
//       value={gameData.match_date.split("T")[0]}
//       onChange={(e) =>
//         setGameData({ ...gameData, match_date: e.target.value })
//       }
//       className="w-1/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3451a8]"
//       required
//     />
//     <Input
//       type="time"
//       id="match_time"
//       name="match_time"
//       value={gameData.match_date.split("T")[1]}
//       onChange={(e) =>
//         setGameData({ ...gameData, match_time: e.target.value })
//       }
//       className="w-1/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3451a8]"
//       required
//     />
//   </div>
// );

// export default DateTimeInput;

