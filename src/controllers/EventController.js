import { Router } from 'express';
import EventService from '../services/EventService';

const EventController = Router();

EventController.get('/', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    
    try {
        const events = await EventService.getAllEvents(parseInt(page), parseInt(limit));
        res.json({
            events,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (error) {
        console.error('Error al obtener la lista de eventos:', error);
        res.status(500).json({ error: 'Hubo un problema al obtener la lista de eventos' });
    }
});