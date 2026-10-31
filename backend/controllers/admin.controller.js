const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Store = require('../models/store.model');
const Rating = require('../models/rating.model');

exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countAll();
        const totalStores = await Store.countAll();
        const totalRatings = await Rating.countAll();
        res.json({ totalUsers, totalStores, totalRatings });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;
        const existing = await User.findByEmail(email);
        if (existing) return res.status(400).json({ error: 'Email already exists.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = ['admin', 'user', 'store_owner'].includes(role) ? role : 'user';

        await User.create({ name, email, password: hashedPassword, address, role: userRole });
        res.status(201).json({ message: 'User added successfully by admin.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addStore = async (req, res) => {
    try {
        const { name, email, address, owner_id } = req.body;
        const existing = await Store.findByEmail(email);
        if (existing) return res.status(400).json({ error: 'Store email already exists.' });

        await Store.create({ name, email, address, owner_id });
        res.status(201).json({ message: 'Store created successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const { search, role, sortBy = 'name', order = 'ASC' } = req.query;
        const users = await User.getAll(search, role, sortBy, order);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStores = async (req, res) => {
    try {
        const { search, sortBy = 'name', order = 'ASC' } = req.query;
        const stores = await Store.getAllForAdmin(search, sortBy, order);
        res.json(stores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
