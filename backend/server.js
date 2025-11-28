// backend/server.js
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURACIÓN DE LA BASE DE DATOS
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',      // Tu usuario de MySQL (por defecto es root en XAMPP)
  password: '',      // Tu contraseña (por defecto vacía en XAMPP)
  database: 'diocesis_sde',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ENDPOINT PRINCIPAL: Obtener toda la estructura
app.get('/api/estructura', async (req, res) => {
  try {
    // 1. Obtener Vicarías
    const [vicarias] = await pool.query('SELECT * FROM vicarias');
    
    // 2. Para cada vicaría, buscar sectores y parroquias
    for (let vicaria of vicarias) {
      const [sectores] = await pool.query('SELECT * FROM sectores WHERE vicaria_id = ?', [vicaria.id]);
      
      for (let sector of sectores) {
        // Buscar parroquias del sector
        const [parroquias] = await pool.query(`
          SELECT p.*, s.nombre as parroco_nombre, s.foto_url as parroco_foto, s.ordenacion, s.educacion, s.experiencia
          FROM parroquias p
          LEFT JOIN sacerdotes s ON p.sacerdote_id = s.id
          WHERE p.sector_id = ?
        `, [sector.id]);

        // Buscar misas para cada parroquia
        for (let parroquia of parroquias) {
          const [misas] = await pool.query('SELECT dia, hora FROM misas WHERE parroquia_id = ?', [parroquia.id]);
          
          // Formatear objeto parroquia para el frontend
          parroquia.parroco = {
            nombre: parroquia.parroco_nombre,
            foto: parroquia.parroco_foto,
            ordenacion: parroquia.ordenacion,
            educacion: parroquia.educacion ? parroquia.educacion.split('|') : [],
            experiencia: parroquia.experiencia ? parroquia.experiencia.split('|') : []
          };
          parroquia.misas = misas;
          
          // Coordenadas manuales (Fallback si no hay en BD)
          // NOTA: Idealmente estas vendrían de la BD, pero si son nulas, usamos las del mapa
          if(!parroquia.latitud) parroquia.coordenadas = null; 
          else parroquia.coordenadas = [parseFloat(parroquia.latitud), parseFloat(parroquia.longitud)];
        }
        
        sector.parroquias = parroquias;
      }
      vicaria.sectores = sectores;
    }

    res.json(vicarias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});