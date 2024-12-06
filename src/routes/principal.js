import { json, Router } from "express";
import pool from "../database.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { IMAGES_FOLDER } from "../index.js";
import { PasswordHasher } from '../hasher.js';


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

router.get("/mantenimiento", isAuthenticated, async(req, res) => {
    const [paquetes] = await pool.query('SELECT * FROM Paquetes');
    res.render("partials/mantenimineto", {layout: "mantenimiento", paquetes: paquetes})
});

router.post("/actualizarPaquete", async(req, res)=>{
  const { id, periodo, meses, precio} = req.body;
  const paquete = {
    Plazo: periodo,
    Meses: meses,
    Precio: precio
  };

  try {
    await pool.query("UPDATE Paquetes SET ? WHERE ID = ?", [paquete, id]);
    res.json({ success: true, message: "Paquete actualizado correctamente" });
  }catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al actualizar el paquete" });
  }
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

router.post('/agregarSuscripcion', async (req, res) => {
  try {
    const { 
      nombres, apellidos, user, diocesis,
      password, direccion, fecha_pago
    } = req.body;

    const [rows] = await pool.query('SELECT ID FROM Comunidades WHERE Nombre = ?', [diocesis]);
    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'La diócesis no existe.' 
      });
    }

    const comunidadID = rows[0].ID;

    const nuevaParroquia = {
      ID_Comunidad: comunidadID, 
      Nombre: "Desconocido",
      Fecha_fundacion: null,
      Ciudad: "Desconocido",
      Direccion: direccion
    };

    const [result] = await pool.query('INSERT INTO Parroquias SET ?', [nuevaParroquia]);
    const lastInsertId = result.insertId;

    const nombreCompleto = nombres + " " + apellidos; 
    const pass = PasswordHasher.hashPassword(password); 

    const nuevoUsuario = {
      ID_Parroquia: lastInsertId,
      Nombre: nombreCompleto,
      Usuario: user,
      Pass: pass,
      Rol: "Administrador_Parroquial",
      Fecha_Licencia: fecha_pago
    };

    await pool.query('INSERT INTO Usuarios SET ?', [nuevoUsuario]);

    res.json({ 
      message: "Formulario procesado correctamente. Suscripción subida.", 
      success: true, 
      usuarioID: result.insertId,
      parroquiaID: lastInsertId
    });
  } catch (error) {
    console.error('Error en la suscripción:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ocurrió un error al procesar la solicitud.' 
    });
  }
});


export default router