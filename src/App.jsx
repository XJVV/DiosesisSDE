import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap, Tooltip } from 'react-leaflet';
import { MapPin, User, Phone, Mail, Calendar, Clock, Church, X, Menu, Search, Home, ArrowLeft } from 'lucide-react';
import 'leaflet/dist/leaflet.css'; // Importante para que el mapa se vea bien
import L from 'leaflet';

// --- Configuración de Iconos del Mapa ---
// Fix para iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Iconos personalizados
const churchIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2480/2480662.png', // Icono de iglesia
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// --- Componentes Auxiliares del Mapa ---

// Componente para manejar el zoom dinámico
const MapController = ({ viewMode, selectedVicaria, selectedSector, selectedParish }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedParish) {
      map.flyTo(selectedParish.coordenadas, 16, { duration: 1.5 });
    } else if (selectedSector) {
      // Zoom al sector (Centro aproximado)
      map.flyTo(selectedSector.centro, 14, { duration: 1.5 });
    } else if (selectedVicaria) {
      // Zoom a la vicaría
      map.flyTo(selectedVicaria.centro, 13, { duration: 1.5 });
    } else if (viewMode === 'map') {
      // Vista general de SDE
      map.flyTo([18.50, -69.85], 11.5, { duration: 1.5 });
    }
  }, [viewMode, selectedVicaria, selectedSector, selectedParish, map]);

  return null;
};

const DiocesisSDE = () => {
  const [selectedVicaria, setSelectedVicaria] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedParish, setSelectedParish] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('map'); // 'map', 'vicaria', 'sector'

  // --- DATOS GEOGRÁFICOS REALES ---
  // Polígono aproximado de Santo Domingo Este (para resaltar la zona)
  const sdeBorder = [
    [18.445, -69.900], // Suroeste (Río Ozama)
    [18.550, -69.900], // Noroeste
    [18.600, -69.750], // Noreste
    [18.480, -69.700], // Este
    [18.445, -69.800], // Sureste (Costa)
    [18.445, -69.900]  // Cierre
  ];

  const estructura = {
    vicarias: [
      {
        id: 1,
        nombre: "Vicaría I - Los Mina Norte",
        color: "#3b82f6", // Azul brillante
        centro: [18.510, -69.880],
        zona: [[18.49, -69.89], [18.53, -69.89], [18.53, -69.86], [18.49, -69.86]], // Rectángulo aprox
        sectores: [
          {
            id: 1,
            nombre: "Sector Los Mina Centro",
            centro: [18.505, -69.878],
            parroquias: [
              {
                id: 1,
                nombre: "Catedral San Vicente de Paúl",
                coordenadas: [18.5025, -69.8765], // Coordenada real aprox
                direccion: "Av. San Vicente de Paúl, Los Mina",
                telefono: "(809) 555-0101",
                email: "catedral@diocesissde.org.do",
                parroco: {
                  nombre: "P. José García Martínez",
                  foto: "https://randomuser.me/api/portraits/men/32.jpg",
                  ordenacion: "15 de agosto de 2005",
                  educacion: ["Licenciatura en Teología - PUCMM", "Maestría en Ciencias Bíblicas - UNIBE"],
                  experiencia: ["Párroco Catedral San Vicente (2020-Presente)", "Vicario Parroquial San Juan Bosco (2015-2020)"]
                },
                misas: [
                  { dia: "Lunes a Viernes", hora: "6:00 AM, 6:00 PM" },
                  { dia: "Domingo", hora: "7:00 AM, 9:00 AM, 6:00 PM" }
                ],
                imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Catedral_San_Vicente_de_Paul.jpg/800px-Catedral_San_Vicente_de_Paul.jpg"
              },
              {
                id: 2,
                nombre: "Parroquia Santa Rosa de Lima",
                coordenadas: [18.5150, -69.8720],
                direccion: "Av. Los Mina, Sector 2",
                telefono: "(809) 555-0102",
                email: "santarosa@diocesissde.org.do",
                parroco: {
                  nombre: "P. Manuel Rodríguez",
                  foto: "https://randomuser.me/api/portraits/men/45.jpg",
                  ordenacion: "10 de junio de 2008",
                  educacion: ["Licenciatura en Teología - PUCMM"],
                  experiencia: ["Párroco Santa Rosa (2019-Presente)"]
                },
                misas: [{ dia: "Domingo", hora: "8:00 AM, 10:00 AM" }],
                imagen: "https://via.placeholder.com/400x300?text=Santa+Rosa"
              }
            ]
          }
        ]
      },
      {
        id: 2,
        nombre: "Vicaría II - San Luis",
        color: "#10b981", // Verde esmeralda
        centro: [18.550, -69.800],
        zona: [[18.53, -69.83], [18.58, -69.83], [18.58, -69.76], [18.53, -69.76]],
        sectores: [
          {
            id: 2,
            nombre: "Sector San Luis Centro",
            centro: [18.555, -69.795],
            parroquias: [
              {
                id: 3,
                nombre: "Parroquia Nuestra Señora del Carmen",
                coordenadas: [18.5580, -69.7920],
                direccion: "Av. Venezuela, San Luis",
                telefono: "(809) 555-0202",
                email: "nscarmen@diocesissde.org.do",
                parroco: {
                  nombre: "P. Miguel Ángel Rodríguez",
                  foto: "https://randomuser.me/api/portraits/men/22.jpg",
                  ordenacion: "12 de junio de 2010",
                  educacion: ["Licenciatura en Teología Dogmática"],
                  experiencia: ["Párroco NS del Carmen (2018-Presente)"]
                },
                misas: [{ dia: "Domingo", hora: "8:00 AM, 10:00 AM" }],
                imagen: "https://via.placeholder.com/400x300?text=NS+Carmen"
              }
            ]
          }
        ]
      },
      {
        id: 3,
        nombre: "Vicaría III - Villa Duarte",
        color: "#f59e0b", // Ámbar
        centro: [18.475, -69.870],
        zona: [[18.45, -69.89], [18.49, -69.89], [18.49, -69.85], [18.45, -69.85]],
        sectores: [
          {
            id: 3,
            nombre: "Sector Villa Duarte Norte",
            centro: [18.472, -69.865],
            parroquias: [
              {
                id: 4,
                nombre: "Parroquia San Juan Bosco",
                coordenadas: [18.4700, -69.8680],
                direccion: "Calle Sanchez, Villa Duarte",
                telefono: "(809) 555-0303",
                email: "sjbosco@diocesissde.org.do",
                parroco: {
                  nombre: "P. Carlos Eduardo Pérez",
                  foto: "https://randomuser.me/api/portraits/men/50.jpg",
                  ordenacion: "20 de septiembre de 2012",
                  educacion: ["Maestría en Pedagogía Salesiana"],
                  experiencia: ["Párroco San Juan Bosco (2019-Presente)"]
                },
                misas: [{ dia: "Domingo", hora: "7:30 AM, 9:30 AM" }],
                imagen: "https://via.placeholder.com/400x300?text=San+Juan+Bosco"
              }
            ]
          }
        ]
      },
      {
        id: 4,
        nombre: "Vicaría IV - Mendoza",
        color: "#8b5cf6", // Violeta
        centro: [18.510, -69.830],
        zona: [[18.49, -69.85], [18.53, -69.85], [18.53, -69.80], [18.49, -69.80]],
        sectores: [
          {
            id: 4,
            nombre: "Sector Mendoza Este",
            centro: [18.512, -69.828],
            parroquias: [
              {
                id: 5,
                nombre: "Parroquia San Francisco de Asís",
                coordenadas: [18.5120, -69.8250],
                direccion: "Av. Mendoza, Sector 1",
                telefono: "(809) 555-0404",
                email: "sanfrancisco@diocesissde.org.do",
                parroco: {
                  nombre: "P. Antonio López",
                  foto: "https://randomuser.me/api/portraits/men/66.jpg",
                  ordenacion: "5 de octubre de 2013",
                  educacion: ["Licenciatura en Teología"],
                  experiencia: ["Párroco San Francisco (2020-Presente)"]
                },
                misas: [{ dia: "Domingo", hora: "8:00 AM, 10:00 AM" }],
                imagen: "https://via.placeholder.com/400x300?text=San+Francisco"
              }
            ]
          }
        ]
      }
    ]
  };

  const getAllParishes = () => {
    const parishes = [];
    estructura.vicarias.forEach(vicaria => {
      vicaria.sectores.forEach(sector => {
        sector.parroquias.forEach(parroquia => {
          parishes.push({
            ...parroquia,
            vicariaId: vicaria.id,
            vicariaNombre: vicaria.nombre,
            sectorId: sector.id,
            sectorNombre: sector.nombre,
            color: vicaria.color
          });
        });
      });
    });
    return parishes;
  };

  const filteredParishes = getAllParishes().filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.vicariaNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sectorNombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVicariaClick = (vicaria) => {
    setSelectedVicaria(vicaria);
    setViewMode('vicaria');
    setSelectedSector(null);
    setSelectedParish(null);
  };

  const handleSectorClick = (sector) => {
    setSelectedSector(sector);
    setViewMode('sector');
    setSelectedParish(null);
  };

  const resetView = () => {
    setViewMode('map');
    setSelectedVicaria(null);
    setSelectedSector(null);
    setSelectedParish(null);
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-slate-50 font-sans overflow-hidden">
      
      {/* --- SIDEBAR LATERAL --- */}
      <aside className={`fixed md:relative z-[1000] w-full md:w-96 h-full bg-white shadow-2xl transition-transform duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
        
        {/* Header del Sidebar */}
        <div className="bg-blue-900 text-white p-6 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Church size={100} />
          </div>
          <div className="relative z-10">
            <h1 className="text-2xl font-bold leading-tight">Diócesis de Santo Domingo Este</h1>
            <p className="text-blue-200 text-sm mt-1">Mapa Pastoral Interactivo</p>
          </div>
          <button 
            onClick={() => setShowSidebar(false)} 
            className="md:hidden absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Buscador y Navegación */}
        <div className="p-4 flex-1 overflow-y-auto">
          
          {/* Breadcrumbs de Navegación */}
          <div className="flex items-center gap-2 mb-6 text-sm">
            <button onClick={resetView} className="p-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition">
              <Home size={16} />
            </button>
            {(selectedVicaria || selectedSector) && <span className="text-gray-400">/</span>}
            {selectedVicaria && (
              <button onClick={() => { setViewMode('vicaria'); setSelectedSector(null); }} className="font-semibold text-gray-700 hover:text-blue-600 truncate max-w-[100px]">
                {selectedVicaria.nombre.split('-')[1]}
              </button>
            )}
            {selectedSector && (
              <>
                <span className="text-gray-400">/</span>
                <span className="font-semibold text-blue-600 truncate max-w-[100px]">{selectedSector.nombre}</span>
              </>
            )}
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar parroquia, sacerdote..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-sm"
            />
          </div>

          <div className="space-y-3">
            {searchTerm ? (
              filteredParishes.map(parish => (
                <div key={parish.id} onClick={() => { setSelectedParish(parish); setShowSidebar(false); }} className="group p-4 bg-white border border-gray-100 rounded-xl hover:shadow-lg cursor-pointer transition-all hover:border-blue-300">
                  <h3 className="font-bold text-gray-800 group-hover:text-blue-700 transition">{parish.nombre}</h3>
                  <p className="text-xs text-gray-500 mt-1">{parish.vicariaNombre}</p>
                </div>
              ))
            ) : viewMode === 'map' ? (
              // Lista de Vicarías
              estructura.vicarias.map(vicaria => (
                <div 
                  key={vicaria.id} 
                  onClick={() => handleVicariaClick(vicaria)}
                  className="p-4 rounded-xl cursor-pointer hover:shadow-md transition-all transform hover:-translate-y-1 border-l-4 bg-white shadow-sm"
                  style={{ borderLeftColor: vicaria.color }}
                >
                  <h3 className="font-bold text-gray-800 text-lg">{vicaria.nombre}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      {vicaria.sectores.length} Sectores
                    </span>
                    <ArrowLeft className="rotate-180 text-gray-300" size={16} />
                  </div>
                </div>
              ))
            ) : viewMode === 'vicaria' ? (
              // Lista de Sectores
              selectedVicaria.sectores.map(sector => (
                <div 
                  key={sector.id} 
                  onClick={() => handleSectorClick(sector)}
                  className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md cursor-pointer transition-all"
                >
                  <h3 className="font-bold text-gray-800">{sector.nombre}</h3>
                  <p className="text-sm text-gray-500 mt-1">{sector.parroquias.length} Parroquias</p>
                </div>
              ))
            ) : (
              // Lista de Parroquias
              selectedSector?.parroquias.map(parish => (
                <div key={parish.id} onClick={() => setSelectedParish(parish)} className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedParish?.id === parish.id ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-gray-100 hover:border-blue-300'}`}>
                  <h3 className="font-semibold text-gray-800">{parish.nombre}</h3>
                  <p className="text-xs text-gray-500 truncate">{parish.direccion}</p>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Footer del Sidebar */}
        <div className="p-4 border-t text-center text-xs text-gray-400 bg-gray-50">
          © 2024 Diócesis Santo Domingo Este
        </div>
      </aside>

      {/* --- ÁREA PRINCIPAL DEL MAPA (LEAFLET) --- */}
      <main className="flex-1 relative h-full w-full">
        {/* Botón flotante para abrir sidebar en móvil */}
        {!showSidebar && (
          <button 
            onClick={() => setShowSidebar(true)}
            className="absolute top-4 left-4 z-[999] p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
          >
            <Menu className="text-blue-900" />
          </button>
        )}

        <MapContainer 
          center={[18.7357, -70.1627]} // Centro de RD
          zoom={8} 
          scrollWheelZoom={true} 
          className="h-full w-full z-0"
        >
          {/* Capa base del mapa (Calles reales) */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController viewMode={viewMode} selectedVicaria={selectedVicaria} selectedSector={selectedSector} selectedParish={selectedParish} />

          {/* Polígono de SDE (Resaltado) */}
          <Polygon 
            positions={sdeBorder} 
            pathOptions={{ color: '#1e40af', fillColor: '#1e40af', fillOpacity: 0.05, weight: 2, dashArray: '5, 10' }} 
          />

          {/* Renderizado de Vicarías (Zonas coloreadas) */}
          {!selectedSector && estructura.vicarias.map(vicaria => (
            <Polygon 
              key={vicaria.id}
              positions={vicaria.zona}
              pathOptions={{ 
                color: vicaria.color, 
                fillColor: vicaria.color, 
                fillOpacity: selectedVicaria?.id === vicaria.id ? 0.3 : 0.4,
                weight: selectedVicaria?.id === vicaria.id ? 2 : 0
              }}
              eventHandlers={{
                click: () => handleVicariaClick(vicaria)
              }}
            >
              <Tooltip sticky direction="center" className="font-bold">{vicaria.nombre}</Tooltip>
            </Polygon>
          ))}

          {/* Renderizado de Parroquias (Pines) */}
          {selectedSector && selectedSector.parroquias.map(parish => (
            <Marker 
              key={parish.id} 
              position={parish.coordenadas}
              icon={churchIcon}
              eventHandlers={{
                click: () => setSelectedParish(parish)
              }}
            >
              {/* No Popup automático, usamos el panel lateral o modal */}
            </Marker>
          ))}

        </MapContainer>

        {/* --- MODAL DE INFORMACIÓN DE PARROQUIA (Overlay Flotante) --- */}
        {selectedParish && (
          <div className="absolute top-4 right-4 z-[1000] w-96 max-h-[calc(100vh-2rem)] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-y-auto border border-white/20 animate-in fade-in slide-in-from-right-10 duration-300">
            <div className="relative">
              <img src={selectedParish.imagen} className="w-full h-48 object-cover rounded-t-2xl" alt={selectedParish.nombre} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <h2 className="text-white font-bold text-xl leading-tight shadow-sm">{selectedParish.nombre}</h2>
              </div>
              <button onClick={() => setSelectedParish(null)} className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Información General */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <MapPin className="text-blue-500 shrink-0" size={18} />
                  <span>{selectedParish.direccion}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-blue-500 shrink-0" size={18} />
                  <span>{selectedParish.telefono}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-blue-500 shrink-0" size={18} />
                  <span className="truncate">{selectedParish.email}</span>
                </div>
              </div>

              {/* Horarios */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-3">
                  <Clock size={18} /> Horarios de Misas
                </h3>
                <div className="space-y-2">
                  {selectedParish.misas.map((misa, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">{misa.dia}</span>
                      <span className="text-gray-600">{misa.hora}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Párroco */}
              <div>
                <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                  <User className="text-blue-600" size={20} /> Sacerdote / Párroco
                </h3>
                <div className="flex gap-4 items-start">
                  <img src={selectedParish.parroco.foto} className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 shadow-sm" alt="Párroco" />
                  <div>
                    <h4 className="font-bold text-gray-900">{selectedParish.parroco.nombre}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Calendar size={12} /> Ord: {selectedParish.parroco.ordenacion}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Formación</p>
                    <ul className="text-sm space-y-1 border-l-2 border-blue-200 pl-3">
                      {selectedParish.parroco.educacion.map((edu, i) => <li key={i} className="text-gray-600">{edu}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Experiencia</p>
                    <ul className="text-sm space-y-1 border-l-2 border-green-200 pl-3">
                      {selectedParish.parroco.experiencia.map((exp, i) => <li key={i} className="text-gray-600">{exp}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DiocesisSDE;