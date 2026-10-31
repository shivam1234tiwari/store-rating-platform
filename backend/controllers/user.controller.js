const Store = require('../models/store.model');
const Rating = require('../models/rating.model');

exports.getStores = async (req, res) => {
    try {
        const { search, sortBy = 'name', order = 'ASC' } = req.query;
        const stores = await Store.getAllForUser(req.user.id, search, sortBy, order);
        res.json(stores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.submitRating = async (req, res) => {
    try {
        const { storeId } = req.params;
        const { rating } = req.body;
        const userId = req.user.id;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be an integer between 1 and 5.' });
        }

        await Rating.upsert(userId, storeId, rating);
        res.json({ message: 'Rating submitted/updated successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
