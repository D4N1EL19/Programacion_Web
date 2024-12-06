import { Router } from "express";
import pool from "../database.js";
import { Session } from 'express-session';
const router = Router()

function isAuthenticated(req, res, next) {
    if (req.session.user) {
      return next();
    }
    res.redirect("/");
}

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

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "1234") {
      req.session.user = { username };
      return res.redirect("/mantenimiento");
    }
  
    res.status(401).send("Credenciales inválidas");
});

router.get("/mantenimiento", isAuthenticated, (req, res) => {
    res.render("manteniminento", {layout: "mantenimiento"})
});

router.post("/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/login");
    });
});

export default router