import express from "express";

const app = express();

const port = 4000;
app.get("/", (req, res) => {
  res.send("Hello in the Server");
});

app.listen(port, () => {
  console.log(`Urbanease backend is up and running at PORT:${port}`);
});
