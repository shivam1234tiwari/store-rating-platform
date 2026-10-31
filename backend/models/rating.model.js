const db = require('../config/db');

class Rating {
    static async countAll() {
        const [rows] = await db.query('SELECT COUNT(*) as count FROM ratings');
        return rows[0].count;
    }

    static async upsert(userId, storeId, rating) {
        await db.query(
            `INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
            [userId, storeId, rating]
        );
    }

    static async getAverageForStore(storeId) {
        const [rows] = await db.query('SELECT COALESCE(AVG(rating), 0) as avg_rating FROM ratings WHERE store_id = ?', [storeId]);
        return rows[0].avg_rating;
    }

    static async getRatingsListForStore(storeId) {
        const [rows] = await db.query(`
            SELECT u.name, u.email, r.rating, r.updated_at 
            FROM ratings r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.store_id = ?
        `, [storeId]);
        return rows;
    }
}

module.exports = Rating;
