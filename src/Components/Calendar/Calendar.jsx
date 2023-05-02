import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

export const Calendar = () => {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <DatePicker
      showIcon
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      popperPlacement="top"
    />
  );
};

