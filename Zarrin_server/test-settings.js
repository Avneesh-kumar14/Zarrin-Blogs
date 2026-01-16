require('dotenv').config({quiet:true});
try {
  console.log('Loading settings controller...');
  const settings = require('./controllers/settings');
  console.log('Settings loaded:', Object.keys(settings));
} catch(e) {
  console.error('Error:', e.message);
  console.error('Stack:', e.stack);
}
