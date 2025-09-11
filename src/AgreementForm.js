import React, { useEffect, useMemo, useState } from "react";
import "./AgreementForm.css";
import Navbar from "./Navbar";

/* -------------------- Validators -------------------- */
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5003";

// Email: defer to HTML5 email but we also add a light regex
const isEmail = (v = "") => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

// Universal phone (E.164 format, + followed by 6–15 digits)
const isPhone = (v = "") => /^\+[1-9]\d{5,14}$/.test(v);

// ACN: 9 digits, weights [8..1] over first 8, check digit rule
const isACN = (v = "") => {
    const digits = v.replace(/\D/g, "");
    if (digits.length !== 9) return false;
    const w = [8, 7, 6, 5, 4, 3, 2, 1];
    const sum = w.reduce((s, weight, i) => s + weight * Number(digits[i]), 0);
    const remainder = sum % 10;
    const check = (10 - remainder) % 10;
    return check === Number(digits[8]);
};

// ABN: 11 digits, subtract 1 from first digit then weights.
// Weights: [10,1,3,5,7,9,11,13,15,17,19]; total % 89 === 0
const isABN = (v = "") => {
    const digits = v.replace(/\D/g, "");
    if (digits.length !== 11) return false;
    const w = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
    const d = digits.split("").map(Number);
    d[0] = d[0] - 1;
    const total = w.reduce((s, weight, i) => s + weight * d[i], 0);
    return total % 89 === 0;
};

// Field required check (non-empty after trim)
const required = (v) => String(v ?? "").trim().length > 0;

const initialData = {
    CompanyName: "",
    Address: "",
    ClientFullName: "",
    DateOfBirth: "",
    ClientEmail: "",
    MobileNumber: "",
    RegisteredOffice: "",
    RegisteredPostCode: "",
    PostalAddress: "",
    PostalPostCode: "",
    BusinessAddress: "",
    BusinessPostCode: "",
    DepartmentContact: "",
    ContactNumber: "",
    DepartmentEmail: "",
    OfficeNumber: "",
    NameOfDirector: "",
    AddressOfDirector: "",
    DriversLicense: "",
    ACN_ABN: "",
    MainService: "",
    ContractStartDate: "",
    JobType: ""
};

const steps = [
    { key: "client", title: "Client" },
    { key: "company", title: "Company" },
    { key: "addresses", title: "Addresses" },
    { key: "department", title: "Department" },
    { key: "director", title: "Director & ID" },
    { key: "agreement", title: "Agreement" }
];

export default function AgreementForm() {
    const [formData, setFormData] = useState(initialData);
    const [step, setStep] = useState(0);
    const [sending, setSending] = useState(false);
    const [touched, setTouched] = useState({}); // for showing errors after interaction
    const [errors, setErrors] = useState({}); // field -> message

    const summaryData = useMemo(
        () => JSON.parse(localStorage.getItem("summaryData") || "{}"),
        []
    );

    // Prefill from summary
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            CompanyName: prev.CompanyName || summaryData?.clientName || "",
            ClientFullName: prev.ClientFullName || summaryData?.clientName || "",
            ClientEmail: prev.ClientEmail || summaryData?.email || "",
            MobileNumber: prev.MobileNumber || summaryData?.phone || "",
            MainService: prev.MainService || summaryData?.service || ""
        }));
    }, [summaryData]);

    // Restore draft
    useEffect(() => {
        const draft = localStorage.getItem("agreementDraft");
        if (draft) {
            try {
                const parsed = JSON.parse(draft);
                if (parsed && typeof parsed === "object") {
                    setFormData((p) => ({ ...p, ...parsed }));
                }
            } catch {}
        }
    }, []);

    // Persist draft
    useEffect(() => {
        localStorage.setItem("agreementDraft", JSON.stringify(formData));
    }, [formData]);

    const update = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        // live-validate on update if already touched
        if (touched[name]) {
            setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
        }
    };

    const markTouched = (name) => {
        setTouched((t) => ({ ...t, [name]: true }));
        setErrors((prev) => ({ ...prev, [name]: validateField(name, formData[name]) }));
    };

    /* -------------------- Validation rules -------------------- */
    function validateField(name, value) {
        const v = String(value ?? "").trim();
        // All fields are required
        if (!required(v)) return "This field is required.";

        switch (name) {
            case "ClientEmail":
            case "DepartmentEmail":
                return isEmail(v) ? "" : "Enter a valid email.";
            case "MobileNumber":
            case "ContactNumber":
            case "OfficeNumber":
                return isPhone(v) ? "" : "Enter a valid international phone (e.g., +61400111222).";

            case "ACN_ABN": {
                const only = v.replace(/\D/g, "");
                const ok =
                    (only.length === 9 && isACN(only)) ||
                    (only.length === 11 && isABN(only));
                return ok ? "" : "Enter a valid ACN (9 digits) or ABN (11 digits).";
            }
            case "RegisteredPostCode":
            case "PostalPostCode":
            case "BusinessPostCode":
                return /^\d{4}$/.test(v) ? "" : "Enter a 4-digit postcode.";
            default:
                return ""; // required already checked
        }
    }

    function validateStep(currentStep = step) {
        const fieldsByStep = {
            client: ["ClientFullName", "ClientEmail", "MobileNumber", "DateOfBirth"],
            // FIX: no TradingName; ensure Address required here
            company: ["CompanyName", "Address", "ACN_ABN", "OfficeNumber"],
            addresses: [
                "RegisteredOffice", "RegisteredPostCode",
                "PostalAddress", "PostalPostCode",
                "BusinessAddress", "BusinessPostCode"
            ],
            department: ["DepartmentContact", "ContactNumber", "DepartmentEmail"],
            director: ["NameOfDirector", "AddressOfDirector", "DriversLicense"],
            agreement: ["MainService", "ContractStartDate", "JobType"]
        };
        const keys = fieldsByStep[steps[currentStep].key] || [];
        const newErrs = {};
        keys.forEach((k) => {
            const msg = validateField(k, formData[k]);
            if (msg) newErrs[k] = msg;
        });
        setErrors((prev) => ({ ...prev, ...newErrs }));
        setTouched((prev) => ({
            ...prev,
            ...Object.fromEntries(keys.map((k) => [k, true]))
        }));
        return Object.keys(newErrs).length === 0;
    }

    const next = () => {
        if (!validateStep(step)) return;
        setStep((s) => Math.min(s + 1, steps.length - 1));
    };

    const back = () => setStep((s) => Math.max(s - 1, 0));

    const handleSubmit = async (e) => {
        e?.preventDefault?.();
        // Validate final step & all previous
        for (let i = 0; i < steps.length; i++) {
            if (!validateStep(i)) {
                setStep(i);
                return;
            }
        }
        setSending(true);
        try {
            const res = await fetch(`${API_BASE}/api/submit-agreement`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || "Failed");
            alert("✅ Agreement submitted successfully!");
            localStorage.removeItem("agreementDraft");
        } catch (err) {
            alert("❌ Submission failed. Please try again.");
        } finally {
            setSending(false);
        }
    };

    /* -------------------- Step UIs -------------------- */
    const StepClient = () => (
        <div className="grid">
            <Field
                label="Client Full Name *"
                name="ClientFullName"
                value={formData.ClientFullName}
                onChange={update}
                onBlur={markTouched}
                error={errors.ClientFullName}
            />
            <Field
                label="Client Email *"
                type="email"
                name="ClientEmail"
                value={formData.ClientEmail}
                onChange={update}
                onBlur={markTouched}
                error={errors.ClientEmail}
                verified={isEmail(formData.ClientEmail)}
            />
            <Field
                label="Mobile Number *"
                name="MobileNumber"
                value={formData.MobileNumber}
                onChange={update}
                onBlur={markTouched}
                error={errors.MobileNumber}
                verified={isPhone(formData.MobileNumber)}
            />
            <Field
                label="Date of Birth *"
                type="date"
                name="DateOfBirth"
                value={formData.DateOfBirth}
                onChange={update}
                onBlur={markTouched}
                error={errors.DateOfBirth}
            />
        </div>
    );

    const StepCompany = () => (
        <div className="grid">
            <Field
                label="Company Name *"
                name="CompanyName"
                value={formData.CompanyName}
                onChange={update}
                onBlur={markTouched}
                error={errors.CompanyName}
            />
            <Field
                label="Address *"
                name="Address"
                value={formData.Address}
                onChange={update}
                onBlur={markTouched}
                error={errors.Address}
            />
            <Field
                label="ACN / ABN *"
                name="ACN_ABN"
                value={formData.ACN_ABN}
                onChange={(n, val) => update(n, val.replace(/[^\d\s]/g, ""))}
                onBlur={markTouched}
                error={errors.ACN_ABN}
                placeholder="ACN (9 digits) or ABN (11 digits)"
                verified={(function (v) {
                    const d = v.replace(/\D/g, "");
                    return (d.length === 9 && isACN(d)) || (d.length === 11 && isABN(d));
                })(formData.ACN_ABN)}
            />
            <Field
                label="Office Number *"
                name="OfficeNumber"
                value={formData.OfficeNumber}
                onChange={update}
                onBlur={markTouched}
                error={errors.OfficeNumber}
                verified={isPhone(formData.OfficeNumber)}
            />
        </div>
    );

    const StepAddresses = () => (
        <>
            <div className="grid">
                <Field
                    label="Registered Office *"
                    name="RegisteredOffice"
                    value={formData.RegisteredOffice}
                    onChange={update}
                    onBlur={markTouched}
                    error={errors.RegisteredOffice}
                />
                <Field
                    label="Post Code *"
                    name="RegisteredPostCode"
                    value={formData.RegisteredPostCode}
                    onChange={update}
                    onBlur={markTouched}
                    error={errors.RegisteredPostCode}
                    inputMode="numeric"
                    placeholder="4 digits"
                />
            </div>

            <div className="grid">
                <Field
                    label="Postal Address *"
                    name="PostalAddress"
                    value={formData.PostalAddress}
                    onChange={update}
                    onBlur={markTouched}
                    error={errors.PostalAddress}
                />
                <Field
                    label="Post Code *"
                    name="PostalPostCode"
                    value={formData.PostalPostCode}
                    onChange={update}
                    onBlur={markTouched}
                    error={errors.PostalPostCode}
                    inputMode="numeric"
                    placeholder="4 digits"
                />
            </div>

            <div className="grid">
                <Field
                    label="Business Address *"
                    name="BusinessAddress"
                    value={formData.BusinessAddress}
                    onChange={update}
                    onBlur={markTouched}
                    error={errors.BusinessAddress}
                />
                <Field
                    label="Post Code *"
                    name="BusinessPostCode"
                    value={formData.BusinessPostCode}
                    onChange={update}
                    onBlur={markTouched}
                    error={errors.BusinessPostCode}
                    inputMode="numeric"
                    placeholder="4 digits"
                />
            </div>
        </>
    );

    const StepDepartment = () => (
        <div className="grid">
            <Field
                label="Department Contact *"
                name="DepartmentContact"
                value={formData.DepartmentContact}
                onChange={update}
                onBlur={markTouched}
                error={errors.DepartmentContact}
            />
            <Field
                label="Contact Number *"
                name="ContactNumber"
                value={formData.ContactNumber}
                onChange={update}
                onBlur={markTouched}
                error={errors.ContactNumber}
                verified={isPhone(formData.ContactNumber)}
            />
            <Field
                label="Department Email *"
                type="email"
                name="DepartmentEmail"
                value={formData.DepartmentEmail}
                onChange={update}
                onBlur={markTouched}
                error={errors.DepartmentEmail}
                verified={isEmail(formData.DepartmentEmail)}
            />
        </div>
    );

    const StepDirector = () => (
        <>
            <div className="grid">
                <Field
                    label="Name of Director *"
                    name="NameOfDirector"
                    value={formData.NameOfDirector}
                    onChange={update}
                    onBlur={markTouched}
                    error={errors.NameOfDirector}
                />
                <Field
                    label="Address of Director *"
                    name="AddressOfDirector"
                    value={formData.AddressOfDirector}
                    onChange={update}
                    onBlur={markTouched}
                    error={errors.AddressOfDirector}
                />
            </div>
            <Field
                label="Driver’s Licence / ID (notes or #) *"
                as="textarea"
                name="DriversLicense"
                value={formData.DriversLicense}
                onChange={update}
                onBlur={markTouched}
                error={errors.DriversLicense}
            />
        </>
    );

    const StepAgreement = () => (
        <div className="grid">
            <Select
                label="Main Service *"
                name="MainService"
                value={formData.MainService}
                onChange={update}
                onBlur={markTouched}
                error={errors.MainService}
                options={["BookKeeping", "CPA", "VA", "Digital Marketing", "Other"]}
            />
            <Select
                label="Job Type *"
                name="JobType"
                value={formData.JobType}
                onChange={update}
                onBlur={markTouched}
                error={errors.JobType}
                options={["Full Time", "Part Time"]}
            />
            <Field
                label="Contract Start Date *"
                type="date"
                name="ContractStartDate"
                value={formData.ContractStartDate}
                onChange={update}
                onBlur={markTouched}
                error={errors.ContractStartDate}
            />
        </div>
    );

    const StepBody = () => {
        switch (steps[step].key) {
            case "client":
                return <StepClient />;
            case "company":
                return <StepCompany />;
            case "addresses":
                return <StepAddresses />;
            case "department":
                return <StepDepartment />;
            case "director":
                return <StepDirector />;
            case "agreement":
                return <StepAgreement />;
            default:
                return null;
        }
    };

    return (
        <div className="agreement-page">
            <Navbar />

            <header className="hero">
                <div className="container">
                    <h1>Continue with Agreement</h1>
                    <p className="lead">
                        To proceed, please complete each section. All fields are required. We only collect what’s needed to prepare your agreement.
                        Review our{" "}
                        <a href="/privacy and policy.pdf" target="_blank" rel="noopener noreferrer">
                            Privacy Policy
                        </a>.
                    </p>
                </div>
            </header>

            <div className="container layout">
                <section className="panel">
                    <Progress current={step} items={steps} />

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="step-card">
                            <div className="step-head">
                                <h3>{steps[step].title}</h3>
                                <p className="muted">
                                    Step {step + 1} of {steps.length}
                                </p>
                            </div>

                            <StepBody />
                        </div>

                        <div className="actions">
                            <button
                                type="button"
                                className="btn ghost"
                                onClick={back}
                                disabled={step === 0}
                            >
                                Back
                            </button>
                            {step < steps.length - 1 ? (
                                <button type="button" className="btn primary" onClick={next}>
                                    Next
                                </button>
                            ) : (
                                <button type="submit" className="btn primary" disabled={sending}>
                                    {sending ? "Sending..." : "Send Agreement"}
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                <aside className="summary">
                    <div className="summary-card">
                        <h3>Your Summary</h3>
                        <ul className="kvlist">
                            <li>
                                <span>Name</span>
                                <strong>{formData.ClientFullName || "—"}</strong>
                            </li>
                            <li>
                                <span>Email</span>
                                <strong>{formData.ClientEmail || "—"}</strong>
                            </li>
                            <li>
                                <span>Phone</span>
                                <strong>{formData.MobileNumber || "—"}</strong>
                            </li>
                            <li>
                                <span>Company</span>
                                <strong>{formData.CompanyName || "—"}</strong>
                            </li>
                            <li>
                                <span>Service</span>
                                <strong>{formData.MainService || "—"}</strong>
                            </li>
                            <li>
                                <span>Start Date</span>
                                <strong>{formData.ContractStartDate || "—"}</strong>
                            </li>
                        </ul>
                        <div className="tips">
                            <details>
                                <summary>Why we verify Email / Phone / ACN-ABN?</summary>
                                <p>
                                    These checks help us ensure we can reach you and prepare a valid agreement for your entity.
                                </p>
                            </details>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

/* ---------- small field components ---------- */
function Field({
                   label,
                   name,
                   value,
                   onChange,
                   onBlur,
                   type = "text",
                   as,
                   error,
                   verified,
                   inputMode,
                   placeholder
               }) {
    const Comp = as === "textarea" ? "textarea" : "input";
    return (
        <label className={`field ${error ? "has-error" : ""}`}>
      <span className="field-label">
        {label}
          {verified ? <span className="badge ok">Verified</span> : null}
      </span>
            <Comp
                className="control"
                name={name}
                value={value}
                type={as ? undefined : type}
                onChange={(e) => onChange(name, e.target.value)}
                onBlur={() => onBlur?.(name)}
                inputMode={inputMode}
                placeholder={placeholder || ""}
                required
            />
            {error ? <em className="error">{error}</em> : null}
        </label>
    );
}

function Select({ label, name, value, onChange, onBlur, options = [], error }) {
    return (
        <label className={`field ${error ? "has-error" : ""}`}>
            <span className="field-label">{label}</span>
            <select
                className="control"
                name={name}
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                onBlur={() => onBlur?.(name)}
                required
            >
                <option value="" disabled>
                    Choose…
                </option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
            {error ? <em className="error">{error}</em> : null}
        </label>
    );
}

function Progress({ current, items }) {
    return (
        <ol className="progress">
            {items.map((it, i) => (
                <li
                    key={it.key}
                    className={i < current ? "done" : i === current ? "now" : ""}
                >
                    <span className="dot" />
                    <span className="txt">{it.title}</span>
                </li>
            ))}
        </ol>
    );
}
