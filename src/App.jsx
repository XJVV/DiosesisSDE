import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polygon, useMap, Tooltip } from 'react-leaflet';
import { MapPin, Clock, ChevronRight, X, Menu, ChevronDown, Phone, Mail, Facebook, Twitter, Instagram, ArrowLeft, Church, User, BookOpen, GraduationCap, Calendar } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- CONFIGURACIÓN DE ICONOS ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- PALETA DE COLORES ---
const PALETTE = {
  color1: '#cbdad5', 
  color2: '#89a7b1', 
  color3: '#566981', 
  color4: '#3a415a', 
  color5: '#34344e', 
  contrast: '#d4a373', 
  white: '#ffffff'
};

// --- DATOS GEOGRÁFICOS ---
const P_PUENTE = [18.478, -69.896];
const P_RIO_NORTE = [18.540, -69.890];
const P_CRUCE_SABANA = [18.550, -69.870];
const P_MEGACENTRO = [18.510, -69.830];
const P_HIPODROMO = [18.490, -69.780];
const P_PEAJE = [18.465, -69.800];
const P_COSTA_OESTE = [18.465, -69.890];
const P_COSTA_ESTE = [18.440, -69.600];
const P_SAN_LUIS_NORTE = [18.600, -69.750];

const zonaVillaDuarte = [P_PUENTE, [18.500, -69.870], P_MEGACENTRO, P_PEAJE, [18.455, -69.800], [18.455, -69.880], P_COSTA_OESTE, P_PUENTE];
const zonaLosMina = [[18.500, -69.870], P_RIO_NORTE, P_CRUCE_SABANA, [18.540, -69.850], P_MEGACENTRO, [18.500, -69.870]];
const zonaSanIsidro = [P_CRUCE_SABANA, P_SAN_LUIS_NORTE, [18.550, -69.700], P_HIPODROMO, P_MEGACENTRO, [18.540, -69.850], P_CRUCE_SABANA];
const zonaInvivienda = [P_MEGACENTRO, P_HIPODROMO, P_PEAJE, P_MEGACENTRO];
const zonaBocaChica = [P_PEAJE, P_HIPODROMO, [18.550, -69.700], [18.500, -69.600], P_COSTA_ESTE, [18.435, -69.680], [18.445, -69.750], P_PEAJE];
const worldMask = [[90, -180], [90, 180], [-90, 180], [-90, -180]];

// --- DATOS DE PRUEBA (DATA FARSA) ---
const datosIniciales = [
  {
    id: 1, nombre: "Vicaría I - Villa Duarte / Las Américas", slug: "villa-duarte", color: PALETTE.color5, zona: zonaVillaDuarte, centro: [18.475, -69.860],
    vicario: { nombre: "Mons. Benito Ángeles", titulo: "Vicario Episcopal", foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Mons._Benito_%C3%81ngeles.jpg/220px-Mons._Benito_%C3%81ngeles.jpg", bio: "Obispo Auxiliar de Santo Domingo." },
    parroquias: []
  },
  {
    id: 2, nombre: "Vicaría II - Los Mina / Ozama", slug: "los-mina", color: PALETTE.color4, zona: zonaLosMina, centro: [18.520, -69.870],
    vicario: { nombre: "P. Gregorio Alegría", titulo: "Vicario Adjunto", foto: "https://randomuser.me/api/portraits/men/45.jpg", bio: "Sacerdote comprometido." },
    parroquias: []
  },
  { id: 3, nombre: "Vicaría III - San Isidro / San Luis", slug: "san-isidro", color: PALETTE.color3, zona: zonaSanIsidro, centro: [18.550, -69.780], vicario: { nombre: "P. Juan Pérez", titulo: "Vicario", foto: "https://randomuser.me/api/portraits/men/32.jpg", bio: "Info pendiente." }, parroquias: [] },
  { id: 4, nombre: "Vicaría IV - Invivienda / Hainamosa", slug: "invivienda", color: PALETTE.color2, zona: zonaInvivienda, centro: [18.490, -69.800], vicario: { nombre: "P. Pedro Martínez", titulo: "Vicario", foto: "https://randomuser.me/api/portraits/men/12.jpg", bio: "Info pendiente." }, parroquias: [] },
  
  // --- VICARÍA DE EJEMPLO LLENA (BOCA CHICA) ---
  { 
    id: 5, 
    nombre: "Vicaría V - Boca Chica / La Caleta", 
    slug: "boca-chica", 
    color: "#4d7c0f", 
    zona: zonaBocaChica, 
    centro: [18.450, -69.650], 
    vicario: { 
      nombre: "P. Luis Gómez", 
      titulo: "Vicario Episcopal", 
      foto: "https://randomuser.me/api/portraits/men/64.jpg", 
      bio: "Encargado de la pastoral turística y el desarrollo comunitario en la zona costera." 
    }, 
    parroquias: [
      { 
        id: 501, 
        nombre: "Parroquia San Rafael Arcángel", 
        direccion: "Calle Duarte #1, Boca Chica", 
        telefono: "809-555-4321", 
        email: "sanrafael@diocesis.do",
        coordenadas: [18.450, -69.610],
        imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Iglesia_San_Rafael_Arcangel_Boca_Chica.jpg/800px-Iglesia_San_Rafael_Arcangel_Boca_Chica.jpg",
        resumen: "Fundada en 1950, es el corazón espiritual de Boca Chica, conocida por su arquitectura colonial moderna y su vibrante comunidad juvenil.",
        misas: [{dia: "Domingo", hora: "8:00 AM"}, {dia: "Domingo", hora: "6:00 PM"}, {dia: "Martes", hora: "7:00 PM"}],
        parroco: {
          id: 901,
          nombre: "P. Antonio Fernández",
          titulo: "Párroco",
          foto: "https://randomuser.me/api/portraits/men/88.jpg",
          ordenacion: "15 de agosto de 2005",
          bio: "Sacerdote diocesano con 15 años de servicio. Especialista en Teología Moral y Pastoral Familiar.",
          educacion: ["Licenciatura en Filosofía - PUCMM", "Maestría en Teología Dogmática - Roma"],
          experiencia: ["Vicario Parroquial San José (2005-2010)", "Párroco Santa María (2010-2018)", "Párroco San Rafael (2018-Presente)"]
        }
      },
      { 
        id: 502, 
        nombre: "Parroquia Nuestra Señora de la Altagracia", 
        direccion: "La Caleta, km 22", 
        telefono: "809-555-8888", 
        email: "altagraciacaleta@diocesis.do",
        coordenadas: [18.445, -69.680],
        imagen: "https://via.placeholder.com/800x600/3a415a/ffffff?text=Parroquia+La+Caleta",
        resumen: "Ubicada cerca del aeropuerto, sirve a la comunidad de La Caleta con diversos programas sociales y educativos.",
        misas: [{dia: "Domingo", hora: "9:00 AM"}, {dia: "Jueves", hora: "6:30 PM"}],
        parroco: {
          id: 902,
          nombre: "P. Manuel Torres",
          titulo: "Párroco",
          foto: "https://randomuser.me/api/portraits/men/33.jpg",
          ordenacion: "10 de junio de 2012",
          bio: "Dedicado a la formación de laicos y la catequesis infantil.",
          educacion: ["Seminario Pontificio Santo Tomás de Aquino"],
          experiencia: ["Párroco N.S. Altagracia (2020-Presente)"]
        }
      },
      { 
        id: 503, 
        nombre: "Parroquia Santa Lucía", 
        direccion: "Barrio Invi, Boca Chica", 
        telefono: "809-555-7777", 
        coordenadas: [18.455, -69.605],
        imagen: "https://via.placeholder.com/800x600/89a7b1/ffffff?text=Santa+Lucia",
        resumen: "Comunidad pequeña pero muy activa, centrada en la ayuda a los envejecientes.",
        misas: [{dia: "Domingo", hora: "7:00 AM"}, {dia: "Domingo", hora: "10:00 AM"}],
        parroco: {
          id: 903,
          nombre: "P. José Luis Rodriguez",
          titulo: "Administrador Parroquial",
          foto: "https://randomuser.me/api/portraits/men/55.jpg",
          ordenacion: "2018",
          bio: "Joven sacerdote impulsando los grupos juveniles.",
          educacion: ["Lic. en Ciencias Religiosas"],
          experiencia: ["Vicario en San Isidro"]
        }
      },
      { 
        id: 504, 
        nombre: "Parroquia San Andrés Apóstol", 
        direccion: "Andrés, Boca Chica", 
        telefono: "809-555-1111", 
        coordenadas: [18.442, -69.630],
        imagen: "https://via.placeholder.com/800x600/566981/ffffff?text=San+Andres",
        resumen: "Histórica parroquia de la zona de Andrés, punto de referencia para las procesiones de Semana Santa.",
        misas: [{dia: "Domingo", hora: "8:30 AM"}, {dia: "Miércoles", hora: "6:00 PM"}],
        parroco: {
          id: 904,
          nombre: "Mons. Fausto Burgos",
          titulo: "Párroco",
          foto: "https://randomuser.me/api/portraits/men/11.jpg",
          ordenacion: "1990",
          bio: "Sacerdote con amplia trayectoria en la pastoral social.",
          educacion: ["Doctorado en Derecho Canónico"],
          experiencia: ["Juez del Tribunal Eclesiástico", "Párroco San Andrés (2015-Presente)"]
        }
      }
    ] 
  }
];

// --- COMPONENTES AUXILIARES ---
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="font-sans shadow-sm relative z-50">
      <div style={{backgroundColor: PALETTE.color4}} className="text-white py-1.5 px-4 md:px-8 text-xs flex justify-between items-center">
        <div className="flex items-center gap-4 opacity-90">
          <span className="flex items-center gap-1"><Phone size={12} /> (809) 594-3352</span>
        </div>
        <div className="flex items-center gap-3 opacity-90">
          <Facebook size={14} className="cursor-pointer hover:text-gray-300" />
          <Instagram size={14} className="cursor-pointer hover:text-gray-300" />
        </div>
      </div>
      <div className="bg-white py-4 px-4 md:px-8 flex justify-between items-center border-b-4" style={{borderColor: PALETTE.color4}}>
        <Link to="/" className="flex items-center gap-3 group">
          <div style={{backgroundColor: PALETTE.color4}} className="h-10 w-10 rounded-sm flex items-center justify-center text-white font-bold text-lg shadow-sm">D</div>
          <div className="leading-tight" style={{color: PALETTE.color4}}>
            <h1 className="font-bold text-xl tracking-wide">DIÓCESIS</h1>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-70">Santo Domingo Este</p>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8 font-semibold text-xs tracking-wider uppercase" style={{color: PALETTE.color5}}>
          <Link to="/" className="hover:opacity-70 transition">Inicio</Link>
          <div className="relative group">
             <button className="flex items-center gap-1 hover:opacity-70 transition py-3">Vicarías <ChevronDown size={14}/></button>
             <div className="absolute top-full right-0 w-56 bg-white shadow-lg rounded-sm py-1 opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible border-t-2 z-50" style={{borderColor: PALETTE.color4}}>
               {datosIniciales.map(vicaria => (
                 <Link key={vicaria.id} to={`/vicaria/${vicaria.slug}`} style={{color: PALETTE.color5}} className="block px-4 py-3 text-xs hover:bg-gray-50 border-b border-gray-50 last:border-0 font-medium">
                   {vicaria.nombre.split('-')[1] || vicaria.nombre}
                 </Link>
               ))}
             </div>
          </div>
          <a href="#" className="hover:opacity-70 transition">Contacto</a>
        </nav>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden" style={{color: PALETTE.color4}}><Menu size={24}/></button>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer style={{backgroundColor: PALETTE.color5}} className="text-white py-6 font-sans mt-auto">
    <div className="max-w-6xl mx-auto px-4 text-center text-xs opacity-80">
      <p className="font-medium tracking-wide mb-2">DIÓCESIS DE SANTO DOMINGO ESTE</p>
      <p className="text-gray-400">© {new Date().getFullYear()} Todos los derechos reservados.</p>
    </div>
  </footer>
);

// --- PÁGINAS ---

// 1. HOME (MAPA)
const HomePage = ({ vicarias }) => {
  const navigate = useNavigate();
  const [hoveredVicaria, setHoveredVicaria] = useState(null);
  return (
    <main className="flex-1 flex flex-col" style={{backgroundColor: PALETTE.color1}}>
      <div style={{backgroundColor: PALETTE.color4}} className="text-white py-10 text-center bg-[url('https://www.arzobispadosd.org/images/headers/header-arzobispado.jpg')] bg-cover bg-center bg-blend-multiply">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">Mapa Pastoral Diocesano</h1>
        <p className="text-blue-100 text-sm font-light">Selecciona una zona en el mapa para ver sus parroquias</p>
      </div>
      <div className="flex-1 w-full px-4 py-12 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row max-w-5xl">
          <div style={{ width: '750px', height: '550px' }} className="relative bg-[#e5e7eb]">
            <MapContainer center={[18.52, -69.75]} zoom={10.8} className="w-full h-full" zoomControl={false} dragging={false} scrollWheelZoom={false} doubleClickZoom={false} touchZoom={false} attributionControl={false}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" opacity={0.6}/>
              <Polygon positions={[worldMask, zonaVillaDuarte.concat(zonaLosMina).concat(zonaSanIsidro).concat(zonaInvivienda).concat(zonaBocaChica)]} pathOptions={{ color: 'transparent', fillColor: PALETTE.color5, fillOpacity: 0.9 }} interactive={false} />
              {vicarias.map(vicaria => (
                <Polygon 
                  key={vicaria.id} positions={vicaria.zona}
                  pathOptions={{ color: 'white', weight: hoveredVicaria === vicaria.id ? 3 : 1, fillColor: vicaria.color, fillOpacity: hoveredVicaria === vicaria.id ? 1 : 0.9 }}
                  eventHandlers={{ click: () => navigate(`/vicaria/${vicaria.slug}`), mouseover: (e) => { setHoveredVicaria(vicaria.id); e.target.setStyle({ fillOpacity: 1, color: '#facc15' }); }, mouseout: (e) => { setHoveredVicaria(null); e.target.setStyle({ fillOpacity: 0.9, color: 'white' }); } }}
                >
                  <Tooltip sticky direction="center" className="bg-transparent border-0 shadow-none text-white font-bold text-[10px] uppercase tracking-widest text-shadow-md">{vicaria.nombre.split('-')[1] || vicaria.nombre}</Tooltip>
                </Polygon>
              ))}
            </MapContainer>
          </div>
          <div className="w-full md:w-64 bg-white p-6 border-l border-gray-100 flex flex-col justify-center">
            <h3 style={{color: PALETTE.color4}} className="font-bold text-sm uppercase mb-4 tracking-wider border-b border-gray-100 pb-2">Zonas Pastorales</h3>
            <ul className="space-y-3">
              {vicarias.map(v => (
                <li key={v.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(`/vicaria/${v.slug}`)} onMouseEnter={() => setHoveredVicaria(v.id)} onMouseLeave={() => setHoveredVicaria(null)}>
                  <span className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white transition-transform group-hover:scale-125" style={{backgroundColor: v.color}}></span>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-[#3a415a] transition-colors leading-tight">{v.nombre.split('-')[1] || v.nombre}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

// --- PÁGINA 2: LISTA DE PARROQUIAS (VICARÍA) ---
const VicariaPage = ({ vicarias }) => {
  const { slug } = useParams();
  const vicaria = vicarias.find(v => v.slug === slug);

  if (!vicaria) return <div className="py-20 text-center" style={{color: PALETTE.color5}}>Vicaría no encontrada. <Link to="/" className="underline">Volver</Link></div>;

  return (
    <main className="flex-1 font-sans" style={{backgroundColor: PALETTE.color1}}>
      <div style={{backgroundColor: PALETTE.color4}} className="text-white py-8 relative shadow-md">
         <div className="max-w-4xl mx-auto px-4 relative z-10">
            <Link to="/" className="inline-flex items-center gap-1.5 text-blue-100 text-xs font-bold uppercase mb-2 hover:text-white transition"><ArrowLeft size={14}/> Volver al Mapa</Link>
            <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">{vicaria.nombre}</h1>
         </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <div className="bg-white p-5 rounded-sm shadow-sm border-t-4 sticky top-4" style={{borderColor: vicaria.color}}>
             <div className="mb-4 border-b border-gray-100 pb-4 text-center">
                <div className="inline-block p-1 bg-gray-50 rounded-full mb-3 shadow-inner">
                  <img src={vicaria.vicario?.foto || "https://via.placeholder.com/300"} alt="Vicario" className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-sm" />
                </div>
                <h3 style={{color: PALETTE.color4}} className="font-bold text-base leading-tight">{vicaria.vicario?.nombre || "Vacante"}</h3>
                <p style={{color: PALETTE.color3}} className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">{vicaria.vicario?.titulo}</p>
             </div>
             <div style={{color: PALETTE.color5}} className="text-sm leading-relaxed mb-4"><p>{vicaria.vicario?.bio}</p></div>
          </div>
        </div>
        <div className="lg:w-2/3">
           <div className="flex items-center justify-between border-b border-gray-300 pb-2 mb-5">
              <h2 style={{color: PALETTE.color4}} className="text-lg font-bold">Parroquias</h2>
              <span style={{backgroundColor: vicaria.color, color: 'white'}} className="text-xs font-medium px-2 py-1 rounded">{vicaria.parroquias.length}</span>
           </div>
           {vicaria.parroquias.length > 0 ? (
              <div className="grid gap-3">
                {vicaria.parroquias.map(parroquia => (
                   <Link key={parroquia.id} to={`/parroquia/${parroquia.id}`} className="block">
                     <div className="bg-white p-4 rounded-sm shadow-sm border-l-4 hover:shadow-md transition-all flex gap-4 items-start group cursor-pointer" style={{borderColor: vicaria.color}}>
                        <div style={{color: vicaria.color}} className="p-2 rounded-md group-hover:bg-gray-50 transition-colors"><Church size={18}/></div>
                        <div className="flex-1 min-w-0">
                           <h3 style={{color: PALETTE.color5}} className="font-bold text-sm truncate group-hover:text-blue-700">{parroquia.nombre}</h3>
                           <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs opacity-80" style={{color: PALETTE.color3}}>
                              <span className="flex items-center gap-1"><MapPin size={12}/> {parroquia.direccion}</span>
                           </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 self-center"/>
                     </div>
                   </Link>
                ))}
              </div>
           ) : (
              <div className="bg-white/50 p-6 rounded text-center text-sm italic opacity-70" style={{color: PALETTE.color5}}>No hay información disponible.</div>
           )}
        </div>
      </div>
    </main>
  );
};

// --- PÁGINA 3: DETALLE DE PARROQUIA (NUEVA) ---
const ParroquiaPage = ({ vicarias }) => {
  const { id } = useParams();
  
  // Función para buscar la parroquia en toda la estructura de datos
  const encontrarParroquia = () => {
    for (const vicaria of vicarias) {
      const parroquia = vicaria.parroquias.find(p => p.id === parseInt(id));
      if (parroquia) return { ...parroquia, vicariaSlug: vicaria.slug, vicariaNombre: vicaria.nombre, vicariaColor: vicaria.color };
    }
    return null;
  };

  const parroquia = encontrarParroquia();

  if (!parroquia) return <div className="py-20 text-center" style={{color: PALETTE.color5}}>Parroquia no encontrada.</div>;

  return (
    <main className="flex-1 font-sans bg-gray-50">
      {/* Hero Parroquia */}
      <div className="h-64 relative bg-gray-800">
        <img src={parroquia.imagen} alt={parroquia.nombre} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 w-full max-w-6xl mx-auto">
           <Link to={`/vicaria/${parroquia.vicariaSlug}`} className="text-white/80 hover:text-white text-xs font-bold uppercase mb-2 inline-flex items-center gap-1"><ArrowLeft size={14}/> {parroquia.vicariaNombre}</Link>
           <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{parroquia.nombre}</h1>
           <p className="text-white/90 flex items-center gap-2 text-sm"><MapPin size={16}/> {parroquia.direccion}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
        {/* Info Principal */}
        <div className="md:w-2/3 space-y-8">
           <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#3a415a] mb-4 flex items-center gap-2"><BookOpen size={20} className="text-blue-500"/> Reseña</h2>
              <p className="text-gray-600 leading-relaxed">{parroquia.resumen || "Información general de la parroquia."}</p>
              
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div>
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Clock size={18} className="text-green-600"/> Horarios de Misa</h3>
                    <ul className="space-y-2">
                       {parroquia.misas?.map((misa, i) => (
                          <li key={i} className="text-sm text-gray-600 bg-green-50 px-3 py-2 rounded-md border border-green-100 flex justify-between">
                             <span className="font-semibold">{misa.dia}</span> <span>{misa.hora}</span>
                          </li>
                       )) || <li className="text-sm text-gray-500">Por confirmar</li>}
                    </ul>
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Phone size={18} className="text-blue-600"/> Contacto</h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                       <li className="flex items-center gap-3"><Phone size={16}/> {parroquia.telefono}</li>
                       {parroquia.email && <li className="flex items-center gap-3"><Mail size={16}/> {parroquia.email}</li>}
                    </ul>
                 </div>
              </div>
           </div>
        </div>

        {/* Tarjeta del Párroco (CORREGIDA) */}
        <div className="md:w-1/3">
           <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Nuestro Párroco</h3>
           {parroquia.parroco ? (
             <Link to={`/sacerdote/${parroquia.parroco.id}`} className="block group">
               <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                  <div className="h-24 bg-gradient-to-r from-[#3a415a] to-[#566981]"></div>
                  
                  {/* CENTRADO Y AJUSTE VISUAL */}
                  <div className="px-6 pb-6 relative flex flex-col items-center text-center">
                     <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 p-1 bg-white rounded-full">
                        <img src={parroquia.parroco.foto} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm group-hover:scale-105 transition-transform" />
                     </div>
                     <div className="mt-16 w-full">
                        <h4 className="font-bold text-lg text-gray-800 group-hover:text-blue-700 leading-tight">{parroquia.parroco.nombre}</h4>
                        <p className="text-xs text-blue-500 font-bold uppercase tracking-wider mt-1">{parroquia.parroco.titulo}</p>
                        <p className="text-sm text-gray-500 mt-3 line-clamp-3">{parroquia.parroco.bio}</p>
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center text-blue-600 text-sm font-medium">
                           Ver Perfil Completo <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform"/>
                        </div>
                     </div>
                  </div>
               </div>
             </Link>
           ) : (
             <div className="bg-gray-100 p-4 rounded text-center text-gray-500 text-sm">Párroco no asignado.</div>
           )}
        </div>
      </div>
    </main>
  );
};

// --- PÁGINA 4: PERFIL DEL SACERDOTE ("CV") (NUEVA) ---
const SacerdotePage = ({ vicarias }) => {
  const { id } = useParams();

  // Buscar sacerdote en toda la data
  const encontrarSacerdote = () => {
    for (const vicaria of vicarias) {
      for (const p of vicaria.parroquias) {
        if (p.parroco && p.parroco.id === parseInt(id)) {
          return { ...p.parroco, parroquiaNombre: p.nombre, parroquiaId: p.id };
        }
      }
    }
    return null;
  };

  const sacerdote = encontrarSacerdote();

  if (!sacerdote) return <div className="py-20 text-center">Información no encontrada.</div>;

  return (
    <main className="flex-1 font-sans bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
         {/* Tarjeta Principal */}
         <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="h-40 bg-[#3a415a] relative">
               <Link to={`/parroquia/${sacerdote.parroquiaId}`} className="absolute top-6 left-6 text-white/80 hover:text-white flex items-center gap-2 text-sm font-bold bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm transition-colors">
                  <ArrowLeft size={16}/> Volver a la Parroquia
               </Link>
            </div>
            
            <div className="px-8 pb-8 relative flex flex-col md:flex-row gap-8">
               {/* Foto Flotante */}
               <div className="-mt-20 shrink-0 flex flex-col items-center">
                  <div className="p-2 bg-white rounded-full shadow-md">
                     <img src={sacerdote.foto} className="w-40 h-40 rounded-full object-cover border-4 border-gray-50" />
                  </div>
                  <div className="mt-4 text-center">
                     <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Activo</span>
                  </div>
               </div>

               {/* Info Personal */}
               <div className="pt-4 flex-1">
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{sacerdote.nombre}</h1>
                  <p className="text-blue-600 font-medium text-lg mb-4">{sacerdote.titulo} - {sacerdote.parroquiaNombre}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                     <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><User size={16}/> Biografía</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{sacerdote.bio}</p>
                     </div>
                     <div className="space-y-6">
                        <div>
                           <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><GraduationCap size={16}/> Formación</h3>
                           <ul className="space-y-2">
                              {sacerdote.educacion?.map((edu, i) => (
                                 <li key={i} className="text-sm text-gray-700 bg-gray-50 p-2 rounded border-l-4 border-blue-400">{edu}</li>
                              )) || <li className="text-gray-500 text-sm">Información no disponible</li>}
                           </ul>
                        </div>
                        <div>
                           <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><BookOpen size={16}/> Experiencia</h3>
                           <ul className="space-y-2">
                              {sacerdote.experiencia?.map((exp, i) => (
                                 <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0"></span> {exp}
                                 </li>
                              )) || <li className="text-gray-500 text-sm">Información no disponible</li>}
                           </ul>
                        </div>
                     </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
                     <Calendar size={16}/> Ordenación Sacerdotal: <span className="font-bold text-gray-700">{sacerdote.ordenacion || "No especificada"}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </main>
  );
};

// --- APP PRINCIPAL ---
const App = () => {
  const [vicarias, setVicarias] = useState(datosIniciales);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/estructura`);
        if (!res.ok) throw new Error("Backend no disponible");
        const dbData = await res.json();

        if (dbData && dbData.length > 0) {
          const mergedData = dbData.map(v => {
            let visualConfig = { zona: [], color: '#ccc' };
            
            if (v.slug === 'villa-duarte' || v.id === 1) visualConfig = { zona: zonaVillaDuarte, color: '#89a7b1' };
            else if (v.slug === 'los-mina' || v.id === 2) visualConfig = { zona: zonaLosMina, color: '#3a415a' };
            else if (v.slug === 'san-isidro' || v.id === 3) visualConfig = { zona: zonaSanIsidro, color: '#d4a373' };
            else if (v.slug === 'invivienda' || v.id === 4) visualConfig = { zona: zonaInvivienda, color: '#566981' };
            else if (v.slug === 'boca-chica' || v.id === 5) visualConfig = { zona: zonaBocaChica, color: '#4d7c0f' };

            // Asegurar que las parroquias tengan coordenadas para el mapa
            const parroquiasConCoords = v.parroquias.map(p => ({
              ...p,
              // Usar latitud/longitud de la BD si existen, sino un default
              coordenadas: (p.latitud && p.longitud) ? [parseFloat(p.latitud), parseFloat(p.longitud)] : [18.50, -69.80]
            }));

            return { ...v, ...visualConfig, parroquias: parroquiasConCoords };
          });
          setVicarias(mergedData); 
        }
      } catch (err) {
        console.log("Usando datos de respaldo (Backend offline o vacío).");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans" style={{backgroundColor: PALETTE.color1}}>
      <Header vicarias={vicarias} />
      <Routes>
        <Route path="/" element={<HomePage vicarias={vicarias} />} />
        <Route path="/vicaria/:slug" element={<VicariaPage vicarias={vicarias} />} />
        <Route path="/parroquia/:id" element={<ParroquiaPage vicarias={vicarias} />} />
        <Route path="/sacerdote/:id" element={<SacerdotePage vicarias={vicarias} />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;