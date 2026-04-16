# Ticketing Microservices

## Local Development

### Prerequisites

- Docker Desktop (Kubernetes enabled)
- `kubectl`
- `skaffold`

### First-Time Setup

1. Add local host mapping:

```bash
sudo sh -c 'echo "127.0.0.1 ticketing.dev" >> /etc/hosts'
```

2. Bootstrap cluster prerequisites and project manifests:

```bash
./scripts/dev-up.sh
```

### Daily Startup

```bash
./scripts/dev-up.sh
skaffold dev
```

Then open:

- http://ticketing.dev

## What `dev-up.sh` Does

- Verifies Kubernetes connectivity.
- Ensures `ticketing.dev` exists in `/etc/hosts`.
- Installs `ingress-nginx` controller if missing.
- Waits for ingress controller readiness.
- Applies all manifests in `infra/k8s` (including `jwt-secret`).

## Common Commands

Check ingress:

```bash
kubectl get ingress -A -o wide
```

Check ingress controller:

```bash
kubectl get pods -n ingress-nginx
kubectl get svc -n ingress-nginx
```

Check app services:

```bash
kubectl get svc
```

## Troubleshooting

If browser still cannot open `ticketing.dev`:

1. Confirm hosts entry:

```bash
grep ticketing.dev /etc/hosts
```

2. Flush DNS cache (macOS):

```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

3. Re-run bootstrap:

```bash
./scripts/dev-up.sh
```

4. Re-run app:

```bash
skaffold dev
```
