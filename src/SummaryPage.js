// src/SummaryPage.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./SummaryPage.css";
import Navbar from "./Navbar";

// Use env var in prod (Vercel) and localhost in dev
// Ensure no trailing slash so `${API_BASE}/path` is clean
const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5003").replace(/\/$/, "");

// Format money for display only
const currency = (n) => `$${Number(n || 0).toFixed(2)}`;

// Coerce any string/pretty value to a plain number before sending to API
const toNumber = (v) =>
    typeof v === "number" ? v : Number(String(v ?? "").replace(/[^0-9.]/g, "") || 0);

export default function SummaryPage() {
    const navigate = useNavigate();

    const summaryData = useMemo(
        () => JSON.parse(localStorage.getItem("summaryData") || "{}"),
        []
    );
    const clientInfo = useMemo(
        () => JSON.parse(localStorage.getItem("clientInfo") || "{}"),
        []
    );

    if (!summaryData?.service) {
        return (
            <>
                <Navbar />
                <div className="container empty">
                    <h2>No summary data found.</h2>
                    <button className="btn primary" onClick={() => navigate("/pricing")}>
                        Go to Pricing
                    </button>
                </div>
            </>
        );
    }

    // Pricing math for display
    const gstRate = 0.1;
    const subtotal = toNumber(summaryData.total || 0);
    const gstAmount = +(subtotal * gstRate).toFixed(2);
    const totalWithGst = subtotal + gstAmount;

    // Client fallbacks
    const displayName = clientInfo.businessName || "—";
    const displayEmail = clientInfo.email || "—";
    const displayPhone = clientInfo.phone || "—";

    const handleAcceptContinue = async () => {
        const payload = {
            businessName: displayName === "—" ? "" : displayName,
            email: clientInfo.email || "",
            phone: clientInfo.phone || "",
            service: summaryData.service || "",
            plan: {
                name: summaryData.plan?.name || "",
                price: toNumber(summaryData.plan?.price),
            },
            addOns: (summaryData.addOns || []).map((a) => ({
                name: a.name,
                price: toNumber(a.price),
            })),
            subtotal: toNumber(subtotal),
            gstAmount: toNumber(gstAmount),
            total: toNumber(totalWithGst),
        };

        try {
            const res = await fetch(`${API_BASE}/api/save-pricing-summary`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result?.message || "Request failed");

            localStorage.setItem("finalSubmission", JSON.stringify(payload));
            navigate("/agreement-form");
        } catch (e) {
            alert("Failed to save summary. Please try again.");
            // console.error(e);
        }
    };

    return (
        <>
            <Navbar />

            <header className="hero">
                <div className="container">
                    <h1>Summary</h1>
                    <p className="lead">
                        Please review your details and selections below. This summary includes your
                        chosen service, plan, and add-ons, along with GST and total costs. Make sure
                        everything is correct before proceeding to the agreement.
                    </p>
                </div>
            </header>

            <div className="summary-page container">
                {/* Left: Summary Card */}
                <section className="card">
                    <div className="section">
                        <h3 className="section-title">Client Information</h3>

                        <div className="kv">
                            <span className="k">Name</span>
                            <span className="v">{displayName}</span>
                        </div>
                        <div className="kv">
                            <span className="k">Email</span>
                            <span className="v">{displayEmail}</span>
                        </div>
                        <div className="kv">
                            <span className="k">Phone</span>
                            <span className="v">{displayPhone}</span>
                        </div>
                    </div>

                    <div className="section">
                        <h3 className="section-title">Summary</h3>

                        <div className="kv">
                            <span className="k">Service</span>
                            <span className="v">{summaryData.service}</span>
                        </div>

                        <div className="kv">
                            <span className="k">Plan</span>
                            <span className="v">
                {summaryData.plan?.name || "—"}
                                {summaryData.plan?.price != null
                                    ? ` — ${currency(summaryData.plan.price)}`
                                    : ""}
              </span>
                        </div>

                        <div className="kv vertical">
                            <span className="k">Add-ons</span>
                            <ul className="addons">
                                {summaryData.addOns?.length ? (
                                    summaryData.addOns.map((a) => (
                                        <li key={a.name}>
                                            <span className="label">{a.name}</span>
                                            <span className="price">{currency(a.price)}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="muted">None selected</li>
                                )}
                            </ul>
                        </div>

                        <p className="hint">This is an Australian GST-inclusive calculation.</p>

                        <div className="totals">
                            <div>
                                <span>Subtotal</span>
                                <span>{currency(subtotal)}</span>
                            </div>
                            <div className="muted">
                                <span>GST (10%)</span>
                                <span>{currency(gstAmount)}</span>
                            </div>
                            <div className="total">
                                <span>Total (incl. GST)</span>
                                <span>{currency(totalWithGst)}</span>
                            </div>
                        </div>

                        <div className="actions">
                            <button className="btn ghost" onClick={() => navigate("/pricing")}>
                                Go Back &amp; Edit
                            </button>
                            <button className="btn primary" onClick={handleAcceptContinue}>
                                Accept and Continue
                            </button>
                        </div>
                    </div>
                </section>

                {/* Right: Help tips */}
                <aside className="card help">
                    <h3 className="section-title">Need anything changed?</h3>
                    <p className="hero-paragraph">
                        Have questions or want to adjust something? We’re happy to help. You can email
                        us at <strong>enquiries@theglobalbpo.com</strong> or call{" "}
                        <strong>+61 03 7042 1180</strong>. If you need changes, go back and edit your
                        selections on the pricing page.
                    </p>
                    <p className="help-copy">
                        Return to the previous step to adjust your service, package, or add-ons. When
                        you’re happy, click <strong>Accept and Continue</strong> to generate your
                        agreement.
                    </p>

                    <div className="faq">
                        <details>
                            <summary>What happens after I accept?</summary>
                            <p>
                                We’ll prepare your agreement with your selections and send a confirmation
                                email with next steps.
                            </p>
                        </details>
                        <details>
                            <summary>Can I change add-ons later?</summary>
                            <p>
                                Yes. Add-ons can be updated at any time; your next invoice will reflect
                                the change.
                            </p>
                        </details>
                    </div>
                </aside>
            </div>
        </>
    );
}
