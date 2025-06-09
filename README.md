# Integration Graph UI (Angular)

----------------------------------

# Code Coverage Summary

![Built With Docker](https://img.shields.io/badge/Built_With-Docker-informational?style=flat&logo=docker)
&nbsp;
![CI](https://github.com/Hassen-BENNOUR/spring-integration-graph-viewer/actions/workflows/ci.yml/badge.svg)
[![Build and Publish Docker GHCR image](https://github.com/Hassen-BENNOUR/spring-integration-graph-viewer/actions/workflows/docker-ghcr-publish.yml/badge.svg)](https://github.com/Hassen-BENNOUR/spring-integration-graph-viewer/actions/workflows/docker-ghcr-publish.yml)
[![Deploy GitHub Pages](https://github.com/Hassen-BENNOUR/spring-integration-graph-viewer/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/Hassen-BENNOUR/spring-integration-graph-viewer/actions/workflows/deploy-pages.yml)
[![Build and Publish Docker Image](https://github.com/Hassen-BENNOUR/spring-integration-graph-viewer/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/Hassen-BENNOUR/spring-integration-graph-viewer/actions/workflows/docker-publish.yml)
[![Dependabot Updates](https://github.com/Hassen-BENNOUR/spring-integration-graph-viewer/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/Hassen-BENNOUR/spring-integration-graph-viewer/actions/workflows/dependabot/dependabot-updates)
[![Npm Publish Github Package](https://github.com/Hassen-BENNOUR/spring-integration-graph-viewer/actions/workflows/npm-publish-github-packages.yml/badge.svg)](https://github.com/Hassen-BENNOUR/spring-integration-graph-viewer/actions/workflows/npm-publish-github-packages.yml)


<!-- coverage start -->
![Statements coverage](https://img.shields.io/badge/Statements-66.32%25-yellow)
![Branches coverage](https://img.shields.io/badge/Branches-31.03%25-yellow)
![Functions coverage](https://img.shields.io/badge/Functions-67.06%25-yellow)
![Lines coverage](https://img.shields.io/badge/Lines-65.47%25-yellow)
<!-- coverage end -->

----------------------------------
**Cette application Angular permet de visualiser dynamiquement les composants EIP exposés par Spring Integration via
l’endpoint `/integrationgraph`.**

----------------------------------

## [**Demo available here**](https://hassen-bennour.github.io/spring-integration-graph-viewer/)

----------------------------------

## How to visualize a Spring Integration graph ?
**Take a look at the** [wiki](https://github.com/Hassen-BENNOUR/spring-integration-graph-viewer/wiki#how-to-visualize-a-spring-integration-graph-) !

-----------------------

## Fonctionnalités

- Récupération dynamique du `/integrationgraph`
- Affichage sous forme de graphe interactif (nœuds, liens fléchés)
- Affichage détaillé des composants EIP avec image du pattern
- Recherche et filtrage dynamique
- Tests unitaires (Jasmine/Karma)
- Tests end-to-end (Cypress)
- Déploiement Docker ou intégration Spring Boot

----------------------------------

## Installation

```bash
npm install
```

```bash
npm start
```

Accédez ensuite à [http://localhost:4200](http://localhost:4200)

## Build

```bash
npm run build
```

Le build de production sera disponible dans `dist/spring-integration-graph-viewer/`.

## Tests

### Tests unitaires + couverture HTML

```bash
npm test
```

**Rapport généré : `coverage/spring-integration-graph-viewer/index.html`**

### Tests E2E (Cypress)

```bash
npx cypress open
# ou
npm run cy:test
```

----------------------------------

## Déploiement Docker

**Building**

```bash
docker build -t spring-integration-graph-viewer .
docker run -p 80:80 spring-integration-graph-viewer
```

**Using GHCR**

`docker pull ghcr.io/hassen-bennour/spring-integration-graph-viewer:main
`
----------------------------------

## Intégration Maven

Le build et les tests peuvent être lancés automatiquement dans Maven :

```bash
mvn clean install
```

----------------------------------

## Contribution

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour contribuer à ce projet.

----------------------------------

## Licence

Distribué sous [Licence Apache 2.0](LICENSE).

----------------------------------

## Historique

Voir [CHANGELOG.md](CHANGELOG.md) pour les évolutions du projet.

----------------------------------

## Code de conduite

Ce projet suit un [Code de Conduite](CODE_OF_CONDUCT.md). Merci de le respecter.

----------------------------------

## Déploiement sur Kubernetes avec Helm

### Prérequis

- `kubectl` configuré pour ton cluster
- `helm` installé (`brew install helm` ou [docs](https://helm.sh))

### Installation

1. Cloner ce dépôt ou copier le dossier `chart/spring-integration-graph-viewer`
2. Adapter `values.yaml` si nécessaire (repository, ports, etc.)
3. Lancer l'installation :

```bash
helm install spring-integration-graph-viewer ./chart/spring-integration-graph-viewer
```

### Mise à jour

```bash
helm upgrade spring-integration-graph-viewer ./chart/spring-integration-graph-viewer
```

### Désinstallation

```bash
helm uninstall spring-integration-graph-viewer
```

### Accès (port-forward ou ingress)

```bash
kubectl port-forward svc/spring-integration-graph-viewer 8080:80
# Accès sur http://localhost:8080
```

> Tu peux aussi activer un Ingress (Nginx, Traefik, etc.) en modifiant `values.yaml`.
