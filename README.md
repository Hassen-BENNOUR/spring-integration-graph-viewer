# Integration Graph UI (Angular)

---

## Code Coverage & Status

[![Built With Docker](https://img.shields.io/badge/Built_With-Docker-informational?style=flat&logo=docker)]()
[![CI](https://github.com/Hassen-BENNOUR/spring-integration-graph-viewer/actions/workflows/ci.yml/badge.svg)]()
[![Docker GHCR](https://github.com/Hassen-BENNOUR/spring-integration-graph-viewer/actions/workflows/docker-ghcr-publish.yml/badge.svg)]()
[![Docker Hub](https://github.com/Hassen-BENNOUR/spring-integration-graph-viewer/actions/workflows/docker-publish.yml/badge.svg)]()
[![GitHub Pages](https://github.com/Hassen-BENNOUR/spring-integration-graph-viewer/actions/workflows/deploy-pages.yml/badge.svg)]()
[![Dependabot](https://github.com/Hassen-BENNOUR/spring-integration-graph-viewer/actions/workflows/dependabot/dependabot-updates/badge.svg)]()
[![npm Package](https://github.com/Hassen-BENNOUR/spring-integration-graph-viewer/actions/workflows/npm-publish-github-packages.yml/badge.svg)]()

<!-- coverage start -->
| Metric     | Coverage                                          |
|------------|---------------------------------------------------|
| Statements | ![Statements coverage](https://img.shields.io/badge/Statements-66.32%25-yellow) |
| Branches   | ![Branches coverage](https://img.shields.io/badge/Branches-31.03%25-yellow)     |
| Functions  | ![Functions coverage](https://img.shields.io/badge/Functions-67.06%25-yellow)   |
| Lines      | ![Lines coverage](https://img.shields.io/badge/Lines-65.47%25-yellow)           |
<!-- coverage end -->

---

This Angular application dynamically visualizes the EIP components published by Spring Integration via the `/integrationgraph` endpoint.

---

🌐 **Demo**:  
[https://hassen-bennour.github.io/spring-integration-graph-viewer/](https://hassen-bennour.github.io/spring-integration-graph-viewer/)

---

## How to visualize a Spring Integration graph?

Refer to our [Wiki guide →](https://github.com/Hassen-BENNOUR/spring-integration-graph-viewer/wiki#how-to-visualize-a-spring-integration-graph-)

---

## Features

- **Dynamic data fetch** from `/integrationgraph` endpoint
- **Multiple D3 visualizations**: tree, force-directed, curved, indented, arc, tidy tree, Sankey
- **Interactive UI**: pan/zoom, tooltips, click for details
- **EIP pattern images** fetched from enterpriseintegrationpatterns.com
- **Search & filter** by component name, type, class, pattern category
- **Unit tests** (Jasmine / Karma) with coverage report
- **E2E tests** (Cypress, headless & CI-ready)
- **Dockerized** frontend & backend, or Spring Boot integration

---

## Installation

```bash
# Frontend
cd spring-integration-graph-viewer
npm install
npm start
```

Then open [http://localhost:4200](http://localhost:4200).

```bash
# Backend (optional)
cd backend
./mvnw spring-boot:run
```

---

## Building for Production

```bash
cd frontend
npm run build -- --configuration production
```

The production build will be in `dist/spring-integration-graph-viewer/browser`.

---

## Testing

### Unit tests & HTML coverage

```bash
cd frontend
npm test
```

→ Coverage report in `coverage/spring-integration-graph-viewer/index.html`.

### E2E (Cypress)

```bash
cd frontend
npm run e2e
```

---

## Docker Deployment

### Build & Run

```bash
# Frontend
cd spring-integration-graph-viewer
docker build -t spring-integration-graph-viewer .
docker run -p 80:80 spring-integration-graph-viewer

```

### GitHub Container Registry (GHCR)

```bash
docker pull ghcr.io/hassen-bennour/spring-integration-graph-viewer:main
```

---

## Maven Integration

```bash
cd backend
./mvnw clean install
```

---

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute.

---

## License

This project is licensed under the [Apache 2.0 License](LICENSE).

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release notes and version history.

---

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). Please read and follow it.

---

## Kubernetes Deployment (Helm)

### Prerequisites

- `kubectl` configured for your cluster
- `helm` installed ([install guide](https://helm.sh))

### Install

```bash
git clone https://github.com/Hassen-BENNOUR/spring-integration-graph-viewer.git
cd spring-integration-graph-viewer/chart/spring-integration-graph-viewer
helm install spring-integration-graph-viewer .
```

### Upgrade & Uninstall

```bash
helm upgrade spring-integration-graph-viewer .
helm uninstall spring-integration-graph-viewer
```

### Access

```bash
kubectl port-forward svc/spring-integration-graph-viewer 8080:80
# then visit http://localhost:8080
```

---

## Suggestions for Improvement

1. **Badge Consistency**
2. **Table of Contents**
3. **Simplify "Getting Started"**
4. **Add UI Screenshots**
5. **Document Env Variables**
6. **Live Demo Badge**
7. **API Contract**
8. **Versioning**
