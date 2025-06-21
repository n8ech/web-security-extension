# Extension de Navigateur avec React et Tailwind

Une extension de navigateur évolutive construite avec React, Tailwind CSS, Vite et TypeScript.

## Structure

L'extension est composée de deux conteneurs principaux :
- Un menu latéral à gauche avec 4 icônes dans des boîtes carrées aux bords arrondis
- Une vue principale qui affiche le contenu en fonction de l'icône sélectionnée

## Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Construire l'extension pour la production
npm run build:extension
```

## Utilisation

Après avoir construit l'extension, vous pouvez la charger dans votre navigateur :

### Chrome
1. Ouvrez Chrome et accédez à `chrome://extensions/`
2. Activez le "Mode développeur"
3. Cliquez sur "Charger l'extension non empaquetée"
4. Sélectionnez le dossier `dist` généré

### Firefox
1. Ouvrez Firefox et accédez à `about:debugging#/runtime/this-firefox`
2. Cliquez sur "Charger un module complémentaire temporaire..."
3. Sélectionnez le fichier `manifest.json` dans le dossier `dist`

## Personnalisation

Vous pouvez personnaliser l'extension en modifiant les composants dans le dossier `src/components/`.

- `Layout.tsx` - Structure principale de l'extension
- `Sidebar.tsx` - Menu latéral avec les icônes
- `ContentView.tsx` - Contenu principal qui change en fonction de la vue active

## Technologies utilisées

- React
- TypeScript
- Tailwind CSS
- Vite
- React Icons
