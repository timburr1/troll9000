# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Troll 9000 is a small Discord bot for a private friend group. Everything lives in [app.js](app.js). It uses **discord.js v12** (the older API: `new Discord.Client()` with no intents, the `'message'` event, `client.users.fetch(id, false)`). Don't use v13+ patterns such as `GatewayIntentBits` or `messageCreate` unless you are also upgrading the dependency.

## Commands

```
npm install
npm run start        # node app.js — logs in and runs until killed
npx eslint app.js    # lint (eslint:recommended, ES2019, node env)
```

There are no tests. `npm test` is the npm placeholder and exits 1. [.vscode/launch.json](.vscode/launch.json) has a debug config that launches `app.js`.

## Configuration

The bot reads secrets and Discord user IDs from a `.env` file in the project root (gitignored) via `dotenv`. Keys are uppercase: `TOKEN`, plus `<NAME>_UID` for users the message handler reacts to (e.g. `TIM_UID`).

`package-lock.json` is gitignored.

## How app.js is organized

- **Message handler** (`client.on('message')`): runs on every message the bot can see. It reacts to specific users by comparing `msg.author.id` with UIDs from `.env`, and replies with a joke on about 1% of messages. Different behaviours get switched on and off by commenting blocks in and out, so check what is commented out before assuming a feature is live.
- **Secret Santa** (`!santa @a @b @c …` → `secretSanta` → `messagePlayers`): the players are the members @mentioned in the command (`msg.mentions.members`, at least 3, server channels only). It shuffles them into a gift circle and DMs each giver the display name of their giftee. Pairings are logged in rot13 so the operator can recover them without seeing them by accident.
