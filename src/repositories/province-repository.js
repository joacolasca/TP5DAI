import pkg from 'pg';
const { Client } = pkg;
import config from '../configs/db-config.js';

export default class ProvinceRepository {
    async getAllAsync() {
        const client = new Client(config);
        
        try {
            await client.connect();
            const sql = `SELECT * FROM provinces`;
            const result = await client.query(sql);
            await client.end();
            return result.rows;
        } catch (error) {
            console.log(error);
        }
    }

    async getByIdAsync(id) {
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT * FROM provinces WHERE id = $1`;
            const values = [id];
            const result = await client.query(sql, values);
            await client.end();
            return result.rows[0];
        } catch (error) {
            console.log(error);
        }
    }

    async createAsync(entity) {
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `INSERT INTO provinces (name, full_name, latitude, longitude, display_order) VALUES ($1, $2, $3, $4, $5)`;
            const values = [entity.name, entity.fullName, entity.latitude, entity.longitude, entity.displayOrder]
            const result = await client.query(sql, values);
            await client.end();
            return result.rowCount;
        } catch (error) {
            console.log(error);
        }
    }

    async updateAsync(entity) {
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `UPDATE provinces SET name = $1, full_name = $2, latitude = $3, longitude = $4, display_order = $5 WHERE id = $6`;
            const values = [entity.name, entity.fullName, entity.latitude, entity.longitude, entity.displayOrder]
            const result = await client.query(sql, values);
            await client.end();
            return result.rowCount;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteByIdAsync(id) {
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `DELETE FROM provinces WHERE id = $1`;
            const values = [id];
            const result = await client.query(sql, values);
            await client.end();
            return result.rowCount;
        } catch (error) {
            console.log(error);
        }
    }
}
