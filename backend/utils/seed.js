const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function seed() {
    try {
        console.log('Seeding initial admin user...');
        const hashedPassword = await bcrypt.hash('Admin@123', 10);

        await db.query(
            `INSERT INTO users (name, email, password, address, role) 
             VALUES (?, ?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE id=id`,
            ['System Administrator Account', 'admin@storeplatform.com', hashedPassword, '123 Admin Headquarters Street, Tech City', 'admin']
        );

        console.log('Seed completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
