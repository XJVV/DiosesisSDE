import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polygon, useMap, Tooltip } from 'react-leaflet';
import { MapPin, Clock, ChevronRight, X, Menu, ChevronDown, Phone, Mail, Facebook, Twitter, Instagram, Youtube, Search, Church, User, ArrowLeft } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- CONFIGURACIÓN DE ICONOS ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const churchIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/685/685806.png',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
  className: 'opacity-90 hover:opacity-100 transition-opacity'
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

// --- DATOS GEOGRÁFICOS (POLÍGONOS FIJOS) ---
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

// Coordenadas de respaldo para iglesias si no vienen de la BD
const defaultCoords = {
  1: [18.4700, -69.8680],
  2: [18.5025, -69.8765]
};

// --- COMPONENTE HEADER ---
const Header = ({ vicarias }) => {
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
             <button className="flex items-center gap-1 hover:opacity-70 transition py-3">
               Vicarías <ChevronDown size={14}/>
             </button>
             <div className="absolute top-full right-0 w-56 bg-white shadow-lg rounded-sm py-1 opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible border-t-2 z-50" style={{borderColor: PALETTE.color4}}>
               {vicarias.map(vicaria => (
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

// --- PÁGINA 1: HOME ---
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
            <MapContainer 
              center={[18.52, -69.75]} zoom={10.8} className="w-full h-full" zoomControl={false} dragging={false} scrollWheelZoom={false} doubleClickZoom={false} touchZoom={false} attributionControl={false}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" opacity={0.6}/>
              <Polygon positions={[worldMask, zonaVillaDuarte.concat(zonaLosMina).concat(zonaSanIsidro).concat(zonaInvivienda).concat(zonaBocaChica)]} pathOptions={{ color: 'transparent', fillColor: '#94a3b8', fillOpacity: 0.6 }} interactive={false} />
              
              {vicarias.map(vicaria => (
                <Polygon 
                  key={vicaria.id}
                  positions={vicaria.zona}
                  pathOptions={{ 
                    color: 'white', 
                    weight: hoveredVicaria === vicaria.id ? 3 : 1, 
                    fillColor: vicaria.color, 
                    fillOpacity: hoveredVicaria === vicaria.id ? 1 : 0.9 
                  }}
                  eventHandlers={{
                    click: () => navigate(`/vicaria/${vicaria.slug}`),
                    mouseover: (e) => { setHoveredVicaria(vicaria.id); e.target.setStyle({ fillOpacity: 1, color: '#facc15' }); },
                    mouseout: (e) => { setHoveredVicaria(null); e.target.setStyle({ fillOpacity: 0.9, color: 'white' }); }
                  }}
                >
                  <Tooltip sticky direction="center" className="bg-transparent border-0 shadow-none text-white font-bold text-[10px] uppercase tracking-widest text-shadow-md">
                    {vicaria.nombre.split('-')[1] || vicaria.nombre}
                  </Tooltip>
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
                  <span className="text-xs font-medium text-gray-600 group-hover:text-[#3a415a] transition-colors leading-tight">
                    {v.nombre.split('-')[1] || v.nombre}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-4 border-t border-gray-50 text-[10px] text-gray-400 text-center">Seleccione una zona para ver el listado</div>
          </div>
        </div>
      </div>
    </main>
  );
};

// --- PÁGINA 2: DETALLE DE VICARÍA ---
const VicariaPage = ({ vicarias }) => {
  const { slug } = useParams();
  const vicaria = vicarias.find(v => v.slug === slug);

  if (!vicaria) return <div className="py-20 text-center" style={{color: PALETTE.color5}}>Vicaría no encontrada. <Link to="/" className="underline">Volver</Link></div>;

  return (
    <main className="flex-1 font-sans" style={{backgroundColor: PALETTE.color1}}>
      <div style={{backgroundColor: PALETTE.color4}} className="text-white py-8 relative shadow-md">
         <div className="max-w-4xl mx-auto px-4 relative z-10">
            <Link to="/" className="inline-flex items-center gap-1.5 text-blue-100 text-xs font-bold uppercase mb-2 hover:text-white transition">
               <ArrowLeft size={14}/> Volver al Mapa
            </Link>
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
             <div style={{color: PALETTE.color5}} className="text-sm leading-relaxed mb-4">
                <p>{vicaria.vicario?.bio}</p>
             </div>
          </div>
        </div>

        <div className="lg:w-2/3">
           <div className="flex items-center justify-between border-b border-gray-300 pb-2 mb-5">
              <h2 style={{color: PALETTE.color4}} className="text-lg font-bold">Parroquias</h2>
              <span style={{backgroundColor: vicaria.color, color: 'white'}} className="text-xs font-medium px-2 py-1 rounded">
                {vicaria.parroquias.length}
              </span>
           </div>
           
           {vicaria.parroquias.length > 0 ? (
              <div className="grid gap-3">
                {vicaria.parroquias.map(parroquia => (
                   <div key={parroquia.id} className="bg-white p-4 rounded-sm shadow-sm border-l-4 hover:shadow-md transition-all flex gap-4 items-start group" style={{borderColor: vicaria.color}}>
                      <div style={{color: vicaria.color}} className="p-2 rounded-md group-hover:bg-gray-50 transition-colors">
                        <Church size={18}/>
                      </div>
                      <div className="flex-1 min-w-0">
                         <h3 style={{color: PALETTE.color5}} className="font-bold text-sm truncate">{parroquia.nombre}</h3>
                         <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs opacity-80" style={{color: PALETTE.color3}}>
                            <span className="flex items-center gap-1"><MapPin size={12}/> {parroquia.direccion}</span>
                         </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 self-center"/>
                   </div>
                ))}
              </div>
           ) : (
              <div className="bg-white/50 p-6 rounded text-center text-sm italic opacity-70" style={{color: PALETTE.color5}}>
                 No hay información disponible.
              </div>
           )}
        </div>
      </div>
    </main>
  );
};

// --- APP PRINCIPAL ---
const App = () => {
  const [vicarias, setVicarias] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH DE DATOS DESDE EL BACKEND
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/estructura`);
        const dbData = await res.json();

        // Mezclar datos de la BD con el diseño (Coordenadas y Colores)
        const mergedData = dbData.map(v => {
          let visualConfig = { zona: [], color: '#ccc' };
          
          if (v.slug === 'villa-duarte' || v.id === 1) visualConfig = { zona: zonaVillaDuarte, color: '#89a7b1' };
          else if (v.slug === 'los-mina' || v.id === 2) visualConfig = { zona: zonaLosMina, color: '#3a415a' };
          else if (v.slug === 'san-isidro' || v.id === 3) visualConfig = { zona: zonaSanIsidro, color: '#d4a373' };
          else if (v.slug === 'invivienda' || v.id === 4) visualConfig = { zona: zonaInvivienda, color: '#566981' };
          else if (v.slug === 'boca-chica' || v.id === 5) visualConfig = { zona: zonaBocaChica, color: '#4d7c0f' };

          // Asignar coordenadas a parroquias si faltan
          const parroquiasConCoords = v.parroquias.map(p => ({
            ...p,
            coordenadas: p.coordenadas || defaultCoords[p.id] || [18.50, -69.80]
          }));

          return { ...v, ...visualConfig, parroquias: parroquiasConCoords };
        });

        setVicarias(mergedData);
        setLoading(false);
      } catch (err) {
        console.error("Error conectando:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-[#3a415a]">Cargando Diócesis...</div>;

  return (
    <div className="flex flex-col min-h-screen font-sans" style={{backgroundColor: PALETTE.color1}}>
      <Header vicarias={vicarias} />
      <Routes>
        <Route path="/" element={<HomePage vicarias={vicarias} />} />
        <Route path="/vicaria/:slug" element={<VicariaPage vicarias={vicarias} />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;