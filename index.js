const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
dotenv.config()
const {UserModel} = require('./UserSchema')

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.json())

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("Connected to MongoDB"))
.catch(error=>console.error(error))

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});


// Register Endpoint
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Check if all fields are provided
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user in database
    const newUser = new UserModel({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

 

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
