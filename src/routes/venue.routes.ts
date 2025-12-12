import { Router } from 'express';
import { VenueController } from '../controllers/VenueController';

const venueRoutes = Router();
const venueController = new VenueController();

/**
 * @swagger
 * tags:
 *   name: Locais
 *   description: Gerenciamento de locais para eventos
 */

/**
 * @swagger
 * /venues:
 *   get:
 *     summary: Listar todos os locais
 *     tags: [Locais]
 *     responses:
 *       200:
 *         description: Lista de locais
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Venue'
 */
venueRoutes.get('/', venueController.index);
/**
 * @swagger
 * /venues/highlights:
 *   get:
 *     summary: Listar locais em destaque
 *     tags: [Locais]
 *     responses:
 *       200:
 *         description: Lista de locais em destaque
 */venueRoutes.get('/highlights', venueController.getHighlights);
/**
 * @swagger
 * /venues/{id}:
 *   get:
 *     summary: Buscar local por ID
 *     tags: [Locais]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Dados do local
 *       404:
 *         description: Local não encontrado
 */venueRoutes.get('/:id', venueController.show);

/**
 * @swagger
 * /venues:
 *   post:
 *     summary: Criar novo local
 *     tags: [Locais]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - capacity
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               isHighlight:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               mainImage:
 *                 type: string
 *     responses:
 *       201:
 *         description: Local criado com sucesso
 */
venueRoutes.post('/', venueController.create);
venueRoutes.put('/:id', venueController.update);
venueRoutes.delete('/:id', venueController.delete);

export default venueRoutes;
