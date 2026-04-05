const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/patients", require("./routes/patients"));
app.use("/doctors", require("./routes/doctors"));
app.use("/appointments", require("./routes/appointments"));


app.use("/rooms", require("./routes/rooms"));
app.use("/invoices", require("./routes/invoices"));


app.use("/admissions", require("./routes/admissions"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/lab-tests", require("./routes/labTests"));

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});