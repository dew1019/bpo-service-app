import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./HomePage";
import PricingPage from "./PricingPage";
import AddOnsPage from "./AddOnsPage";
import SummaryPage from "./SummaryPage";
import AgreementForm from "./AgreementForm";

// ADD THESE
import SignClient from "./pages/SignClient";
import SignDirector from "./pages/SignDirector";

export default function App() {
    const [selectedService, setSelectedService] = useState(null);
    const [selectedSubBox, setSelectedSubBox] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedAddOns, setSelectedAddOns] = useState([]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                    path="/pricing"
                    element={
                        <PricingPage
                            selectedService={selectedService}
                            setSelectedService={setSelectedService}
                            selectedSubBox={selectedSubBox}
                            setSelectedSubBox={setSelectedSubBox}
                            selectedPlan={selectedPlan}
                            setSelectedPlan={setSelectedPlan}
                            setSelectedAddOns={setSelectedAddOns}
                        />
                    }
                />
                <Route
                    path="/addons"
                    element={
                        <AddOnsPage
                            selectedService={selectedService}
                            selectedPlan={selectedPlan}
                            selectedAddOns={selectedAddOns}
                            setSelectedAddOns={setSelectedAddOns}
                        />
                    }
                />
                <Route path="/summary" element={<SummaryPage />} />
                <Route path="/agreement-form" element={<AgreementForm />} />

                {/* SIGNING ROUTES */}
                <Route path="/sign/:token" element={<SignClient />} />
                <Route path="/sign-director/:token" element={<SignDirector />} />

                {/* helpful 404 */}
                <Route path="*" element={<div style={{padding:24}}>404 – no route matched</div>} />
            </Routes>
        </Router>
    );
}
