import express from "express";

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  // Empty up all the cookies from users browser
  req.session = null;
  res.send({});
});

export { router as signoutRouter };