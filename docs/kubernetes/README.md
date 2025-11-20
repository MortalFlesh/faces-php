# Faces Demo with Istio Gateway API

This directory contains the Faces demo application configured to work with Istio and Gateway API.

## Quick Start

```bash
# Step 1: Deploy base application
kubectl apply -f step1.yaml

# Verify it's working at http://faces-mf.adun:31080
# You should see: 100% green backgrounds + 100% 😀 faces

# Step 2: Enable traffic splitting (50/50 canary)
kubectl apply -f step2.yaml

# Refresh the dashboard - you should now see:
# - 50% green + 50% cyan backgrounds
# - 50% 😀 + 50% 😍 faces
# - All 4 combinations appearing randomly
```

## What is Faces Demo?

Faces is a microservices demo application from BuoyantIO that displays a grid of faces with different expressions and background colors. It's designed to demonstrate service mesh capabilities, resilience patterns, and observability in Kubernetes.

**Source**: https://github.com/BuoyantIO/faces-demo

## Architecture

### Step 1: Basic Setup
```
External Access:
   faces-mf.adun:31080 (Istio Gateway via NodePort)
          │
          ├─→ / → dashboard (Web UI)
          ├─→ /face → face service
          ├─→ /smiley → smiley service
          └─→ /color → color service

Internal (Pod-to-Pod with Istio service mesh):
┌─────────────┐
│  dashboard  │  → Fetches from /face via browser
└─────────────┘

   ┌───────┐
   │ face  │  ← Aggregator service (with Istio sidecar)
   └───┬───┘
       │ (Istio-proxied internal K8s service communication)
       ├─────────────┬─────────────┐
       ▼             ▼             ▼
  ┌────────┐                  ┌────────┐
  │ smiley │                  │ color  │
  │   😀   │                  │ green  │
  │ (100%) │                  │ (100%) │
  └────────┘                  └────────┘
  (with Istio sidecar)        (with Istio sidecar)
```

### Step 2: Traffic Splitting (with Istio HTTPRoute)
```
   ┌───────┐
   │ face  │  ← Aggregator service (with Istio sidecar)
   └───┬───┘
       │ (calls "smiley" and "color" services)
       │ (Istio intercepts via HTTPRoute with Service parentRefs)
       │
       ├─────────────────────┬─────────────────────┐
       ▼                     ▼                     ▼
  ┌────────┐  HTTPRoute ┌────────┐  HTTPRoute ┌────────┐
  │ smiley │  ─────────►│ color  │  ─────────►│        │
  │service │  (canary)  │service │  (canary)  │        │
  └───┬────┘            └───┬────┘            │        │
      │                    │                  │        │
   50%│  50%            50%│  50%             │        │
      ▼     ▼              ▼     ▼            ▼        ▼
  ┌────┐ ┌─────┐      ┌───┐ ┌─────┐
  │ 😀 │ │ 😍  │      │ 🟢 │ │ 🔵  │
  │    │ │     │      │    │ │     │
  └────┘ └─────┘      └───┘ └─────┘
  smiley  smiley2     color  color2
  (pods with Istio sidecars)
```

## Services

- **dashboard** - Web interface that displays the grid of faces
- **face** - Aggregates calls to smiley and color services to generate each face
- **smiley** - Returns a grinning emoji (😀) - no errors
- **smiley2** - Returns heart eyes emoji (😍) - no errors
- **color** - Returns light green background - no errors
- **color2** - Returns cyan background - no errors

## Access

The application is exposed via Istio Gateway at:

```
http://faces-mf.adun:31080
```

**Note**: The Gateway API is configured on port 80, but Istio ingress gateway exposes it via NodePort 31080:
- Gateway listener: `port: 80` (internal Gateway API configuration)
- Istio ingress service: `80:31080/TCP` (NodePort mapping)

Make sure `faces-mf.adun` is added to your DNS (Pi-hole) pointing to your Istio ingress gateway.

## Gateway Configuration

The application uses Kubernetes Gateway API with Istio as the implementation:

### External Gateway (Istio)

The HTTPRoute exposes services externally via Istio Gateway:

- `GET /` → `dashboard:80` - Serves the web interface
- `GET /face` → `face:80` - API endpoint for fetching face data (called by browser)
- `GET /smiley` → `smiley:80` - Direct access to smiley service (optional, for debugging)
- `GET /color` → `color:80` - Direct access to color service (optional, for debugging)

**Gateway Configuration:**
```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: faces-gateway
  namespace: faces-mf
spec:
  gatewayClassName: istio  # Uses Istio as the Gateway implementation
  listeners:
    - name: http
      hostname: "*.adun"
      port: 80
      protocol: HTTP
```

### Internal Service Mesh Communication (Istio)

The face service communicates with smiley and color services using short service names:
- `http://smiley/smiley` - Kubernetes DNS resolves to the smiley Service
- `http://color/color` - Kubernetes DNS resolves to the color Service

**Key Features:**
- **Istio sidecars** are automatically injected into all pods (via `istio-injection: enabled` namespace label)
- **Service mesh** provides mTLS, observability, and traffic management
- Short service names work for same-namespace communication
- When HTTPRoute with Service parentRefs is applied in Step 2, Istio intercepts traffic and splits it according to configured weights

## Deployment Steps

### Step 1: Deploy the Base Application

Deploy all the Faces services with Istio service mesh:

```bash
# Deploy the application
kubectl apply -f step1.yaml

# This creates:
# - Namespace with istio-injection: enabled label
# - Dashboard, face, smiley, and color deployments (Istio sidecars auto-injected)
# - Kubernetes Services
# - Istio Gateway (faces-gateway)
# - HTTPRoute for external access

# Check status
kubectl get pods -n faces-mf

# You should see 2 containers per pod (app + istio-proxy sidecar)
# NAME                        READY   STATUS    RESTARTS   AGE
# color-xxx                   2/2     Running   0          1m
# dashboard-xxx               2/2     Running   0          1m
# face-xxx                    2/2     Running   0          1m
# smiley-xxx                  2/2     Running   0          1m

# Watch for ready state
kubectl rollout status -n faces-mf deployment --all

# View logs (application container)
kubectl logs -n faces-mf -l app=face -c face --tail=20

# View Istio sidecar logs
kubectl logs -n faces-mf -l app=face -c istio-proxy --tail=20
```

Access at `http://faces-mf.adun:31080` - you should see a grid with:
- Green backgrounds (color service - 100%)
- Grinning faces 😀 (smiley service - 100%)
- All working reliably via Istio service mesh

### Step 2: Enable Traffic Splitting with HTTPRoute

This step demonstrates **canary deployments** and **A/B testing** using Istio's HTTPRoute traffic splitting.

The configuration uses HTTPRoute's `parentRefs` pointing to Services (not Gateway) to intercept service-to-service traffic within the Istio mesh:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
    name: smiley-canary
    namespace: faces-mf
spec:
    parentRefs:
        - name: smiley      # Attach to the smiley Service
          kind: Service
          group: ""
          port: 80
    rules:
        - backendRefs:
              - name: smiley
                port: 80
                weight: 50    # 50% traffic to smiley (😀)
              - name: smiley2
                port: 80
                weight: 50    # 50% traffic to smiley2 (😍)
```

Deploy the traffic splitting configuration:

```bash
# Apply the canary HTTPRoutes
kubectl apply -f step2.yaml

# This creates:
# - smiley2 and color2 deployments (with Istio sidecars)
# - smiley2 and color2 services
# - HTTPRoute smiley-canary (intercepts traffic to smiley service)
# - HTTPRoute color-canary (intercepts traffic to color service)

# Verify the HTTPRoutes were created
kubectl get httproute -n faces-mf

# You should see:
# NAME             HOSTNAMES         AGE
# faces-routes     faces-mf.adun     5m
# smiley-canary    <none>            30s
# color-canary     <none>            30s
```

**Expected Result**: Access `http://faces-mf.adun:31080` and refresh the page. You should now see:
- **Mixed emojis**: 50% grinning faces (😀) and 50% heart eyes (😍)
- **Mixed colors**: 50% green backgrounds and 50% cyan backgrounds
- The face service makes requests to `smiley` and `color` services, but Istio's HTTPRoute intercepts and splits traffic

**How This Works**:
1. **Face service** makes HTTP requests to service names: `http://smiley/smiley` and `http://color/color`
2. **Istio sidecar** intercepts these outbound requests
3. **HTTPRoute with Service parentRefs** tells Istio to split traffic according to configured weights
4. **Traffic is distributed** 50/50 between the original and v2 services without any changes to the face service code

This is more powerful than traditional Kubernetes Service load balancing because:
- ✅ You can do weighted traffic splits (canary, blue/green)
- ✅ Changes are immediate (no pod restarts needed)
- ✅ Works at the application layer (HTTP-aware routing)
- ✅ Can route based on headers, paths, or other HTTP attributes
- ✅ Istio provides mTLS, observability, and retries automatically

**Verify Traffic Split**:
```bash
# Watch the faces update - you should see both variants
# - Green 😀 faces (smiley + color)
# - Green 😍 faces (smiley2 + color)
# - Cyan 😀 faces (smiley + color2)
# - Cyan 😍 faces (smiley2 + color2)

# Check HTTPRoute status
kubectl describe httproute smiley-canary -n faces-mf
kubectl describe httproute color-canary -n faces-mf

# Test from within the face pod to see traffic splitting
kubectl exec -n faces-mf deploy/face -c face -- sh -c '
  for i in 1 2 3 4 5; do
    wget -qO- http://smiley/smiley | grep -o "\"smiley\":\"[^\"]*\"" 
  done
'
```

**Adjust Traffic Weights**:
```bash
# Edit the canary HTTPRoute to change weights
kubectl edit httproute smiley-canary -n faces-mf

# Example: Change to 90/10 split
# - smiley: weight: 90
# - smiley2: weight: 10

# The changes apply immediately via Istio without redeploying pods!
```

## Cleanup

```bash
# Remove everything
kubectl delete ns faces-mf

# Or remove just step2 (traffic splitting)
kubectl delete -f step2.yaml

# Or remove step1 (the entire app)
kubectl delete -f step1.yaml
```

## Testing Step 2 - Traffic Splitting

After applying step2.yaml, verify the traffic splitting is working:

### 1. Check HTTPRoutes were created

```bash
kubectl get httproute -n faces-mf

# Expected output:
# NAME                    HOSTNAMES           AGE
# color-canary           <none>              30s
# faces-color-route      faces-mf.adun       5m
# faces-color2-route     faces-mf.adun       30s
# faces-dashboard-route  faces-mf.adun       5m
# faces-face-route       faces-mf.adun       5m
# faces-smiley-route     faces-mf.adun       5m
# faces-smiley2-route    faces-mf.adun       30s
# smiley-canary          <none>              30s
```

Note: The `*-canary` routes have no hostnames because they use Service parentRefs (internal routing).

### 2. Verify services are running

```bash
kubectl get pods -n faces-mf

# Should see smiley, smiley2, color, color2 all running
```

### 3. Test traffic distribution from inside face pod

```bash
POD=$(kubectl get pod -n faces-mf -l app=face -o jsonpath='{.items[0].metadata.name}')

# Test smiley - should return both 😀 and 😍
for i in {1..10}; do
  kubectl exec -n faces-mf $POD -- wget -qO- http://smiley/smiley 2>/dev/null | grep -o '"smiley":"[^"]*"'
done

# Test color - should return both mint (#96CEB4) and cyan (#45B7D1)
for i in {1..10}; do
  kubectl exec -n faces-mf $POD -- wget -qO- http://color/color 2>/dev/null | grep -o '"color":"[^"]*"'
done
```

### 4. Visual verification

Open `http://faces-mf.adun:31080` in your browser and start the demo. You should see:

- **4 different face combinations** appearing randomly:
  - Green background + 😀 (smiley + color)
  - Green background + 😍 (smiley2 + color)
  - Cyan background + 😀 (smiley + color2)
  - Cyan background + 😍 (smiley2 + color2)

- **Distribution**: Roughly 50/50 for each variant over time

### 5. Adjust weights dynamically

```bash
# Change smiley split to 90/10
kubectl patch httproute smiley-canary -n faces-mf --type='json' -p='[
  {"op": "replace", "path": "/spec/rules/0/backendRefs/0/weight", "value": 90},
  {"op": "replace", "path": "/spec/rules/0/backendRefs/1/weight", "value": 10}
]'

# Refresh browser - you should now see mostly 😀 with occasional 😍
```
