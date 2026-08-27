# nested-comments-nginx-lab

A tiny Express app (nested comments UI) used as a sandbox for learning DevOps basics —
deploying to an EC2 instance, fronting it with Nginx as a reverse proxy, and picking up
process management, domains/SSL, and basic server hardening along the way.

## What this repo actually is

The app itself is intentionally simple: a nested-comments demo built with vanilla JS/HTML/CSS
and a small Express server (`server.js`) that serves it. The interesting part isn't the app —
it's everything around it:

- Provisioning and connecting to an EC2 instance
- Running the Node/Express app on the instance (e.g. with `pm2` or `systemd`)
- Configuring Nginx as a reverse proxy in front of the app
- Pointing a domain at it and adding HTTPS (e.g. via Certbot/Let's Encrypt)
- Basic firewall/security group setup

## Running locally

```bash
npm install
npm start
```

App runs at `http://localhost:3000`.

## Status

Work in progress — used purely for learning, not a production project.
