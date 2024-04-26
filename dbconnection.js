// To estblish database connection

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function connectToDatabase() {
    try {
        let db = await open({
            filename: './CertVault.db',
            driver: sqlite3.Database
        });
        return db;
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        throw error;
    }
}
