import joblib
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS  # Importa CORS
from tensorflow.keras.models import load_model
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf
import random 

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

def get_canciones(artistas, data_api):
    lista_canciones = []
    
    for artista in artistas:
        artist_code = label_encoders['artist_name'].transform([artista])[0]
        
        # Filtra el conjunto de datos para obtener las canciones del artista codificado
        
        canciones_disponibles = data_api[data_api['artist_name'] == artist_code]
        canciones_disponibles = canciones_disponibles.to_numpy().tolist()
        lista_cancion = random.choice(canciones_disponibles)
        cancion = lista_cancion[2]
        
        le = label_encoders["track_name"]
        nombre_cancion = le.inverse_transform([cancion])[0]
        lista_temp = []
        lista_temp.append(artista)
        lista_temp.append(nombre_cancion)
        lista_canciones.append(lista_temp)
    
    return lista_canciones

app = Flask(__name__)
CORS(app)  # Habilita CORS para tu aplicación Flask

@app.route('/modelo', methods=['POST'])
def getProducts():
    try:
        data = request.get_json()

        if data is None:
            return jsonify({'error': 'El cuerpo de la solicitud debe contener datos JSON'}), 400

        
        artist = data.get('nombre', "Ed Sheeran")
        
        
        
        artistlabel = label_encoders['artist_name'].transform([artist])[0]

        pred = get_similar_artists_api(modelo_recomendacion, artistlabel, data_api)
        pred = pred.tolist()
        listaretorno = get_canciones(pred,data_api)
        

        return jsonify({'artistas': listaretorno,})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)