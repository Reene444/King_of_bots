
<h1 align="center">Multiplayer snake game - v2.0.0-exp </h1>

## :wrench: Tasks
- Scalability - Kubernetes auto Scaling - HPA
    
## :sparkles: Skills
- `Kubernetes`
- `Docker`
- `HPA`

# Kubernetes directory structure

```plaintext
kubernetes/
├── base/
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── nginx-deployment.yaml
│   ├── nginx-service.yaml
│   ├── redis-deployment.yaml
│   ├── redis-service.yaml
│   ├── mongodb-deployment.yaml
│   ├── mongodb-service.yaml
│   └── kafka-deployment.yaml
│       └── kafka-service.yaml
├── overlays/
│   ├── dev/
│   │   ├── kustomization.yaml
│   │   ├── backend-deployment.yaml
│   │   ├── nginx-deployment.yaml
│   │   ├── redis-deployment.yaml
│   │   ├── mongodb-deployment.yaml
│   │   └── kafka-deployment.yaml
│   ├── prod/
│   │   ├── kustomization.yaml
│   │   ├── backend-deployment.yaml
│   │   ├── nginx-deployment.yaml
│   │   ├── redis-deployment.yaml
│   │   ├── mongodb-deployment.yaml
│   │   └── kafka-deployment.yaml
│   └── staging/
│       ├── kustomization.yaml
│       ├── backend-deployment.yaml
│       ├── nginx-deployment.yaml
│       ├── redis-deployment.yaml
│       ├── mongodb-deployment.yaml
│       └── kafka-deployment.yaml
└── kustomization.yaml


