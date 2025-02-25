const express = require("express");
const connectDB = require("./config/db");
const createSuperadmin = require("./utils/createSuperadmin");
const app = express();

require("dotenv").config();
connectDB();

// Create superadmin on server start
createSuperadmin();

app.use(express.json());

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/clubs", require("./routes/clubRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
