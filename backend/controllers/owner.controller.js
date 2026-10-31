const Store = require('../models/store.model');
const Rating = require('../models/rating.model');

exports.getDashboard = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const store = await Store.findByOwnerId(ownerId);
        if (!store) {
            return res.json({ store: null, average_rating: 0, ratings: [] });
        }

        const average_rating = await Rating.getAverageForStore(store.id);
        const ratings = await Rating.getRatingsListForStore(store.id);

        res.json({
            store,
            average_rating,
            ratings
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
