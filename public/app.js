
function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function layout(pageTitle, content, options = {}) {
  const active = options.active || "";

  return `
    <div class="page-shell">
      <header class="site-header">
        <a class="brand" href="/index.html">
          <span class="brand-mark">LF</span>
          <span>LinkFuel</span>
        </a>
        <nav class="nav">
          <a href="/personalization.html"${active === "personalization" ? ' style="color: var(--text)"' : ""}>Personalization</a>
          <a href="/marketplace.html"${active === "marketplace" ? ' style="color: var(--text)"' : ""}>Marketplace</a>
          <a href="/wallet.html"${active === "wallet" ? ' style="color: var(--text)"' : ""}>Wallet</a>
          <a href="/orders.html"${active === "orders" ? ' style="color: var(--text)"' : ""}>Orders</a>
          <a href="/publisher.html"${active === "publisher" ? ' style="color: var(--text)"' : ""}>Publisher</a>
          <a href="/admin.html"${active === "admin" ? ' style="color: var(--text)"' : ""}>Admin</a>
        </nav>
      </header>
      ${content}
      <footer class="footer">
        <span>${pageTitle}</span>
        <span>Financial vertical marketplace MVP with wallet-based checkout</span>
      </footer>
    </div>
  `;
}

function heroSummary() {
  const summary = window.LinkFuelData.summary;
  return `
    <div class="hero-stats">
      <div class="metric-card">
        <div class="metric-label">Approved Media</div>
        <div class="metric-value">${summary.totalSites}</div>
        <div class="metric-note">Finance-ready sites reviewed for high-risk vertical rules.</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Active Partners</div>
        <div class="metric-value">${summary.activePublishers}</div>
        <div class="metric-note">Media partners can upload inventory and manage orders directly.</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Avg Turnaround</div>
        <div class="metric-value">${summary.avgTurnaroundDays} days</div>
        <div class="metric-note">Clear order state and risk prompts across buyer and publisher flows.</div>
      </div>
    </div>
  `;
}

function renderHome() {
  return layout(
    "Buyer Homepage",
    `
      <section class="hero">
        <div class="hero-card">
          <span class="eyebrow">Crypto / Fintech / Forex</span>
          <h1>Find finance-safe media placements without fighting SEO filters.</h1>
          <p class="subhead">
            LinkFuel turns a complex backlink marketplace into a guided buying flow. Upload a domain, get
            ranked recommendations, review clear policy fit, pay from wallet balance, and track every order.
          </p>
          <div class="hero-actions">
            <a class="button" href="/personalization.html">Start Personalization</a>
            <a class="button secondary" href="/marketplace.html">Browse Marketplace</a>
          </div>
          ${heroSummary()}
        </div>
        <div class="hero-card">
          <span class="kicker">Current Project</span>
          <h2>${window.LinkFuelData.project.name}</h2>
          <p class="subhead">
            ${window.LinkFuelData.project.domain} is being matched against media inventory that accepts
            ${window.LinkFuelData.project.vertical} offers, supports ${window.LinkFuelData.project.targetCountries.join(", ")}
            and keeps budget in the ${window.LinkFuelData.project.budgetRange} range.
          </p>
          <div class="tag-row">
            <span class="tag">${window.LinkFuelData.project.vertical}</span>
            <span class="tag">${window.LinkFuelData.project.targetCountries.join(" / ")}</span>
            <span class="tag">${window.LinkFuelData.project.objective}</span>
          </div>
          <ul class="reason-list">
            <li>Recommendation layer hides sites that reject finance or money pages.</li>
            <li>Each offer explains why it fits and what restrictions remain.</li>
            <li>Wallet flow is built for Cryptomus deposits and internal balance checkout.</li>
          </ul>
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <div>
            <span class="kicker">Core Buyer Flow</span>
            <h2>From domain input to paid order in four steps.</h2>
          </div>
        </div>
        <div class="steps-grid">
          <div class="step-card">
            <span class="pill">Step 1</span>
            <h3>Analyze Domain</h3>
            <p>Collect vertical, target markets, budget and target page rules from the buyer.</p>
          </div>
          <div class="step-card">
            <span class="pill">Step 2</span>
            <h3>Rank Inventory</h3>
            <p>Filter offers by vertical acceptance, country fit, page restrictions and budget.</p>
          </div>
          <div class="step-card">
            <span class="pill">Step 3</span>
            <h3>Review Risk</h3>
            <p>Explain sponsor labels, money page limits and editorial rules before checkout.</p>
          </div>
          <div class="step-card">
            <span class="pill">Step 4</span>
            <h3>Pay from Wallet</h3>
            <p>Use Cryptomus-funded balance to place orders and manage refunds inside the platform.</p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <div>
            <span class="kicker">MVP Areas</span>
            <h2>What is already modeled in this prototype.</h2>
          </div>
        </div>
        <div class="cards-grid">
          <div class="list-card">
            <h3>Buyer Experience</h3>
            <p>Domain-based personalization, marketplace exploration, wallet funding and order tracking.</p>
          </div>
          <div class="list-card">
            <h3>Publisher Operations</h3>
            <p>Site inventory, offer setup, approval status and payout visibility in a self-serve panel.</p>
          </div>
          <div class="list-card">
            <h3>Admin Control</h3>
            <p>Approval queue, dispute handling and deposit checks for a finance-sensitive marketplace.</p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="banner">
          <div>
            <span class="kicker">Default Build Path</span>
            <h3>Prototype first, then data model and payments.</h3>
            <p>The current site uses mock data so the product flow can be reviewed before backend integration.</p>
          </div>
          <a class="button" href="/orders.html">Review Orders</a>
        </div>
      </section>
    `,
    { active: "home" }
  );
}

function renderPersonalization() {
  const project = window.LinkFuelData.project;
  const topOffers = [...window.LinkFuelData.offers].sort((a, b) => b.score - a.score).slice(0, 3);

  return layout(
    "Personalization",
    `
      <section class="section">
        <div class="section-head">
          <div>
            <span class="kicker">Project Personalization</span>
            <h2>Turn a domain into a short list of finance-safe media offers.</h2>
            <p class="subhead">This screen is the decision layer that sits on top of the raw marketplace.</p>
          </div>
        </div>
        <div class="filters-layout">
          <div class="panel">
            <span class="pill">Buyer Input</span>
            <div class="filter-group">
              <label>Domain<input value="${project.domain}" /></label>
              <label>Primary Vertical<select><option>${project.vertical}</option></select></label>
              <label>Target Countries<input value="${project.targetCountries.join(", ")}" /></label>
              <label>Target Languages<input value="${project.targetLanguages.join(", ")}" /></label>
              <label>Budget Range<input value="${project.budgetRange}" /></label>
              <label>Objective<textarea>${project.objective}</textarea></label>
              <label>Notes<textarea>${project.notes}</textarea></label>
            </div>
            <div class="hero-actions">
              <a class="button" href="/marketplace.html">Refresh Recommendations</a>
            </div>
          </div>
          <div class="panel">
            <span class="pill">Analysis Snapshot</span>
            <div class="tag-row">
              <span class="tag">Vertical match: strict</span>
              <span class="tag">Money pages allowed: prefer yes</span>
              <span class="tag">Budget: mid-market</span>
            </div>
            <ul class="detail-list">
              <li>Domain classified as exchange-led crypto brand with commercial landing pages.</li>
              <li>Inventory that rejects crypto or commercial URLs is removed before ranking.</li>
              <li>US and UK English placements are weighted above regionally broad finance blogs.</li>
            </ul>
            <div class="section-head" style="margin-top: 22px;">
              <div>
                <span class="kicker">Top Recommendations</span>
                <h3>Best-fit offers right now.</h3>
              </div>
            </div>
            <div class="result-list">
              ${topOffers
                .map(
                  (offer) => `
                    <article class="result-card">
                      <div class="result-top">
                        <div>
                          <h3>${offer.siteName}</h3>
                          <div class="site-meta">${offer.domain} · ${offer.country} · ${offer.offerType}</div>
                        </div>
                        <span class="badge">Score ${offer.score}</span>
                      </div>
                      <div class="tag-row">
                        <span class="tag">${currency(offer.price)}</span>
                        <span class="tag">DR ${offer.dr}</span>
                        <span class="tag">${offer.turnaroundDays} days</span>
                      </div>
                      <ul class="reason-list">
                        ${offer.reasons.map((reason) => `<li>${reason}</li>`).join("")}
                      </ul>
                    </article>
                  `
                )
                .join("")}
            </div>
          </div>
        </div>
      </section>
    `,
    { active: "personalization" }
  );
}

function renderMarketplace() {
  const offers = [...window.LinkFuelData.offers].sort((a, b) => b.score - a.score);
  return layout(
    "Marketplace",
    `
      <section class="section">
        <div class="section-head">
          <div>
            <span class="kicker">Smart Inventory</span>
            <h2>Recommended media first, raw filters second.</h2>
            <p class="subhead">The list favors fit and clarity over exposing every SEO knob at once.</p>
          </div>
        </div>
        <div class="filters-layout">
          <aside class="panel">
            <span class="pill">Filters</span>
            <div class="filter-group">
              <label>Vertical<select><option>Crypto / Web3</option><option>Fintech / Payment</option><option>Forex</option></select></label>
              <label>Country<select><option>US / UK / AE</option><option>US</option><option>UK</option><option>AE</option></select></label>
              <label>Offer Type<select><option>All</option><option>Guest Post</option><option>Link Insertion</option></select></label>
              <label>Max Price<input value="600" /></label>
              <label>Minimum DR<input value="60" /></label>
              <label>Money Page<select><option>Required</option><option>Optional</option></select></label>
              <label>Sponsored<select><option>Any</option><option>No Sponsor Label</option><option>Sponsor Label OK</option></select></label>
            </div>
            <div class="hero-actions">
              <button>Apply Filters</button>
              <a class="button secondary" href="/personalization.html">Edit Project Inputs</a>
            </div>
          </aside>
          <div class="result-list">
            ${offers
              .map(
                (offer) => `
                  <article class="result-card">
                    <div class="result-top">
                      <div>
                        <h3>${offer.siteName}</h3>
                        <div class="site-meta">${offer.domain} · ${offer.country} · ${offer.language}</div>
                      </div>
                      <div>
                        <span class="badge">Score ${offer.score}</span>
                      </div>
                    </div>
                    <div class="result-meta">
                      <span>${offer.offerType}</span>
                      <span>DR ${offer.dr}</span>
                      <span>Traffic ${offer.traffic.toLocaleString()}</span>
                      <span>${offer.turnaroundDays} day TAT</span>
                      <span>${currency(offer.price)}</span>
                    </div>
                    <div class="tag-row">
                      ${offer.verticals.map((item) => `<span class="tag">${item}</span>`).join("")}
                      <span class="tag">${offer.moneyPageAllowed ? "Money page OK" : "No money page"}</span>
                      <span class="tag">${offer.contentWriting ? "Writing included" : "Buyer content"}</span>
                    </div>
                    <p class="subhead">${offer.description}</p>
                    <ul class="reason-list">
                      ${offer.reasons.map((reason) => `<li>${reason}</li>`).join("")}
                    </ul>
                    <div class="card-actions" style="margin-top: 18px;">
                      <a class="button" href="/site.html?id=${offer.id}">View Details</a>
                      <a class="button secondary" href="/wallet.html">Fund Wallet</a>
                    </div>
                  </article>
                `
              )
              .join("")}
          </div>
        </div>
      </section>
    `,
    { active: "marketplace" }
  );
}

function renderSiteDetail() {
  const params = new URLSearchParams(window.location.search);
  const offerId = params.get("id");
  const offer = window.LinkFuelData.offers.find((item) => item.id === offerId) || window.LinkFuelData.offers[0];

  return layout(
    "Site Detail",
    `
      <section class="section">
        <div class="detail-grid">
          <div class="panel">
            <span class="pill">Site Offer</span>
            <h2 style="margin-top: 18px;">${offer.siteName}</h2>
            <p class="subhead">${offer.description}</p>
            <div class="tag-row">
              <span class="tag">${offer.offerType}</span>
              <span class="tag">${currency(offer.price)}</span>
              <span class="tag">DR ${offer.dr}</span>
              <span class="tag">${offer.country}</span>
              <span class="tag">${offer.turnaroundDays} day TAT</span>
            </div>
            <div class="section-head" style="margin-top: 22px;">
              <div>
                <span class="kicker">Why It Fits</span>
                <h3>Recommendation reasons</h3>
              </div>
            </div>
            <ul class="reason-list">
              ${offer.reasons.map((reason) => `<li>${reason}</li>`).join("")}
            </ul>
            <div class="section-head" style="margin-top: 22px;">
              <div>
                <span class="kicker">Restrictions</span>
                <h3>Important rules before checkout</h3>
              </div>
            </div>
            <ul class="reason-list">
              ${offer.risks.map((risk) => `<li>${risk}</li>`).join("")}
              <li>${offer.sponsoredRequired ? "Sponsor label required by publisher" : "Sponsor label not required by default"}</li>
              <li>${offer.moneyPageAllowed ? "Commercial landing pages accepted" : "Commercial landing pages must be swapped for educational content"}</li>
            </ul>
          </div>
          <div class="panel">
            <span class="pill">Checkout Brief</span>
            <div class="filter-group">
              <label>Target URL<input value="https://velora.trade/exchange" /></label>
              <label>Anchor Text<input value="Velora exchange" /></label>
              <label>Article Angle<textarea>Explain the role of execution speed and custody transparency for modern crypto exchanges.</textarea></label>
              <label>Special Instructions<textarea>Keep compliance-friendly tone. Avoid yield claims or aggressive investment language.</textarea></label>
            </div>
            <div class="mini-stat" style="margin-top: 18px;">
              <span class="metric-label">Wallet Balance</span>
              <strong>${currency(window.LinkFuelData.summary.buyerWalletBalance)}</strong>
              <span class="metric-note">Enough balance to place this order immediately.</span>
            </div>
            <div class="hero-actions">
              <a class="button" href="/orders.html">Place Order</a>
              <a class="button secondary" href="/wallet.html">Top Up Wallet</a>
            </div>
          </div>
        </div>
      </section>
    `,
    { active: "marketplace" }
  );
}

function renderWallet() {
  const summary = window.LinkFuelData.summary;
  return layout(
    "Wallet",
    `
      <section class="section">
        <div class="wallet-grid">
          <div class="panel">
            <span class="pill">Balance</span>
            <div class="wallet-balance">${currency(summary.buyerWalletBalance)}</div>
            <p class="subhead">Fund your buyer wallet via Cryptomus, then place finance-marketplace orders without per-order payment friction.</p>
            <div class="cards-grid" style="grid-template-columns: repeat(3, 1fr); margin-top: 22px;">
              <div class="mini-stat">
                <span class="metric-label">Preferred Asset</span>
                <strong>USDT</strong>
              </div>
              <div class="mini-stat">
                <span class="metric-label">Provider</span>
                <strong>Cryptomus</strong>
              </div>
              <div class="mini-stat">
                <span class="metric-label">Refund Route</span>
                <strong>Wallet Credit</strong>
              </div>
            </div>
          </div>
          <div class="panel">
            <span class="pill">Create Deposit</span>
            <div class="filter-group">
              <label>Amount (USD)<input value="2500" /></label>
              <label>Crypto Asset<select><option>USDT (TRC20)</option><option>USDT (ERC20)</option><option>BTC</option><option>ETH</option></select></label>
              <label>Billing Note<textarea>Top up for Q2 authority campaign.</textarea></label>
            </div>
            <div class="hero-actions">
              <button>Create Cryptomus Invoice</button>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="table-card">
          <span class="kicker">Recent Transactions</span>
          <h2>Deposits, spend and refunds.</h2>
          <table class="table-like">
            <thead>
              <tr><th>Date</th><th>Type</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${window.LinkFuelData.walletTransactions
                .map(
                  (txn) => `
                    <tr>
                      <td>${txn.date}</td>
                      <td>${txn.type}</td>
                      <td>${txn.amount}</td>
                      <td>${txn.status}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </section>
    `,
    { active: "wallet" }
  );
}

function renderOrders() {
  return layout(
    "Orders",
    `
      <section class="section">
        <div class="section-head">
          <div>
            <span class="kicker">Buyer Orders</span>
            <h2>Track every placement and decision blocker.</h2>
          </div>
        </div>
        <div class="order-grid">
          ${window.LinkFuelData.orders
            .map(
              (order, index) => `
                <article class="panel">
                  <div class="order-top">
                    <div>
                      <span class="kicker">${order.id}</span>
                      <h3>${order.siteName}</h3>
                    </div>
                    <span class="status ${index === 2 ? "success" : index === 1 ? "pending" : "pending"}">${order.status}</span>
                  </div>
                  <div class="tag-row">
                    <span class="tag">${order.offerType}</span>
                    <span class="tag">${currency(order.amount)}</span>
                    <span class="tag">Due ${order.dueDate}</span>
                  </div>
                  <p class="subhead">${order.brief}</p>
                  <ul class="timeline">
                    <li>Buyer brief captured and vertical rules checked.</li>
                    <li>Publisher reviewing anchor and target page policy.</li>
                    <li>Platform can intervene if finance restrictions conflict.</li>
                  </ul>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `,
    { active: "orders" }
  );
}

function renderPublisher() {
  return layout(
    "Publisher Panel",
    `
      <section class="section">
        <div class="dashboard-grid">
          <div class="panel">
            <span class="pill">Publisher Snapshot</span>
            <h2 style="margin-top: 18px;">Inventory and payout visibility.</h2>
            <div class="cards-grid" style="grid-template-columns: repeat(3, 1fr); margin-top: 20px;">
              <div class="mini-stat"><span class="metric-label">Active Sites</span><strong>2</strong></div>
              <div class="mini-stat"><span class="metric-label">Open Orders</span><strong>5</strong></div>
              <div class="mini-stat"><span class="metric-label">MTD Payout</span><strong>$4,600</strong></div>
            </div>
          </div>
          <div class="panel">
            <span class="pill">Add New Site</span>
            <div class="filter-group">
              <label>Domain<input value="newsitename.com" /></label>
              <label>Primary Verticals<input value="Crypto / Web3, Fintech / Payment" /></label>
              <label>Guest Post Price<input value="450" /></label>
              <label>Rules<textarea>Allow sponsored finance content. Reject casino, adult, payday loan.</textarea></label>
            </div>
            <div class="hero-actions">
              <button>Submit for Review</button>
            </div>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="table-card">
          <span class="kicker">Managed Sites</span>
          <h2>Current publisher inventory.</h2>
          <table class="table-like">
            <thead>
              <tr><th>Site</th><th>Status</th><th>Verticals</th><th>Offers</th><th>Payout</th></tr>
            </thead>
            <tbody>
              ${window.LinkFuelData.publisherSites
                .map(
                  (site) => `
                    <tr>
                      <td>${site.name}<br /><span class="metric-note">${site.domain}</span></td>
                      <td>${site.status}</td>
                      <td>${site.verticals}</td>
                      <td>${site.offers}</td>
                      <td>${site.payout}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </section>
    `,
    { active: "publisher" }
  );
}

function renderAdmin() {
  return layout(
    "Admin Panel",
    `
      <section class="section">
        <div class="dashboard-grid">
          <div class="panel">
            <span class="pill">Admin Queue</span>
            <h2 style="margin-top: 18px;">Manual review for finance-sensitive workflows.</h2>
            <div class="result-list" style="margin-top: 18px;">
              ${window.LinkFuelData.adminQueue
                .map(
                  (item) => `
                    <article class="result-card">
                      <div class="result-top">
                        <div>
                          <span class="kicker">${item.type}</span>
                          <h3>${item.target}</h3>
                        </div>
                        <span class="status ${item.priority === "High" ? "alert" : "pending"}">${item.priority}</span>
                      </div>
                      <p class="subhead">${item.reason}</p>
                    </article>
                  `
                )
                .join("")}
            </div>
          </div>
          <div class="panel">
            <span class="pill">Rule Controls</span>
            <div class="filter-group">
              <label>Default Crypto Weight<input value="1.35" /></label>
              <label>Money Page Penalty<input value="-0.25" /></label>
              <label>Disallowed Categories<textarea>Casino, Adult, Payday Loan</textarea></label>
              <label>Manual Review Trigger<textarea>Loan-related terms, leverage claims, guaranteed returns</textarea></label>
            </div>
            <div class="hero-actions">
              <button>Save Rule Set</button>
            </div>
          </div>
        </div>
      </section>
    `,
    { active: "admin" }
  );
}

function boot() {
  const app = document.getElementById("app");
  const page = document.body.dataset.page;

  const pages = {
    home: renderHome,
    personalization: renderPersonalization,
    marketplace: renderMarketplace,
    site: renderSiteDetail,
    wallet: renderWallet,
    orders: renderOrders,
    publisher: renderPublisher,
    admin: renderAdmin,
  };

  const renderer = pages[page] || renderHome;
  app.innerHTML = renderer();
}

document.addEventListener("DOMContentLoaded", boot);
