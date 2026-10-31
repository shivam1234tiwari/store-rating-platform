const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.register = async (req, res) => {
    try {
        const { name, email, password, address } = req.body;
        const existing = await User.findByEmail(email);
        if (existing) return res.status(400).json({ error: 'Email already registered.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword, address, role: 'user' });
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);
        if (!user) return res.status(400).json({ error: 'Invalid credentials.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials.' });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) return res.status(400).json({ error: 'New password is required.' }); 

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.updatePassword(req.user.id, hashedPassword);
        res.json({ message: 'Password updated successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
