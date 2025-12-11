import { Router } from 'express';
import { VenueController } from '../controllers/VenueController';

const venueRoutes = Router();
const venueController = new VenueController();

venueRoutes.get('/', venueController.index);
venueRoutes.get('/highlights', venueController.getHighlights);
venueRoutes.get('/:id', venueController.show);
venueRoutes.post('/', venueController.create);
venueRoutes.put('/:id', venueController.update);
venueRoutes.delete('/:id', venueController.delete);

export default venueRoutes;
