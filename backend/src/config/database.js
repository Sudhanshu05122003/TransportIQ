const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'transportiq',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'transportiq_dev_2024',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 20,
      min: 5,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

async function initDatabase() {
  try {
    await sequelize.authenticate();
    
    // Ensure PostGIS extension is enabled
    // await sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    
    // Sync models in development (use migrations in production)

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

module.exports = { sequelize, initDatabase };
