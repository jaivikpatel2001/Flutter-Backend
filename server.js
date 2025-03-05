const express = require("express");
const connectDB = require("./config/db");
const checkSeederStatus = require("./utils/checkSeederStatus"); // Import the function
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();
connectDB();

// Run the seeder check
checkSeederStatus();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/permissions", require("./routes/permissionRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
