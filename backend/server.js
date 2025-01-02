const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB Connection
const db = "mongodb+srv://aspsandeep960:sk182820@car-rental.tkx4q.mongodb.net/"; // Replace with your MongoDB connection string

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Schema and Model Definitions
const Schema = mongoose.Schema;

// User schema
const UserSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobnum: { type: String },
  timeslot: { type: String },
  model: { type: String },
});

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const carSchema = new Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
});

const bookingSchema = new Schema({
  car: {
    name: String,
    price: String,
    description: String,
  },
  clientName: String,
  clientNumber: String,
  clientEmail: String,
  pickupTime: String,
  rentalDays: Number,
  paymentMode: String,
  totalPrice: Number,
});

// Models
const User = mongoose.model("User", UserSchema);
const Contact = mongoose.model("Contact", contactSchema);
const Car = mongoose.model("Car", carSchema);
const Booking = mongoose.model("Booking", bookingSchema);

// Routes
app.post("/api/users/book", async (req, res) => {
  const { firstname, lastname, email, mobnum, timeslot, model } = req.body;
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: "Booking successful", newUser });
  } catch (err) {
    console.error("Error booking car:", err);
    res.status(500).send("Error booking car");
  }
});

app.get("/api/users/book", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.error("Error retrieving users:", err);
    res.status(500).send("Error retrieving users");
  }
});

app.post("/api/bookings", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: "Booking saved successfully!" });
  } catch (err) {
    console.error("Error saving booking:", err);
    res.status(500).json({ message: "Error saving booking data" });
  }
});

app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(200).json({ message: "Message sent and saved successfully!" });
  } catch (err) {
    console.error("Error saving contact message:", err);
    res.status(500).json({ message: "Error saving message to database." });
  }
});

// Start the server
const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
