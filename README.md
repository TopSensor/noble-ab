# NodeSnapWeb
[![Snap Status](https://build.snapcraft.io/badge/bleonard252/NodeSnapWeb.svg)](https://build.snapcraft.io/user/bleonard252/NodeSnapWeb)
![Maintenance: active](https://img.shields.io/badge/maintenance-active-green.svg)

[![Get it from the Snap Store](https://snapcraft.io/static/images/badges/en/snap-store-black.svg)](https://snapcraft.io/nsw)

A configurable node.js server running under snap.

Simply `snap install nsw` to add it to any system. (Use `snap install nsw --edge` to install from master.)

To run it with port 80 and on /var/www/html, run:

```bash
sudo nsw start --port=80 --path=/var/www/html
```

(`sudo` is required to bind to port 80.)

## Break the sandbox
Running NodeSnapWeb out of the Snap sandbox may be needed to circumvent problems and allow access to /var/www/html. Within the Snap confinement, NSW only has access to your home directory and may have issues with NSW silently refusing to start. To circumvent these problems, replace `nsw` with:

```bash
/snap/nsw/current/bin/node /snap/nsw/current/lib/node_modules/nsw/index.js
```

It may be preferrable to set an alias:

```bash
alias nsw="/snap/nsw/current/bin/node /snap/nsw/current/lib/node_modules/nsw/index.js"
```
