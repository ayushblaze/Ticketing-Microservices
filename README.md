# Ticketing Microservices

Microservices-based ticketing application running on Kubernetes with:

- `auth` service (Node.js + TypeScript + MongoDB)
- `client` service (Next.js)
- shared `common` package (TypeScript)

## Repository Structure

```text
.
├── auth/
│   └── src/
│       ├── errors/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       │   └── __test__/
│       ├── services/
│       └── test/
├── client/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   └── pages/
│       └── auth/
├── common/
│   └── src/
├── infra/
│   └── k8s/
├── scripts/
└── skaffold.yaml
```

## Services

### Auth Service (`auth`)

- Runs on port `3000`
- Connects to MongoDB service `auth-mongo-srv:27017`
- Uses `JWT_KEY` from Kubernetes secret `jwt-secret`
- Handles auth routes:
	- `POST /api/users/signup`
	- `POST /api/users/signin`
	- `POST /api/users/signout`
	- `GET /api/users/currentuser`

### Client Service (`client`)

- Next.js app served via ingress at `http://ticketing.dev`
- Uses shared `build-client` helper for server/browser API calls
- Auth pages:
	- `/auth/signup`
	- `/auth/signin`
	- `/auth/signout`

### Common Package (`common`)

- Local TypeScript package for shared code
- Build output is in `common/build`
- Published package metadata is managed in `common/package.json`

## Kubernetes and Routing

All manifests are in `infra/k8s`:

- `auth-depl.yaml`
- `auth-mongo-depl.yaml`
- `client-depl.yaml`
- `ingress-srv.yaml`
- `jwt-secret.yaml`

Ingress host: `ticketing.dev`

Routes:

- `/api/users/*` -> `auth-srv:3000`
- `/*` -> `client-srv:3000`

## Prerequisites

- Docker Desktop with Kubernetes enabled
- `kubectl`
- `skaffold`
- Node.js + npm

## First-Time Setup

1. Add host mapping:

```bash
sudo sh -c 'echo "127.0.0.1 ticketing.dev" >> /etc/hosts'
```

2. Bootstrap cluster dependencies and manifests:

```bash
./scripts/dev-up.sh
```

3. Start development:

```bash
skaffold dev
```

4. Open:

```text
http://ticketing.dev
```

## Daily Workflow

```bash
./scripts/dev-up.sh
skaffold dev
```

## Helpful Commands

### Cluster and Ingress

```bash
kubectl get ingress -A -o wide
kubectl get pods -n ingress-nginx
kubectl get svc -n ingress-nginx
kubectl get svc
```

### Auth Service Tests

```bash
cd auth
npm test
```

Run tests once:

```bash
cd auth
npm run test:ci
```

### Common Package Build

```bash
cd common
npm run build
```

## Script: `scripts/dev-up.sh`

This script makes startup repeatable by:

- Verifying Kubernetes connectivity
- Ensuring `/etc/hosts` includes `ticketing.dev`
- Installing ingress-nginx controller if missing
- Waiting for ingress controller readiness
- Applying all manifests in `infra/k8s`

## Troubleshooting

If `ticketing.dev` does not open:

1. Verify host mapping:

```bash
grep ticketing.dev /etc/hosts
```

2. Ensure ingress controller is running:

```bash
kubectl get pods -n ingress-nginx
```

3. Re-bootstrap:

```bash
./scripts/dev-up.sh
```

4. Restart dev loop:

```bash
skaffold dev
```

5. Flush DNS cache on macOS if needed:

```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```
