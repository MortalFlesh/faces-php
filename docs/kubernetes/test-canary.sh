#!/usr/bin/env bash

set -e

POD=$(kubectl get pod -n faces-mf -l app=face -o jsonpath='{.items[0].metadata.name}')
echo "Testing pod: $POD"

# Test smiley - should return both 😀 and 😍
echo "Testing smiley endpoint:"
for i in {1..10}; do
  kubectl exec -n faces-mf $POD -c face -- wget -qO- http://smiley/smiley 2>/dev/null | grep -o '"smiley":"[^"]*"'
done

echo ""

# Test color - should return both mint (#96CEB4) and cyan (#45B7D1)
echo "Testing color endpoint:"
for i in {1..10}; do
  kubectl exec -n faces-mf $POD -c face -- wget -qO- http://color/color 2>/dev/null | grep -o '"color":"[^"]*"'
done

echo "Done"
