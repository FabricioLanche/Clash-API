// Configuración de la API
const API_BASE_URL = 'http://localhost:5000';

// Funciones de consulta
async function buscarJugador() {
  const nombre = document.getElementById("nombreJugador").value.trim();

  if (!nombre) {
    mostrarError("resultadoJugador", "Por favor ingresa un nombre de usuario");
    return;
  }

  mostrarCargando("resultadoJugador");

  try {
    const res = await fetch(`${API_BASE_URL}/jugador?nombre=${encodeURIComponent(nombre)}`);
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    mostrarResultado(data, "resultadoJugador");
  } catch (error) {
    mostrarError("resultadoJugador", `Error al buscar jugador: ${error.message}`);
  }
}

async function buscarClanes() {
  const orden = document.getElementById("ordenClan").value;
  const umbral = document.getElementById("umbralClan").value || 0;

  mostrarCargando("resultadoClanes");

  try {
    const res = await fetch(`${API_BASE_URL}/clanes?orden=${orden}&umbral=${umbral}`);

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    mostrarResultado(data, "resultadoClanes");
  } catch (error) {
    mostrarError("resultadoClanes", `Error al buscar clanes: ${error.message}`);
  }
}

async function buscarMazos() {
  const carta = document.getElementById("cartaMazo").value.trim();

  if (!carta) {
    mostrarError("resultadoMazos", "Por favor ingresa el ID o nombre de una carta");
    return;
  }

  mostrarCargando("resultadoMazos");

  try {
    const res = await fetch(`${API_BASE_URL}/mazos?carta=${encodeURIComponent(carta)}`);

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    mostrarResultado(data, "resultadoMazos");
  } catch (error) {
    mostrarError("resultadoMazos", `Error al buscar mazos: ${error.message}`);
  }
}

async function buscarCartas() {
  const tipo = document.getElementById("tipoCarta").value;
  const rareza = document.getElementById("rarezaCarta").value;

  mostrarCargando("resultadoCartas");

  try {
    let url = `${API_BASE_URL}/cartas?`;
    if (tipo) url += `tipo=${encodeURIComponent(tipo)}&`;
    if (rareza) url += `rareza=${encodeURIComponent(rareza)}&`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    mostrarResultado(data, "resultadoCartas");
  } catch (error) {
    mostrarError("resultadoCartas", `Error al buscar cartas: ${error.message}`);
  }
}

// Funciones auxiliares
function mostrarResultado(data, elementoId) {
  const ul = document.getElementById(elementoId);
  ul.innerHTML = "";

  if (!data || data.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No se encontraron resultados";
    li.className = "no-results";
    ul.appendChild(li);
    return;
  }

  data.forEach(fila => {
    const li = document.createElement("li");

    // Formatear los datos de manera más legible
    if (Array.isArray(fila)) {
      li.textContent = fila.join(" | ");
    } else if (typeof fila === 'object') {
      // Si es un objeto, mostrar las propiedades de manera más legible
      const entries = Object.entries(fila);
      li.textContent = entries.map(([key, value]) => `${key}: ${value}`).join(" | ");
    } else {
      li.textContent = String(fila);
    }

    ul.appendChild(li);
  });
}

function mostrarError(elementoId, mensaje) {
  const ul = document.getElementById(elementoId);
  ul.innerHTML = "";

  const li = document.createElement("li");
  li.textContent = mensaje;
  li.className = "no-results";
  ul.appendChild(li);
}

function mostrarCargando(elementoId) {
  const ul = document.getElementById(elementoId);
  ul.innerHTML = "";

  const li = document.createElement("li");
  li.textContent = "Cargando...";
  li.style.textAlign = "center";
  li.style.fontStyle = "italic";
  li.style.color = "#6b7280";
  ul.appendChild(li);
}

// Event listeners para Enter en los inputs
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('nombreJugador').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      buscarJugador();
    }
  });

  document.getElementById('cartaMazo').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      buscarMazos();
    }
  });

  document.getElementById('umbralClan').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      buscarClanes();
    }
  });
});