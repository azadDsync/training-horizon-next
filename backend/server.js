const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const trainer_router = require('./routes/trainerRoutes')
const root_router = require('./routes/index')
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3005;
app.use(cors()); 
app.use(express.json());

connectDB();

// all routes here
app.use('/api/v1' , trainer_router)
// app.use('/api/v1',rootRouter);
app.use('/api/v1',root_router);


app.listen(PORT, () => {
    console.log(`Training-Horizon is serving on port ${PORT}`);
});