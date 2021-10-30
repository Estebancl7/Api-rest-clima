const { Router } = require('express');
const router = Router();
const { main, webScraping, scrapingEstaciones, test, vericationStations } = require('../controllers/webscrap.controller');


router.get('/grupo-b/scrapingEstacion', scrapingEstaciones);
router.get('/grupo-b/scraping', webScraping);
router.get('/grupo-b/test', vericationStations);


module.exports = router;