const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const env = require("dotenv");
const path = require("path");
const cors = require("cors");
const app = express();

//call routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

//env config
env.config();

//connected to mongodb
mongoose
  .connect(
    "mongodb+srv://" +
      process.env.DB_USER +
      ":" +
      process.env.DB_PW +
      "@cluster0.hajwu.mongodb.net/" +
      process.env.DB_NAME +
      "?retryWrites=true&w=majority",
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Database connected"))
  .catch((error) => console.log(error));

app.use(morgan("dev"));
app.use(cors());
app.use(express.json({}));
app.use("/images", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
