require('dotenv').config();
const { initDatabase } = require('./config/database');

initDatabase()
  .then(() => {
    console.log('✅ Database connection successful');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });
