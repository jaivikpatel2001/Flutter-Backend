const express = require("express");
const connectDB = require("./config/db");
const createUsers = require("./utils/createUsers");
const createCategories = require("./utils/createCategory");
const createPermissions = require("./utils/createPermission");
const createProducts = require("./utils/createProduct");
const cookieParser = require("cookie-parser"); // Add cookie-parser
const cors = require("cors"); // Add cors
const app = express();

require("dotenv").config();
connectDB();

// Run seeders in proper order
(async () => {
  await createUsers(); // First create users
  await createCategories(); // Then create categories
  await createPermissions(); // Then create permissions
  await createProducts(); // Finally create products
})();

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
