import joblib
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS  # Importa CORS
from tensorflow.keras.models import load_model
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf

modelo_recomendacion = load_model("model_artistas.h5")
data_api = pd.read_csv("ml_dataframe_ver3.csv")
artist_ids_api = data_api['artist_name'].astype('category').cat.codes
label_encoders = {}
categorical_columns = ["playlist_name", "artist_name", "track_name", "album_name"]

for column in categorical_columns:
    le = LabelEncoder()
    data_api[column] = le.fit_transform(data_api[column])
    label_encoders[column] = le


def get_similar_artists_api(model,artist_name, data_model, n_similar=10, max_iterations=10):
    # Encuentra el índice del artista en la columna 'artist_name' de data_model
    artist_id = artist_ids_api[data_model['artist_name'] == artist_name].values[0]


    # Obtiene la representación vectorial (embedding) del artista desde la primera capa de la red
    artist_embedding = model.layers[0].get_weights()[0][artist_id]

    # Inicializa una lista para almacenar los artistas similares
    similar_artists = [artist_id]
    iteration = 0

    while len(similar_artists) < n_similar and iteration < max_iterations :
        # Calcula las distancias entre el embedding del artista y los embeddings de todos los artistas en el modelo
        distances = tf.norm(model.layers[0].get_weights()[0] - artist_embedding, axis=1).numpy()


        # Excluye los artistas ya considerados
        distances[similar_artists] = np.inf

        print(f'Iteration {iteration}: {distances}')

        # Encuentra el índice del siguiente artista más similar
        next_artist = np.argmin(distances)

        
        if iteration == 0:
            similar_artists = similar_artists[1:]


        # Agrega el siguiente artista más similar a la lista
        # similar_artists.append(next_artist)
        if next_artist not in similar_artists:
            print(next_artist)
            similar_artists.append(next_artist)
        else:
            # Get the next closest artist
            next_artist = np.argsort(distances)[2]
            similar_artists.append(next_artist)
            
        iteration += 1


    # Obtiene los nombres de los artistas similares en base a sus índices
    similar_artist_names = data_model['artist_name'].iloc[similar_artists].values

    return label_encoders['artist_name'].inverse_transform(similar_artist_names)


def obtener_cancion_aleatoria(artist_name):
    # Filtrar el DataFrame por el nombre del artista
    artist_songs = data_api[data_api['artist_name'] == artist_name]

    if artist_songs.empty:
        return "Artista no encontrado"

    # Elegir una canción aleatoria del artista
    random_song = artist_songs.sample(1)
    
    # Obtener el nombre del artista y el nombre de la canción
    artist = random_song['artist_name'].values[0]
    song = random_song['track_name'].values[0]

    return artist, song


def obtener_canciones_aleatorias(lista_de_artistas):
    resultados = []
    for artista in lista_de_artistas:
        artist, song = obtener_cancion_aleatoria(artista)
        resultados.append((artist, song))
    return resultados

app = Flask(__name__)
CORS(app)  # Habilita CORS para tu aplicación Flask

@app.route('/modelo', methods=['POST'])
def getProducts():
    try:
        data = request.get_json()

        if data is None:
            return jsonify({'error': 'El cuerpo de la solicitud debe contener datos JSON'}), 400

        
        artist = data.get('nombre', "Ed Sheeran")
        print("Este es el nombre del artista: "+str(artist))
        
        
        artistlabel = label_encoders['artist_name'].transform([artist])[0]

        pred = get_similar_artists_api(modelo_recomendacion, artistlabel, data_api)
        pred = pred.tolist()
        

        return jsonify({'artistas': pred, "canciones": 1})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)