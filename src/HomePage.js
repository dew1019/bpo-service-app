import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./HomePage.css";

// If you keep the image in /src/assets/hero-services.jpg, use an import:
// import heroBanner from "../assets/hero-services.jpg";

// For now, point to any hosted image (replace with your asset path/import).
const heroBanner =
    "https://videos.openai.com/vg-assets/assets%2Ftask_01k3q561prekrsqn6gf883n8by%2F1756345169_img_1.webp?st=2025-09-05T00%3A57%3A37Z&se=2025-09-11T01%3A57%3A37Z&sks=b&skt=2025-09-05T00%3A57%3A37Z&ske=2025-09-11T01%3A57%3A37Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=5e5fc900-07cf-43e7-ab5b-314c0d877bb0&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=uMgwuMEC4sqsaNmcTbcs0d5%2B9Pw0xiog80SAwXwZs%2Bg%3D&az=oaivgprodscus"
const isEmail = (v = "") => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const isE164 = (v = "") => /^\+\d{6,15}$/.test(v);

export default function HomePage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        businessName: "",
        email: "",
        phone: "",
    });
    const [touched, setTouched] = useState({});
    const [sending, setSending] = useState(false);

    const errors = {
        businessName: !formData.businessName.trim()
            ? "Business name is required."
            : "",
        email: !formData.email.trim()
            ? "Email is required."
            : !isEmail(formData.email)
                ? "Enter a valid email."
                : "",
        phone: !formData.phone.trim()
            ? "Contact number is required."
            : !isE164(formData.phone)
                ? "Enter a valid number with country code."
                : "",
    };

    const showError = (name) => touched[name] && errors[name];

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };

    const onBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

    const onPhoneChange = (value) => {
        const withPlus = value ? `+${value}` : "";
        setFormData((p) => ({ ...p, phone: withPlus }));
        if (!touched.phone) setTouched((t) => ({ ...t, phone: true }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({ businessName: true, email: true, phone: true });
        if (errors.businessName || errors.email || errors.phone) return;

        try {
            setSending(true);

            localStorage.setItem(
                "clientInfo",
                JSON.stringify({
                    businessName: formData.businessName,
                    email: formData.email,
                    phone: formData.phone,
                })
            );

            await fetch("https://hearty-happiness-production.up.railway.app/api/new-client-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            navigate("/pricing");
        } catch {
            alert("Submission failed. Please try again.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="homepage">
            <Navbar />

            {/* ======= Banner ======= */}
            <section className="hero">
                <div className="hero-media">
                    {/* If you imported the image, replace heroBanner with {heroBanner} */}
                    <img src={heroBanner} alt="Our services banner" />
                    <div className="hero-overlay" />
                    <div className="hero-title">

                    </div>
                </div>
            </section>

            {/* ======= Overlapping cards row ======= */}
            <section className="cards-row">
                {/* Left info card */}
                <aside className="info-card card-float">
                    <h3>Why start here?</h3>
                    <ul className="benefits">
                        <p>
                            We ask for your basic information to create a more personalized and efficient experience tailored specifically to your business goals. By understanding your business name, email, and contact number, we’re able to recommend pricing options that align best with your needs, industry type, and budget — saving you time and helping you make informed decisions faster.
                            <br /><br />
                            This small step allows us to better understand who you are, how we can support you, and which of our services may be the right fit. It also helps us deliver accurate communication and relevant updates to keep you in the loop without overwhelming your inbox.
                            <br /><br />
                            Please rest assured that your details are 100% secure with us. We respect your privacy — there’s no spam, no cold calls, and no data sharing with third parties. You’ll only receive the information that matters to your business and nothing more.
                            <br /><br />
                            Ready to take the next step? Fill in your details below and discover the plan that suits you best.
                        </p>
                    </ul>
                    <div className="tiny muted">
                        Questions? <a href="https://www.theglobalbpo.com">Talk to our team</a>.
                    </div>
                </aside>

                {/* Right form card */}
                <form className="lead-card card-float" onSubmit={handleSubmit} noValidate>
                    <label className={`field ${showError("businessName") ? "has-error" : ""}`}>
                        <span>Business Name *</span>
                        <input
                            type="text"
                            name="businessName"
                            placeholder="e.g., The Global BPO"
                            value={formData.businessName}
                            onChange={onChange}
                            onBlur={onBlur}
                            autoComplete="organization"
                            aria-invalid={!!showError("businessName")}
                        />
                        {showError("businessName") && (
                            <em className="error">{errors.businessName}</em>
                        )}
                    </label>

                    <label className={`field ${showError("email") ? "has-error" : ""}`}>
            <span>
              Work Email *{" "}
                {isEmail(formData.email) && <small className="verified">Verified</small>}
            </span>
                        <input
                            type="email"
                            name="email"
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={onChange}
                            onBlur={onBlur}
                            autoComplete="email"
                            aria-invalid={!!showError("email")}
                        />
                        {showError("email") && <em className="error">{errors.email}</em>}
                    </label>

                    <label className={`field ${showError("phone") ? "has-error" : ""}`}>
            <span>
              Contact Number *{" "}
                {isE164(formData.phone) && <small className="verified">Verified</small>}
            </span>

                        <PhoneInput
                            country="au"
                            enableSearch
                            preferredCountries={["au", "us", "gb", "lk", "in", "nz"]}
                            value={formData.phone.replace(/^\+/, "")}
                            onChange={onPhoneChange}
                            inputProps={{
                                name: "phone",
                                required: true,
                                "aria-invalid": !!showError("phone"),
                                autoComplete: "tel",
                            }}
                            inputStyle={{ width: "100%" }}
                            buttonStyle={{ borderRadius: "10px 0 0 10px" }}
                            containerStyle={{ width: "100%" }}
                        />

                        {showError("phone") && <em className="error">{errors.phone}</em>}
                    </label>

                    <button className="cta" type="submit" disabled={sending}>
                        {sending ? "Loading…" : "See Pricing Plans"}
                    </button>

                    <p className="tiny">
                        By continuing you agree to our{" "}
                        <a
                            href="https://theglobalbpo.com/terms-and-conditions/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Terms
                        </a>{" "}
                        and{" "}
                        <a
                            href="https://theglobalbpo.com/privacy-and-policy/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Privacy Policy
                        </a>
                        . We’ll only contact you about your enquiry.
                    </p>
                </form>
            </section>

            <Footer />
        </div>
    );
}
