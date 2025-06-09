# Integration Graph UI (Angular)

----------------------------------
# Code Coverage Summary
![Built With Docker](https://img.shields.io/badge/Built_With-Docker-informational?style=flat&logo=docker)
&nbsp;
![CI](https://github.com/Hassen-BENNOUR/spring-integration-graph-viewer/actions/workflows/ci.yml/badge.svg)

<!-- coverage start -->
-----------------------------------------------------|---------|----------|---------|---------|------------------------------------------------------
File                                                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                                    
-----------------------------------------------------|---------|----------|---------|---------|------------------------------------------------------
All files                                            |   66.32 |    31.03 |   67.06 |   65.47 |                                                      
 src                                                 |     100 |      100 |     100 |     100 |                                                      
  test.ts                                            |     100 |      100 |     100 |     100 |                                                      
 src/app                                             |     100 |      100 |     100 |     100 |                                                      
  app.component.ts                                   |     100 |      100 |     100 |     100 |                                                      
 src/app/d3-arc-graph-viewer                         |   72.32 |    30.76 |   69.23 |   72.16 |                                                      
  d3-arc-diagram-viewer.component.ts                 |   72.32 |    30.76 |   69.23 |   72.16 | 36-47,60,221-240,258-269,276                         
 src/app/d3-force-directed-curved-graph-viewer       |   68.13 |    31.81 |   65.78 |    67.9 |                                                      
  d3-force-directed-curved-graph-viewer.component.ts |   68.13 |    31.81 |   65.78 |    67.9 | 35-46,59,199-218,231,250-263                         
 src/app/d3-force-directed-graph-viewer              |   68.13 |    31.81 |    67.5 |   68.67 |                                                      
  d3-force-directed-graph-viewer.component.ts        |   68.13 |    31.81 |    67.5 |   68.67 | 36-47,60,193-212,229,248-264                         
 src/app/d3-indented-tree-viewer                     |    80.2 |    38.88 |    75.6 |   78.82 |                                                      
  d3-indented-tree-viewer.component.ts               |    80.2 |    38.88 |    75.6 |   78.82 | 48-59,72,205-224,235                                 
 src/app/d3-tidy-tree-viewer                         |   70.51 |    36.95 |   65.38 |   70.62 |                                                      
  d3-tidy-tree-viewer.component.ts                   |   70.51 |    36.95 |   65.38 |   70.62 | 48-59,72,200,218,232-239,273,299-300,311-332,342-361 
 src/app/main                                        |     100 |      100 |     100 |     100 |                                                      
  main.component.ts                                  |     100 |      100 |     100 |     100 |                                                      
 src/app/services                                    |   37.28 |       20 |      50 |   35.96 |                                                      
  load-graph.service.ts                              |   37.28 |       20 |      50 |   35.96 | 40-43,88,96-200                                      
-----------------------------------------------------|---------|----------|---------|---------|------------------------------------------------------

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
