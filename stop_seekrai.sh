#!/bin/bash
# SeekrAI Stop Script — stops all services

echo "========================================"
echo "  Stopping SeekrAI Services"
echo "========================================"
echo ""

if tmux has-session -t seekrai-search 2>/dev/null; then
    tmux kill-session -t seekrai-search
    echo "  Stopped search service (port 5500)"
else
    echo "  Search service not running"
fi

if tmux has-session -t seekrai-ui 2>/dev/null; then
    tmux kill-session -t seekrai-ui
    echo "  Stopped UI service (port 5501)"
else
    echo "  UI service not running"
fi

if tmux has-session -t seekrai-asksre 2>/dev/null; then
    tmux kill-session -t seekrai-asksre
    echo "  Stopped ask-sre service (port 8000)"
else
    echo "  ask-sre service not running"
fi

echo ""
echo "All services stopped."
echo ""
