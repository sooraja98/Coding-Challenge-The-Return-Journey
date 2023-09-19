const ipinfo = require('ipinfo');
const createError = require('../customerror/createError');
const validateIP = async (req, res, next) => {
  try {
    const userIP = req.ip; // using a middleware like express-ip to extract the user's IP
  
    // Use ipinfo to get information about the user's IP
    const ipDetails = await new Promise((resolve, reject) => {
      ipinfo(userIP, (err, details) => {
        if (err) {
          reject(err);
        } else {
          resolve(details);
        }
      });
    });

    // Check if the user's IP meets your validation criteria
    const allowedCountries = ['US', 'CA','IN']; // Replace with your allowed countries
    if (!allowedCountries.includes(ipDetails.country)) {
      return next(createError(403, 'Access denied. Invalid IP address. You cannot access the website from this country.'));
    }
    next();
  } catch (error) {
     next(error);
  }
};

module.exports = validateIP;
