# My 80's Store - Backend

Bienvenue dans le repository backend de **My 80's Store**, une boutique en ligne proposant des objets vintage emblématiques des années 80-90 : jeux vidéo, consoles, vêtements, VHS, etc.

## Prérequis

Avant de lancer le projet, assurez-vous d'avoir les outils suivants installés :

- [Node.js](https://nodejs.org/) (version recommandée : 18.x)
- [yarn](https://yarnpkg.com/)
- [Express.js](https://expressjs.com/)

## Installation

1. Clonez ce repository :
   ```bash
   git clone https://github.com/votre-utilisateur/my-80s-store-backend.git
   ```
2. Accédez au dossier du projet :
   ```bash
   cd my-80s-store-backend
   ```
3. Installez les dépendances :
   ```bash
   yarn install
   ```

## Configuration

Créez un fichier `.env` à la racine du projet et ajoutez-y les variables d'environnement nécessaires :

```
MONGODB_CONNECTION_STRING=yourMongoDbConnectionString
JWT_SECRET=yourJwtSecret
STRIPE_SECRET_KEY=yourStripeSecretKey
CLIENT_URL=https://my-80store-frontend.vercel.app/
```

## Scripts disponibles

- **Démarrage du serveur de développement** :
  ```bash
  yarn dev
  ```
- **Démarrage du serveur en production** :
  ```bash
  yarn start
  ```

## Structure du projet

La structure du projet est la suivante :

```
/src
  /config
  /controllers
  /middlewares
  /models
  /routes
  /bin
```

## Fonctionnalités principales

- Gestion des utilisateurs avec rôles (admin, utilisateur standard)
- Authentification sécurisée avec JWT
- Gestion des produits et des catégories
- Système de panier avec suivi des commandes
- Gestion du paiement via Stripe

## Améliorations futures

- Mise en place de tests unitaires et d'intégration
- Documentation complète de l'API

## Lien vers le frontend

[My 80's Store - Frontend](https://my-80store-frontend.vercel.app/)
