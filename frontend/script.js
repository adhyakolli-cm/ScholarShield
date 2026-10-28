const API_URL = "http://127.0.0.1:8000";

const API_SCAN_URL = `${API_URL}/scan`;

const API_HISTORY_URL = `${API_URL}/history`;


// =========================================================
// 2. DOM HELPER
// =========================================================

function $(selector) {
    return document.querySelector(selector);
}

function $all(selector) {
    return document.querySelectorAll(selector);
}


// =========================================================
// 3. DOM ELEMENTS
// =========================================================

const urlInput = $("#urlInput");
const scanBtn = $("#scanBtn");

const resultBox = $("#result");

const progressBox = $("#progress");
const progressText = $("#progressText");
const progressPct = $("#progressPct");
const progressFill = $("#progressFill");

const verdictIcon = $("#verdictIcon");
const verdictTitle = $("#verdictTitle");
const verdictSub = $("#verdictSub");

const riskScore = $("#riskScore");

const mDomain = $("#mDomain");
const mSSL = $("#mSSL");
const mContent = $("#mContent");
const mFee = $("#mFee");

const deepScan = $("#deepScan");

const chart = $("#chart");

const modal = $("#modal");

const reportBtn = $("#reportBtn");
const reportBtn2 = $("#reportBtn2");

const closeModalBtn = $("#closeModal");
const cancelModalBtn = $("#cancelModal");

const reportForm = $("#reportForm");
const reportUrl = $("#reportUrl");

const toastBox = $("#toast");


// =========================================================
// 4. APPLICATION STATE
// =========================================================

const state = {
    scanning: false,
    lastScan: null,
    scanHistory: [],
    scanCount: 0
};


// =========================================================
// 5. TOAST SYSTEM
// =========================================================

let toastTimer = null;

function toast(message, duration = 2800) {

    if (!toastBox) {
        console.log(message);
        return;
    }

    toastBox.textContent = message;

    toastBox.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toastBox.classList.remove("show");
    }, duration);
}


// =========================================================
// 6. URL NORMALIZATION
// =========================================================

function normalizeUrl(value) {

    if (!value) {
        return "";
    }

    value = value.trim();

    // Add HTTPS if the user did not enter a protocol
    if (!/^https?:\/\//i.test(value)) {
        value = "https://" + value;
    }

    return value;
}


// =========================================================
// 7. URL VALIDATION
// =========================================================

function validateUrl(value) {

    if (!value) {

        return {
            valid: false,
            message: "Please enter a website URL."
        };
    }

    const normalized = normalizeUrl(value);

    try {

        const parsed = new URL(normalized);

        if (
            parsed.protocol !== "http:" &&
            parsed.protocol !== "https:"
        ) {

            return {
                valid: false,
                message: "Only HTTP and HTTPS URLs are supported."
            };
        }

        if (!parsed.hostname) {

            return {
                valid: false,
                message: "Please enter a valid domain."
            };
        }

        return {
            valid: true,
            url: normalized
        };

    } catch (error) {

        return {
            valid: false,
            message: "Please enter a valid URL."
        };
    }
}


// =========================================================
// 8. BUTTON STATE
// =========================================================

function setScanning(isScanning) {

    state.scanning = isScanning;

    if (!scanBtn) {
        return;
    }

    scanBtn.disabled = isScanning;

    if (isScanning) {

        scanBtn.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Scanning';

    } else {

        scanBtn.innerHTML =
            '<i class="fa-solid fa-bolt"></i> Scan';
    }
}


// =========================================================
// 9. PROGRESS SYSTEM
// =========================================================

function resetProgress() {

    if (!progressBox) {
        return;
    }

    progressBox.classList.remove("show");

    if (progressFill) {
        progressFill.style.width = "0%";
    }

    if (progressPct) {
        progressPct.textContent = "0%";
    }

    if (progressText) {
        progressText.textContent =
            "Initializing analysis...";
    }

    $all(".step").forEach(step => {
        step.classList.remove("active");
        step.classList.remove("done");
    });
}


async function runProgressAnimation() {

    if (!progressBox) {
        return;
    }

    progressBox.classList.add("show");

    const steps = [

        {
            id: "s1",
            text: "Resolving DNS & SSL signals...",
            percent: 25
        },

        {
            id: "s2",
            text: "Evaluating domain intelligence...",
            percent: 50
        },

        {
            id: "s3",
            text: "Analyzing page content...",
            percent: 75
        },

        {
            id: "s4",
            text: "Evaluating risk indicators...",
            percent: 92
        }
    ];

    for (const step of steps) {

        if (progressText) {
            progressText.textContent = step.text;
        }

        if (progressPct) {
            progressPct.textContent = `${step.percent}%`;
        }

        if (progressFill) {
            progressFill.style.width =
                `${step.percent}%`;
        }

        $all(".step").forEach(element => {
            element.classList.remove("active");
        });

        const currentStep = $(`#${step.id}`);

        if (currentStep) {
            currentStep.classList.add("active");
        }

        await sleep(300);
    }
}


function finishProgress() {

    if (!progressBox) {
        return;
    }

    if (progressText) {
        progressText.textContent =
            "Analysis complete";
    }

    if (progressPct) {
        progressPct.textContent =
            "100%";
    }

    if (progressFill) {
        progressFill.style.width =
            "100%";
    }

    $all(".step").forEach(step => {

        step.classList.remove("active");

        step.classList.add("done");
    });
}


// =========================================================
// 10. SLEEP HELPER
// =========================================================

function sleep(milliseconds) {

    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}


// =========================================================
// 11. BACKEND HEALTH CHECK
// =========================================================

async function checkBackend() {

    try {

        const response = await fetch(API_URL, {
            method: "GET"
        });

        if (!response.ok) {

            throw new Error(
                `Backend returned ${response.status}`
            );
        }

        const data = await response.json();

        console.log(
            "ScholarShield backend:",
            data
        );

        return true;

    } catch (error) {

        console.error(
            "Backend health check failed:",
            error
        );

        return false;
    }
}


// =========================================================
// 12. REAL SCAN API
// =========================================================

async function scanWebsite(url) {

    console.log(
        "Sending scan request to:",
        API_SCAN_URL
    );

    console.log(
        "URL being scanned:",
        url
    );

    try {

        const response = await fetch(API_SCAN_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },

            body: JSON.stringify({
                url: url
            })
        });


        console.log(
            "Backend response status:",
            response.status
        );


        const responseText =
            await response.text();


        console.log(
            "Backend response:",
            responseText
        );


        if (!response.ok) {

            let message =
                `Backend error ${response.status}`;

            try {

                const errorData =
                    JSON.parse(responseText);

                if (errorData.detail) {
                    message = errorData.detail;
                }

            } catch (error) {

                if (responseText) {
                    message += `: ${responseText}`;
                }
            }

            throw new Error(message);
        }


        let data;

        try {

            data = JSON.parse(responseText);

        } catch (error) {

            throw new Error(
                "Backend returned invalid JSON."
            );
        }


        return data;


    } catch (error) {

        console.error(
            "SCAN REQUEST FAILED:",
            error
        );


        if (
            error instanceof TypeError &&
            error.message === "Failed to fetch"
        ) {

            throw new Error(
                "Cannot connect to ScholarShield backend. Start FastAPI on http://127.0.0.1:8000."
            );
        }


        throw error;
    }
}


// =========================================================
// 13. HISTORY API
// =========================================================

async function getHistory() {

    try {

        const response =
            await fetch(API_HISTORY_URL);


        if (!response.ok) {

            throw new Error(
                `History request failed: ${response.status}`
            );
        }


        const data =
            await response.json();


        state.scanHistory =
            Array.isArray(data)
                ? data
                : [];


        return state.scanHistory;


    } catch (error) {

        console.error(
            "History error:",
            error
        );

        return [];
    }
}


// =========================================================
// 14. RISK LEVEL NORMALIZATION
// =========================================================

function getRiskCategory(score) {

    score = Number(score) || 0;

    if (score >= 80) {
        return "very-high";
    }

    if (score >= 60) {
        return "high";
    }

    if (score >= 30) {
        return "medium";
    }

    return "low";
}


// =========================================================
// 15. RISK DISPLAY
// =========================================================

function updateRiskDisplay(data) {

    const score =
        Number(data.risk_score);

    const level =
        data.risk_level || "Unknown";


    const category =
        getRiskCategory(score);


    let icon =
        "fa-circle-check";

    let color =
        "var(--green)";

    let background =
        "rgba(57,229,140,.12)";


    if (category === "medium") {

        icon =
            "fa-shield-halved";

        color =
            "var(--yellow)";

        background =
            "rgba(255,200,87,.12)";
    }


    if (
        category === "high" ||
        category === "very-high"
    ) {

        icon =
            "fa-triangle-exclamation";

        color =
            "var(--red)";

        background =
            "rgba(255,93,115,.12)";
    }


    if (verdictIcon) {

        verdictIcon.style.background =
            background;

        verdictIcon.style.color =
            color;

        verdictIcon.innerHTML =
            `<i class="fa-solid ${icon}"></i>`;
    }


    if (riskScore) {

        // THIS IS THE REAL BACKEND SCORE
        riskScore.textContent =
            `${score}/100`;

        riskScore.style.color =
            color;
    }


    if (verdictTitle) {

        if (category === "low") {

            verdictTitle.textContent =
                "Low-risk signal profile";

        } else if (category === "medium") {

            verdictTitle.textContent =
                "Suspicious signals detected";

        } else {

            verdictTitle.textContent =
                "High-risk signals detected";
        }
    }


    if (verdictSub) {

        if (category === "low") {

            verdictSub.textContent =
                "Fewer obvious risk indicators were detected.";

        } else if (category === "medium") {

            verdictSub.textContent =
                "Review the detected indicators carefully.";

        } else {

            verdictSub.textContent =
                "Verify independently before sharing information or paying.";
        }
    }


    if (resultBox) {
        resultBox.classList.add("show");
    }


    console.log(
        "REAL RISK SCORE:",
        score
    );

    console.log(
        "RISK LEVEL:",
        level
    );
}


// =========================================================
// 16. DOMAIN METRIC
// =========================================================

function updateDomainMetric(data) {

    if (!mDomain) {
        return;
    }

    const domain =
        data.domain_features || {};


    if (domain.resolved) {

        mDomain.textContent =
            "RESOLVED";

    } else {

        mDomain.textContent =
            "UNRESOLVED";
    }
}


// =========================================================
// 17. SSL METRIC
// =========================================================

function updateSSLMetric(data) {

    if (!mSSL) {
        return;
    }

    const ssl =
        data.ssl_features || {};

    const urlFeatures =
        data.url_features || {};


    if (
        ssl.https_enabled ||
        urlFeatures.https === true
    ) {

        mSSL.textContent =
            "HTTPS";

    } else {

        mSSL.textContent =
            "NO HTTPS";
    }
}


// =========================================================
// 18. CONTENT METRIC
// =========================================================

function updateContentMetric(data) {

    if (!mContent) {
        return;
    }

    const html =
        data.html_features || {};


    let contentRisk = 0;


    if (html.has_login_form) {
        contentRisk += 1;
    }


    if (html.has_payment_form) {
        contentRisk += 2;
    }


    if (html.external_form_action) {
        contentRisk += 2;
    }


    if (
        Number(html.number_of_password_fields) > 0
    ) {

        contentRisk += 1;
    }


    if (contentRisk >= 4) {

        mContent.textContent =
            "HIGH";

    } else if (contentRisk >= 2) {

        mContent.textContent =
            "MEDIUM";

    } else {

        mContent.textContent =
            "LOW";
    }
}


// =========================================================
// 19. FEE METRIC
// =========================================================

function updateFeeMetric(data) {

    if (!mFee) {
        return;
    }

    const html =
        data.html_features || {};

    const factors =
        data.risk_factors || [];


    const hasPayment =
        html.has_payment_form === true;


    const paymentFactor =
        factors.some(factor =>
            String(factor)
                .toLowerCase()
                .includes("payment")
        );


    if (
        hasPayment ||
        paymentFactor
    ) {

        mFee.textContent =
            "REVIEW";

    } else {

        mFee.textContent =
            "LOW";
    }
}


// =========================================================
// 20. UPDATE ALL METRICS
// =========================================================

function updateMetrics(data) {

    updateDomainMetric(data);

    updateSSLMetric(data);

    updateContentMetric(data);

    updateFeeMetric(data);
}


// =========================================================
// 21. DISPLAY RISK FACTORS
// =========================================================

function displayRiskFactors(data) {

    const factors =
        data.risk_factors || [];


    console.log(
        "ScholarShield risk factors:",
        factors
    );


    if (factors.length === 0) {

        toast(
            "No major rule-based risk indicators were returned."
        );

        return;
    }


    toast(
        `${factors.length} risk indicator(s) detected.`,
        3500
    );
}


// =========================================================
// 22. DISPLAY ML INFORMATION
// =========================================================

function displayMLResult(data) {

    const prediction =
        data.ml_prediction;

    const probability =
        data.ml_suspicious_probability;


    console.log(
        "ML prediction:",
        prediction
    );


    console.log(
        "ML model output:",
        probability
    );
}


// =========================================================
// 23. DISPLAY COMPLETE RESULT
// =========================================================

function displayScanResult(data) {

    state.lastScan =
        data;


    updateRiskDisplay(data);

    updateMetrics(data);

    displayRiskFactors(data);

    displayMLResult(data);
}


// =========================================================
// 24. MAIN SCAN FUNCTION
// =========================================================

async function scan() {

    if (state.scanning) {
        return;
    }


    if (!urlInput) {

        console.error(
            "URL input element not found."
        );

        return;
    }


    const validation =
        validateUrl(urlInput.value);


    if (!validation.valid) {

        toast(validation.message);

        urlInput.focus();

        return;
    }


    const url =
        validation.url;


    urlInput.value =
        url;


    setScanning(true);


    if (resultBox) {
        resultBox.classList.remove("show");
    }


    resetProgress();


    try {

        // Start visual progress
        const progressPromise =
            runProgressAnimation();


        // REAL BACKEND REQUEST
        const data =
            await scanWebsite(url);


        // Wait for progress animation
        await progressPromise;


        // Complete progress
        finishProgress();


        // Display REAL backend result
        displayScanResult(data);


        state.scanCount++;


        toast(
            "Scan complete — review the detected signals."
        );


        // Update database history
        await loadHistory();


    } catch (error) {

        console.error(
            "ScholarShield scan error:",
            error
        );


        finishProgress();


        showError(
            error.message ||
            "Unable to complete the website scan."
        );


    } finally {

        setScanning(false);
    }
}


// =========================================================
// 25. ERROR DISPLAY
// =========================================================

function showError(message) {

    if (resultBox) {
        resultBox.classList.add("show");
    }


    if (verdictIcon) {

        verdictIcon.style.background =
            "rgba(255,93,115,.12)";

        verdictIcon.style.color =
            "var(--red)";

        verdictIcon.innerHTML =
            '<i class="fa-solid fa-circle-exclamation"></i>';
    }


    if (verdictTitle) {

        verdictTitle.textContent =
            "Scan could not be completed";
    }


    if (verdictSub) {

        verdictSub.textContent =
            message;
    }


    if (riskScore) {

        riskScore.textContent =
            "--";

        riskScore.style.color =
            "var(--red)";
    }


    if (mDomain) {
        mDomain.textContent = "--";
    }

    if (mSSL) {
        mSSL.textContent = "--";
    }

    if (mContent) {
        mContent.textContent = "--";
    }

    if (mFee) {
        mFee.textContent = "--";
    }


    toast(
        message,
        5000
    );
}


// =========================================================
// 26. EXAMPLE URL BUTTONS
// =========================================================

function setupExampleButtons() {

    $all(".example").forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const url =
                    button.dataset.url;


                if (!url) {
                    return;
                }


                if (urlInput) {

                    urlInput.value =
                        url;
                }


                scan();
            }
        );
    });
}


// =========================================================
// 27. ENTER KEY SUPPORT
// =========================================================

function setupKeyboardShortcuts() {

    if (!urlInput) {
        return;
    }


    urlInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                scan();
            }
        }
    );
}


// =========================================================
// 28. MODAL SYSTEM
// =========================================================

function openModal() {

    if (!modal) {
        return;
    }


    modal.classList.add("show");


    if (reportUrl && urlInput) {

        reportUrl.value =
            urlInput.value;
    }
}


function closeModal() {

    if (!modal) {
        return;
    }


    modal.classList.remove("show");
}


function setupModal() {

    if (reportBtn) {

        reportBtn.addEventListener(
            "click",
            openModal
        );
    }


    if (reportBtn2) {

        reportBtn2.addEventListener(
            "click",
            openModal
        );
    }


    if (closeModalBtn) {

        closeModalBtn.addEventListener(
            "click",
            closeModal
        );
    }


    if (cancelModalBtn) {

        cancelModalBtn.addEventListener(
            "click",
            closeModal
        );
    }


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (event.target === modal) {
                    closeModal();
                }
            }
        );
    }
}


// =========================================================
// 29. REPORT FORM
// =========================================================

function setupReportForm() {

    if (!reportForm) {
        return;
    }


    reportForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            closeModal();


            toast(
                "Threat report captured in this UI prototype."
            );


            reportForm.reset();
        }
    );
}


// =========================================================
// 30. ESC KEY
// =========================================================

function setupEscapeKey() {

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {
                closeModal();
            }
        }
    );
}


// =========================================================
// 31. DASHBOARD CHART
// =========================================================

function createChart() {

    if (!chart) {
        return;
    }


    chart.innerHTML = "";


    const values = [
        48,
        72,
        58,
        91,
        67,
        82,
        64
    ];


    values.forEach(value => {

        const bar =
            document.createElement("div");


        bar.className =
            "bar";


        bar.style.height =
            `${value}%`;


        bar.title =
            `Demo activity level: ${value}%`;


        chart.appendChild(bar);
    });
}


// =========================================================
// 32. LOAD HISTORY
// =========================================================

async function loadHistory() {

    const history =
        await getHistory();


    console.log(
        "Scan history:",
        history
    );


    updateChartFromHistory(
        history
    );
}


// =========================================================
// 33. UPDATE CHART USING HISTORY
// =========================================================

function updateChartFromHistory(history) {

    if (!chart) {
        return;
    }


    if (
        !Array.isArray(history) ||
        history.length === 0
    ) {

        createChart();

        return;
    }


    const recent =
        history
            .slice(0, 7)
            .reverse();


    chart.innerHTML = "";


    recent.forEach(scanData => {

        const bar =
            document.createElement("div");


        bar.className =
            "bar";


        const score =
            Number(scanData.risk_score) || 0;


        const height =
            Math.max(12, score);


        bar.style.height =
            `${height}%`;


        bar.title =
            `${scanData.risk_level || "Unknown"} — ${score}/100`;


        chart.appendChild(bar);
    });
}


// =========================================================
// 34. NAVIGATION ACTIVE STATE
// =========================================================

function setupNavigation() {

    const links =
        $all(".navlinks a");


    links.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                links.forEach(item => {

                    item.classList.remove(
                        "active"
                    );
                });


                link.classList.add(
                    "active"
                );
            }
        );
    });
}


// =========================================================
// 35. DEEP SCAN SWITCH
// =========================================================

function setupDeepScan() {

    if (!deepScan) {
        return;
    }


    deepScan.addEventListener(
        "change",
        () => {

            if (deepScan.checked) {

                toast(
                    "Deep analysis mode enabled."
                );

            } else {

                toast(
                    "Deep analysis mode disabled."
                );
            }
        }
    );
}


// =========================================================
// 36. SCROLL REVEAL
// =========================================================

function setupScrollReveal() {

    const elements =
        $all(".feature, .panel, .stat");


    if (
        !("IntersectionObserver" in window)
    ) {

        return;
    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.style.opacity =
                            "1";

                        entry.target.style.transform =
                            "translateY(0)";


                        observer.unobserve(
                            entry.target
                        );
                    }
                });

            },
            {
                threshold: 0.08
            }
        );


    elements.forEach(element => {

        element.style.opacity =
            "0";

        element.style.transform =
            "translateY(15px)";

        element.style.transition =
            "opacity .5s ease, transform .5s ease";


        observer.observe(element);
    });
}


// =========================================================
// 37. CONNECTION STATUS
// =========================================================

async function initializeConnectionStatus() {

    const online =
        await checkBackend();


    if (online) {

        toast(
            "ScholarShield backend connected."
        );

    } else {

        toast(
            "Backend offline — start FastAPI on port 8000.",
            4500
        );
    }
}


// =========================================================
// 38. SCAN BUTTON
// =========================================================

function setupScanButton() {

    if (!scanBtn) {

        console.error(
            "Scan button #scanBtn was not found."
        );

        return;
    }


    scanBtn.addEventListener(
        "click",
        scan
    );
}


// =========================================================
// 39. INITIALIZE APPLICATION
// =========================================================

async function initializeScholarShield() {

    console.log(
        "===================================="
    );

    console.log(
        "SCHOLARSHIELD AI"
    );

    console.log(
        "Frontend initialized."
    );

    console.log(
        "API:",
        API_URL
    );

    console.log(
        "===================================="
    );


    setupScanButton();

    setupExampleButtons();

    setupKeyboardShortcuts();

    setupModal();

    setupReportForm();

    setupEscapeKey();

    setupNavigation();

    setupDeepScan();

    createChart();

    setupScrollReveal();


    // Check FastAPI
    await initializeConnectionStatus();


    // Load SQLite history
    await loadHistory();


    console.log(
        "ScholarShield initialization complete."
    );
}


// =========================================================
// 40. START APPLICATION
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeScholarShield
);
