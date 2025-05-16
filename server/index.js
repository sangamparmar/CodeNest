// const cors = require('cors');
// const express = require('express');
// const mongoose = require('mongoose');
// const FormDataModel = require('./models/FormData');

// const app = express();
// app.use(express.json());
// app.use(cors());

// // MongoDB Atlas URI (with your credentials)
// const mongoURI = 'mongodb+srv://itsinstagram69:sangam27@cluster0.mongodb.net/codenest?retryWrites=true&w=majority';

// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log("Connected to MongoDB Atlas"))
//     .catch((err) => console.log("Error connecting to MongoDB Atlas: ", err));

// app.post('/register', (req, res) => {
//     // To post / insert data into database
//     const { email, password } = req.body;
//     FormDataModel.findOne({ email: email })
//         .then(user => {
//             if (user) {a
//                 res.json("Already registered");
//             } else {
//                 FormDataModel.create(req.body)
//                     .then(log_reg_form => res.json(log_reg_form))
//                     .catch(err => res.json(err));
//             }
//         })
// });

// app.post('/login', (req, res) => {
//     // To find record from the database
//     const { email, password } = req.body;
//     FormDataModel.findOne({ email: email })
//         .then(user => {
//             if (user) {
//                 // If user found then these 2 cases
//                 if (user.password === password) {
//                     res.json("Success");
//                 } else {
//                     res.json("Wrong password");
//                 }
//             }
//             // If user not found then
//             else {
//                 res.json("No records found!");
//             }
//         })
// });

// app.listen(3001, () => {
//     console.log("Server listening on http://127.0.0.1:3001");
// });
