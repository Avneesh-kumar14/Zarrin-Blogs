require('dotenv').config({quiet:true});
console.log('1. Loading readingProgressRoutes...');
const readingProgressRoutes = require('./routes/readingProgress');
console.log('   ✓ readingProgressRoutes');

console.log('2. Loading settingsRoutes...');
const settingsRoutes = require('./routes/settings');
console.log('   ✓ settingsRoutes');

console.log('3. Loading notificationsRoutes...');
const notificationsRoutes = require('./routes/notifications');
console.log('   ✓ notificationsRoutes');

console.log('\nAll routes loaded successfully!');
