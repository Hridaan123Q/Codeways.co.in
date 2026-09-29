// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Simple intersection observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply initial styles and observe cards
document.querySelectorAll('.card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.1}s`;
    observer.observe(card);
});

// Helper for robust copying
function fallbackCopyTextToClipboard(text, onSuccess, onError) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        var successful = document.execCommand('copy');
        if(successful) onSuccess();
        else if(onError) onError();
    } catch (err) {
        if(onError) onError();
    }
    document.body.removeChild(textArea);
}

function copyText(text, onSuccess, onError) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text, onSuccess, onError);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        onSuccess();
    }, function(err) {
        fallbackCopyTextToClipboard(text, onSuccess, onError);
    });
}

// Function to copy discord ID to clipboard
function copyDiscord(element, event) {
    event.preventDefault();
    const discordId = "Hridaan123q7400";

    copyText(discordId, () => {
        const originalText = element.innerHTML;

        // Change text temporarily to show feedback
        if (element.querySelector('span')) {
            element.querySelector('span').innerText = "Copied ID!";
        } else {
            element.innerHTML = `<i class="fa-brands fa-discord"></i> Copied ID!`;
        }

        // Reset after 2 seconds
        setTimeout(() => {
            element.innerHTML = originalText;
        }, 2000);
    }, () => {
        alert("Failed to copy automatically. Our Discord ID is: Hridaan123q7400");
    });
}

// Toast Notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Remove after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 4000);
}

// Modal Logic
const modal = document.getElementById("orderModal");
let currentServiceType = '';

function openModal(e, serviceType) {
    e.preventDefault();
    currentServiceType = serviceType;
    modal.style.display = "flex";

    const titleSpan = document.querySelector("#modal-title .gradient-text");
    const formContent = document.getElementById("dynamic-form-content");

    // Reset contact method specific fields
    document.getElementById("customer-name").value = "";
    document.getElementById("customer-email").value = "";
    document.getElementById("customer-discord").value = "";
    document.getElementById("contact-method").value = "discord";
    document.getElementById("discord-handle-group").style.display = "block";

    // Handle contact method toggle
    document.getElementById("contact-method").addEventListener("change", function() {
        const discordGroup = document.getElementById("discord-handle-group");
        if (this.value === "discord") {
            discordGroup.style.display = "block";
        } else {
            discordGroup.style.display = "none";
        }
    });

    if (serviceType === 'website') {
        titleSpan.innerText = "Website";
        formContent.innerHTML = `
            <p class="form-desc">Tell us about your website requirements.</p>
            <div class="form-group">
                <label>Website Type</label>
                <select id="website-type">
                    <option value="Landing Page">Landing Page</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Portfolio">Portfolio</option>
                    <option value="Custom">Custom Web App</option>
                </select>
            </div>
            <div class="form-group">
                <label>Description & Requirements</label>
                <textarea id="service-details" rows="3" placeholder="Pages needed, design ideas, features..."></textarea>
            </div>
        `;
    } else if (serviceType === 'app') {
        titleSpan.innerText = "Mobile App";
        formContent.innerHTML = `
            <p class="form-desc">What kind of mobile app do you need?</p>
            <div class="form-group">
                <label>Platform</label>
                <select id="app-platform">
                    <option value="Android">Android</option>
                    <option value="iOS">iOS</option>
                    <option value="Cross-Platform (Both)">Cross-Platform (Both)</option>
                </select>
            </div>
            <div class="form-group">
                <label>App Features & Description</label>
                <textarea id="service-details" rows="3" placeholder="Core features, target audience..."></textarea>
            </div>
        `;
    } else if (serviceType === 'bot') {
        titleSpan.innerText = "Discord Bot";
        formContent.innerHTML = `
            <p class="form-desc">Describe your perfect Discord Bot.</p>
            <div class="form-group">
                <label>Primary Bot Function</label>
                <select id="bot-type">
                    <option value="Moderation">Moderation</option>
                    <option value="Economy/Games">Economy/Games</option>
                    <option value="Utility/Tickets">Utility/Tickets</option>
                    <option value="All-in-One Custom">All-in-One Custom</option>
                </select>
            </div>
            <div class="form-group">
                <label>Detailed Features</label>
                <textarea id="service-details" rows="3" placeholder="Specific commands, APIs needed..."></textarea>
            </div>
        `;
    } else if (serviceType === 'server') {
        titleSpan.innerText = "MC Server";
        formContent.innerHTML = `
            <div class="modal-tabs" style="margin-top:0;">
                <button class="tab-btn active" id="btn-basic" onclick="switchTab('basic')" type="button">Basic (No Customization)</button>
                <button class="tab-btn" id="btn-custom" onclick="switchTab('custom')" type="button">Customization</button>
            </div>

            <div id="basic-form" class="form-section active">
                <p class="form-desc">Standard Vanilla setup for you and your friends.</p>
                <div class="form-group">
                    <label>Minecraft Edition</label>
                    <select id="mc-edition">
                        <option value="Vanilla">Vanilla (Only option for Basic)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Version</label>
                    <input type="text" id="mc-version" placeholder="e.g. 1.20.4, 1.19.2">
                </div>
            </div>

            <div id="custom-form" class="form-section" style="display: none;">
                <p class="form-desc">Infinite possibilities! Mods, plugins, custom maps, you name it.</p>
                <div class="form-group">
                    <label>What do you want?</label>
                    <textarea id="service-details" rows="3" placeholder="Describe your dream server setup here..."></textarea>
                </div>
            </div>
        `;
        // Reset tab state
        currentTab = 'basic';
    }
}

function closeModal() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

let currentTab = 'basic';
function switchTab(tab) {
    currentTab = tab;

    document.getElementById("btn-basic").classList.remove("active");
    document.getElementById("btn-custom").classList.remove("active");

    document.getElementById("basic-form").style.display = "none";
    document.getElementById("custom-form").style.display = "none";

    if(tab === 'basic') {
        document.getElementById("btn-basic").classList.add("active");
        document.getElementById("basic-form").style.display = "block";
    } else {
        document.getElementById("btn-custom").classList.add("active");
        document.getElementById("custom-form").style.display = "block";
    }
}

function processOrder(btn) {
    const name = document.getElementById("customer-name").value.trim();
    const email = document.getElementById("customer-email").value.trim();
    const contactMethod = document.getElementById("contact-method").value;
    const discordHandle = document.getElementById("customer-discord") ? document.getElementById("customer-discord").value.trim() : "";

    if (!name || !email) {
        showToast("Please enter your Name and Email ID!", "error");
        return;
    }

    if (contactMethod === "discord" && !discordHandle) {
        showToast("Please enter your Discord Handle!", "error");
        return;
    }

    // Prepare the order details dynamically based on service
    let orderDetails = "";

    if (currentServiceType === 'website') {
        const type = document.getElementById("website-type").value;
        const details = document.getElementById("service-details").value || "No extra details";
        orderDetails = `Service: Website\nType: ${type}\nDetails: ${details}`;
    } else if (currentServiceType === 'app') {
        const platform = document.getElementById("app-platform").value;
        const details = document.getElementById("service-details").value || "No extra details";
        orderDetails = `Service: Mobile App\nPlatform: ${platform}\nDetails: ${details}`;
    } else if (currentServiceType === 'bot') {
        const type = document.getElementById("bot-type").value;
        const details = document.getElementById("service-details").value || "No extra details";
        orderDetails = `Service: Discord Bot\nType: ${type}\nDetails: ${details}`;
    } else if (currentServiceType === 'server') {
        if (currentTab === 'basic') {
            const version = document.getElementById("mc-version").value || "Latest";
            orderDetails = `Service: Minecraft Server (Basic)\nEdition: Vanilla\nVersion: ${version}`;
        } else {
            const details = document.getElementById("service-details").value || "No details provided.";
            orderDetails = `Service: Minecraft Server (Custom)\nDetails: ${details}`;
        }
    }

    orderDetails += `\n\nPreferred Contact: ${contactMethod}`;
    if(contactMethod === "discord") {
        orderDetails += `\nDiscord Handle: ${discordHandle}`;
    }

    // Set up autoresponse message according to user request
    const autoResponseMessage = `Hello ${name},\n\nWe have got your email; we will respond soon...\n\nWe will discuss your ${currentServiceType} project via ${contactMethod === 'discord' ? 'Discord (' + discordHandle + ')' : 'Email'} as you requested.\nAfter finalising the details, we will handle the payment and start making it for you.\n\nBest Regards,\nCodeways Team`;

    const ogText = btn.innerText;
    btn.innerText = "Sending Order...";
    btn.disabled = true;
    btn.style.opacity = "0.7";

    fetch("https://formsubmit.co/ajax/codeways.co.in@gmail.com", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            message: orderDetails,
            _subject: `New ${currentServiceType.toUpperCase()} Order from ${name}!`,
            _autoresponse: autoResponseMessage,
            _replyto: email
        })
    })
    .then(response => response.json())
    .then(data => {
        btn.innerText = "Order Submitted!";
        btn.style.background = "var(--neon-green)";
        btn.style.opacity = "1";
        btn.style.color = "#000";

        setTimeout(() => {
            showToast(`Thank you, ${name}! Your order was received. Check your email for our automated response.`, 'success');
            btn.innerText = ogText;
            btn.style.background = "";
            btn.style.color = "";
            btn.disabled = false;

            closeModal();
        }, 1500);
    })
    .catch(error => {
        console.error(error);
        showToast("Error submitting your order. Please contact us directly.", "error");
        btn.innerText = ogText;
        btn.disabled = false;
        btn.style.opacity = "1";
    });
}
