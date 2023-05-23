import express, { Router } from "express";
import dbconfig from "./db/dbconfig.js";
import queryDatabase from "./model/locations.js";
import queryDatabaseUsers from "./model/users.js";
import connectToDB from '../src/db/dbconfig.js';
import queryAreas from "./model/areas.js";
import {allAreas,specificArea,createArea,updateArea,deleteArea} from "./controllers/areas.js";
import {allLocations,specificLocation,createLocation,updateLocation,deleteLocation, distanceTo, isInArea, allInArea} from "./controllers/locations.js";
import { auth } from "./controllers/auth.js";

const app = express();
const router = Router(); 

app.use(express.json());
app.use(router)

// router.get('/auth',(req,res)=>{
//     auth();
// })

app.get('/', (req, res) => {
    res.status(200).send('Desafio BackEnd');
})

router.get('/locations', async (req, res) => {
    allLocations(req,res);
});

router.get('/locations/:id', async (req, res) => {
    specificLocation(req,res);
});

router.post('/locations', async (req, res) => {
    createLocation(req,res);
});

router.put('/locations/:id', async (req, res) => {
    updateLocation(req,res);
});

router.delete('/locations/:id', async (req, res) => {
    deleteLocation(req,res);
});

router.get('/areas', (req, res) => {
    allAreas(req, res);
});

router.get('/areas/:id', async (req, res) => {
    specificArea(req, res);
});
router.post('/areas', async (req, res) => {
    createArea(req, res);
});
router.put('/areas/:id', async (req, res) => {
    updateArea(req, res);
});
router.delete('/areas/:id', async (req, res) => {
    deleteArea(req, res);
});

router.get('/locations/:id1/distanceto/:id2', async (req, res) => {
    distanceTo(req, res);
});

router.get('/locations/:id1/isInArea/:id2', async (req, res) => {
    isInArea(req, res);
});

router.get('/locations/allInArea/:id', async (req, res) => {
    allInArea(req,res);
});
export default app;