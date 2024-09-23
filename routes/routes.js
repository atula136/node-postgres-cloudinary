const express = require('express');
const router = express.Router();
const imageUpload = require("./controllers/imageUpload");
const persistImage = require("./controllers/persistImage");
const retrieveImage = require("./controllers/retrieveImage");
const deleteImage = require("./controllers/deleteImage");
const updateImage = require("./controllers/updateImage");

const { pool } = require('../services/db');

router.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

router.post("/image-upload", imageUpload.imageUpload);
router.post('/persist-image', persistImage.persistImage);
router.get("/retrieve-image/:cloudinary_id", retrieveImage.retrieveImage);
router.delete("/delete-image/:cloudinary_id", deleteImage.deleteImage);
router.put("/update-image/:cloudinary_id", updateImage.updateImage);

router.get('/student', (req, res) => {
  pool.connect((err, client, done) => {
    const query = 'SELECT * FROM students';
    client.query(query, (error, result) => {
      done();
      if (error) {
        res.status(400).json({ error })
      }
      if (result.rows < '1') {
        res.status(404).send({
          status: 'Failed',
          message: 'No student information found',
        });
      } else {
        res.status(200).send({
          status: 'Successful',
          message: 'Students Information retrieved',
          students: result.rows,
        });
      }
    });
  });
});

router.post('/student', (req, res) => {
  const data = {
    name: req.body.studentName,
    age: req.body.studentAge,
    classroom: req.body.studentClass,
    parents: req.body.parentContact,
    admission: req.body.admissionDate,
  }

  pool.connect((err, client, done) => {
    const query = 'INSERT INTO students(student_name,student_age, student_class, parent_contact, admission_date) VALUES($1,$2,$3,$4,$5) RETURNING *';
    const values = [data.name, data.age, data.classroom, data.parents, data.admission];

    client.query(query, values, (error, result) => {
      done();
      if (error) {
        res.status(400).json({ error });
      }
      res.status(202).send({
        status: 'Successful',
        result: result.rows,
      });
    });
  });
});


router.get('/student/:id', (req, res) => {
  const id = req.params.id;
  pool.connect((err, client, done) => {
    const query = 'SELECT * FROM students WHERE id = $1';
    client.query(query, [id], (error, result) => {
      done();
      if (error) {
        res.status(400).json({ error })
      }
      if (result.rows < '1') {
        res.status(404).send({
          status: 'Failed',
          message: 'No student information found',
        });
      } else {
        res.status(200).send({
          status: 'Successful',
          message: 'Students Information retrieved',
          students: result.rows[0],
        });
      }
    });
  });
});

module.exports = router;