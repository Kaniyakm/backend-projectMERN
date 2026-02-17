// backend/utils/generateToken.js
/*
  PHASE 1 — JWT GENERATOR
  - Used in login/register
*/
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

module.exports = generateToken;  // ← single export, no refresh token