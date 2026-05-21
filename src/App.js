import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Recherche from './Recherche';
import LigneBus from './LigneBus';
import DetailLigne from './DetailLigne';
import Footer from './Footer';
import Carte from './Carte';

function App() {
  // 1. Trois etats
  const [lignes, setLignes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [recherche, setRecherche] = useState("");
  const [nbRecherches, setNbRecherches] = useState(0);
  const [ligneSelectionnee, setLigneSelectionnee]
    = useState(null);


  // ============================================================
  // EXERCICE 1 : Bouton "Recharger"
  // On extrait le fetch dans une fonction separee "chargerLignes"
  // pour pouvoir l'appeler depuis deux endroits :
  //   - useEffect au demarrage de la page
  //   - onClick du bouton "Recharger"
  // ============================================================

  function chargerLignes() {                       // fonction reutilisable pour lancer le fetch
    setChargement(true);                           // affiche "Chargement des lignes..."
    setErreur(null);                               // efface l'erreur precedente avant de reessayer

    fetch("http://localhost:5000/lignes")          // requete GET vers le serveur Flask
      .then(response => {                          // quand Flask repond...
        if (!response.ok) {                        // si le code HTTP n'est pas 200 OK
          throw new Error(                         // on cree une erreur avec le code recu
            "Erreur serveur : " + response.status
          );
        }
        return response.json();                    // sinon on transforme la reponse en tableau JS
      })
      .then(data => {                              // quand le JSON est pret...
        setLignes(data);                           // on stocke les lignes dans le state
        setChargement(false);                      // on cache le message de chargement
      })
      .catch(error => {                            // si une erreur reseau ou serveur se produit
        setErreur(error.message);                  // on affiche l'erreur a l'ecran
        setChargement(false);                      // on cache aussi le chargement
      });
  }

  useEffect(() => {                                // useEffect = s'execute apres le 1er rendu
    chargerLignes();                               // on charge les lignes au demarrage
  }, []);                                          // [] vide = une seule fois, pas de re-execution

  // ============================================================
  // EXERCICE 2 : Nouvelles lignes sans modifier React
  // Pas de code modifie ici.
  // On a ajoute 2 objets dans api/lignes_ddd.json.
  // Flask relit ce fichier JSON a chaque requete /lignes,
  // donc React recoit les nouvelles lignes au prochain fetch.
  // ============================================================

  const lignesFiltrees = lignes.filter(l =>        // on parcourt toutes les lignes
    l.depart.toLowerCase()                         // on met en minuscules pour ignorer la casse
      .includes(recherche.toLowerCase()) ||        // vrai si le depart contient la recherche
    l.arrivee.toLowerCase()
      .includes(recherche.toLowerCase()) ||        // vrai si l'arrivee contient la recherche
    l.numero.includes(recherche)                   // vrai si le numero de ligne correspond
  );

  // ============================================================
  // EXERCICE 3 : Charger les details d'une ligne au clic
  // Avant : on utilisait l'objet "ligne" deja en memoire.
  // Maintenant : on fait un nouveau fetch GET /lignes/<id>
  // pour charger les details complets depuis Flask au moment du clic.
  // Pattern reel : la liste = resume rapide,
  //                les details = charges a la demande.
  // ============================================================

  function handleClickLigne(ligne) {
    if (                                           // si on reclique sur la ligne deja ouverte
      ligneSelectionnee &&
      ligneSelectionnee.id === ligne.id
    ) {
      setLigneSelectionnee(null);                  // on la ferme (comportement toggle)
    } else {
      fetch(                                       // sinon on interroge Flask pour les details
        "http://localhost:5000/lignes/" + ligne.id // URL avec l'id de la ligne cliquee
      )
        .then(response => response.json())         // on convertit la reponse en objet JS
        .then(data => {
          setLigneSelectionnee(data);              // on stocke pour afficher dans DetailLigne
        });
    }
  }
  
  // Ecran de chargement
  if (chargement) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <p className="message-chargement">
            Chargement des lignes...
          </p>
        </main>
      </div>
    );
  }

  // Ecran d'erreur
  if (erreur) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <div className="message-erreur">
            <p>Impossible de charger les lignes.</p>
            <p className="erreur-detail">{erreur}</p>
            <p>
              Verifiez que le serveur Flask est lance
              (python api/app.py).
            </p>
          </div>
        </main>
      </div>
    );
  }
  return (
    <div className="App">
      <Header />

      <main className="contenu">
        <p>Vous avez effectué {nbRecherches} recherche(s)</p>

        <button onClick={chargerLignes}>Recharger</button>

        <Recherche
          valeur={recherche}
          onChange={valeur => { setRecherche(valeur); setNbRecherches(n => n + 1); }}
          onEffacer={() => setRecherche("")}
        />

        <p className="resultat-recherche">
          {lignesFiltrees.length} ligne
          {lignesFiltrees.length > 1 ? "s" : ""} trouvee
          {lignesFiltrees.length > 1 ? "s" : ""}
        </p>

        {lignesFiltrees.length === 0 && (
          <p>Aucune ligne trouvée</p>
        )}

        {lignesFiltrees.map(ligne => (
          <LigneBus
            key={ligne.id}
            numero={ligne.numero}
            depart={ligne.depart}
            arrivee={ligne.arrivee}
            arrets={ligne.arrets}
            couleur={ligne.couleur}
            estSelectionnee={
              ligneSelectionnee &&
              ligneSelectionnee.id === ligne.id
            }
            onClick={() => handleClickLigne(ligne)}
          />
        ))}

        {ligneSelectionnee && (
          <DetailLigne ligne={ligneSelectionnee} />
        )}

        <Carte />
      </main>

      <Footer />
    </div>
  );
}

export default App;