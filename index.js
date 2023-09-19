const express = require('express');
const session = require('express-session');
const expressIp = require('express-ip'); // dotenv configuring
require('dotenv').config();
const app = express();
const databaseconnect = require('./utils/databaseconnection/dataBase'); // import database connect function
databaseconnect(); // database start running
const userRouter = require('./router/userRouter');
// import userRouter router


// build in middleware function
app.use(express.json());
// Configure express-session
app.use(
    session({
      secret: process.env.SECRET_SESSION, // Change this to a strong and unique secret
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }, // Set to true if using HTTPS
    })
  );
app.use(expressIp().getIpInfoMiddleware); // This middleware extracts and adds IP info to req.ipInfo

app.use('/', userRouter);

// Error handling middle ware
app.use((error, req, res, next) => {
    const errorStatus = error.status || 500
    const errorMessage = error.message || "Backend error"
    return res.status(errorStatus).json({success: false, status: errorStatus, message: errorMessage, stack: error.stack})
})

app.listen(process.env.PORT, () => {
    console.log("Server is started on port", process.env.PORT);
});
