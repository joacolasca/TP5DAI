import pkg from 'pg';
const { Client } = pkg;
import config from '../configs/db-config.js';

export default class EventRepository {
    async getAllAsync() {
        const client = new Client(config);
        try {
            await client.connect();
            const sql = `SELECT 
                e.id, e.name, e.description, 
                json_build_object('id', el.id, 'name', el.name, 'full_address', el.full_address, 'latitude', el.latitude, 'longitude', el.longitude, 'max_capacity', el.max_capacity, 'location',
                json_build_object('id', l.id, 'name', l.name, 'latitude', l.latitude, 'longitude', l.longitude, 'max_capacity', l.max_capacity, 'province',
                json_build_object('id', p.id, 'name', p.name, 'full_name', p.full_name, 'latitude', p.latitude, 'longitude', p.longitude, 'display_order', p.display_order))) as event_location, 
                e.start_date, e.duration_in_minutes, e.price, e.enabled_for_enrollment, e.max_assistance, 
                json_build_object('id', u.id, 'username', u.username, 'first_name', u.first_name, 'last_name', u.last_name) as creator_user
                array(select json_build_object('id', t.id, 'name', t.name) from tags t inner join event_tags et on t.id = et.id_tag where et.id_event = e.id) as tags
                from events e 
                inner join event_locations el on events
                inner join locations l on event_locations
                inner join provinces p on locations
                inner join users u on events`;
            const result = await client.query(sql);
            await client.end();
            return result.rows;
        } catch (error) {
            console.log(error);
        }
    }

    async getByFilters(name, category, start_date, tag) {
        const client = new Client(config);
        try {
            await client.connect();
            let baseQuery = `
                SELECT 
                    e.id, e.name, e.description, 
                    json_build_object('id', el.id, 'name', el.name, 'full_address', el.full_address, 'latitude', el.latitude, 'longitude', el.longitude, 'max_capacity', el.max_capacity, 'location',
                    json_build_object('id', l.id, 'name', l.name, 'latitude', l.latitude, 'longitude', l.longitude, 'max_capacity', l.max_capacity, 'province',
                    json_build_object('id', p.id, 'name', p.name, 'full_name', p.full_name, 'latitude', p.latitude, 'longitude', p.longitude, 'display_order', p.display_order))) as event_location, 
                    e.start_date, e.duration_in_minutes, e.price, e.enabled_for_enrollment, e.max_assistance, 
                    json_build_object('id', u.id, 'username', u.username, 'first_name', u.first_name, 'last_name') as creator_user,
                    array(
                        SELECT json_build_object('id', t.id, 'name', t.name) 
                        FROM tags t 
                        INNER JOIN event_tags et ON t.id = et.tag_id 
                        WHERE et.id_event = e.id
                    ) as tags
                FROM events e 
                INNER JOIN event_locations el ON e.event_location_id = el.id
                INNER JOIN locations l ON el.location_id = l.id
                INNER JOIN provinces p ON l.province_id = p.id
                INNER JOIN users u ON e.creator_user_id = u.id
                WHERE 1 = 1`;
            const values = []; 
            if (name) {
                baseQuery += ` AND e.name = $${values.length + 1}`;
                values.push(name);
            }
            if (category) {
                baseQuery += `
                    AND EXISTS (
                        SELECT 1 
                        FROM event_categories ec
                        WHERE ec.event_id = e.id
                        AND ec.category_id = (
                            SELECT id 
                            FROM categories 
                            WHERE name = $${values.length + 1}
                        )
                    )
                `;
                values.push(category);
            }
            if (start_date) {
                baseQuery += ` AND e.start_date >= $${values.length + 1}`;
                values.push(start_date);
            }
            if (tag) {
                baseQuery += `
                    AND EXISTS (
                        SELECT 1 
                        FROM event_tags et
                        INNER JOIN tags t ON et.tag_id = t.id
                        WHERE et.event_id = e.id
                        AND t.name = $${values.length + 1}
                    )
                `;
                values.push(tag);
            }
            const result = await client.query(baseQuery, values);
            await client.end();
            return result.rows;
        } catch (error) {
            console.error(error);
        }
    }
    async getById(id) {
        const client = new Client(config);
        try {
            await client.connect();
            //falta hacer
            const sql = `SELECT 
                e.id, e.name, e.description, 
                json_build_object('id', el.id, 'name', el.name, 'full_address', el.full_address, 'latitude', el.latitude, 'longitude', el.longitude, 'max_capacity', el.max_capacity, 'location',
                json_build_object('id', l.id, 'name', l.name, 'latitude', l.latitude, 'longitude', l.longitude, 'max_capacity', l.max_capacity, 'province',
                json_build_object('id', p.id, 'name', p.name, 'full_name', p.full_name, 'latitude', p.latitude, 'longitude', p.longitude, 'display_order', p.display_order))) as event_location, 
                e.start_date, e.duration_in_minutes, e.price, e.enabled_for_enrollment, e.max_assistance, 
                json_build_object('id', u.id, 'username', u.username, 'first_name', u.first_name, 'last_name', u.last_name) as creator_user
                array(select json_build_object('id', t.id, 'name', t.name) from tags t inner join event_tags et on t.id = et.id_tag where et.id_event = e.id) as tags
                from events e 
                inner join event_locations el on events
                inner join locations l on event_locations
                inner join provinces p on locations
                inner join users u on events`;
            const result = await client.query(sql);
            await client.end();
            return result.rows;
        }
        catch{
            console.log(error);
        }
    }
}