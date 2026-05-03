import './StatReseau.css';

function StatReseau({ nombreLignes, nombreArrets, lignePlusArrets}) { 
    return (
        <div className="stat-reseau">
            <h2>Statistiques du Réseau</h2>
            <p>Nombre de lignes de bus : {nombreLignes}</p>
            <p>Nombre d'arrêts : {nombreArrets}</p>
            <p>Ligne avec le plus d'arrêts : {lignePlusArrets}</p>
        </div>
    );
}

export default StatReseau;
