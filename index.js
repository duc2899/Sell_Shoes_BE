const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./connect");
const routes = require("./routes");

require("dotenv").config();

const port = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: "*", // Chỉ cho phép các yêu cầu từ nguồn gốc này
  })
);

// Middleware để parse JSON
app.use(express.json());

// Nếu bạn đang gửi dữ liệu dưới dạng form-urlencoded:
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
