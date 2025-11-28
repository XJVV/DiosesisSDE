import React, { useState } from 'react';
import { MapPin, User, Phone, Mail, Calendar, Clock, Church, X, Menu, Search, Home } from 'lucide-react';

const DiocesisSDE = () => {
  const [selectedVicaria, setSelectedVicaria] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedParish, setSelectedParish] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('map'); // 'map', 'vicaria', 'sector'

  // Estructura jerárquica: Vicarías -> Sectores -> Parroquias
  const estructura = {
    vicarias: [
      {
        id: 1,
        nombre: "Vicaría I - Los Mina Norte",
        color: "#1e3a8a",
        sectores: [
          {
            id: 1,
            nombre: "Sector Los Mina Centro",
            parroquias: [
              {
                id: 1,
                nombre: "Catedral San Vicente de Paúl",
                direccion: "Calle Principal, Los Mina",
                telefono: "(809) 555-0101",
                email: "catedral@diocesissde.org.do",
                parroco: {
                  nombre: "P. José García Martínez",
                  foto: "https://via.placeholder.com/150",
                  ordenacion: "15 de agosto de 2005",
                  educacion: [
                    "Licenciatura en Teología - PUCMM",
                    "Maestría en Ciencias Bíblicas - UNIBE"
                  ],
                  experiencia: [
                    "Párroco Catedral San Vicente (2020-Presente)",
                    "Vicario Parroquial San Juan Bosco (2015-2020)"
                  ]
                },
                misas: [
                  { dia: "Lunes a Viernes", hora: "6:00 AM, 6:00 PM" },
                  { dia: "Sábado", hora: "6:00 PM" },
                  { dia: "Domingo", hora: "7:00 AM, 9:00 AM, 11:00 AM, 6:00 PM" }
                ],
                imagen: "https://via.placeholder.com/400x300"
              },
              {
                id: 2,
                nombre: "Parroquia Santa Rosa de Lima",
                direccion: "Av. Los Mina, Sector 2",
                telefono: "(809) 555-0102",
                email: "santarosa@diocesissde.org.do",
                parroco: {
                  nombre: "P. Manuel Rodríguez",
                  foto: "https://via.placeholder.com/150",
                  ordenacion: "10 de junio de 2008",
                  educacion: [
                    "Licenciatura en Teología - PUCMM"
                  ],
                  experiencia: [
                    "Párroco Santa Rosa (2019-Presente)"
                  ]
                },
                misas: [
                  { dia: "Domingo", hora: "8:00 AM, 10:00 AM" }
                ],
                imagen: "https://via.placeholder.com/400x300"
              }
            ]
          }
        ]
      },
      {
        id: 2,
        nombre: "Vicaría II - San Luis",
        color: "#065f46",
        sectores: [
          {
            id: 2,
            nombre: "Sector San Luis Centro",
            parroquias: [
              {
                id: 3,
                nombre: "Parroquia Nuestra Señora del Carmen",
                direccion: "Av. Venezuela, San Luis",
                telefono: "(809) 555-0202",
                email: "nscarmen@diocesissde.org.do",
                parroco: {
                  nombre: "P. Miguel Ángel Rodríguez",
                  foto: "https://via.placeholder.com/150",
                  ordenacion: "12 de junio de 2010",
                  educacion: [
                    "Licenciatura en Teología Dogmática",
                    "Especialización en Pastoral Familiar"
                  ],
                  experiencia: [
                    "Párroco NS del Carmen (2018-Presente)"
                  ]
                },
                misas: [
                  { dia: "Lunes a Viernes", hora: "6:30 AM, 7:00 PM" },
                  { dia: "Domingo", hora: "8:00 AM, 10:00 AM, 12:00 PM" }
                ],
                imagen: "https://via.placeholder.com/400x300"
              }
            ]
          }
        ]
      },
      {
        id: 3,
        nombre: "Vicaría III - Villa Duarte",
        color: "#7c2d12",
        sectores: [
          {
            id: 3,
            nombre: "Sector Villa Duarte Norte",
            parroquias: [
              {
                id: 4,
                nombre: "Parroquia San Juan Bosco",
                direccion: "Calle Sanchez, Villa Duarte",
                telefono: "(809) 555-0303",
                email: "sjbosco@diocesissde.org.do",
                parroco: {
                  nombre: "P. Carlos Eduardo Pérez",
                  foto: "https://via.placeholder.com/150",
                  ordenacion: "20 de septiembre de 2012",
                  educacion: [
                    "Licenciatura en Teología",
                    "Maestría en Pedagogía Salesiana"
                  ],
                  experiencia: [
                    "Párroco San Juan Bosco (2019-Presente)"
                  ]
                },
                misas: [
                  { dia: "Domingo", hora: "7:30 AM, 9:30 AM, 11:30 AM" }
                ],
                imagen: "https://via.placeholder.com/400x300"
              }
            ]
          }
        ]
      },
      {
        id: 4,
        nombre: "Vicaría IV - Mendoza",
        color: "#581c87",
        sectores: [
          {
            id: 4,
            nombre: "Sector Mendoza Este",
            parroquias: [
              {
                id: 5,
                nombre: "Parroquia San Francisco de Asís",
                direccion: "Av. Mendoza, Sector 1",
                telefono: "(809) 555-0404",
                email: "sanfrancisco@diocesissde.org.do",
                parroco: {
                  nombre: "P. Antonio López",
                  foto: "https://via.placeholder.com/150",
                  ordenacion: "5 de octubre de 2013",
                  educacion: [
                    "Licenciatura en Teología"
                  ],
                  experiencia: [
                    "Párroco San Francisco (2020-Presente)"
                  ]
                },
                misas: [
                  { dia: "Domingo", hora: "8:00 AM, 10:00 AM" }
                ],
                imagen: "https://via.placeholder.com/400x300"
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

  const handleBackToMap = () => {
    setViewMode('map');
    setSelectedVicaria(null);
    setSelectedSector(null);
    setSelectedParish(null);
  };

  const handleBackToVicaria = () => {
    setViewMode('vicaria');
    setSelectedSector(null);
    setSelectedParish(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Church className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Diócesis de Santo Domingo Este</h1>
                <p className="text-blue-200 text-sm">Mapa de Parroquias</p>
              </div>
            </div>
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-2 hover:bg-blue-800 rounded transition"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative w-80 bg-white shadow-xl transition-transform z-20 h-full overflow-y-auto`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Navegación</h2>
              <button 
                onClick={() => setShowSidebar(false)}
                className="lg:hidden p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Breadcrumb */}
            {(selectedVicaria || selectedSector) && (
              <div className="mb-4 flex items-center gap-2 text-sm">
                <button 
                  onClick={handleBackToMap}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Home className="w-4 h-4" />
                  Inicio
                </button>
                {selectedVicaria && (
                  <>
                    <span className="text-gray-400">/</span>
                    <button 
                      onClick={() => setViewMode('vicaria')}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {selectedVicaria.nombre.split(' - ')[1]}
                    </button>
                  </>
                )}
                {selectedSector && (
                  <>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600">{selectedSector.nombre}</span>
                  </>
                )}
              </div>
            )}

            {/* Búsqueda */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar parroquia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Lista dinámica */}
            <div className="space-y-2">
              {searchTerm ? (
                // Resultados de búsqueda
                filteredParishes.map(parish => (
                  <button
                    key={parish.id}
                    onClick={() => {
                      setSelectedParish(parish);
                      setShowSidebar(false);
                    }}
                    className="w-full text-left p-4 rounded-lg bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-blue-500 transition"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-800">{parish.nombre}</h3>
                        <p className="text-sm text-gray-600">{parish.vicariaNombre}</p>
                        <p className="text-xs text-gray-500">{parish.sectorNombre}</p>
                      </div>
                    </div>
                  </button>
                ))
              ) : viewMode === 'map' ? (
                // Vista de vicarías
                estructura.vicarias.map(vicaria => (
                  <button
                    key={vicaria.id}
                    onClick={() => handleVicariaClick(vicaria)}
                    className="w-full text-left p-4 rounded-lg hover:shadow-md transition"
                    style={{ 
                      backgroundColor: `${vicaria.color}15`,
                      borderLeft: `4px solid ${vicaria.color}`
                    }}
                  >
                    <h3 className="font-bold text-gray-800">{vicaria.nombre}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {vicaria.sectores.reduce((acc, s) => acc + s.parroquias.length, 0)} parroquias
                    </p>
                  </button>
                ))
              ) : viewMode === 'vicaria' && selectedVicaria ? (
                // Vista de sectores
                selectedVicaria.sectores.map(sector => (
                  <button
                    key={sector.id}
                    onClick={() => handleSectorClick(sector)}
                    className="w-full text-left p-4 rounded-lg bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-blue-500 transition"
                  >
                    <h3 className="font-semibold text-gray-800">{sector.nombre}</h3>
                    <p className="text-sm text-gray-600">{sector.parroquias.length} parroquias</p>
                  </button>
                ))
              ) : viewMode === 'sector' && selectedSector ? (
                // Vista de parroquias
                selectedSector.parroquias.map(parish => (
                  <button
                    key={parish.id}
                    onClick={() => {
                      setSelectedParish(parish);
                      setShowSidebar(false);
                    }}
                    className={`w-full text-left p-4 rounded-lg transition ${
                      selectedParish?.id === parish.id 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-800">{parish.nombre}</h3>
                        <p className="text-sm text-gray-600">{parish.direccion}</p>
                      </div>
                    </div>
                  </button>
                ))
              ) : null}
            </div>
          </div>
        </aside>

        {/* Área principal - Mapa */}
        <main className="flex-1 relative bg-gradient-to-br from-blue-50 to-green-50">
          <div className="absolute inset-0">
            <svg viewBox="0 0 1000 800" className="w-full h-full">
              {/* Mapa de República Dominicana completo */}
              
              {/* Resto de RD (no interactivo) - gris */}
              <g opacity="0.3">
                {/* Región Norte */}
                <path d="M 100 150 L 900 150 L 900 300 L 100 300 Z" 
                      fill="#d1d5db" stroke="#9ca3af" strokeWidth="2"/>
                <text x="500" y="230" textAnchor="middle" fill="#6b7280" fontSize="20">Región Norte</text>
                
                {/* Región Oeste */}
                <path d="M 100 320 L 300 320 L 300 650 L 100 650 Z" 
                      fill="#d1d5db" stroke="#9ca3af" strokeWidth="2"/>
                <text x="200" y="490" textAnchor="middle" fill="#6b7280" fontSize="18">Oeste</text>
                
                {/* Región Sur */}
                <path d="M 320 550 L 650 550 L 650 700 L 320 700 Z" 
                      fill="#d1d5db" stroke="#9ca3af" strokeWidth="2"/>
                <text x="485" y="630" textAnchor="middle" fill="#6b7280" fontSize="18">Región Sur</text>
                
                {/* Región Suroeste */}
                <path d="M 100 670 L 310 670 L 310 750 L 100 750 Z" 
                      fill="#d1d5db" stroke="#9ca3af" strokeWidth="2"/>
                <text x="205" y="715" textAnchor="middle" fill="#6b7280" fontSize="16">Suroeste</text>
              </g>

              {/* Santo Domingo Este - INTERACTIVO */}
              <g>
                <text x="700" y="380" textAnchor="middle" fill="#1e40af" fontSize="24" fontWeight="bold">
                  SANTO DOMINGO ESTE
                </text>
                
                {viewMode === 'map' ? (
                  // Vista del mapa completo de SDE con vicarías
                  <>
                    {estructura.vicarias.map((vicaria, idx) => {
                      const positions = [
                        { x: 550, y: 400, w: 140, h: 120 }, // Vicaría I - Los Mina
                        { x: 700, y: 400, w: 140, h: 120 }, // Vicaría II - San Luis
                        { x: 550, y: 530, w: 140, h: 120 }, // Vicaría III - Villa Duarte
                        { x: 700, y: 530, w: 140, h: 120 }  // Vicaría IV - Mendoza
                      ];
                      const pos = positions[idx];
                      
                      return (
                        <g key={vicaria.id} 
                           onClick={() => handleVicariaClick(vicaria)}
                           className="cursor-pointer hover:opacity-80 transition"
                           style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
                          <rect 
                            x={pos.x} 
                            y={pos.y} 
                            width={pos.w} 
                            height={pos.h}
                            fill={vicaria.color}
                            fillOpacity="0.7"
                            stroke="white" 
                            strokeWidth="3"
                            rx="8"
                          />
                          <text 
                            x={pos.x + pos.w/2} 
                            y={pos.y + pos.h/2 - 10} 
                            textAnchor="middle" 
                            fill="white" 
                            fontSize="16"
                            fontWeight="bold"
                          >
                            {vicaria.nombre.split(' - ')[1]}
                          </text>
                          <text 
                            x={pos.x + pos.w/2} 
                            y={pos.y + pos.h/2 + 15} 
                            textAnchor="middle" 
                            fill="white" 
                            fontSize="12"
                          >
                            {vicaria.sectores.reduce((acc, s) => acc + s.parroquias.length, 0)} parroquias
                          </text>
                        </g>
                      );
                    })}
                  </>
                ) : viewMode === 'vicaria' && selectedVicaria ? (
                  // Vista de sectores dentro de una vicaría
                  <>
                    <rect x="500" y="350" width="400" height="350" 
                          fill={selectedVicaria.color} fillOpacity="0.1" 
                          stroke={selectedVicaria.color} strokeWidth="3" rx="10"/>
                    
                    {selectedVicaria.sectores.map((sector, idx) => (
                      <g key={sector.id}
                         onClick={() => handleSectorClick(sector)}
                         className="cursor-pointer hover:opacity-80 transition">
                        <rect 
                          x={520 + (idx % 2) * 180} 
                          y={380 + Math.floor(idx / 2) * 150}
                          width={160}
                          height={130}
                          fill={selectedVicaria.color}
                          fillOpacity="0.6"
                          stroke="white"
                          strokeWidth="3"
                          rx="8"
                        />
                        <text 
                          x={600 + (idx % 2) * 180} 
                          y={440 + Math.floor(idx / 2) * 150}
                          textAnchor="middle"
                          fill="white"
                          fontSize="14"
                          fontWeight="bold"
                        >
                          {sector.nombre}
                        </text>
                        <text 
                          x={600 + (idx % 2) * 180} 
                          y={465 + Math.floor(idx / 2) * 150}
                          textAnchor="middle"
                          fill="white"
                          fontSize="12"
                        >
                          {sector.parroquias.length} parroquias
                        </text>
                      </g>
                    ))}
                  </>
                ) : viewMode === 'sector' && selectedSector ? (
                  // Vista de parroquias dentro de un sector
                  <>
                    <rect x="500" y="350" width="400" height="350" 
                          fill={selectedVicaria.color} fillOpacity="0.1" 
                          stroke={selectedVicaria.color} strokeWidth="3" rx="10"/>
                    
                    {selectedSector.parroquias.map((parish, idx) => (
                      <g key={parish.id}
                         onClick={() => setSelectedParish(parish)}
                         className="cursor-pointer hover:opacity-90 transition">
                        <circle 
                          cx={620 + (idx % 2) * 160} 
                          cy={430 + Math.floor(idx / 2) * 100}
                          r="20"
                          fill="#dc2626"
                          stroke="white"
                          strokeWidth="4"
                        />
                        <text 
                          x={620 + (idx % 2) * 160} 
                          y={470 + Math.floor(idx / 2) * 100}
                          textAnchor="middle"
                          fill="#1f2937"
                          fontSize="13"
                          fontWeight="600"
                        >
                          {parish.nombre.length > 25 ? parish.nombre.substring(0, 25) + '...' : parish.nombre}
                        </text>
                      </g>
                    ))}
                  </>
                ) : null}
              </g>
            </svg>
          </div>

          {/* Panel de información de parroquia */}
          {selectedParish && (
            <div className="absolute top-4 right-4 w-96 max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-y-auto">
              <div className="relative">
                <img 
                  src={selectedParish.imagen} 
                  alt={selectedParish.nombre}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <button
                  onClick={() => setSelectedParish(null)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedParish.nombre}</h2>
                <p className="text-blue-600 font-medium mb-4">{selectedParish.sectorNombre}</p>

                {/* Información de contacto */}
                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                    <span className="text-gray-700">{selectedParish.direccion}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">{selectedParish.telefono}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">{selectedParish.email}</span>
                  </div>
                </div>

                {/* Horarios */}
                <div className="mb-6 pb-6 border-b">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Horarios de Misas
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
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Párroco
                  </h3>
                  
                  <div className="flex items-start gap-4 mb-4">
                    <img 
                      src={selectedParish.parroco.foto} 
                      alt={selectedParish.parroco.nombre}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">{selectedParish.parroco.nombre}</h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <Calendar className="w-4 h-4" />
                        Ordenación: {selectedParish.parroco.ordenacion}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-800 mb-2">Formación Académica</h5>
                    <ul className="space-y-1">
                      {selectedParish.parroco.educacion.map((edu, idx) => (
                        <li key={idx} className="text-sm text-gray-600 pl-4 border-l-2 border-blue-300">
                          {edu}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Experiencia Pastoral</h5>
                    <ul className="space-y-1">
                      {selectedParish.parroco.experiencia.map((exp, idx) => (
                        <li key={idx} className="text-sm text-gray-600 pl-4 border-l-2 border-green-300">
                          {exp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DiocesisSDE;