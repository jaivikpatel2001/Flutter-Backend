const express = require("express");
const connectDB = require("./config/db");
const createSuperadmin = require("./utils/createSuperadmin");
const cookieParser = require("cookie-parser"); // Add cookie-parser
const cors = require("cors"); // Add cors
const app = express();

require("dotenv").config();
connectDB();

// Create superadmin on server start
createSuperadmin();

app.use(cors({
  origin: 'http://localhost:5173', // Specify the allowed origin
  credentials: true // Allow credentials to be included
})); // Enable CORS

app.use(express.json());
app.use(cookieParser()); // Initialize cookie-parser

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/permissions", require("./routes/permissionRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
