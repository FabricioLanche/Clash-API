from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app)

conn = psycopg2.connect(
    dbname=os.getenv('DB_NAME'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    host=os.getenv('DB_HOST'),
    port=os.getenv('DB_PORT')
)
cursor = conn.cursor()


@app.route('/')
def hello_world():
    return 'API activa: Flask + PostgreSQL'


# 1. Buscar jugador por nombre
@app.route('/jugador', methods=['GET'])
def buscar_jugador():
    nombre = request.args.get('nombre')
    cursor.execute("""
        SELECT j.id_jugador, j.nombre_usuario, j.nivel, j.trofeos, c.nombre AS clan
        FROM Jugador j
        LEFT JOIN Clan c ON j.id_clan = c.id_clan
        WHERE j.nombre_usuario ILIKE %s
    """, ('%' + nombre + '%',))
    return jsonify(cursor.fetchall())


# 2. Buscar clanes filtrados por trofeos totales
@app.route('/clanes', methods=['GET'])
def buscar_clanes():
    orden = request.args.get('orden', 'asc')
    umbral = request.args.get('umbral', 0)

    if orden.lower() not in ['asc', 'desc']:
        orden = 'asc'

    cursor.execute(f"""
        SELECT nombre, trofeos_totales
        FROM Clan
        WHERE trofeos_totales >= %s
        ORDER BY trofeos_totales {orden.upper()}
    """, (umbral,))
    return jsonify(cursor.fetchall())


# 3. Buscar mazos que contengan una carta por nombre o ID
@app.route('/mazos', methods=['GET'])
def buscar_mazos():
    carta = request.args.get('carta')  # puede ser nombre o id

    if carta.isdigit():
        cursor.execute("""
            SELECT m.id_mazo, m.nombre, j.nombre_usuario
            FROM Mazo m
            JOIN Jugador j ON m.id_jugador = j.id_jugador
            JOIN Mazo_carta mc ON m.id_mazo = mc.id_mazo
            WHERE mc.id_carta = %s
        """, (int(carta),))
    else:
        cursor.execute("""
            SELECT m.id_mazo, m.nombre, j.nombre_usuario
            FROM Mazo m
            JOIN Jugador j ON m.id_jugador = j.id_jugador
            JOIN Mazo_carta mc ON m.id_mazo = mc.id_mazo
            JOIN Carta c ON mc.id_carta = c.id_carta
            WHERE c.nombre ILIKE %s
        """, ('%' + carta + '%',))

    return jsonify(cursor.fetchall())


# 4. Buscar cartas por tipo y rareza
@app.route('/cartas', methods=['GET'])
def buscar_cartas():
    tipo = request.args.get('tipo')
    rareza = request.args.get('rareza')

    filtros = []
    valores = []

    if tipo:
        filtros.append("c.tipo = %s")
        valores.append(tipo)
    if rareza:
        filtros.append("c.rareza = %s")
        valores.append(rareza)

    where_clause = "WHERE " + " AND ".join(filtros) if filtros else ""

    cursor.execute(f"""
        SELECT c.id_carta, c.nombre, c.rareza, c.tipo, c.coste_elixir
        FROM Carta c
        {where_clause}
    """, tuple(valores))

    return jsonify(cursor.fetchall())


if __name__ == '__main__':
    app.run('FLASK_DEBUG', 'FLASK_PORT')