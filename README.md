# Integration Graph UI (Angular)

----------------------------------
# Code Coverage Summary
![Built With Docker](https://img.shields.io/badge/Built_With-Docker-informational?style=flat&logo=docker)
&nbsp;
![CI](https://github.com/Hassen-BENNOUR/spring-integration-graph-viewer/actions/workflows/ci.yml/badge.svg)


<!-- coverage start -->
| Statements | Branches | Functions | Lines |
| --- | --- | --- | --- |
| 65.28% | 31.03% | 64.68% | 64.33% |
<!-- coverage end -->
----------------------------------
**Cette application Angular permet de visualiser dynamiquement les composants EIP exposés par Spring Integration via l’endpoint `/integrationgraph`.**

----------------------------------

## [**Demo available here**](https://hassen-bennour.github.io/spring-integration-graph-viewer/)

## Fonctionnalités

- Récupération dynamique du `/integrationgraph`
- Affichage sous forme de graphe interactif (nœuds, liens fléchés)
- Affichage détaillé des composants EIP avec image du pattern
- Recherche et filtrage dynamique
- Pagination
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

Rapport généré : `coverage/spring-integration-graph-viewer/index.html`

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
