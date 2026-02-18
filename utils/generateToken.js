// backend/utils/generateToken.js
/*
  PHASE 1 — JWT GENERATOR
  - Used in login/register
*/
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export default generateToken;
