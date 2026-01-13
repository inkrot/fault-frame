#!/bin/bash
# Verify that npm package excludes demo/ and other dev files

set -e

echo "🔍 Verifying npm package contents..."
echo ""

# Run dry-run pack
echo "Running npm pack --dry-run..."
npm pack --dry-run > pack-output.txt 2>&1

# Display package info
echo ""
echo "📦 Package Info:"
grep "package size:" pack-output.txt || echo "Could not find size"
grep "total files:" pack-output.txt || echo "Could not find file count"
echo ""

# Check for unwanted files/folders
ERRORS=0

if grep -q "demo/" pack-output.txt; then
  echo "❌ ERROR: demo/ folder found in package!"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ demo/ is excluded"
fi

if grep -q "src/" pack-output.txt; then
  echo "❌ ERROR: src/ folder found in package!"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ src/ is excluded"
fi

if grep -q "examples/" pack-output.txt; then
  echo "❌ ERROR: examples/ folder found in package!"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ examples/ is excluded"
fi

if grep -q "tsconfig.json" pack-output.txt; then
  echo "❌ ERROR: tsconfig.json found in package!"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ tsconfig.json is excluded"
fi

if grep -q "CHANGELOG.md" pack-output.txt; then
  echo "⚠️  WARNING: CHANGELOG.md found in package (might be intentional)"
fi

# Check required files
echo ""
echo "📄 Required Files:"

if grep -q "dist/index.js" pack-output.txt; then
  echo "✅ dist/index.js included"
else
  echo "❌ ERROR: dist/index.js missing!"
  ERRORS=$((ERRORS + 1))
fi

if grep -q "dist/index.mjs" pack-output.txt; then
  echo "✅ dist/index.mjs included"
else
  echo "❌ ERROR: dist/index.mjs missing!"
  ERRORS=$((ERRORS + 1))
fi

if grep -q "dist/index.d.ts" pack-output.txt; then
  echo "✅ dist/index.d.ts included"
else
  echo "❌ ERROR: dist/index.d.ts missing!"
  ERRORS=$((ERRORS + 1))
fi

if grep -q "README.md" pack-output.txt; then
  echo "✅ README.md included"
else
  echo "❌ ERROR: README.md missing!"
  ERRORS=$((ERRORS + 1))
fi

if grep -q "LICENSE" pack-output.txt; then
  echo "✅ LICENSE included"
else
  echo "❌ ERROR: LICENSE missing!"
  ERRORS=$((ERRORS + 1))
fi

# Check file count
echo ""
FILE_COUNT=$(grep "total files:" pack-output.txt | awk '{print $4}')
echo "📊 Total files: $FILE_COUNT"

if [ "$FILE_COUNT" -gt 15 ]; then
  echo "⚠️  WARNING: Package has $FILE_COUNT files (expected ~7)"
  echo "   This might indicate unwanted files are included"
fi

# Display all files
echo ""
echo "📋 All files in package:"
grep -A 100 "Tarball Contents" pack-output.txt | grep -v "Tarball Contents" | grep -v "Tarball Details" | grep "kB" || echo "(Could not list files)"

# Cleanup
rm pack-output.txt

# Final result
echo ""
if [ $ERRORS -eq 0 ]; then
  echo "✅ Package verification passed!"
  exit 0
else
  echo "❌ Package verification failed with $ERRORS error(s)"
  exit 1
fi
