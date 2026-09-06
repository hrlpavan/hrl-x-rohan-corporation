#!/usr/bin/env bash
set -e

# HRL International x Rohan Corporation
# Automated Commit & Push Pipeline

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

echo "=================================================================="
echo "⚡ HRL × Rohan Corporation — Auto-Push Pipeline"
echo "=================================================================="

# 1. Check if there are changes (tracked or untracked)
STATUS=$(GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1 git status --porcelain)
AHEAD=$(GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1 git status -sb | grep -o "ahead [0-9]*" || true)

if [ -z "$STATUS" ] && [ -z "$AHEAD" ]; then
    echo "ℹ️  Working tree clean and already up to date with remote. Nothing to push."
    exit 0
fi

# 2. Run automated verification suite if python3 exists
if [ -f "tests/verify_platform_integrity.py" ]; then
    echo "🔍 Running Automated Integrity & Math Test Suite..."
    python3 tests/verify_platform_integrity.py
    if [ $? -ne 0 ]; then
        echo "❌ Platform integrity tests failed. Aborting push to protect main."
        exit 1
    fi
fi

# 3. Stage changes if working tree has changes
if [ -n "$STATUS" ]; then
    echo "📦 Staging all workspace modifications..."
    GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1 git add -A

    # Commit message handling
    COMMIT_MSG="$1"
    if [ -z "$COMMIT_MSG" ]; then
        TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
        COMMIT_MSG="chore(auto-sync): synchronized platform changes ($TIMESTAMP)"
    fi

    echo "✍️  Creating commit: "$COMMIT_MSG""
    GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1 git -c user.name="Pavankumar S" -c user.email="pavankumars@google.com" commit -m "$COMMIT_MSG"
fi

# 4. Push to remote main with resolved GitHub endpoint
echo "🚀 Pushing commits to origin main..."
GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1 git -c http.curloptResolve="github.com:443:20.207.73.82" push origin main

echo "=================================================================="
echo "✅ Auto-Push Completed Successfully! Remote is 100% in sync."
echo "=================================================================="
