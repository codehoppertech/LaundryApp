require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const businessRoutes = require("./routes/businessRoutes");
const locationRoutes = require("./routes/locationRoutes");
const hubRoutes = require("./routes/hubRoutes");
const machineRoutes = require("./routes/machineRoutes");

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Use Routes
app.use("/api/user", userRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/hub", hubRoutes);
app.use("/api/machine", machineRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
