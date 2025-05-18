# Integration Graph UI (Angular)

![CI](https://github.com/<your-username>/integration-graph-ui-angular/actions/workflows/ci.yml/badge.svg)

Cette application Angular permet de visualiser dynamiquement les composants EIP exposés par Spring Integration via l’endpoint `/integrationgraph`.

## Fonctionnalités

- Récupération dynamique du `/integrationgraph`
- Affichage sous forme de graphe interactif (nœuds, liens fléchés)
- Affichage détaillé des composants EIP avec image du pattern
- Recherche et filtrage dynamique
- Pagination
- Tests unitaires (Jasmine/Karma)
- Tests end-to-end (Cypress)
- Déploiement Docker ou intégration Spring Boot

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

Le build de production sera disponible dans `dist/integration-graph-ui/`.

## Tests

### Tests unitaires + couverture HTML

```bash
npm test
```

Rapport généré : `coverage/integration-graph-ui/index.html`

### Tests E2E (Cypress)

```bash
npx cypress open
# ou
npm run cy:test
```

## Déploiement Docker

```bash
docker build -t integration-graph-ui-angular .
docker run -p 80:80 integration-graph-ui-angular
```

## Intégration Maven

Le build et les tests peuvent être lancés automatiquement dans Maven :

```bash
mvn clean install
```

## Contribution

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour contribuer à ce projet.

## Licence

Distribué sous [Licence Apache 2.0](LICENSE).

## Historique

Voir [CHANGELOG.md](CHANGELOG.md) pour les évolutions du projet.

## Code de conduite

Ce projet suit un [Code de Conduite](CODE_OF_CONDUCT.md). Merci de le respecter.

## Déploiement sur Kubernetes avec Helm

### Prérequis

- `kubectl` configuré pour ton cluster
- `helm` installé (`brew install helm` ou [docs](https://helm.sh))

### Installation

1. Cloner ce dépôt ou copier le dossier `chart/integration-graph-ui`
2. Adapter `values.yaml` si nécessaire (repository, ports, etc.)
3. Lancer l'installation :

```bash
helm install integration-graph-ui ./chart/integration-graph-ui
```

### Mise à jour

```bash
helm upgrade integration-graph-ui ./chart/integration-graph-ui
```

### Désinstallation

```bash
helm uninstall integration-graph-ui
```

### Accès (port-forward ou ingress)

```bash
kubectl port-forward svc/integration-graph-ui 8080:80
# Accès sur http://localhost:8080
```

> Tu peux aussi activer un Ingress (Nginx, Traefik, etc.) en modifiant `values.yaml`.
