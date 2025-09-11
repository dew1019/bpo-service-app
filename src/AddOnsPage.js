import React from "react";
import { useNavigate } from "react-router-dom";
import "./addones.css";


const addOnsByService = {
    BookKeeping: [
        { name: "S1 Add-on 1", price: 50, imageUrl: "https://via.placeholder.com/150/FF5733/FFFFFF?text=AddOn1" },
        { name: "S1 Add-on 2", price: 80, imageUrl: "https://via.placeholder.com/150/33FF57/FFFFFF?text=AddOn2" },
    ],
    CPA: [
        { name: "S2 Add-on 1", price: 70, imageUrl: "https://via.placeholder.com/150/3357FF/FFFFFF?text=AddOn3" },
        { name: "S2 Add-on 2", price: 110, imageUrl: "https://via.placeholder.com/150/FF33A1/FFFFFF?text=AddOn4" },
    ],
    VA: [
        { name: "S3 Add-on 1", price: 60, imageUrl: "https://via.placeholder.com/150/A133FF/FFFFFF?text=AddOn5" },
        { name: "S3 Add-on 2", price: 90, imageUrl: "https://via.placeholder.com/150/33FFA1/FFFFFF?text=AddOn6" },
    ],
    "Digital Marketing": [
        {
            name: "Social Media Post",
            price: 30,
            imageUrl:
                "https://videos.openai.com/vg-assets/assets%2Ftask_01k0dzrxp9e5gb1w06z1xr0dj1%2F1752816257_img_0_thumb.webp?st=2025-09-05T00%3A57%3A09Z&se=2025-09-11T01%3A57%3A09Z&sks=b&skt=2025-09-05T00%3A57%3A09Z&ske=2025-09-11T01%3A57%3A09Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=5e5fc900-07cf-43e7-ab5b-314c0d877bb0&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=WDlOk%2F2XzPF%2Fx9uZpqkOX6DolU%2BnHTrGKeU%2Ft7mrwVc%3D&az=oaivgprodscus",
        },
        {
            name: "Video",
            price: 60,
            imageUrl:
                "https://videos.openai.com/vg-assets/assets%2Ftask_01k0e04v0qebkvnwm7kqeqzmha%2F1752816692_img_0_thumb.webp?st=2025-09-05T00%3A57%3A09Z&se=2025-09-11T01%3A57%3A09Z&sks=b&skt=2025-09-05T00%3A57%3A09Z&ske=2025-09-11T01%3A57%3A09Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=5e5fc900-07cf-43e7-ab5b-314c0d877bb0&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=NZzc2l60FUBfTnaXS9BMjZ7IJpCcFWPER9AbidvktXY%3D&az=oaivgprodscus",
        },
        {
            name: "Email Campaign with 1 Flyer",
            price: 40,
            imageUrl:
                "https://videos.openai.com/vg-assets/assets%2Ftask_01k0e0a92eeaxr2ekv645hcw0s%2F1752816870_img_0_thumb.webp?st=2025-09-05T00%3A57%3A09Z&se=2025-09-11T01%3A57%3A09Z&sks=b&skt=2025-09-05T00%3A57%3A09Z&ske=2025-09-11T01%3A57%3A09Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=5e5fc900-07cf-43e7-ab5b-314c0d877bb0&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=sSvqvtaagFFS0V68NHCVXJ0JClbYVK74jHmfEdwmhms%3D&az=oaivgprodscus",
        },
        {
            name: "Blog Post",
            price: 40,
            imageUrl:
                "https://videos.openai.com/vg-assets/assets%2Ftask_01k0e0feyseg08a032z62nx0c4%2F1752817044_img_0_thumb.webp?st=2025-09-05T00%3A57%3A09Z&se=2025-09-11T01%3A57%3A09Z&sks=b&skt=2025-09-05T00%3A57%3A09Z&ske=2025-09-11T01%3A57%3A09Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=5e5fc900-07cf-43e7-ab5b-314c0d877bb0&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=N29r%2BnOT5Q7hxqs5VsiRsYqpkolNj8gqqoh4t0YV%2FMA%3D&az=oaivgprodscus",
        },
    ],
};

function AddOnsPage({ selectedService, selectedPlan, selectedAddOns, setSelectedAddOns }) {
    const navigate = useNavigate();

    // If user jumps here directly, send them back
    if (!selectedService || !selectedPlan) {
        navigate("/pricing");
        return null;
    }

    const availableAddOns = addOnsByService[selectedService] || [];

    const toggleAddOn = (addon) => {
        const exists = selectedAddOns.some((a) => a.name === addon.name);
        if (exists) {
            setSelectedAddOns(selectedAddOns.filter((a) => a.name !== addon.name));
        } else {
            setSelectedAddOns([...selectedAddOns, addon]);
        }
    };

    const handleBack = () => navigate("/pricing");

    // ⬇️ EXACTLY like your original summary step (no totals UI here)
    const handleViewSummary = () => {
        const clientInfo = JSON.parse(localStorage.getItem("clientInfo")) || {};
        const total =
            (selectedPlan?.price || 0) +
            selectedAddOns.reduce((sum, a) => sum + a.price, 0);

        const summaryData = {
            ...clientInfo,
            service: selectedService,
            plan: selectedPlan,
            addOns: selectedAddOns,
            total,
        };

        localStorage.setItem("summaryData", JSON.stringify(summaryData));
        navigate("/summary");
    };

    return (
        <div className="addonPage">



            <div className="addons-intro-container">
                <h1 className="addons-heading">Add-ons for {selectedService}</h1>
                <p className="addons-description">
                    Pick extra items to personalize your package. Tap a card to add or remove it.
                </p>

                <div className="addons-list">
                    {availableAddOns.map((addon) => {
                        const selected = selectedAddOns.some((a) => a.name === addon.name);
                        return (
                            <div
                                key={addon.name}
                                className={`addon-card ${selected ? "selected" : ""}`}
                                onClick={() => toggleAddOn(addon)}
                            >
                                {/* top-right select dot */}
                                <span className={`select-dot ${selected ? "on" : ""}`} />

                                <div className="addon-visual-content">
                                    <div className="addon-image-container">
                                        <img src={addon.imageUrl} alt={addon.name} className="addon-image" />
                                    </div>
                                    <div className="addon-info">
                                        <h3 className="addon-name">{addon.name}</h3>
                                        <p className="addon-price">${addon.price}</p>
                                    </div>
                                </div>

                                {selected ? (
                                    <button className="remove-btn" onClick={(e) => { e.stopPropagation(); toggleAddOn(addon); }}>
                                        Remove
                                    </button>
                                ) : (
                                    <button className="add-btn" onClick={(e) => { e.stopPropagation(); toggleAddOn(addon); }}>
                                        Add on
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Only the two actions, no totals UI */}
                <div className="addon-actions">
                    <button onClick={handleBack}>Back</button>
                    <button onClick={handleViewSummary}>View Summary</button>
                </div>
            </div>
        </div>
    );
}

export default AddOnsPage;
