import { Router } from "express";
import pool from "../database.js";

const router = Router()

router.get('/', async(req,res)=>{
    try{
        const [paquetes] = await pool.query('SELECT * FROM Paquetes');
        const [noticias] = await pool.query('SELECT * FROM Noticias ORDER BY ID LIMIT 3');
        res.render('index', {paquetes: paquetes, noticias: noticias});
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
});

export default router