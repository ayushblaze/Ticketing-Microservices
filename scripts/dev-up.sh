#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INGRESS_MANIFEST_URL="https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml"

log() {
  printf "\n[%s] %s\n" "dev-up" "$1"
}

ensure_hosts_entry() {
  if grep -qE '(^|[[:space:]])ticketing\.dev([[:space:]]|$)' /etc/hosts; then
    log "Hosts entry found: ticketing.dev"
    return
  fi

  log "Missing /etc/hosts entry for ticketing.dev"
  echo "Run this once, then re-run this script:"
  echo "  sudo sh -c 'echo \"127.0.0.1 ticketing.dev\" >> /etc/hosts'"
  exit 1
}

ensure_ingress_controller() {
  if kubectl get deployment ingress-nginx-controller -n ingress-nginx >/dev/null 2>&1; then
    log "ingress-nginx controller already installed"
  else
    log "Installing ingress-nginx controller"
    kubectl apply -f "$INGRESS_MANIFEST_URL"
  fi

  log "Waiting for ingress-nginx controller to be ready"
  kubectl wait --namespace ingress-nginx \
    --for=condition=Ready pod \
    --selector=app.kubernetes.io/component=controller \
    --timeout=180s

  if kubectl get ingressclass nginx >/dev/null 2>&1; then
    log "IngressClass nginx is available"
  else
    log "IngressClass nginx not found after install"
    exit 1
  fi
}

ensure_project_manifests() {
  log "Applying project manifests"
  kubectl apply -f "$PROJECT_ROOT/infra/k8s"
}

main() {
  log "Checking kubectl connectivity"
  kubectl cluster-info >/dev/null

  ensure_hosts_entry
  ensure_ingress_controller
  ensure_project_manifests

  log "Bootstrap complete. Start development with: skaffold dev"
}

main "$@"
