import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(express.json());

app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:5173',
            'https://schedulo-79bw.onrender.com',
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

const slots = Array.from({ length: 9 }, (_, i) => ({
  time: `${10 + i}:00`,
  name: '',
  booked: false,
}));

app.get('/', (req, res) => {
    res.send("Backend is Working!");
});

app.get('/slots', (req, res) => {
    res.status(200).json({success: true, message: "Data Retrived",slots});
});

app.post('/book', (req, res) => {
  const { time, name } = req.body;
  if (!time || !name) return res.status(400).json({ success:false, message:"Time and name are required"});
  const slot = slots.find(s => s.time === time);
  if (!slot) return res.status(404).json({ success: false,message: 'Slot not found' });
  if (slot.booked) return res.status(400).json({ success: false, message: 'Slot is already booked' });

  slot.booked = true;
  slot.name = name;
  
  res.status(200).json({success: true, message: "Successfully Booked your Schudele",slot});
});

app.post('/cancel', (req, res) => {
  const { time } = req.body;
  if (!time) return res.status(400).json({ success: false, message: 'Time is required' });
  const slot = slots.find(s => s.time === time);
  if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
  if (!slot.booked) return res.status(400).json({ error: 'Slot is not booked' });

  slot.booked = false;
  slot.name = null;
  
  res.status(200).json({ success: true, message: "Successfull cancel your Schudele", slot});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
