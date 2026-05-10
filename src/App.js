import { useState } from 'react';
import './App.css';
import Header from './Header';
import Recherche from './Recherche';
import LigneBus from './LigneBus';
import DetailLigne from './DetailLigne';
import Footer from './Footer';

function App() {
  const [recherche, setRecherche] = useState("");
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);

  const lignes = [
    { id: 1, numero: "1", depart: "Parcelles Assainies", arrivee: "Plateau", arrets: 14, couleur: "#3498db", listeArrets: ["Parcelles Assainies", "Cambérène", "Liberté 6", "Liberté 5", "Liberté 1", "Castors", "Fann Résidence", "Université", "Médina", "Tilène", "Sandaga", "Kermel", "Rue Carnot", "Plateau"] },
    { id: 2, numero: "7", depart: "Guediawaye", arrivee: "Place de l'Obélisque", arrets: 18, couleur: "#2ecc71", listeArrets: ["Guediawaye", "Daroukhane", "Golf Sud", "Sam Notaire", "Thiaroye", "Pikine", "Nimzatt", "Keur Massar", "Dalifort", "Mbao", "Yeumbeul", "Malika", "Rufisque", "Bargny", "Sébi", "Sangalkam", "Diamniadio", "Place de l'Obélisque"] },
    { id: 3, numero: "15", depart: "Pikine", arrivee: "Medina", arrets: 12, couleur: "#e74c3c", listeArrets: ["Pikine", "Thiaroye", "Dalifort", "Hamo 4", "Hamo 5", "Colobane", "HLM", "Grand Dakar", "Biscuiterie", "Tilène", "Santiaba", "Médina"] },
    { id: 4, numero: "23", depart: "Ouakam", arrivee: "Grand Dakar", arrets: 10, couleur: "#f39c12", listeArrets: ["Ouakam", "Almadies", "Ngor", "Yoff", "Cambérène", "Patte d'Oie", "Liberté 6", "HLM", "Biscuiterie", "Grand Dakar"] },
    { id: 5, numero: "8", depart: "Almadies", arrivee: "Colobane", arrets: 16, couleur: "#9b59b6", listeArrets: ["Almadies", "Ngor", "Yoff", "Ouakam", "Fenêtre Mermoz", "Mermoz", "Sacré-Cœur", "Liberté 5", "Liberté 1", "Castors", "Fann", "Université", "Médina", "Tilène", "Santiaba", "Colobane"] },
    { id: 6, numero: "12", depart: "Yoff", arrivee: "Sandaga", arrets: 11, couleur: "#1abc9c", listeArrets: ["Yoff", "Ngor", "Almadies", "Ouakam", "Patte d'Oie", "Liberté 6", "Liberté 5", "Liberté 1", "Université", "Médina", "Sandaga"] },
  ];
  

  const lignesFiltrees = lignes.filter(l =>
    l.depart.toLowerCase().includes(recherche.toLowerCase()) ||
    l.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
    l.numero.includes(recherche)
  );

  function handleClickLigne(ligne) {
    if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
      setLigneSelectionnee(null);
    } else {
      setLigneSelectionnee(ligne);
    }
  }

  return (
    <div className="App">
      <Header />

      <main className="contenu">
        <Recherche
          valeur={recherche}
          onChange={setRecherche}
        />

        <p className="resultat-recherche">
          {lignesFiltrees.length} ligne
          {lignesFiltrees.length > 1 ? "s" : ""} trouvee
          {lignesFiltrees.length > 1 ? "s" : ""}
        </p>

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
      </main>

      <Footer />
    </div>
  );
}

export default App;