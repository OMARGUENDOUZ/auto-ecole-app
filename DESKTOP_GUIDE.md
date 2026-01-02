# Guide : Conversion en Application Desktop Locale

Ce guide explique comment transformer votre application Next.js en une application desktop autonome avec une base de données locale (SQLite) et une authentification persistante sans serveur distant.

---

## 1. Choix du Framework : Electron

Pour une application Next.js complexe avec le App Router, **Electron** est le choix le plus robuste.

### Installation
```bash
npm install --save-dev electron electron-builder electron-is-dev
```

---

## 2. Persistance des Données : SQLite

Puisque vous voulez que la base de données soit stockée sur le PC de l'utilisateur, **SQLite** est la solution idéale.

### Pourquoi SQLite ?
- Pas de serveur à installer.
- Un seul fichier `.sqlite` auto-suffisant.
- Très performant pour une gestion locale.

### Installation du driver
```bash
npm install better-sqlite3
```

---

## 3. Architecture : Le Pont IPC (Inter-Process Communication)

Dans une application Electron, le Frontend (Next.js) ne peut pas accéder directement au système de fichiers ou à SQLite pour des raisons de sécurité. On utilise un "Pont IPC".

### Structure recommandée
1.  **Main Process** (Processus principal) : Gère SQLite et les fichiers.
2.  **Preload Script** : Expose des fonctions sécurisées au Frontend.
3.  **Renderer Process** (Next.js) : Appelle ces fonctions.

---

## 4. Stratégie d'Authentification Locale

Sans serveur distant, l'authentification doit se faire contre la base SQLite locale.

### Étapes :
1.  **Table Users** : Créez une table `users` dans votre SQLite avec les colonnes `username` et `password_hash`.
2.  **Premier Lancement** : Si la base est vide, affichez un écran de création de compte "Administrateur".
3.  **Vérification** :
    - Utilisez `bcryptjs` pour comparer le mot de passe saisi avec le hash stocké.
    - Une fois validé, renvoyez un objet `user` au frontend.
4.  **Session** : Stockez l'état "connecté" dans le `localStorage` ou via un état sécurisé dans Electron.

---

## 5. Persistence et Stockage

Le fichier de la base de données doit être stocké dans le dossier réservé aux applications de l'utilisateur pour éviter les problèmes de permissions.

```javascript
// Dans le fichier main.js d'Electron
const { app } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(app.getPath('userData'), 'auto-ecole.sqlite');
const db = new Database(dbPath);
```

---

## 6. Migration du Code (API)

Actuellement, votre code utilise `axios` pour appeler un backend. Vous devrez modifier votre `api.ts` pour utiliser le pont Electron :

```typescript
// src/lib/api.ts (Exemple de modification)
export const api = {
  get: async (path) => {
    if (window.electron) {
      return window.electron.invoke('db-get', path);
    }
    // Fallback original pour le web
    return originalAxios.get(path);
  }
};
```

---

---

## 7. Migration du Backend (Cas Spécifique : Carly - Spring Boot)

Puisque votre backend **Carly** est en Java Spring Boot avec **H2**, voici la stratégie de migration locale :

### A. Persistance H2 sur le PC
Actuellement, H2 est probablement en mémoire. Il faut le passer en mode "File" pour que les données restent sur le disque :
```properties
# src/main/resources/application.properties
spring.datasource.url=jdbc:h2:file:~/auto-ecole/db;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driverClassName=org.h2.Driver
spring.jpa.hibernate.ddl-auto=update
```

### B. Bundling avec Electron (Sidecar)
Vous pouvez packager votre backend en un fichier `.jar` et demander à Electron de le lancer au démarrage.

1.  **Générer le JAR** : `mvn clean package`
2.  **Lancement IPC** dans Electron :
```javascript
const { spawn } = require('child_process');
const path = require('path');

// Chemin vers le JAR dans les ressources de l'app
const jarPath = path.join(__dirname, 'backend', 'carly-0.0.1-SNAPSHOT.jar');
const backendProcess = spawn('java', ['-jar', jarPath]);

backendProcess.stdout.on('data', (data) => {
  console.log(`Backend: ${data}`);
});
```

### C. Authentification Locale
Comme **Carly** ne semble pas avoir de couche Spring Security complexe, vous pouvez :
- Soit ajouter une table `users` simple et un `LoginController` basique qui vérifie en base locale.
- Soit gérer l'authentification maître directement dans Electron avant de donner accès à l'interface Next.js.

---

## 8. Build et Packaging

Utilisez `electron-builder` pour générer un installateur (`.exe` pour Windows).

### Configuration `package.json`
```json
"build": {
  "appId": "com.votreapp.autoecole",
  "directories": {
    "output": "dist"
  },
  "files": [
    "out/**/*",
    "main.js"
  ]
}
```

> [!IMPORTANT]
> Vous devrez utiliser `next export` (mode statique) ou un bridge comme `electron-next` pour servir les pages Next.js à l'intérieur d'Electron.
