const db = require('../config/db');

class User {
    static async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT id, name, email, address, role FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async create({ name, email, password, address, role = 'user' }) {
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, password, address, role]
        );
        return result.insertId;
    }

    static async updatePassword(id, hashedPassword) {
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    }

    static async countAll() {
        const [rows] = await db.query('SELECT COUNT(*) as count FROM users');
        return rows[0].count;
    }

    static async getAll(search, role, sortBy, order) {
        let query = `
            SELECT u.id, u.name, u.email, u.address, u.role, 
            (SELECT AVG(r.rating) FROM ratings r JOIN stores s ON r.store_id = s.id WHERE s.owner_id = u.id) as rating 
            FROM users u WHERE 1=1
        `;
        let params = [];

        if (search) {
            query += ` AND (u.name LIKE ? OR u.email LIKE ? OR u.address LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        if (role) {
            query += ` AND u.role = ?`;
            params.push(role);
        }

        const validSortFields = ['name', 'email', 'address', 'role'];
        const sortField = validSortFields.includes(sortBy) ? `u.${sortBy}` : 'u.name';
        const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        query += ` ORDER BY ${sortField} ${sortOrder}`;

        const [rows] = await db.query(query, params);
        return rows;
    }
}

module.exports = User;
