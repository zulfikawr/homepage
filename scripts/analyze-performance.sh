#!/bin/bash
set -e

echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║                 SITE PERFORMANCE ANALYSIS TOOL                           ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Dependency Analysis
echo -e "${BLUE}📦 DEPENDENCY ANALYSIS${NC}"
echo "─────────────────────────────────────────────────────────────────────────"
echo "Node Modules Size:"
du -sh node_modules 2>/dev/null | awk '{print "  " $1}'

echo ""
echo "Top 10 Largest Dependencies:"
du -sh node_modules/*/ 2>/dev/null | sort -rh | head -10 | awk '{print "  " $1 "\t" $2}'

EXTRANEOUS=$(npm list --depth=0 2>&1 | grep -c "extraneous" || echo "0")
echo ""
echo "Extraneous Packages: $EXTRANEOUS"
if [ "$EXTRANEOUS" -gt 0 ]; then
  echo -e "  ${RED}⚠️  Found extraneous packages. Run: npm prune${NC}"
else
  echo -e "  ${GREEN}✓ No extraneous packages${NC}"
fi

# 2. Build Analysis
echo ""
echo -e "${BLUE}🔨 BUILD ANALYSIS${NC}"
echo "─────────────────────────────────────────────────────────────────────────"

if [ -d ".next" ]; then
  echo "Build Size (.next):"
  du -sh .next | awk '{print "  " $1}'
  
  JS_SIZE=$(find .next -type f -name "*.js" -exec du -c {} + 2>/dev/null | tail -1 | awk '{print $1}')
  echo "JavaScript Bundle Size:"
  echo "  $((JS_SIZE / 1024))K"
  
  JS_COUNT=$(find .next -type f -name "*.js" 2>/dev/null | wc -l)
  echo "JavaScript Files: $JS_COUNT"
else
  echo -e "  ${YELLOW}ℹ️  .next directory not found. Run: npm run build${NC}"
fi

# 3. Package Updates
echo ""
echo -e "${BLUE}🔄 AVAILABLE UPDATES${NC}"
echo "─────────────────────────────────────────────────────────────────────────"
npm outdated 2>/dev/null | grep -v "npm WARN" | head -10 || echo "  All dependencies up to date!"

# 4. Code Quality
echo ""
echo -e "${BLUE}📊 CODE QUALITY${NC}"
echo "─────────────────────────────────────────────────────────────────────────"

if command -v npx &> /dev/null; then
  echo "TypeScript Check:"
  npx tsc --noEmit 2>&1 | head -3 || echo "  ${GREEN}✓ No TypeScript errors${NC}"
fi

# 5. Summary
echo ""
echo -e "${BLUE}📈 PERFORMANCE SUMMARY${NC}"
echo "─────────────────────────────────────────────────────────────────────────"
echo "✓ Run \`npm run build\` to generate latest metrics"
echo "✓ Monitor .next size during development"
echo "✓ Keep node_modules under 500MB for optimal CI/CD"
echo "✓ Target: build < 50s on standard hardware"
echo ""
echo -e "${GREEN}Analysis complete!${NC}"
