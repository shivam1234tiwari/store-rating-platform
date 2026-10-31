const validateName = (name) => typeof name === 'string' && name.length >= 20 && name.length <= 60;
const validateAddress = (address) => typeof address === 'string' && address.length <= 400;
const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
    return regex.test(password);
};
const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const validateUserInput = (req, res, next) => {
    const { name, email, password, address } = req.body;
    
    if (name && !validateName(name)) {
        return res.status(400).json({ error: 'Name must be between 20 and 60 characters.' });
    }
    if (email && !validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }
    if (password && !validatePassword(password)) {
        return res.status(400).json({ error: 'Password must be 8-16 characters long and include at least one uppercase letter and one special character.' });
    }
    if (address && !validateAddress(address)) {
        return res.status(400).json({ error: 'Address cannot exceed 400 characters.' });
    }
    next();
};

module.exports = { validateUserInput, validateName, validateAddress, validatePassword, validateEmail };
