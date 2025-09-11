import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PricingPage.css";
import Navbar from "./Navbar";

/* =========================
   DATA
========================= */

const digitalMarketingPackages = {
    "Part Time Digital Marketing": [
        {
            name: "PT Package 1",
            price: 150,
            description: [
                "4 Social Media Posts",
                "2 Videos (15-60 Sec)",
                "Content Writing (Captions, Scripts, Hashtags)",
                "Post Scheduling",
            ],
        },
    ],
    "Full Time Digital Marketing": [
        {
            name: "FT Package 1",
            price: 300,
            description: [
                "16 Social Media Posts",
                "6 Videos (15-60 Sec)",
                "Monthly cover for Facebook & LinkedIn",
                "Content Writing (Captions, Scripts, Hashtags)",
            ],
        },
    ],
    "Package Basis": {
        "BRAND STARTER": [
            {
                name: "BRAND STARTER",
                price: 350,
                description: [
                    "Create, Setup & Configure Social Media with Profile Picture & Cover Images",
                    "Optimized Bio for Social Media",
                    "Google Business Profile Setup",
                    "2FA Setup for All accounts",
                    "Logo Creation",
                    "Brand Guideline w/it Color Palette, Typography & mockups.",
                    "3 Social Media Posts",
                ],
            },
        ],
        "SOCIAL ACTIVE": [
            {
                name: "SOCIAL ACTIVE",
                price: 400,
                description: [
                    "Facebook, Instagram, LinkedIn",
                    "8 Social Media Posts",
                    "4 Videos (15-60 Sec )",
                    "Monthly cover for Facebook & LinkedIn",
                    "Content Writing (Captions, Scripts, Hashtags)",
                    "Post Scheduling",
                    "Message Response Automation",
                    "Monthly Performance Reporting",
                ],
            },
        ],
        MOMENTUM: [
            {
                name: "MOMENTUM",
                price: 550,
                description: [
                    "Facebook, Instagram, LinkedIn, Tik Tok",
                    "12 Social Media Posts",
                    "4 Videos (15-60 Sec )",
                    "Monthly cover for Facebook & LinkedIn",
                    "Content Writing ( Captions, Scripts, Hashtags)",
                    "Post Scheduling",
                    "Message Response Automation",
                    "Monthly Performance Report",
                ],
            },
        ],
        ACCELERATOR: [
            {
                name: "ACCELERATOR",
                price: 600,
                description: [
                    "Facebook, Instagram, LinkedIn, Tik Tok",
                    "8 Social Media Posts",
                    "4 Videos (15-60 Sec )",
                    "Monthly cover for Facebook & LinkedIn",
                    "Content Writing & Post Scheduling",
                    "Message Response Automation",
                    "Meta Campaign Management",
                    "4 Ad creatives (3 Images 1 Video)",
                    "Monthly Performance Report",
                ],
            },
        ],
        "FULL THROTTLE": [
            {
                name: "FULL THROTTLE",
                price: 750,
                description: [
                    "Everything in Accelerator And,",
                    "1 Email Marketing campaign",
                    "2 Email Flyers",
                    "2 Blogs",
                ],
            },
        ],
    },
};

const services = [
    {
        name: "BookKeeping",
        description: "Our team of highly experienced bookkeepers will take care of all your bookkeeping.",
        icon: "https://videos.openai.com/vg-assets/assets%2Ftask_01k06dejhhfr799yqa55ghhz20%2F1752562130_img_0_thumb.webp?st=2025-09-05T00%3A57%3A09Z&se=2025-09-11T01%3A57%3A09Z&sks=b&skt=2025-09-05T00%3A57%3A09Z&ske=2025-09-11T01%3A57%3A09Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=5e5fc900-07cf-43e7-ab5b-314c0d877bb0&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=Fw5HXe9VWKfHkVm72epYlgoPHY3lN0O1PBra8hfzjOU%3D&az=oaivgprodscus",
    },
    {
        name: "CPA",
        description: "CPA will handle general accounting tasks by regulating and confirming financial transactions.",
        icon: "https://videos.openai.com/vg-assets/assets%2Ftask_01k06cshnseejav1pswjmsejjq%2F1752561445_img_0_thumb.webp?st=2025-09-05T01%3A53%3A51Z&se=2025-09-11T02%3A53%3A51Z&sks=b&skt=2025-09-05T01%3A53%3A51Z&ske=2025-09-11T02%3A53%3A51Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=5e5fc900-07cf-43e7-ab5b-314c0d877bb0&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=nYZ0Ukkef0Puw1uK9RykWSc7RulGt6t46JSYpmJTBPY%3D&az=oaivgprodscus",
    },
    {
        name: "VA",
        description: "Our team of skilled remote assistants are geared to help take care of your day-to-day administrative tasks.",
        icon: "https://videos.openai.com/vg-assets/assets%2Ftask_01k06db6qxey7a4sagvtqtv5rk%2F1752562016_img_1.webp?st=2025-09-05T01%3A53%3A51Z&se=2025-09-11T02%3A53%3A51Z&sks=b&skt=2025-09-05T01%3A53%3A51Z&ske=2025-09-11T02%3A53%3A51Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=5e5fc900-07cf-43e7-ab5b-314c0d877bb0&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=f01zDJ8UjVoQgjEn8wlM5RR9r%2BFYRGEblvVc8ERHxm0%3D&az=oaivgprodscus",
    },
    {
        name: "Digital Marketing",
        description: "Our expert team deliversROI-Driven Digital Marketing Solutions tailored to your business goals.",
        icon: "https://videos.openai.com/vg-assets/assets%2Ftask_01k06cjfcef3082pqpa3svzx5r%2F1752561216_img_0_thumb.webp?st=2025-09-05T01%3A53%3A51Z&se=2025-09-11T02%3A53%3A51Z&sks=b&skt=2025-09-05T01%3A53%3A51Z&ske=2025-09-11T02%3A53%3A51Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=5e5fc900-07cf-43e7-ab5b-314c0d877bb0&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=KwRM%2FoiW1TB25VpzhxZnGil6WBfPcLF%2BERO571sWq9o%3D&az=oaivgprodscus",
    },
];

const packagesByService = {
    BookKeeping: [
        { name: "S1 Package 1", price: 200, description: "Feature A\nFeature B" },
        { name: "S1 Package 2", price: 300, description: "Feature A\nFeature B\nFeature C" },
        { name: "S1 Package 3", price: 400, description: "Feature A\nFeature B\nFeature C\nFeature D" },
        { name: "S1 Package 4", price: 500, description: "Feature A\nFeature B\nFeature C\nFeature D\nFeature E" },
        { name: "S1 Package 5", price: 600, description: "Feature A\nFeature B\nFeature C\nFeature D\nFeature E\nFeature F" },
    ],
    CPA: [
        { name: "S2 Package 1", price: 220, description: "Feature A\nFeature B" },
        { name: "S2 Package 2", price: 320, description: "Feature A\nFeature B\nFeature C" },
        { name: "S2 Package 3", price: 420, description: "Feature A\nFeature B\nFeature C\nFeature D" },
        { name: "S2 Package 4", price: 520, description: "Feature A\nFeature B\nFeature C\nFeature D\nFeature E" },
        { name: "S2 Package 5", price: 620, description: "Feature A\nFeature B\nFeature C\nFeature D\nFeature E\nFeature F" },
    ],
    VA: [
        { name: "S3 Package 1", price: 250, description: "Feature A\nFeature B" },
        { name: "S3 Package 2", price: 350, description: "Feature A\nFeature B\nFeature C" },
        { name: "S3 Package 3", price: 450, description: "Feature A\nFeature B\nFeature C\nFeature D" },
        { name: "S3 Package 4", price: 550, description: "Feature A\nFeature B\nFeature C\nFeature D\nFeature E" },
        { name: "S3 Package 5", price: 650, description: "Feature A\nFeature B\nFeature C\nFeature D\nFeature E\nFeature F" },
    ],
    "Digital Marketing": digitalMarketingPackages,
};

const subBoxes = [
    { label: "For Startups", plans: [0] },          // Startup pack is index 0
    { label: "For Digital Presence", plans: [1, 2] },
    { label: "For Growth", plans: [3, 4] },
];

const serviceQuestions = {
    BookKeeping: [
        { id: "assistant_type", question: "Do you need a full-time or part-time assistant?", type: "dropdown", options: ["Full-time", "Part-time"] },
        { id: "contract_start_date", question: "When would you like the contract to start?", type: "calendar" }
    ],
    CPA: [
        { id: "assistant_type", question: "Do you need a full-time or part-time assistant?", type: "dropdown", options: ["Full-time", "Part-time"] },
        { id: "contract_start_date", question: "When would you like the contract to start?", type: "calendar" }
    ],
    VA: [
        { id: "assistant_type", question: "Do you need a full-time or part-time assistant?", type: "dropdown", options: ["Full-time", "Part-time"] },
        { id: "contract_start_date", question: "When would you like the contract to start?", type: "calendar" }
    ],
};

const digitalMarketingSubcategories = [
    "Part Time Digital Marketing",
    "Full Time Digital Marketing",
    "Package Basis",
];

/* =========================
   HELPERS & CARDS
========================= */

const QuestionBox = ({ questions, answers, setAnswers, onComplete }) => {
    const handleAnswerChange = (id, value) => setAnswers(prev => ({ ...prev, [id]: value }));
    const isFormComplete = () =>
        questions.every(q => (q.type === "checkbox") || (answers[q.id] !== undefined && answers[q.id] !== ""));

    return (
        <div className="question-box-container">
            <h3>Please tell us a bit about your needs:</h3>
            {questions.map((q) => (
                <div key={q.id} className="question-item">
                    <p>{q.question}</p>

                    {q.type === "text" && (
                        <input type="text" className="question-input" value={answers[q.id] || ""} onChange={(e) => handleAnswerChange(q.id, e.target.value)} />
                    )}

                    {q.type === "number" && (
                        <input type="number" className="question-input" value={answers[q.id] || ""} onChange={(e) => handleAnswerChange(q.id, e.target.value)} />
                    )}

                    {q.type === "checkbox" && (
                        <input type="checkbox" className="question-checkbox" checked={answers[q.id] || false} onChange={(e) => handleAnswerChange(q.id, e.target.checked)} />
                    )}

                    {q.type === "dropdown" && (
                        <select className="question-input" value={answers[q.id] || ""} onChange={(e) => handleAnswerChange(q.id, e.target.value)}>
                            <option value="" disabled>Select an option</option>
                            {q.options.map(option => (<option key={option} value={option}>{option}</option>))}
                        </select>
                    )}

                    {q.type === "calendar" && (
                        <input type="date" className="question-input" value={answers[q.id] || ""} onChange={(e) => handleAnswerChange(q.id, e.target.value)} />
                    )}
                </div>
            ))}
            <button onClick={onComplete} disabled={!isFormComplete()} className="continue-button">Continue</button>
        </div>
    );
};

function extractFeatures(plans) {
    const set = new Set();
    plans.forEach((p) => {
        const featuresArray = Array.isArray(p.description) ? p.description : p.description.split("\n");
        featuresArray.forEach((f) => set.add(f.trim()));
    });
    return Array.from(set).filter(Boolean);
}

const planColors = ["#0b0f5c", "#0b0f5c", "#0b0f5c", "#0b0f5c", "#0b0f5c"];

const PlanCard = ({
                      plan,
                      allFeatures,
                      isSelected,
                      onSelect,
                      color,
                      withCheckmarks = true,
                      showMonthlyText = true,
                      showStartupBadge = false,
                  }) => {
    return (
        <div
            key={plan.name}
            className={`plan-card ${isSelected ? "active" : ""}`}
            onClick={() => onSelect(plan)}
            style={{ borderTopColor: color }}
        >
            {showStartupBadge && <div className="startup-badge">Startup Pack</div>}

            <div className="plan-header" style={{ backgroundColor: color }}>
                <h3 className="plan-title" style={{ color: 'white' }}>{plan.name}</h3>
            </div>

            <div className="plan-features">
                {withCheckmarks ? (
                    allFeatures.map((feat, i) => (
                        <div key={i} className="plan-feature-item">
                            <span className={`feature-icon ${(Array.isArray(plan.description) ? plan.description : plan.description.split('\n')).includes(feat) ? 'check' : 'cross'}`}></span>
                            <span>{feat}</span>
                        </div>
                    ))
                ) : (
                    (Array.isArray(plan.description) ? plan.description : plan.description.split('\n')).map((feat, i) => (
                        <div key={i} className="plan-feature-item">
                            <span className="feature-icon dot"></span>
                            <span>{feat}</span>
                        </div>
                    ))
                )}
            </div>

            <div className="plan-price-display">
                <span className="price-value">${plan.price}</span>
                {showMonthlyText && <span className="monthly-plan-text">per month</span>}
            </div>

            <button
                className="buy-now-button"
                onClick={(e) => { e.stopPropagation(); onSelect(plan); }}
                style={{ backgroundColor: color }}
            >
                {isSelected ? "Selected" : "Choose"}
            </button>
        </div>
    );
};

const PlanComparisonRow = ({
                               plans,
                               features,
                               startupPlan,
                               bundle,
                               isBundleMode,
                               selectedPlan,
                               onSelectPlan,
                               className = "",
                           }) => {
    return (
        <div className={`plan-comparison-row ${className}`}>
            {plans.map((plan, idx) => {
                const selected = isBundleMode
                    ? (bundle.startup?.name === plan.name || bundle.extra?.name === plan.name)
                    : (selectedPlan && selectedPlan.name === plan.name);

                const showStartupBadge = isBundleMode && startupPlan && startupPlan.name === plan.name;

                return (
                    <PlanCard
                        key={plan.name}
                        plan={plan}
                        allFeatures={features}
                        isSelected={selected}
                        onSelect={onSelectPlan}
                        color={planColors[idx % planColors.length]}
                        showStartupBadge={showStartupBadge}
                    />
                );
            })}
        </div>
    );
};

const PackageBasisRow = ({ packages, onSelectPlan, bundle, isBundleMode, selectedPlan }) => {
    const allFeatures = extractFeatures(packages);
    const startupPlan = packages[0]; // visually badge if we ever use bundle in Package Basis (we don't here)
    return (
        <div className="package-basis-row">
            {packages.map((plan, idx) => {
                const selected = isBundleMode
                    ? (bundle.startup?.name === plan.name || bundle.extra?.name === plan.name)
                    : (selectedPlan && selectedPlan.name === plan.name);

                return (
                    <PlanCard
                        key={plan.name}
                        plan={plan}
                        allFeatures={allFeatures}
                        isSelected={selected}
                        onSelect={onSelectPlan}
                        color={planColors[idx % planColors.length]}
                        withCheckmarks={false}
                        showMonthlyText={false}
                        showStartupBadge={isBundleMode && startupPlan?.name === plan.name}
                    />
                );
            })}
        </div>
    );
};

/* =========================
   PAGE
========================= */

function PricingPage({
                         selectedService,
                         setSelectedService,
                         selectedSubBox,
                         setSelectedSubBox,
                         selectedPlan,
                         setSelectedPlan,
                         setSelectedAddOns,
                     }) {
    const navigate = useNavigate();
    const [showQuestions, setShowQuestions] = useState(false);
    const [answers, setAnswers] = useState({});
    const [selectedDigitalMarketingCategory, setSelectedDigitalMarketingCategory] = useState(null);

    // Bundle state for "For Startups" -> choose Startup + any one extra
    const [bundle, setBundle] = useState({ startup: null, extra: null });

    const resetAll = () => {
        setSelectedSubBox(null);
        setSelectedPlan(null);
        setSelectedAddOns([]);
        setAnswers({});
        setSelectedDigitalMarketingCategory(null);
        setBundle({ startup: null, extra: null });
    };

    const packagesToShow = () => {
        if (selectedService === "Digital Marketing") {
            if (selectedDigitalMarketingCategory === "Package Basis") {
                return Object.values(digitalMarketingPackages["Package Basis"]).flat();
            } else if (selectedDigitalMarketingCategory) {
                return digitalMarketingPackages[selectedDigitalMarketingCategory];
            }
        } else if (selectedService && packagesByService[selectedService]) {
            return packagesByService[selectedService];
        }
        return [];
    };

    const subBoxPackages = () => {
        const allPackages = packagesToShow();

        // SPECIAL: If "For Startups" is chosen, show ALL packages so the user can add one more.
        if (selectedService !== "Digital Marketing" && selectedSubBox === 0) {
            return allPackages;
        }

        if (selectedService !== "Digital Marketing" && selectedSubBox !== null) {
            return subBoxes[selectedSubBox].plans.map(idx => allPackages[idx]).filter(Boolean);
        }
        return allPackages;
    };

    const packages = subBoxPackages();
    const startupPlan = packagesToShow()[0] || null; // startup pack is index 0 by convention
    const features = packages.length ? extractFeatures(packages) : [];
    const isBundleMode = selectedService !== "Digital Marketing" && selectedSubBox === 0;

    const handleSelectPlan = (plan) => {
        if (isBundleMode) {
            // bundle rules: one must be startup (index 0), plus one optional extra
            const isStartup = startupPlan && plan.name === startupPlan.name;

            setBundle((prev) => {
                // toggle logic
                if (isStartup) {
                    // toggle startup
                    const nextStartup = prev.startup && prev.startup.name === plan.name ? null : plan;
                    return { ...prev, startup: nextStartup };
                } else {
                    // toggle extra
                    const nextExtra = prev.extra && prev.extra.name === plan.name ? null : plan;
                    return { ...prev, extra: nextExtra };
                }
            });
        } else {
            setSelectedPlan(plan);
        }
    };

    const handleNext = () => {
        if (isBundleMode) {
            if (!bundle.startup && !bundle.extra) {
                alert("Please select at least the Startup pack or one package.");
                return;
            }
            // Create a normalized object for downstream steps
            const items = [bundle.startup, bundle.extra].filter(Boolean);
            const total = items.reduce((sum, p) => sum + (p?.price || 0), 0);
            setSelectedPlan({ bundle: true, items, total }); // you can read this shape in /addons
        } else {
            if (!selectedPlan) {
                alert("Please select a package before continuing.");
                return;
            }
        }
        navigate("/addons");
    };

    const handleServiceClick = (service) => {
        if (selectedService !== service) {
            setSelectedService(service);
            resetAll();
            if (service !== "Digital Marketing" && serviceQuestions[service]) {
                setShowQuestions(true);
            } else {
                setShowQuestions(false);
            }
        } else {
            setSelectedService(null);
            resetAll();
            setShowQuestions(false);
        }
    };

    const handleDigitalMarketingCategoryClick = (category) => {
        setSelectedDigitalMarketingCategory(category);
        setSelectedPlan(null);
        setBundle({ startup: null, extra: null });
    };

    const centerRow = packages.length <= 3 ? "center-when-few" : "";

    const totalBundlePrice =
        (bundle.startup?.price || 0) + (bundle.extra?.price || 0);

    return (
        <div className="pricing-page-wrapper">
            <Navbar />
            <div className="header-banner1"></div>

            {/* Services */}
            <div className="services-grid">
                {services.map((service) => (
                    <div
                        key={service.name}
                        className={`service-box${selectedService === service.name ? " active" : ""}`}
                        onClick={() => handleServiceClick(service.name)}
                    >
                        <div className="icon-box">
                            <img src={service.icon} alt={`${service.name} Icon`} width="80" />
                        </div>
                        <h3>{service.name}</h3>
                        <p className="service-description">{service.description}</p>
                    </div>
                ))}
            </div>

            {selectedService && (
                <>
                    {selectedService !== "Digital Marketing" && showQuestions ? (
                        <QuestionBox
                            questions={serviceQuestions[selectedService]}
                            answers={answers}
                            setAnswers={setAnswers}
                            onComplete={() => setShowQuestions(false)}
                        />
                    ) : (
                        <>
                            {selectedService !== "Digital Marketing" && (
                                <div className="answers-summary">
                                    <h3>Your Preferences:</h3>
                                    <div className="answers-list">
                                        {serviceQuestions[selectedService].map((q) => (
                                            <p key={q.id}>
                                                <strong>{q.question}</strong>{" "}
                                                {q.type === "checkbox" ? (answers[q.id] ? "Yes" : "No") : (answers[q.id] || "N/A")}
                                            </p>
                                        ))}
                                    </div>
                                    <button onClick={() => setShowQuestions(true)} className="edit-answers-button">
                                        Edit My Answers
                                    </button>
                                </div>
                            )}



                            {selectedService === "Digital Marketing" && (
                                <div className="sub-category-grid">
                                    {digitalMarketingSubcategories.map((category) => (
                                        <div
                                            key={category}
                                            className={`sub-category-box${selectedDigitalMarketingCategory === category ? " active" : ""}`}
                                            onClick={() => handleDigitalMarketingCategoryClick(category)}
                                        >
                                            {category}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selectedService !== "Digital Marketing" && (
                                <div className="subboxes-area">
                                    {subBoxes.map((sub, idx) => (
                                        <div
                                            key={sub.label}
                                            className={`subbox${selectedSubBox === idx ? " active" : ""}`}
                                            onClick={() => { setSelectedSubBox(idx); setSelectedPlan(null); setBundle({ startup: null, extra: null }); }}
                                        >
                                            {sub.label}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {packages.length > 0 &&
                                (selectedDigitalMarketingCategory === "Package Basis" ? (
                                    <PackageBasisRow
                                        packages={packages}
                                        onSelectPlan={handleSelectPlan}
                                        bundle={bundle}
                                        isBundleMode={isBundleMode}
                                        selectedPlan={selectedPlan}
                                    />
                                ) : (
                                    <PlanComparisonRow
                                        plans={packages}
                                        features={features}
                                        startupPlan={startupPlan}
                                        bundle={bundle}
                                        isBundleMode={isBundleMode}
                                        selectedPlan={selectedPlan}
                                        onSelectPlan={handleSelectPlan}
                                        className={centerRow}
                                    />
                                ))
                            }

                            {/* Bundle summary when in Startup mode */}
                            {isBundleMode && (
                                <div className="bundle-summary">
                                    <div className="bundle-items">
                                        <div className="bundle-chip">
                                            <span className="chip-label">Startup</span>
                                            <span className="chip-value">{bundle.startup ? bundle.startup.name : "Not selected"}</span>
                                        </div>
                                        <div className="bundle-chip">
                                            <span className="chip-label">+ Any Package</span>
                                            <span className="chip-value">{bundle.extra ? bundle.extra.name : "Optional"}</span>
                                        </div>
                                    </div>
                                    <div className="bundle-total">
                                        <span>Total</span>
                                        <strong>${totalBundlePrice}</strong>
                                    </div>
                                </div>
                            )}

                            <button onClick={handleNext} className="next-button">
                                Next
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default PricingPage;
