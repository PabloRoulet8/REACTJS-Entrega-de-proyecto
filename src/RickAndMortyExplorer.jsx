import { useState, useEffect } from 'react';

export default function RickAndMortyExplorer() {
  const [personajes, setPersonajes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltrado, setEstadoFiltrado] = useState('');
  const [pagina, setPagina] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  
  // Nuevo estado para el modal
  const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null);

  const fetchPersonajes = async (limpiar = false) => {
    setCargando(true);
    setError('');
    try {
      const url = `https://rickandmortyapi.com/api/character/?page=${pagina}&name=${busqueda}&status=${estadoFiltrado}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('No se encontraron personajes');
      
      const data = await res.json();
      if (limpiar) {
        setPersonajes(data.results);
      } else {
        setPersonajes(prev => [...prev, ...data.results]);
      }
    } catch (err) {
      setError(err.message);
      if (limpiar) setPersonajes([]);
    }
    setCargando(false);
  };

  useEffect(() => {
    setPagina(1);
    fetchPersonajes(true);
  }, [busqueda, estadoFiltrado]);

  useEffect(() => {
    if (pagina > 1) fetchPersonajes(false);
  }, [pagina]);

  return (
    <div style={{ fontFamily: 'Arial', padding: '20px', maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
      <h2>Rick and Morty Explorer</h2>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Buscar personaje por nombre..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ padding: '8px', flexGrow: 1 }}
        />
        <select value={estadoFiltrado} onChange={(e) => setEstadoFiltrado(e.target.value)} style={{ padding: '8px' }}>
          <option value="">Todos los estados</option>
          <option value="alive">Vivo (Alive)</option>
          <option value="dead">Muerto (Dead)</option>
          <option value="unknown">Desconocido (Unknown)</option>
        </select>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {personajes.map(pj => (
          <div 
            key={pj.id} 
            onClick={() => setPersonajeSeleccionado(pj)} // Abre el modal al clickear
            style={{ background: '#3c3e44', color: 'white', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img src={pj.image} alt={pj.name} style={{ width: '100%', height: 'auto' }} />
            <div style={{ padding: '15px' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{pj.name}</h3>
              <p style={{ margin: '5px 0' }}>
                <span style={{ 
                  display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', marginRight: '5px',
                  background: pj.status === 'Alive' ? '#55cc44' : pj.status === 'Dead' ? '#d63d2e' : '#9e9e9e' 
                }}></span>
                {pj.status} - {pj.species}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        {cargando && <p>Cargando personajes del multiverso... 🛸</p>}
        {!cargando && personajes.length > 0 && (
          <button 
            onClick={() => setPagina(p => p + 1)}
            style={{ padding: '10px 20px', fontSize: '16px', background: '#ff9800', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Cargar más
          </button>
        )}
      </div>

      {/* MODAL DE DETALLE DEL PERSONAJE */}
      {personajeSeleccionado && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ background: '#202329', color: 'white', padding: '30px', borderRadius: '10px', maxWidth: '600px', width: '90%', position: 'relative' }}>
            <button 
              onClick={() => setPersonajeSeleccionado(null)} 
              style={{ position: 'absolute', top: '15px', right: '15px', padding: '5px 10px', cursor: 'pointer', background: 'red', color: 'white', border: 'none', borderRadius: '5px' }}
            >
              Cerrar
            </button>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
               <img src={personajeSeleccionado.image} alt={personajeSeleccionado.name} style={{ borderRadius: '10px', width: '100%', maxWidth: '200px' }} />
               <div style={{ flex: 1 }}>
                  <h2 style={{ marginTop: 0 }}>{personajeSeleccionado.name}</h2>
                  <hr style={{ borderColor: '#444' }} />
                  <p><strong>Estado:</strong> {personajeSeleccionado.status}</p>
                  <p><strong>Especie:</strong> {personajeSeleccionado.species}</p>
                  <p><strong>Género:</strong> {personajeSeleccionado.gender}</p>
                  <p><strong>Origen:</strong> {personajeSeleccionado.origin.name}</p>
                  <p><strong>Ubicación actual:</strong> {personajeSeleccionado.location.name}</p>
                  <p><strong>Apariciones:</strong> {personajeSeleccionado.episode.length} episodio(s)</p>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}