import React, { useState, useEffect } from 'react';
import axios from "axios"
import { useParams } from 'react-router-dom';

const ChevronIcon = ({ direction = 'left' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`h-6 w-6 ${direction === 'right' ? 'transform rotate-180' : ''}`}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const Scheduletime = () => {  
  const candidate = {
    name: 'Anjali Sharma',
    role: 'Senior React Developer',
    company: 'InnovateTech Solutions',
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [timeSlots, setTimeSlots]= useState([]);
  const [uh, setUh]= useState("");

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  let {uhid}= useParams();
  useEffect(()=>{
    axios.get(`http://localhost:8000/app/hr/interviewschedule/${uhid}`,{
      withCredentials:true,
    })
    .then((res)=> {
      setTimeSlots(res.data?.interviewUh);
      setUh(res.data?.uh);
    })
    .catch(()=>{
      alert("There is problem to fetch user data");
    })
  },[])
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };


  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (newSelectedDate >= today) {
      setSelectedDate(newSelectedDate);
      setSelectedTime(''); 
    }
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;

    axios.post("http://localhost:8000/app/hr/setinterview",{
      selectedDate,
      selectedTime,
      uhid
    },{
      withCredentials:true,
    })
    .then((res)=>{
      alert(res.data?.message)
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsConfirmed(true);
      }, 1500);
    })
    .catch((err)=>{
      alert(err.data?.message)
    })

  };
  
  const handleScheduleAnother = () => {
    setIsConfirmed(false);
    setSelectedDate(null);
    setSelectedTime('');
    setCurrentDate(new Date());
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`blank-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {  
      const date = new Date(year, month, day);
      const isToday = date.getTime() === today.getTime();
      const isSelected = selectedDate && date.getTime() === selectedDate.getTime();
      const isPast = date < today;

      let classes = 'p-2 text-center rounded-full cursor-pointer transition-colors duration-200';
      if (isPast) {
        classes += ' text-gray-400 cursor-not-allowed';
      } else if (isSelected) {
        classes += ' bg-green-600 text-white font-bold shadow-md';
      } else if (isToday) {
        classes += ' bg-blue-500 text-white font-semibold';
      } else {
        classes += ' hover:bg-gray-200 text-gray-700';
      }

      calendarDays.push(
        <div key={day} className={classes} onClick={() => handleDateClick(day)}>
          {day}
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <ChevronIcon direction="left" />
          </button>
          <h3 className="text-xl font-semibold text-gray-800">
            {monthNames[month]} {year}
          </h3>
          <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <ChevronIcon direction="right" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center font-medium text-gray-500 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">{calendarDays}</div>
      </div>
    );
  };
  
  const renderTimeSlots = () => {
   

    if (!selectedDate) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg p-6">
          <p className="text-gray-500 text-lg">Please select a date to see already assigned times.</p>
        </div>
      );
    }
    
    return (
       <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Assign Interview time in <span className="text-green-600">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </h3>
            <div className="grid grid-cols-1 gap-4">
                <div>
                  <label>{`Assign a time for ${uh?.user?.name}`}
                  <input type="time" value={selectedTime} onChange={(e)=>setSelectedTime(e.target.value)} />
                  </label>
                </div>
                <div>
                  <h3>Already Assigned candidate</h3>
                  {(() => {
                    const tt = timeSlots?.filter((time) => {
                      const ti = new Date(time.interviewtime);
                      const sd = new Date(selectedDate);
                      return (
                        ti.getFullYear() === sd.getFullYear() &&
                        ti.getMonth() === sd.getMonth() &&
                        ti.getDate() === sd.getDate()
                      );
                    });

                    if (!tt || tt.length === 0) return "No Interview assigned this day";

                    return tt.map((tim) => {
                      const tl = new Date(tim?.interviewtime);
                      return (
                        <p key={tim._id}>
                          {`Interview Scheduled for ${tim?.user?.name} at ${tl.toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}`}
                        </p>
                      );
                    });
                  })()}

                </div>
            </div>
        </div>
    );
  };
  
  if (isConfirmed) {
      return (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
              <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in">
                <div className="mx-auto bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mb-6">
                    <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Interview Scheduled!</h2>
                  <p className="text-gray-600 mb-6">An invitation has been sent to your email.</p>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-left space-y-4">
                      <p><strong className="text-gray-700">Candidate:</strong> <span className="text-gray-900">{candidate.name}</span></p>
                      <p><strong className="text-gray-700">Role:</strong> <span className="text-gray-900">{candidate.role} at {candidate.company}</span></p>
                      <p><strong className="text-gray-700">Date:</strong> <span className="text-gray-900">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span></p>
                      <p><strong className="text-gray-700">Time:</strong> <span className="text-gray-900">{selectedTime}</span></p>
                  </div>

                  <button 
                      onClick={handleScheduleAnother}
                      className="mt-8 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
                      Schedule Another Interview
                  </button>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-5xl mx-auto bg-gray-50/50 rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="p-6 bg-white border-b border-gray-200">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Schedule Interview</h1>
            <p className="text-md text-gray-600 mt-1">
                With <strong className="text-blue-600">{uh?.user?.name}</strong> for the <strong>{uh?.internship?.title}</strong> role.
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 p-4 sm:p-6">
            <div>
                {renderCalendar()}
            </div>
            <div className="md:border-l md:border-gray-200 md:pl-4 lg:pl-8">
                {renderTimeSlots()}
            </div>
        </div>

        <div className="p-6 bg-white border-t border-gray-200">
            <button 
                onClick={handleConfirm} 
                disabled={!selectedDate || !selectedTime || isLoading}
                className="w-full flex items-center justify-center bg-green-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Confirming...
                    </>
                ) : (
                    'Confirm Interview'
                )}
            </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

