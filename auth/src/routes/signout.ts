import express from "express";

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  res.send("Signed Out :)");
});

export { router as signoutRouter };