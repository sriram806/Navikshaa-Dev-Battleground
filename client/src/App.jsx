import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'https://schedulepro-rphx.onrender.com'; // http://localhost:5000

function App() {
  const [slots, setSlots] = useState([]);
  const [name, setName] = useState('');

  const fetchSlots = async () => {
    const res = await axios.get(`${API}/slots`);
    setSlots(res.data);
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const bookSlot = async (time) => {
    if (!name.trim()) return alert('Please enter your name');
    try {
      await axios.post(`${API}/book`, { time, name });
      fetchSlots();
    } catch {
      alert('Slot already booked');
    }
  };

  const cancelSlot = async (time) => {
    try {
      await axios.post(`${API}/cancel`, { time });
      fetchSlots();
    } catch {
      alert('Unable to cancel');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">Schedulo Lite Smart Session Booking MVP</h1>
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-medium">Your Name</label>
          <input
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {slots.map(slot => (
            <div
              key={slot.time}
              className={`p-4 rounded-lg shadow transition-all ${
                slot.booked ? 'bg-red-50 border border-red-300' : 'bg-green-50 border border-green-300'
              }`}
            >
              <h2 className="text-lg font-semibold text-gray-800">{slot.time}</h2>
              <p className="text-sm mb-3 text-gray-600">
                Status: {slot.booked ? (
                  <span className="text-red-500 font-medium">Booked by {slot.name}</span>
                ) : (
                  <span className="text-green-600 font-medium">Available</span>
                )}
              </p>

              {slot.booked ? (
                <button
                  className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
                  onClick={() => cancelSlot(slot.time)}
                >
                  Cancel Booking
                </button>
              ) : (
                <button
                  className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-md transition"
                  onClick={() => bookSlot(slot.time)}
                >
                  Book Slot
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;