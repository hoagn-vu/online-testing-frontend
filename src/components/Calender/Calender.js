import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function MyCalendar() {
  const [date, setDate] = useState(new Date());

  return (
    <div style={{ maxWidth: '350px', margin: 'auto' }}>
      <Calendar
        onChange={setDate}
        value={date}
        locale="vi-VN"
      />
      {/* <p>Ngày bạn chọn: {date.toLocaleDateString('vi-VN')}</p> */}
    </div>
  );
}

export default MyCalendar;
