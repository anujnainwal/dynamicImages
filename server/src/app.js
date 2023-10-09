const express = require("express");
const compression = require("compression");
const connectDB = require("../config/connectDb");
const crypto = require("crypto");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
var bodyParser = require("body-parser");
connectDB();

// app.use(cors({ origin: "http://localhost:3000" }));
app.use(cors({ origin: "http://16.171.3.157" }));
app.use(compression({ filter: shouldCompress, level: 6 }));

function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
}
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    parameterLimit: 50000,
    extended: true,
  })
);
app.get("/", (req, res, next) => {
  res.status(200).json({ message: "Ok" });
  next();
});
function format(seconds) {
  function pad(s) {
    return (s < 10 ? "0" : "") + s;
  }
  var hours = Math.floor(seconds / (60 * 60));
  var minutes = Math.floor((seconds % (60 * 60)) / 60);
  var seconds = Math.floor(seconds % 60);

  return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
}

app.use("/api/v1", require("../router/routes"));
app.use("/api/v1/folder", require("../router/folder.route"));

app.listen(port, () => console.log("server running " + port));
