// backend/utils/generateToken.js
/*
  PHASE 1 — JWT GENERATOR
  - Used in login/register
*/
const jwt = require('jsonwebtoken');

module.exports = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });