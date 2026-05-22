import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Carte.css';

// Corriger les icones Leaflet (bug webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ============================================================
// EXERCICE 1 : Icone orange pour l'arret le plus proche
// On cree une nouvelle icone avec new L.Icon()
// en pointant vers une image de marqueur orange.
// On cree aussi une icone bleue par defaut car Leaflet
// n'accepte pas undefined comme valeur d'icone.
// ============================================================
const iconeOrange = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Icone bleue par defaut (memes parametres que l'icone originale)
const iconeBleu = new L.Icon({
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// ============================================================
// EXERCICE 2 : Bouton "Centrer sur ma position"
// Ce composant doit etre a l'interieur de <MapContainer>
// pour pouvoir utiliser useMap() qui donne acces a l'objet carte.
// ============================================================
function BoutonCentrer({ position }) {
  const map = useMap(); // acces a l'objet carte Leaflet

  // Si l'utilisateur n'a pas encore autorise la geolocalisation,
  // on n'affiche pas le bouton
  if (!position) return null;

  return (
    // Les classes leaflet-top / leaflet-right placent le bouton
    // dans le coin superieur droit de la carte
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control">
        <button
          className="bouton-centrer"
          onClick={() => map.setView(position, 15)} // recentre la carte sur l'utilisateur
        >
          Centrer sur ma position
        </button>
      </div>
    </div>
  );
}

// Calculer la distance entre 2 points GPS (formule de Haversine, resultat en km)
function calculerDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function Carte() {
  const [arrets, setArrets] = useState([]);
  const [positionUtilisateur, setPositionUtilisateur] = useState(null);

  // EXERCICE 3 : on stocke les 3 arrets les plus proches (pas seulement 1)
  const [arretsProches, setArretsProches] = useState([]);

  const DAKAR = [14.6928, -17.4467];

  // Charger les arrets depuis Flask
  useEffect(() => {
    fetch("http://localhost:5000/arrets")
      .then(r => r.json())
      .then(data => setArrets(data))
      .catch(err => console.error("Erreur arrets:", err));
  }, []);

  // Geolocalisation de l'utilisateur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setPositionUtilisateur([
            pos.coords.latitude,
            pos.coords.longitude
          ]);
        },
        () => console.log("Geolocation refusee")
      );
    }
  }, []);

  // ============================================================
  // EXERCICE 3 : Trouver les 3 arrets les plus proches
  // On calcule la distance pour chaque arret,
  // on trie du plus proche au plus loin,
  // et on garde seulement les 3 premiers.
  // ============================================================
  useEffect(() => {
    if (positionUtilisateur && arrets.length > 0) {

      // Etape 1 : ajouter la distance a chaque arret
      const arretsAvecDistance = arrets.map(a => ({
        ...a,
        distance: calculerDistance(
          positionUtilisateur[0], positionUtilisateur[1],
          a.lat, a.lon
        )
      }));

      // Etape 2 : trier du plus proche au plus loin
      arretsAvecDistance.sort((a, b) => a.distance - b.distance);

      // Etape 3 : garder seulement les 3 premiers
      setArretsProches(arretsAvecDistance.slice(0, 3));
    }
  }, [positionUtilisateur, arrets]);

  return (
    <div className="carte-container">
      <h2 className="carte-titre">Carte des arrets</h2>

      {/* EXERCICE 3 : liste des 3 arrets les plus proches au-dessus de la carte */}
      {arretsProches.length > 0 && (
        <div className="arrets-proches">
          <p className="arrets-proches-titre">
            3 arrets les plus proches :
          </p>
          <ul className="arrets-proches-liste">
            {arretsProches.map((a, index) => (
              <li key={a.id} className="arret-proche-item">
                {/* index 0 = le plus proche, on le met en evidence */}
                <span className={index === 0 ? "arret-numero premier" : "arret-numero"}>
                  {index + 1}
                </span>
                <strong>{a.nom}</strong>
                {" — "}
                {a.distance.toFixed(2)} km
              </li>
            ))}
          </ul>
        </div>
      )}

      <MapContainer
        center={DAKAR}
        zoom={13}
        className="carte"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />

        {/* Afficher tous les arrets avec leur marqueur */}
        {arrets.map(a => (
          // EXERCICE 1 : icone orange si c'est l'arret le plus proche, bleue sinon
          <Marker
            key={a.id}
            position={[a.lat, a.lon]}
            icon={
              arretsProches[0] && arretsProches[0].id === a.id
                ? iconeOrange   // marqueur orange = arret le plus proche
                : iconeBleu     // marqueur bleu par defaut pour les autres
            }
          >
            <Popup>
              <strong>{a.nom}</strong>
              <br />
              Lignes : {a.lignes.join(", ")}
              {arretsProches[0] && arretsProches[0].id === a.id && (
                <><br /><em>Arret le plus proche</em></>
              )}
            </Popup>
          </Marker>
        ))}

        {/* Marqueur de position de l'utilisateur */}
        {positionUtilisateur && (
          <Marker position={positionUtilisateur}>
            <Popup>Vous etes ici</Popup>
          </Marker>
        )}

        {/* EXERCICE 2 : bouton a l'interieur de MapContainer pour utiliser useMap() */}
        <BoutonCentrer position={positionUtilisateur} />
      </MapContainer>
    </div>
  );
}

export default Carte;
