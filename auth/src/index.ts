import express from "express";

const app = express();
app.use(express.json());

app.get("/api/users/currentuser", (req, res) => {
  res.send("Current User: Ayush (GOAT)");
});

app.listen(3000, () => {
  console.log("Auth Service Listening on Port: 3000 ✅");
});