const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user.js');

exports.register = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

exports.getUserDetails = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
        res.json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            subscriptionValidUntil: user.subscriptionValidUntil,
            restPlans: user.restPlans
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

exports.updateUserSubscription = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        user.subscriptionValidUntil = req.body.subscriptionValidUntil || user.subscriptionValidUntil;
        user.restPlans = req.body.restPlans || user.restPlans;

        await user.save();

        res.json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            subscriptionValidUntil: user.subscriptionValidUntil,
            restPlans: user.restPlans,
            token: generateToken(user._id)
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

exports.logout = asyncHandler(async (req, res) => {
    
    res.json({ message: 'Successfully logged out' });
});

function generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
}


