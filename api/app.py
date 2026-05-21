import json
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Charger les donnees depuis le fichier JSON
with open("lignes_ddd.json", "r") as f:
    lignes = json.load(f)

@app.route("/")
def accueil():

    return jsonify({
        "message": "Bienvenue sur l'API SenTransport !",
        "endpoints": [
            "/lignes",
            "/lignes/<id>"
        ]
    })

@app.route("/lignes")
def get_lignes():

    return jsonify(lignes)

@app.route("/lignes/<int:ligne_id>")
def get_ligne(ligne_id):

    ligne = next(
        (
            l for l in lignes
            if l["id"] == ligne_id
        ),
        None
    )

    if ligne is None:

        return jsonify({
            "erreur": "Ligne non trouvee"
        }), 404

    return jsonify(ligne)

with open("arrets.json", "r") as f:
    arrets = json.load(f)

@app.route("/arrets")
def get_arrets():
    return jsonify(arrets)

# # Exercice 1 : 
# @app.route("/arrets")
# def get_arrets():

#     tous_les_arrets = set()

#     for ligne in lignes:
#         for arret in ligne["listeArrets"]:
#             tous_les_arrets.add(arret)

#     return jsonify(list(tous_les_arrets))


# # Exercice 2 :
# @app.route("/stats")
# def get_stats():

#     nombre_de_lignes = len(lignes)

#     total_arrets = 0
#     for ligne in lignes:
#         total_arrets = total_arrets + ligne["arrets"]

#     ligne_max = lignes[0]
#     for ligne in lignes:
#         if ligne["arrets"] > ligne_max["arrets"]:
#             ligne_max = ligne

#     return jsonify({
#         "nombre_de_lignes": nombre_de_lignes,
#         "total_arrets": total_arrets,
#         "ligne_plus_darrets": ligne_max["numero"]
#     })


# # Exercice 3 :
# @app.route("/lignes/recherche")
# def recherche_lignes():

#     q = request.args.get("q", "")

#     resultats = []

#     for ligne in lignes:
#         if q.lower() in ligne["depart"].lower() or q.lower() in ligne["arrivee"].lower():
#             resultats.append(ligne)

#     return jsonify(resultats)


if __name__ == "__main__":
    app.run(debug=True,port=5000)