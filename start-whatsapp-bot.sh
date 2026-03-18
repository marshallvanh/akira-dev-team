#!/usr/bin/env bash
set -e

export ANTHROPIC_API_KEY="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"

cd /home/marshall/ai-dev-team-whatsapp
node whatsapp-bot.cjs
