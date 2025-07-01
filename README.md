# Clash-API ⚔️

Una pequeña API desarrollada con **Flask** y conectada a una base de datos **PostgreSQL**, basada en un modelo inspirado en juegos de estrategia con clanes, jugadores, cartas y batallas.

## 📦 Requisitos

Antes de ejecutar este proyecto, asegúrate de tener instalado:

- Python 3.10 o superior
- PostgreSQL

## 🔧 Instalación

1. Clona el repositorio o descarga los archivos del proyecto.
2. Abre una terminal en la carpeta del proyecto.
3. Instala las dependencias necesarias:

```bash
pip install flask psycopg2
pip install flask-cors
```

## 🚀 Ejecutar la API

Asegúrate de tener tu base de datos PostgreSQL corriendo y que los datos de conexión coincidan con los configurados en `app.py`. Luego ejecuta:

```bash
python app.py
```

La API estará disponible en: [http://localhost:5000](http://localhost:5000)

## 📋 Endpoints disponibles

- `/jugador?nombre=...` → Buscar jugador por nombre.
- `/clanes?orden=asc|desc&umbral=N` → Filtrar clanes por trofeos.
- `/mazos?carta=...` → Buscar mazos que contienen una carta por nombre o ID.
- `/cartas?tipo=...&rareza=...` → Filtrar cartas por tipo y rareza.
- `/top10` → Top 10 jugadores por trofeos.
- `/estadisticas?nombre=...&temporada=...` → Ver estadísticas de jugador.

## 📁 Estructura

- `app.py` → Archivo principal del backend Flask.
- `index.html` → Interfaz sencilla en HTML para interactuar con la API.
- `requirements.txt` → (opcional) Puedes generar uno con `pip freeze > requirements.txt`.

## 🧠 Notas

- Esta API es de propósito educativo.
- Puedes modificar los datos de conexión en `app.py` si tu base de datos tiene una configuración distinta.


---
