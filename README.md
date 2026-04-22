# LinkFuel App

Zero-dependency Node application for a finance-focused media marketplace.

## Run

```bash
node server.js
```

Then open `http://127.0.0.1:3000`.

## Share Publicly

The fastest way to make this app public is:

1. Push this folder to a GitHub repository
2. Deploy it on Render or Railway
3. Use the start command `node server.js`

This project already includes a `package.json`, so most Node hosts can detect it automatically.

## Demo accounts

- Buyer: `buyer@linkfuel.app` / `demo123`
- Publisher: `publisher@linkfuel.app` / `demo123`
- Admin: `admin@linkfuel.app` / `demo123`

## Included flows

- Buyer login, project creation, marketplace filters, site detail, order placement, wallet deposits, order tracking
- Publisher login, site submission, inventory visibility
- Admin login, pending-site review, order overview

## Notes

- Persistent data is stored in `data/store.json`
- Sessions are cookie-based and held in memory
- `public/index.html` is only a static notice page; the app itself is served by `server.js`
