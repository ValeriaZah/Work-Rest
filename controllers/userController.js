const { users } = require('../DataStore');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { firstName, lastName, email, password, age } = req.body;

  if (password.length < 8 || !password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
    return res.status(400).send("Password must be at least 8 characters long, include at least one number, one uppercase and one lowercase letter.");
  }

  const duplicate = users.find(user => user.email === email);
  if (duplicate) return res.status(409).send("Email already registered.");

  const hashedPassword = await bcrypt.hash(password, 8);
  const newUser = { id: users.length + 1, firstName, lastName, email, password: hashedPassword, age };
  users.push(newUser);
  const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.status(201).send({ token });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(user => user.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send("Authentication failed.");
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.send({ token });
};
