const db = require('../config/db');

class Store {
    static async findByEmail(email) {
        const [rows] = await db.query('SELECT id FROM stores WHERE email = ?', [email]);
        return rows[0];
    }

    static async create({ name, email, address, owner_id }) {
        const [result] = await db.query(
            'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
            [name, email, address, owner_id || null]
        );
        return result.insertId;
    }

    static async countAll() {
        const [rows] = await db.query('SELECT COUNT(*) as count FROM stores');
        return rows[0].count;
    }

    static async getAllForAdmin(search, sortBy, order) {
        let query = `
            SELECT s.id, s.name, s.email, s.address, 
            COALESCE(AVG(r.rating), 0) as rating 
            FROM stores s 
            LEFT JOIN ratings r ON s.id = r.store_id 
            WHERE 1=1
        `;
        let params = [];

        if (search) {
            query += ` AND (s.name LIKE ? OR s.email LIKE ? OR s.address LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        query += ` GROUP BY s.id`;

        const validSortFields = ['name', 'email', 'address', 'rating'];
        const sortField = validSortFields.includes(sortBy) ? (sortBy === 'rating' ? 'rating' : `s.${sortBy}`) : 's.name';
        const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        query += ` ORDER BY ${sortField} ${sortOrder}`;

        const [rows] = await db.query(query, params);
        return rows;
    }

    static async getAllForUser(userId, search, sortBy, order) {
        let query = `
            SELECT s.id, s.name, s.address, 
            COALESCE((SELECT AVG(rating) FROM ratings WHERE store_id = s.id), 0) as overall_rating,
            (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = ?) as user_rating
            FROM stores s WHERE 1=1
        `;
        let params = [userId];

        if (search) {
            query += ` AND (s.name LIKE ? OR s.address LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        const validSortFields = ['name', 'address', 'overall_rating'];
        const sortField = validSortFields.includes(sortBy) ? (sortBy === 'overall_rating' ? 'overall_rating' : `s.${sortBy}`) : 's.name';
        const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        query += ` ORDER BY ${sortField} ${sortOrder}`;

        const [rows] = await db.query(query, params);
        return rows;
    }

    static async findByOwnerId(ownerId) {
        const [rows] = await db.query('SELECT * FROM stores WHERE owner_id = ?', [ownerId]);
        return rows[0];
    }
}

module.exports = Store;
