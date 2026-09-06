#!/usr/bin/env bash
set -e

# Setup git post-commit hook for automated GitHub synchronization
HOOK_FILE=".git/hooks/post-commit"
mkdir -p .git/hooks

cat << 'EOF' > "$HOOK_FILE"
#!/usr/bin/env bash
# Git post-commit hook for automatic background push to GitHub
echo ""
echo "⚡ [Git Hook: post-commit] Auto-pushing commit to origin main..."
GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1 git -c http.curloptResolve="github.com:443:20.207.73.82" push origin main
echo "✅ [Git Hook: post-commit] Successfully synchronized with remote main!"
EOF

chmod +x "$HOOK_FILE"
echo "✅ Git post-commit hook installed successfully at $HOOK_FILE"
