require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const path = require('path');
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'frontend'))); 

const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("client");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("DB connection error:", err);
  }
}
connectDB();

app.post("/", async (req, res) => {
  const { name,fname,dob,education,hometown,experience,position,employement,curr_salary,
          expt_salary,email,mobile
   } = req.body;

  if (!name || !fname || !dob || !education || !hometown || !experience || !position || !employement || !curr_salary || !expt_salary || !email || !mobile
  )
    return res.status(400).json({ message: "Please fill all details" });

  try {
    await db.collection("users").insertOne({
      name,
      fname,
      dob,
      education,
      hometown,
      experience,
      position,
      employement,
      curr_salary,
      expt_salary,
      email,
      mobile,
      createdAt: new Date(),
    });

    console.log("📦 Data saved:", name);

    res.json({ message: "Data saved successfully!" });

  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/employees", async (req, res) => {
  try {
    const employees = await db
      .collection("users")
      .find({})
      .sort({ createdAt: -1 }) // newest first
      .toArray();

    res.json(employees);

  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ message: "Server error" });
  }
});
app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
