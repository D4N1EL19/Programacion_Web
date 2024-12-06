import { Router } from "express";
import pool from "../database.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { IMAGES_FOLDER } from "../index.js";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, IMAGES_FOLDER);
    },
    filename: (req, file, cb) => {
      const existingImages = fs.readdirSync(IMAGES_FOLDER).filter((f) =>
        f.startsWith("imagen")
      );
      const currentNumbers = existingImages.map(
        (img) => parseInt(img.match(/\d+/)?.[0] || 0)
      );
      const nextNumber = currentNumbers.length > 0 ? Math.max(...currentNumbers) + 1 : 1;
  
      cb(null, `imagen${nextNumber}${path.extname(file.originalname)}`);
    },
  });

const upload = multer({ storage });
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

router.post("/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
});

router.get("/mantenimiento", isAuthenticated, (req, res) => {
    res.render("partials/mantenimineto", {layout: "mantenimiento"})
});

router.post("/uploadImage", upload.single("file"), async(req, res)=>{
    const { descripcion, link } = req.body;
    const archivo = req.file;
    const MAX_IMAGES = 3;
  
    try{
        let images = fs.readdirSync(IMAGES_FOLDER).filter((f) => f.startsWith("imagen"));
        if (images.length > MAX_IMAGES) {
            images.sort((a, b) => {
                const numA = parseInt(a.match(/\d+/)?.[0] || 0);
                const numB = parseInt(b.match(/\d+/)?.[0] || 0);
                return numA - numB;
            });

            while (images.length > MAX_IMAGES) {
                const imageToDelete = images.shift();
                fs.unlinkSync(path.join(IMAGES_FOLDER, imageToDelete));
            }
        }

        const nuevaNotica = {
            Contenido: descripcion,
            link,
            foto: archivo.filename
        };

        await pool.query('INSERT INTO Noticias SET ?', [nuevaNotica]);

        res.json({ 
            message: "Formulario procesado correctamente. Imagen subida.", 
            success: true 
        });
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
});

export default router