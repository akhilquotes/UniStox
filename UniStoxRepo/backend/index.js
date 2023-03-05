const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 5000;
// const reactBuild = path.join(__dirname, "build");

app.use(cors());
app.use(express.json());
// app.use(express.static(reactBuild));

app.use("/rapyd", require("./rapyd"));
app.use("/fantom", require("./fantom"));
// app.get("/*", async (req, res) => {
//   res.sendFile(path.join(reactBuild, "/index.html"));
// });
app.listen(port, () => {
  console.log("Listening on port", port);
});
