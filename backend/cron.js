const cron = require('node-cron');
const axios = require('axios');

// URL to call every 14 minutes
const url = 'https://atharv1599-gmail-com-cuvette-final.onrender.com';

// Schedule the cron job to run every 14 minutes
cron.schedule('*/14 * * * *', async () => {
  try {
    await axios.get(url);
  } catch (error) {
    // Handle error silently or add any necessary error handling
  }
});
