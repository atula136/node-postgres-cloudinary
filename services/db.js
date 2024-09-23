const pg = require('pg');
require('dotenv').config();

// set production variable. This will be called when deployed to a live host
const isProduction = process.env.NODE_ENV === 'production';

// configuration details
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// const config = {
//   user: 'neit',
//   database: 'pg_nodejs_demo',
//   password: '12345',
//   port: 5432,
//   max: 10, // max number of clients in the pool
//   idleTimeoutMillis: 30000,
// };

// const pool = new pg.Pool(config);

// if project has been deployed, connect with the host's DATABASE_URL
// else connect with the local DATABASE_URL
const pool = new pg.Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction
    ? { rejectUnauthorized: false } // Only enforce SSL in production
    : false,
});

// display message on success if successful
pool.on('connect', () => {
  console.log('Database connected successfully!');
});

const createTables = () => {
  const schoolTable = `CREATE TABLE IF NOT EXISTS
    students(
      id SERIAL PRIMARY KEY,
      student_name VARCHAR(128) NOT NULL,
      student_age INT NOT NULL,
      student_class VARCHAR(128) NOT NULL,
      parent_contact VARCHAR(128) NOT NULL,
      admission_date VARCHAR(128) NOT NULL
    )`;

  const imageTable = `CREATE TABLE IF NOT EXISTS
    images(
      id SERIAL PRIMARY KEY,
      title VARCHAR(128) NOT NULL,
      cloudinary_id VARCHAR(128) NOT NULL,
      image_url VARCHAR(128) NOT NULL
    )`;

  // Chain the queries and close the pool only after all are executed
  pool.query(schoolTable)
    .then((res) => {
      console.log('Students table created:', res);
      return pool.query(imageTable); // Chain the next query
    })
    .then((res) => {
      console.log('Images table created:', res);
      pool.end(); // End the pool after all queries are done
    })
    .catch((err) => {
      console.log(err);
      pool.end(); // Ensure the pool is closed even on error
    });
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});


//export pool and createTables to be accessible  from an where within the application
module.exports = {
  createTables,
  pool,
};

require('make-runnable');