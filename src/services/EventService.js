import db from '../configs/db-config';

class EventService {
    static async getAllEvents(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const query = `
            SELECT e.id, e.name, e.description, e.event_date, e.duration, e.price, 
                   e.is_enabled, e.capacity, u.id as user_id, u.name as user_name, 
                   c.id as category_id, c.name as category_name, 
                   l.id as location_id, l.name as location_name 
            FROM events e
            JOIN users u ON e.user_id = u.id
            JOIN categories c ON e.category_id = c.id
            JOIN locations l ON e.location_id = l.id
            LIMIT $1 OFFSET $2
        `;
        const values = [limit, offset];
        
        try {
            const result = await db.query(query, values);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener eventos con paginación:', error);
            throw error;
        }
    }
}

export default EventService;