const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const querystring = require("querystring");

const root = __dirname;
const publicDir = path.join(root, "public");
const dataDir = path.join(root, "data");
const storeFile = path.join(dataDir, "store.json");
const port = Number(process.env.PORT || 3000);
const host = "127.0.0.1";
const sessions = new Map();

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

const seedStore = {
  counters: {
    user: 4,
    project: 2,
    site: 4,
    offer: 6,
    order: 4,
    transaction: 5,
  },
  users: [
    {
      id: "user_1",
      role: "buyer",
      name: "Velora Growth",
      company: "Velora",
      email: "buyer@linkfuel.app",
      passwordHash: "d3ad9315b7be5dd53b31a273b3b3aba5defe700808305aa16a3062b76658a791",
    },
    {
      id: "user_2",
      role: "publisher",
      name: "BlockDepth Media",
      company: "BlockDepth Media",
      email: "publisher@linkfuel.app",
      passwordHash: "d3ad9315b7be5dd53b31a273b3b3aba5defe700808305aa16a3062b76658a791",
    },
    {
      id: "user_3",
      role: "admin",
      name: "Platform Admin",
      company: "LinkFuel",
      email: "admin@linkfuel.app",
      passwordHash: "d3ad9315b7be5dd53b31a273b3b3aba5defe700808305aa16a3062b76658a791",
    },
  ],
  wallets: [
    { userId: "user_1", balance: 12840 },
    { userId: "user_2", balance: 0 },
    { userId: "user_3", balance: 0 },
  ],
  projects: [
    {
      id: "project_1",
      buyerId: "user_1",
      name: "Velora Exchange",
      domain: "velora.trade",
      vertical: "Crypto / Web3",
      targetCountries: "US, UK, AE",
      targetLanguages: "English",
      budgetRange: "$3k - $8k",
      objective: "Authority growth with finance-relevant placements",
      notes: "Prefer finance-relevant placements that accept money pages and crypto exchange narratives.",
      createdAt: "2026-04-22",
    },
  ],
  sites: [
    {
      id: "site_1",
      publisherId: "user_2",
      siteName: "BlockDepth Journal",
      domain: "blockdepthjournal.com",
      country: "US",
      language: "English",
      verticals: "Crypto / Web3, Fintech / Payment",
      status: "approved",
      moneyPageAllowed: true,
      sponsoredRequired: false,
      contentWriting: true,
      dr: 71,
      traffic: 48200,
      description: "A crypto-finance publication with active editorial review and strong US traffic.",
      restrictions: "Finance claims require editorial review. Casino, adult and payday loans are rejected.",
    },
    {
      id: "site_2",
      publisherId: "user_2",
      siteName: "Finroute Daily",
      domain: "finroutedaily.com",
      country: "UK",
      language: "English",
      verticals: "Fintech / Payment, Crypto / Web3",
      status: "approved",
      moneyPageAllowed: true,
      sponsoredRequired: true,
      contentWriting: false,
      dr: 67,
      traffic: 32100,
      description: "A fintech-heavy blog that accepts commercial updates and curated niche edits.",
      restrictions: "Sponsored label required. Loans, casino and leverage-promising copy are rejected.",
    },
    {
      id: "site_3",
      publisherId: "user_2",
      siteName: "Macro Ledger",
      domain: "macroledger.co",
      country: "AE",
      language: "English",
      verticals: "Crypto / Web3, Forex",
      status: "approved",
      moneyPageAllowed: false,
      sponsoredRequired: false,
      contentWriting: true,
      dr: 63,
      traffic: 21400,
      description: "Regional finance publication suited for thought leadership and top-of-funnel crypto content.",
      restrictions: "Direct exchange signup pages are not accepted. Educational pieces only.",
    },
    {
      id: "site_4",
      publisherId: "user_2",
      siteName: "ChainAlpha News",
      domain: "chainalpha.news",
      country: "US",
      language: "English",
      verticals: "Crypto / Web3, Loan",
      status: "pending",
      moneyPageAllowed: true,
      sponsoredRequired: false,
      contentWriting: true,
      dr: 56,
      traffic: 15400,
      description: "Pending review due to mixed crypto and loan category claims.",
      restrictions: "Awaiting admin review.",
    },
  ],
  offers: [
    {
      id: "offer_1",
      siteId: "site_1",
      offerType: "Guest Post",
      price: 420,
      turnaroundDays: 3,
      score: 94,
      reasons: "Strong vertical match for crypto exchange content|US audience fit|Accepts commercial landing pages",
    },
    {
      id: "offer_2",
      siteId: "site_2",
      offerType: "Link Insertion",
      price: 350,
      turnaroundDays: 5,
      score: 88,
      reasons: "Budget-friendly fit|Supports finance and payment adjacent topics|Useful for branded anchors",
    },
    {
      id: "offer_3",
      siteId: "site_3",
      offerType: "Guest Post",
      price: 290,
      turnaroundDays: 4,
      score: 82,
      reasons: "Regional fit for UAE growth goals|Fast turnaround|Works for educational crypto narratives",
    },
    {
      id: "offer_4",
      siteId: "site_2",
      offerType: "Guest Post",
      price: 430,
      turnaroundDays: 6,
      score: 84,
      reasons: "Fintech and crypto adjacency|Higher editorial trust|Useful for product explainers",
    },
  ],
  orders: [
    {
      id: "order_1",
      orderNo: "LF-240321",
      buyerId: "user_1",
      publisherId: "user_2",
      projectId: "project_1",
      offerId: "offer_1",
      siteId: "site_1",
      amount: 420,
      status: "in_progress",
      targetUrl: "https://velora.trade/exchange",
      anchorText: "Velora exchange",
      instructions: "Feature Velora's on-chain execution layer with brand anchor.",
      createdAt: "2026-04-21",
    },
    {
      id: "order_2",
      orderNo: "LF-240298",
      buyerId: "user_1",
      publisherId: "user_2",
      projectId: "project_1",
      offerId: "offer_2",
      siteId: "site_2",
      amount: 350,
      status: "awaiting_buyer_reply",
      targetUrl: "https://velora.trade/uk",
      anchorText: "Velora UK",
      instructions: "Need final target URL confirmation for UK landing page.",
      createdAt: "2026-04-20",
    },
    {
      id: "order_3",
      orderNo: "LF-240255",
      buyerId: "user_1",
      publisherId: "user_2",
      projectId: "project_1",
      offerId: "offer_3",
      siteId: "site_3",
      amount: 290,
      status: "completed",
      targetUrl: "https://velora.trade/blog/defi-execution",
      anchorText: "DeFi execution infrastructure",
      instructions: "Published as an educational feature around DeFi trading infrastructure.",
      createdAt: "2026-04-18",
    },
  ],
  transactions: [
    { id: "txn_1", userId: "user_1", type: "deposit", amount: 5000, status: "paid", note: "USDT top-up via Cryptomus", createdAt: "2026-04-20" },
    { id: "txn_2", userId: "user_1", type: "payment", amount: -420, status: "settled", note: "Order LF-240321", createdAt: "2026-04-21" },
    { id: "txn_3", userId: "user_1", type: "payment", amount: -350, status: "settled", note: "Order LF-240298", createdAt: "2026-04-21" },
    { id: "txn_4", userId: "user_1", type: "refund", amount: 90, status: "pending_review", note: "Refund pending for order adjustment", createdAt: "2026-04-22" },
  ],
};

ensureStore();

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = decodeURIComponent(url.pathname);
    const method = req.method || "GET";

    if (pathname.startsWith("/styles.css")) {
      return sendStatic(res, path.join(publicDir, "styles.css"));
    }

    const store = readStore();
    const session = getSession(req, store);
    const user = session ? findUser(store, session.userId) : null;

    if (method === "GET" && pathname === "/") {
      return html(res, renderHomePage(store, user, getFlash(url)));
    }
    if (method === "GET" && pathname === "/login") {
      return html(res, renderLoginPage(getFlash(url)));
    }
    if (method === "POST" && pathname === "/login") {
      const body = await parseBody(req);
      return handleLogin(res, store, body);
    }
    if (method === "GET" && pathname === "/signup") {
      return html(res, renderSignupPage(getFlash(url), url.searchParams.get("role") || "buyer"));
    }
    if (method === "POST" && pathname === "/signup") {
      const body = await parseBody(req);
      return handleSignup(res, store, body);
    }
    if (method === "POST" && pathname === "/logout") {
      return handleLogout(req, res);
    }

    if (pathname.startsWith("/buyer")) {
      requireRole(res, user, "buyer");
      if (res.writableEnded) return;
      if (method === "GET" && pathname === "/buyer/dashboard") {
        return html(res, renderBuyerDashboard(store, user, getFlash(url)));
      }
      if (method === "POST" && pathname === "/buyer/projects") {
        const body = await parseBody(req);
        return handleCreateProject(res, store, user, body);
      }
      if (method === "GET" && pathname === "/buyer/marketplace") {
        return html(res, renderMarketplacePage(store, user, url, getFlash(url)));
      }
      if (method === "GET" && pathname === "/buyer/site") {
        return html(res, renderSiteDetailPage(store, user, url, getFlash(url)));
      }
      if (method === "POST" && pathname === "/buyer/orders") {
        const body = await parseBody(req);
        return handleCreateOrder(res, store, user, body);
      }
      if (method === "GET" && pathname === "/buyer/orders") {
        return html(res, renderOrdersPage(store, user, getFlash(url)));
      }
      if (method === "GET" && pathname === "/buyer/wallet") {
        return html(res, renderWalletPage(store, user, getFlash(url)));
      }
      if (method === "POST" && pathname === "/buyer/wallet/deposit") {
        const body = await parseBody(req);
        return handleDeposit(res, store, user, body);
      }
    }

    if (pathname.startsWith("/publisher")) {
      requireRole(res, user, "publisher");
      if (res.writableEnded) return;
      if (method === "GET" && pathname === "/publisher/dashboard") {
        return html(res, renderPublisherDashboard(store, user, getFlash(url)));
      }
      if (method === "POST" && pathname === "/publisher/sites") {
        const body = await parseBody(req);
        return handleCreateSite(res, store, user, body);
      }
    }

    if (pathname.startsWith("/admin")) {
      requireRole(res, user, "admin");
      if (res.writableEnded) return;
      if (method === "GET" && pathname === "/admin/dashboard") {
        return html(res, renderAdminDashboard(store, user, getFlash(url)));
      }
      if (method === "POST" && pathname === "/admin/site-status") {
        const body = await parseBody(req);
        return handleSiteStatus(res, store, body);
      }
    }

    return notFound(res);
  } catch (error) {
    console.error(error);
    html(res, renderErrorPage(error), 500);
  }
});

server.listen(port, host, () => {
  console.log(`LinkFuel app running at http://${host}:${port}`);
});

function hash(input) {
  return crypto.createHash("sha256").update(String(input)).digest("hex");
}

function ensureStore() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(storeFile)) {
    fs.writeFileSync(storeFile, JSON.stringify(seedStore, null, 2));
  }
}

function readStore() {
  return JSON.parse(fs.readFileSync(storeFile, "utf8"));
}

function writeStore(store) {
  fs.writeFileSync(storeFile, JSON.stringify(store, null, 2));
}

function nextId(store, type) {
  store.counters[type] += 1;
  return `${type}_${store.counters[type]}`;
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  return Object.fromEntries(
    header
      .split(";")
      .map((chunk) => chunk.trim())
      .filter(Boolean)
      .map((chunk) => {
        const index = chunk.indexOf("=");
        return [chunk.slice(0, index), decodeURIComponent(chunk.slice(index + 1))];
      })
  );
}

function getSession(req) {
  const cookies = parseCookies(req);
  const sessionId = cookies.sid;
  if (!sessionId) return null;
  return sessions.get(sessionId) || null;
}

function createSession(res, userId) {
  const sessionId = crypto.randomBytes(24).toString("hex");
  sessions.set(sessionId, { userId, createdAt: Date.now() });
  res.setHeader("Set-Cookie", `sid=${sessionId}; HttpOnly; Path=/; SameSite=Lax`);
}

function clearSession(req, res) {
  const cookies = parseCookies(req);
  if (cookies.sid) sessions.delete(cookies.sid);
  res.setHeader("Set-Cookie", "sid=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax");
}

function findUser(store, userId) {
  return store.users.find((item) => item.id === userId);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk.toString();
      if (raw.length > 1_000_000) req.destroy();
    });
    req.on("end", () => resolve(querystring.parse(raw)));
    req.on("error", reject);
  });
}

function html(res, content, status = 200) {
  res.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
  res.end(content);
}

function redirect(res, location) {
  res.writeHead(302, { Location: location });
  res.end();
}

function notFound(res) {
  html(
    res,
    baseLayout(
      "Not Found",
      null,
      `<section class="section"><div class="panel"><h2>Page not found.</h2><p class="subhead">The route you requested does not exist.</p></div></section>`
    ),
    404
  );
}

function sendStatic(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = contentTypes[ext] || "application/octet-stream";
  fs.readFile(filePath, (err, data) => {
    if (err) return notFound(res);
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  });
}

function requireRole(res, user, role) {
  if (!user) {
    redirect(res, "/login?error=Please+log+in+first");
    return;
  }
  if (user.role !== role) {
    redirect(res, `/?error=You+do+not+have+access+to+that+area`);
  }
}

function getFlash(url) {
  const error = url.searchParams.get("error");
  const success = url.searchParams.get("success");
  if (error) return { type: "error", text: error };
  if (success) return { type: "success", text: success };
  return null;
}

function handleLogin(res, store, body) {
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const user = store.users.find((item) => item.email.toLowerCase() === email && item.passwordHash === hash(password));

  if (!user) return redirect(res, "/login?error=Invalid+email+or+password");

  createSession(res, user.id);
  return redirect(res, dashboardPathFor(user.role));
}

function handleSignup(res, store, body) {
  const role = String(body.role || "buyer");
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const name = String(body.name || "").trim();
  const company = String(body.company || "").trim();

  if (!name || !email || !password || !role) {
    return redirect(res, `/signup?role=${encodeURIComponent(role)}&error=All+fields+are+required`);
  }

  if (store.users.some((item) => item.email.toLowerCase() === email)) {
    return redirect(res, `/signup?role=${encodeURIComponent(role)}&error=Email+already+exists`);
  }

  const userId = nextId(store, "user");
  store.users.push({ id: userId, role, name, company, email, passwordHash: hash(password) });
  store.wallets.push({ userId, balance: 0 });
  writeStore(store);
  return redirect(res, "/login?success=Account+created.+Please+log+in");
}

function handleLogout(req, res) {
  clearSession(req, res);
  return redirect(res, "/?success=Logged+out");
}

function handleCreateProject(res, store, user, body) {
  const projectId = nextId(store, "project");
  store.projects.push({
    id: projectId,
    buyerId: user.id,
    name: String(body.name || "").trim() || "Untitled Project",
    domain: String(body.domain || "").trim(),
    vertical: String(body.vertical || "").trim(),
    targetCountries: String(body.targetCountries || "").trim(),
    targetLanguages: String(body.targetLanguages || "").trim(),
    budgetRange: String(body.budgetRange || "").trim(),
    objective: String(body.objective || "").trim(),
    notes: String(body.notes || "").trim(),
    createdAt: new Date().toISOString().slice(0, 10),
  });
  writeStore(store);
  return redirect(res, "/buyer/dashboard?success=Project+saved");
}

function handleDeposit(res, store, user, body) {
  const amount = Number(body.amount || 0);
  if (!Number.isFinite(amount) || amount <= 0) {
    return redirect(res, "/buyer/wallet?error=Enter+a+valid+deposit+amount");
  }

  const wallet = store.wallets.find((item) => item.userId === user.id);
  wallet.balance += amount;
  store.transactions.unshift({
    id: nextId(store, "transaction"),
    userId: user.id,
    type: "deposit",
    amount,
    status: "paid",
    note: `Cryptomus simulated deposit via ${String(body.asset || "USDT")}`,
    createdAt: new Date().toISOString().slice(0, 10),
  });
  writeStore(store);
  return redirect(res, "/buyer/wallet?success=Wallet+funded");
}

function handleCreateOrder(res, store, user, body) {
  const offerId = String(body.offerId || "");
  const offer = store.offers.find((item) => item.id === offerId);
  if (!offer) return redirect(res, "/buyer/marketplace?error=Offer+not+found");

  const site = store.sites.find((item) => item.id === offer.siteId);
  const wallet = store.wallets.find((item) => item.userId === user.id);
  if (!wallet || wallet.balance < offer.price) {
    return redirect(res, `/buyer/wallet?error=Insufficient+wallet+balance`);
  }

  wallet.balance -= offer.price;
  const buyerProjects = store.projects.filter((item) => item.buyerId === user.id);
  const project = buyerProjects[0];
  const orderId = nextId(store, "order");
  const orderNo = `LF-${String(240300 + store.counters.order).padStart(6, "0")}`;

  store.orders.unshift({
    id: orderId,
    orderNo,
    buyerId: user.id,
    publisherId: site.publisherId,
    projectId: project ? project.id : "",
    offerId: offer.id,
    siteId: site.id,
    amount: offer.price,
    status: "paid",
    targetUrl: String(body.targetUrl || "").trim(),
    anchorText: String(body.anchorText || "").trim(),
    instructions: String(body.instructions || "").trim(),
    createdAt: new Date().toISOString().slice(0, 10),
  });
  store.transactions.unshift({
    id: nextId(store, "transaction"),
    userId: user.id,
    type: "payment",
    amount: -offer.price,
    status: "settled",
    note: `Order ${orderNo}`,
    createdAt: new Date().toISOString().slice(0, 10),
  });
  writeStore(store);
  return redirect(res, "/buyer/orders?success=Order+placed");
}

function handleCreateSite(res, store, user, body) {
  const siteId = nextId(store, "site");
  store.sites.unshift({
    id: siteId,
    publisherId: user.id,
    siteName: String(body.siteName || "").trim(),
    domain: String(body.domain || "").trim(),
    country: String(body.country || "").trim(),
    language: String(body.language || "").trim(),
    verticals: String(body.verticals || "").trim(),
    status: "pending",
    moneyPageAllowed: String(body.moneyPageAllowed || "") === "yes",
    sponsoredRequired: String(body.sponsoredRequired || "") === "yes",
    contentWriting: String(body.contentWriting || "") === "yes",
    dr: Number(body.dr || 0),
    traffic: Number(body.traffic || 0),
    description: String(body.description || "").trim(),
    restrictions: String(body.restrictions || "").trim(),
  });
  store.offers.unshift({
    id: nextId(store, "offer"),
    siteId,
    offerType: String(body.offerType || "Guest Post"),
    price: Number(body.price || 0),
    turnaroundDays: Number(body.turnaroundDays || 7),
    score: 70,
    reasons: "Awaiting admin approval|Publisher submitted from dashboard",
  });
  writeStore(store);
  return redirect(res, "/publisher/dashboard?success=Site+submitted+for+review");
}

function handleSiteStatus(res, store, body) {
  const site = store.sites.find((item) => item.id === body.siteId);
  if (!site) return redirect(res, "/admin/dashboard?error=Site+not+found");
  site.status = String(body.status || "pending");
  writeStore(store);
  return redirect(res, "/admin/dashboard?success=Site+status+updated");
}

function dashboardPathFor(role) {
  if (role === "buyer") return "/buyer/dashboard";
  if (role === "publisher") return "/publisher/dashboard";
  return "/admin/dashboard";
}

function approvedOffers(store) {
  return store.offers
    .map((offer) => ({ ...offer, site: store.sites.find((site) => site.id === offer.siteId) }))
    .filter((offer) => offer.site && offer.site.status === "approved");
}

function buyerProjects(store, user) {
  return store.projects.filter((project) => project.buyerId === user.id);
}

function buyerOrders(store, user) {
  return store.orders
    .filter((order) => order.buyerId === user.id)
    .map((order) => ({ ...order, site: store.sites.find((site) => site.id === order.siteId), offer: store.offers.find((offer) => offer.id === order.offerId) }));
}

function publisherSites(store, user) {
  return store.sites.filter((site) => site.publisherId === user.id);
}

function publisherOrders(store, user) {
  return store.orders.filter((order) => order.publisherId === user.id);
}

function walletFor(store, user) {
  return store.wallets.find((wallet) => wallet.userId === user.id) || { balance: 0 };
}

function baseLayout(title, user, content, flash) {
  const nav = user
    ? `
      <nav class="nav">
        ${user.role === "buyer" ? '<a href="/buyer/dashboard">Dashboard</a><a href="/buyer/marketplace">Marketplace</a><a href="/buyer/wallet">Wallet</a><a href="/buyer/orders">Orders</a>' : ""}
        ${user.role === "publisher" ? '<a href="/publisher/dashboard">Publisher</a>' : ""}
        ${user.role === "admin" ? '<a href="/admin/dashboard">Admin</a>' : ""}
      </nav>
      <div class="stack-row">
        <strong>${escapeHtml(user.name)}</strong>
        <form method="POST" action="/logout"><button class="secondary" type="submit">Log out</button></form>
      </div>
    `
    : `
      <nav class="nav">
        <a href="/login">Login</a>
        <a href="/signup?role=buyer">Buyer Sign Up</a>
        <a href="/signup?role=publisher">Publisher Sign Up</a>
      </nav>
    `;

  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${escapeHtml(title)}</title>
      <link rel="stylesheet" href="/styles.css" />
    </head>
    <body>
      <div class="page-shell">
        <header class="site-header">
          <a class="brand" href="/"><span class="brand-mark">LF</span><span>LinkFuel</span></a>
          ${nav}
        </header>
        ${flash ? `<section class="section"><div class="notice ${flash.type === "error" ? "danger" : "success"}">${escapeHtml(flash.text)}</div></section>` : ""}
        ${content}
        <footer class="footer">
          <span>${escapeHtml(title)}</span>
          <span>Demo accounts: buyer@linkfuel.app / publisher@linkfuel.app / admin@linkfuel.app · password: demo123</span>
        </footer>
      </div>
    </body>
  </html>`;
}

function renderHomePage(store, user, flash) {
  const approved = approvedOffers(store);
  const pendingCount = store.sites.filter((site) => site.status === "pending").length;
  return baseLayout(
    "LinkFuel | Finance Marketplace",
    user,
    `
      <section class="hero">
        <div class="hero-card">
          <span class="eyebrow">Real App MVP</span>
          <h1>Finance-safe media buying with actual users, orders and wallet balance.</h1>
          <p class="subhead">
            This build now persists users, projects, publisher inventory, buyer orders and wallet transactions in local storage.
            It is no longer just a static demo.
          </p>
          <div class="hero-actions">
            <a class="button" href="${user ? dashboardPathFor(user.role) : "/login"}">${user ? "Open Dashboard" : "Log In"}</a>
            <a class="button secondary" href="/signup?role=buyer">Create Buyer Account</a>
          </div>
          <div class="hero-stats">
            <div class="metric-card"><div class="metric-label">Approved Offers</div><div class="metric-value">${approved.length}</div><div class="metric-note">Ready to buy today.</div></div>
            <div class="metric-card"><div class="metric-label">Pending Reviews</div><div class="metric-value">${pendingCount}</div><div class="metric-note">Publisher submissions waiting on admin.</div></div>
            <div class="metric-card"><div class="metric-label">Demo Roles</div><div class="metric-value">3</div><div class="metric-note">Buyer, publisher and admin are live.</div></div>
          </div>
        </div>
        <div class="hero-card">
          <span class="kicker">Demo Credentials</span>
          <h2>Use the seeded accounts or create your own.</h2>
          <table class="table-like">
            <thead><tr><th>Role</th><th>Email</th><th>Password</th></tr></thead>
            <tbody>
              <tr><td>Buyer</td><td>buyer@linkfuel.app</td><td>demo123</td></tr>
              <tr><td>Publisher</td><td>publisher@linkfuel.app</td><td>demo123</td></tr>
              <tr><td>Admin</td><td>admin@linkfuel.app</td><td>demo123</td></tr>
            </tbody>
          </table>
          <div class="tag-row">
            <span class="tag">Persistent JSON storage</span>
            <span class="tag">Cookie sessions</span>
            <span class="tag">Buyer / Publisher / Admin</span>
          </div>
        </div>
      </section>
    `,
    flash
  );
}

function renderLoginPage(flash) {
  return baseLayout(
    "Login",
    null,
    `
      <section class="section">
        <div class="panel auth-panel">
          <span class="pill">Login</span>
          <h2 style="margin-top: 18px;">Access your workspace.</h2>
          <form method="POST" action="/login" class="form-grid">
            <label>Email<input type="email" name="email" value="buyer@linkfuel.app" /></label>
            <label>Password<input type="password" name="password" value="demo123" /></label>
            <button type="submit">Log In</button>
          </form>
        </div>
      </section>
    `,
    flash
  );
}

function renderSignupPage(flash, selectedRole) {
  return baseLayout(
    "Create Account",
    null,
    `
      <section class="section">
        <div class="panel auth-panel">
          <span class="pill">Create Account</span>
          <h2 style="margin-top: 18px;">Start as buyer or publisher.</h2>
          <form method="POST" action="/signup" class="form-grid">
            <label>Name<input name="name" required /></label>
            <label>Company<input name="company" /></label>
            <label>Email<input type="email" name="email" required /></label>
            <label>Password<input type="password" name="password" required /></label>
            <label>Role
              <select name="role">
                <option value="buyer"${selectedRole === "buyer" ? " selected" : ""}>Buyer</option>
                <option value="publisher"${selectedRole === "publisher" ? " selected" : ""}>Publisher</option>
              </select>
            </label>
            <button type="submit">Create Account</button>
          </form>
        </div>
      </section>
    `,
    flash
  );
}

function renderBuyerDashboard(store, user, flash) {
  const projects = buyerProjects(store, user);
  const project = projects[0];
  const offers = approvedOffers(store).sort((a, b) => b.score - a.score).slice(0, 3);
  const wallet = walletFor(store, user);
  return baseLayout(
    "Buyer Dashboard",
    user,
    `
      <section class="section">
        <div class="dashboard-grid">
          <div class="panel">
            <span class="pill">Current Project</span>
            ${project ? `
              <h2 style="margin-top: 18px;">${escapeHtml(project.name)}</h2>
              <p class="subhead">${escapeHtml(project.domain)} · ${escapeHtml(project.vertical)} · ${escapeHtml(project.objective)}</p>
              <div class="tag-row">
                <span class="tag">${escapeHtml(project.targetCountries)}</span>
                <span class="tag">${escapeHtml(project.targetLanguages)}</span>
                <span class="tag">${escapeHtml(project.budgetRange)}</span>
              </div>
            ` : `<p class="subhead">No project saved yet. Create one below.</p>`}
            <div class="mini-stat" style="margin-top: 18px;">
              <span class="metric-label">Wallet Balance</span>
              <strong>${money(wallet.balance)}</strong>
            </div>
          </div>
          <div class="panel">
            <span class="pill">Create or Update Project</span>
            <form method="POST" action="/buyer/projects" class="form-grid">
              <label>Project Name<input name="name" value="${project ? escapeAttr(project.name) : ""}" required /></label>
              <label>Domain<input name="domain" value="${project ? escapeAttr(project.domain) : ""}" required /></label>
              <label>Vertical<select name="vertical">
                ${option("Crypto / Web3", project && project.vertical)}
                ${option("Fintech / Payment", project && project.vertical)}
                ${option("Forex", project && project.vertical)}
              </select></label>
              <label>Target Countries<input name="targetCountries" value="${project ? escapeAttr(project.targetCountries) : "US, UK"}" /></label>
              <label>Target Languages<input name="targetLanguages" value="${project ? escapeAttr(project.targetLanguages) : "English"}" /></label>
              <label>Budget Range<input name="budgetRange" value="${project ? escapeAttr(project.budgetRange) : "$2k - $5k"}" /></label>
              <label>Objective<textarea name="objective">${project ? escapeHtml(project.objective) : ""}</textarea></label>
              <label>Notes<textarea name="notes">${project ? escapeHtml(project.notes) : ""}</textarea></label>
              <button type="submit">Save Project</button>
            </form>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <div><span class="kicker">Recommended Offers</span><h2>Best inventory for your current project.</h2></div>
          <a class="button secondary" href="/buyer/marketplace">Open Marketplace</a>
        </div>
        <div class="result-list">
          ${offers.map(renderOfferCard).join("")}
        </div>
      </section>
    `,
    flash
  );
}

function renderMarketplacePage(store, user, url, flash) {
  const vertical = url.searchParams.get("vertical") || "";
  const country = url.searchParams.get("country") || "";
  const maxPrice = Number(url.searchParams.get("maxPrice") || 0);
  const moneyPage = url.searchParams.get("moneyPage") || "";
  let offers = approvedOffers(store);

  if (vertical) offers = offers.filter((offer) => offer.site.verticals.includes(vertical));
  if (country) offers = offers.filter((offer) => offer.site.country === country);
  if (maxPrice) offers = offers.filter((offer) => offer.price <= maxPrice);
  if (moneyPage === "yes") offers = offers.filter((offer) => offer.site.moneyPageAllowed);

  offers.sort((a, b) => b.score - a.score);

  return baseLayout(
    "Marketplace",
    user,
    `
      <section class="section">
        <div class="filters-layout">
          <aside class="panel">
            <span class="pill">Filters</span>
            <form method="GET" action="/buyer/marketplace" class="form-grid">
              <label>Vertical
                <select name="vertical">
                  <option value="">All</option>
                  ${option("Crypto / Web3", vertical)}
                  ${option("Fintech / Payment", vertical)}
                  ${option("Forex", vertical)}
                </select>
              </label>
              <label>Country
                <select name="country">
                  <option value="">All</option>
                  ${option("US", country)}
                  ${option("UK", country)}
                  ${option("AE", country)}
                </select>
              </label>
              <label>Max Price<input name="maxPrice" value="${maxPrice || ""}" /></label>
              <label>Money Pages
                <select name="moneyPage">
                  <option value="">Any</option>
                  <option value="yes"${moneyPage === "yes" ? " selected" : ""}>Required</option>
                </select>
              </label>
              <button type="submit">Apply Filters</button>
            </form>
          </aside>
          <div class="result-list">
            ${offers.length ? offers.map(renderOfferCard).join("") : `<div class="panel"><h3>No offers matched.</h3><p class="subhead">Try broadening your filters.</p></div>`}
          </div>
        </div>
      </section>
    `,
    flash
  );
}

function renderSiteDetailPage(store, user, url, flash) {
  const offer = approvedOffers(store).find((item) => item.id === url.searchParams.get("offer"));
  if (!offer) {
    return baseLayout("Site Detail", user, `<section class="section"><div class="panel"><h3>Offer not found.</h3></div></section>`, flash);
  }

  const project = buyerProjects(store, user)[0];
  return baseLayout(
    "Site Detail",
    user,
    `
      <section class="section">
        <div class="detail-grid">
          <div class="panel">
            <span class="pill">Offer Detail</span>
            <h2 style="margin-top: 18px;">${escapeHtml(offer.site.siteName)}</h2>
            <p class="subhead">${escapeHtml(offer.site.description)}</p>
            <div class="tag-row">
              <span class="tag">${escapeHtml(offer.offerType)}</span>
              <span class="tag">${money(offer.price)}</span>
              <span class="tag">DR ${offer.site.dr}</span>
              <span class="tag">${offer.site.country}</span>
              <span class="tag">${offer.turnaroundDays} days</span>
            </div>
            <ul class="reason-list">
              ${offer.reasons.split("|").map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}
              <li>${escapeHtml(offer.site.restrictions)}</li>
            </ul>
          </div>
          <div class="panel">
            <span class="pill">Place Order</span>
            <form method="POST" action="/buyer/orders" class="form-grid">
              <input type="hidden" name="offerId" value="${escapeAttr(offer.id)}" />
              <label>Target URL<input name="targetUrl" value="${project ? escapeAttr(`https://${project.domain}`) : ""}" required /></label>
              <label>Anchor Text<input name="anchorText" value="Brand anchor" required /></label>
              <label>Instructions<textarea name="instructions" required>Keep compliance-friendly tone. Avoid aggressive financial claims.</textarea></label>
              <button type="submit">Pay ${money(offer.price)} from Wallet</button>
            </form>
          </div>
        </div>
      </section>
    `,
    flash
  );
}

function renderOrdersPage(store, user, flash) {
  const orders = buyerOrders(store, user);
  return baseLayout(
    "Orders",
    user,
    `
      <section class="section">
        <div class="section-head"><div><span class="kicker">Order Book</span><h2>Persistent order history and statuses.</h2></div></div>
        <div class="order-grid">
          ${orders.map((order) => `
            <article class="panel">
              <div class="order-top">
                <div><span class="kicker">${escapeHtml(order.orderNo)}</span><h3>${escapeHtml(order.site ? order.site.siteName : "Unknown Site")}</h3></div>
                <span class="status ${statusTone(order.status)}">${prettyStatus(order.status)}</span>
              </div>
              <div class="tag-row">
                <span class="tag">${money(order.amount)}</span>
                <span class="tag">${escapeHtml(order.offer ? order.offer.offerType : "Offer")}</span>
                <span class="tag">${escapeHtml(order.createdAt)}</span>
              </div>
              <ul class="reason-list">
                <li>Target URL: ${escapeHtml(order.targetUrl)}</li>
                <li>Anchor: ${escapeHtml(order.anchorText)}</li>
                <li>${escapeHtml(order.instructions)}</li>
              </ul>
            </article>
          `).join("")}
        </div>
      </section>
    `,
    flash
  );
}

function renderWalletPage(store, user, flash) {
  const wallet = walletFor(store, user);
  const transactions = store.transactions.filter((item) => item.userId === user.id);
  return baseLayout(
    "Wallet",
    user,
    `
      <section class="section">
        <div class="wallet-grid">
          <div class="panel">
            <span class="pill">Wallet Balance</span>
            <div class="wallet-balance">${money(wallet.balance)}</div>
            <p class="subhead">Deposits are persisted and immediately available for marketplace checkout.</p>
          </div>
          <div class="panel">
            <span class="pill">Simulate Cryptomus Deposit</span>
            <form method="POST" action="/buyer/wallet/deposit" class="form-grid">
              <label>Amount<input name="amount" value="2500" required /></label>
              <label>Asset
                <select name="asset">
                  <option>USDT (TRC20)</option>
                  <option>USDT (ERC20)</option>
                  <option>BTC</option>
                  <option>ETH</option>
                </select>
              </label>
              <button type="submit">Create Deposit</button>
            </form>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="table-card">
          <span class="kicker">Transactions</span>
          <h2>Buyer ledger.</h2>
          <table class="table-like">
            <thead><tr><th>Date</th><th>Type</th><th>Amount</th><th>Status</th><th>Note</th></tr></thead>
            <tbody>
              ${transactions.map((txn) => `<tr><td>${escapeHtml(txn.createdAt)}</td><td>${escapeHtml(txn.type)}</td><td>${money(txn.amount)}</td><td>${escapeHtml(txn.status)}</td><td>${escapeHtml(txn.note)}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      </section>
    `,
    flash
  );
}

function renderPublisherDashboard(store, user, flash) {
  const sites = publisherSites(store, user);
  const orders = publisherOrders(store, user);
  return baseLayout(
    "Publisher Dashboard",
    user,
    `
      <section class="section">
        <div class="dashboard-grid">
          <div class="panel">
            <span class="pill">Inventory</span>
            <div class="cards-grid" style="grid-template-columns: repeat(3, 1fr); margin-top: 18px;">
              <div class="mini-stat"><span class="metric-label">Sites</span><strong>${sites.length}</strong></div>
              <div class="mini-stat"><span class="metric-label">Approved</span><strong>${sites.filter((site) => site.status === "approved").length}</strong></div>
              <div class="mini-stat"><span class="metric-label">Orders</span><strong>${orders.length}</strong></div>
            </div>
          </div>
          <div class="panel">
            <span class="pill">Submit New Site</span>
            <form method="POST" action="/publisher/sites" class="form-grid">
              <label>Site Name<input name="siteName" required /></label>
              <label>Domain<input name="domain" required /></label>
              <label>Country<input name="country" value="US" required /></label>
              <label>Language<input name="language" value="English" required /></label>
              <label>Verticals<input name="verticals" value="Crypto / Web3, Fintech / Payment" required /></label>
              <label>DR<input name="dr" value="60" required /></label>
              <label>Traffic<input name="traffic" value="15000" required /></label>
              <label>Offer Type<input name="offerType" value="Guest Post" required /></label>
              <label>Price<input name="price" value="350" required /></label>
              <label>Turnaround Days<input name="turnaroundDays" value="5" required /></label>
              <label>Money Pages<select name="moneyPageAllowed"><option value="yes">Allowed</option><option value="no">Not Allowed</option></select></label>
              <label>Sponsored Required<select name="sponsoredRequired"><option value="no">No</option><option value="yes">Yes</option></select></label>
              <label>Content Writing<select name="contentWriting"><option value="yes">Yes</option><option value="no">No</option></select></label>
              <label>Description<textarea name="description"></textarea></label>
              <label>Restrictions<textarea name="restrictions">Reject casino, adult and payday loan.</textarea></label>
              <button type="submit">Submit for Review</button>
            </form>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="table-card">
          <span class="kicker">Your Sites</span>
          <h2>Publisher inventory.</h2>
          <table class="table-like">
            <thead><tr><th>Site</th><th>Status</th><th>Verticals</th><th>Money Page</th><th>Restrictions</th></tr></thead>
            <tbody>
              ${sites.map((site) => `<tr><td>${escapeHtml(site.siteName)}<br /><span class="metric-note">${escapeHtml(site.domain)}</span></td><td>${escapeHtml(site.status)}</td><td>${escapeHtml(site.verticals)}</td><td>${site.moneyPageAllowed ? "Yes" : "No"}</td><td>${escapeHtml(site.restrictions)}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      </section>
    `,
    flash
  );
}

function renderAdminDashboard(store, user, flash) {
  const pendingSites = store.sites.filter((site) => site.status === "pending");
  const users = store.users.length;
  const orders = store.orders.length;
  return baseLayout(
    "Admin Dashboard",
    user,
    `
      <section class="section">
        <div class="dashboard-grid">
          <div class="panel">
            <span class="pill">Platform Snapshot</span>
            <div class="cards-grid" style="grid-template-columns: repeat(3, 1fr); margin-top: 18px;">
              <div class="mini-stat"><span class="metric-label">Users</span><strong>${users}</strong></div>
              <div class="mini-stat"><span class="metric-label">Orders</span><strong>${orders}</strong></div>
              <div class="mini-stat"><span class="metric-label">Pending Sites</span><strong>${pendingSites.length}</strong></div>
            </div>
          </div>
          <div class="panel">
            <span class="pill">Review Queue</span>
            ${pendingSites.length ? pendingSites.map((site) => `
              <form method="POST" action="/admin/site-status" class="inline-form">
                <input type="hidden" name="siteId" value="${escapeAttr(site.id)}" />
                <div>
                  <strong>${escapeHtml(site.siteName)}</strong>
                  <div class="metric-note">${escapeHtml(site.domain)} · ${escapeHtml(site.verticals)}</div>
                </div>
                <select name="status">
                  <option value="approved">Approve</option>
                  <option value="rejected">Reject</option>
                  <option value="pending">Keep Pending</option>
                </select>
                <button type="submit">Save</button>
              </form>
            `).join("") : `<p class="subhead">No pending sites right now.</p>`}
          </div>
        </div>
      </section>
      <section class="section">
        <div class="table-card">
          <span class="kicker">Recent Orders</span>
          <h2>Cross-role order log.</h2>
          <table class="table-like">
            <thead><tr><th>Order</th><th>Buyer</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              ${store.orders.map((order) => {
                const buyer = findUser(store, order.buyerId);
                return `<tr><td>${escapeHtml(order.orderNo)}</td><td>${escapeHtml(buyer ? buyer.email : "Unknown")}</td><td>${money(order.amount)}</td><td>${prettyStatus(order.status)}</td></tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>
      </section>
    `,
    flash
  );
}

function renderOfferCard(offer) {
  return `
    <article class="result-card">
      <div class="result-top">
        <div>
          <h3>${escapeHtml(offer.site.siteName)}</h3>
          <div class="site-meta">${escapeHtml(offer.site.domain)} · ${escapeHtml(offer.site.country)} · ${escapeHtml(offer.site.language)}</div>
        </div>
        <span class="badge">Score ${offer.score}</span>
      </div>
      <div class="result-meta">
        <span>${escapeHtml(offer.offerType)}</span>
        <span>${money(offer.price)}</span>
        <span>DR ${offer.site.dr}</span>
        <span>${offer.turnaroundDays} days</span>
      </div>
      <div class="tag-row">
        ${offer.site.verticals.split(",").map((item) => `<span class="tag">${escapeHtml(item.trim())}</span>`).join("")}
        <span class="tag">${offer.site.moneyPageAllowed ? "Money page OK" : "No money page"}</span>
      </div>
      <ul class="reason-list">
        ${offer.reasons.split("|").map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}
      </ul>
      <div class="card-actions">
        <a class="button" href="/buyer/site?offer=${escapeAttr(offer.id)}">View & Order</a>
      </div>
    </article>
  `;
}

function renderErrorPage(error) {
  return baseLayout(
    "Application Error",
    null,
    `<section class="section"><div class="panel"><h2>Unexpected error</h2><p class="subhead">${escapeHtml(error.message || "Unknown error")}</p></div></section>`
  );
}

function statusTone(status) {
  if (status === "completed") return "success";
  if (status === "awaiting_buyer_reply") return "alert";
  return "pending";
}

function prettyStatus(status) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function option(value, selected) {
  return `<option value="${escapeAttr(value)}"${value === selected ? " selected" : ""}>${escapeHtml(value)}</option>`;
}

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}
