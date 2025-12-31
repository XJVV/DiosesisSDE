require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la conexión usando el archivo .env
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// Endpoint principal: Obtener toda la estructura (Vicarías -> Sectores -> Parroquias)
app.get('/api/estructura', async (req, res) => {
  try {
    // 1. Obtener todas las Vicarías
    const [vicarias] = await pool.query('SELECT * FROM vicarias');
    
    // 2. Recorrer cada vicaría para buscar sus datos relacionados
    for (let vicaria of vicarias) {
      
      // Buscar el "Vicario" (Sacerdote principal) para la portada
      // NOTA: Aquí podrías tener una tabla intermedia 'asignaciones', pero por simplicidad
      // buscamos un sacerdote aleatorio o el primero disponible si no tienes esa lógica aún.
      const [vicario] = await pool.query('SELECT * FROM sacerdotes LIMIT 1'); 
      vicaria.vicario = vicario[0] || { 
        nombre: "Vacante", 
        titulo: "Vicario Episcopal", 
        foto: "https://via.placeholder.com/150", 
        bio: "Información no disponible." 
      };

      // 3. Buscar Sectores de esta Vicaría
      const [sectores] = await pool.query('SELECT * FROM sectores WHERE vicaria_id = ?', [vicaria.id]);
      
      for (let sector of sectores) {
        // 4. Buscar Parroquias de este Sector (incluyendo datos del sacerdote/párroco)
        const [parroquias] = await pool.query(`
          SELECT p.*, s.nombre as parroco_nombre, s.foto_url as parroco_foto 
          FROM parroquias p 
          LEFT JOIN sacerdotes s ON p.sacerdote_id = s.id 
          WHERE p.sector_id = ?`, [sector.id]);
          
        // Formatear datos para el frontend (asegurar coordenadas numéricas)
        sector.parroquias = parroquias.map(p => ({
          ...p,
          // Si lat/lng son nulos en la BD, el frontend usará sus coordenadas fijas de respaldo
          coordenadas: p.latitud && p.longitud ? [parseFloat(p.latitud), parseFloat(p.longitud)] : null,
          parroco: { 
            nombre: p.parroco_nombre || "Párroco No Asignado", 
            foto: p.parroco_foto || "https://via.placeholder.com/150" 
          }
        }));
      }
      
      // Aplanamos la lista de parroquias para mostrarla fácil en la página de la vicaría
      vicaria.parroquias = sectores.flatMap(s => s.parroquias); 
      vicaria.sectores = sectores;
    }

    res.json(vicarias);
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});