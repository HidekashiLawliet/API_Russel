# API Russel

Une API RESTful pour la gestion des catways, réservations et utilisateurs, construite avec Node.js, Express et MongoDB.

## Description

Ce projet est une application web permettant de gérer des catways (emplacements pour bateaux), leurs réservations et les utilisateurs. Il inclut une interface utilisateur pour l'administration via des pages EJS.

## Fonctionnalités

- **Gestion des utilisateurs** : Inscription, connexion, modification et suppression
- **Gestion des catways** : Création, modification, suppression des emplacements
- **Gestion des réservations** : Création, modification, suppression des réservations par catway
- **Upload de fichiers** : Téléchargement d'images avec stockage en base de données
- **Authentification** : Via cookies avec bcrypt pour le hachage des mots de passe

## Technologies utilisées

- **Backend** : Node.js, Express.js
- **Base de données** : MongoDB avec Mongoose
- **Authentification** : bcrypt, cookies
- **Upload de fichiers** : Multer
- **Frontend** : EJS, JavaScript
- **Autres** : Path, Cookie-parser

## Installation

1. Clonez le repository :

      ```
      git clone <url-du-repo>
      cd API_Russel
      ```

2. Installez les dépendances :

      ```
      npm install
      ```

3. Configurez la base de données :
      - Assurez-vous que MongoDB est installé et en cours d'exécution
      - Modifiez les paramètres de connexion dans `models/config.js` si nécessaire

4. Lancez le serveur :
      ```
      npm start
      ```

Le serveur démarrera sur le port 8080.

## Utilisation

### Pages web

- **/** : Page de connexion
- **/signup** : Page d'inscription
- **/home/:id** : Page d'accueil pour l'utilisateur connecté
- **/upload** : Page d'upload de fichiers

### API Endpoints

#### Utilisateurs

- `POST /signup` : Inscription d'un nouvel utilisateur
- `POST /login` : Connexion
- `GET /logout` : Déconnexion
- `GET /users` : Récupérer tous les utilisateurs
- `PUT /users/:id/change` : Modifier un utilisateur
- `DELETE /users/:id/delete` : Supprimer un utilisateur

#### Catways

- `GET /cateways` : Récupérer tous les catways
- `POST /cateway/create` : Créer un nouveau catway
- `PUT /cateway/:id` : Modifier un catway
- `DELETE /cateway/delete/:id` : Supprimer un catway

#### Réservations

- `GET /catways/:id/reservations` : Récupérer toutes les réservations
- `POST /reservations/create` : Créer une nouvelle réservation
- `PUT /catway/:catwayNumber/reservations/:reservationId` : Modifier une réservation
- `DELETE /catway/:catwayNumber/reservations/:reservationId` : Supprimer une réservation

#### Fichiers

- `POST /upload` : Télécharger une image

## Structure du projet

```
API_Russel/
├── models/
│   ├── catway.js
│   ├── config.js
│   ├── file.js
│   └── reservation.js
├── pages/
│   ├── home.ejs
│   ├── login.ejs
│   ├── signup.ejs
│   └── upload.ejs
├── public/
├── script/
│   ├── files-storage.js
│   └── home.js
├── Fichiers/
│   ├── catways.json
│   └── reservations.json
├── images/
├── package.json
├── server.js
└── README.md
```

## Scripts npm

- `npm start` : Lance le serveur

## Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence MIT.
