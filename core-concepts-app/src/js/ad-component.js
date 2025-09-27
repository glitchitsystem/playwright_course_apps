// GDPR Compliant Ad Component
class AdComponent {
  constructor() {
    this.consentKey = "ad-consent";
    this.cookiesKey = "cookies-accepted";
    this.consentExpiry = 30; // days
    this.googleAdClient = "ca-pub-0000000000000000"; // Replace with your AdSense ID

    this.init();
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.setupEventListeners();
      this.checkConsentStatus();
      this.showConsentBannerIfNeeded();
    });
  }

  setupEventListeners() {
    // Consent button in ad placeholder
    const consentBtn = document.getElementById("consent-ads");
    if (consentBtn) {
      consentBtn.addEventListener("click", () => this.grantAdConsent());
    }

    // Cookie banner buttons
    const acceptBtn = document.getElementById("accept-cookies");
    const rejectBtn = document.getElementById("reject-cookies");
    const manageBtn = document.getElementById("manage-cookies");

    if (acceptBtn) {
      acceptBtn.addEventListener("click", () => this.acceptAllCookies());
    }
    if (rejectBtn) {
      rejectBtn.addEventListener("click", () => this.rejectCookies());
    }
    if (manageBtn) {
      manageBtn.addEventListener("click", () => this.showCookieSettings());
    }

    // Privacy policy page specific buttons
    const changeConsentBtn = document.getElementById("change-consent");
    if (changeConsentBtn) {
      changeConsentBtn.addEventListener("click", () =>
        this.showConsentOptions()
      );
    }
  }

  checkConsentStatus() {
    const consent = this.getStoredConsent();
    const cookiesAccepted = localStorage.getItem(this.cookiesKey);

    // Check if user has given ad consent either directly or through "Accept All"
    if ((consent && consent.ads) || cookiesAccepted === "true") {
      this.loadGoogleAds();
    } else {
      this.showAdPlaceholder();
    }
  }

  showConsentBannerIfNeeded() {
    const consent = this.getStoredConsent();
    const cookiesAccepted = localStorage.getItem(this.cookiesKey);

    // Show banner if no consent decision has been made
    if (!consent && !cookiesAccepted) {
      setTimeout(() => {
        this.showCookieBanner();
      }, 2000); // Show banner after 2 seconds
    }
  }

  getStoredConsent() {
    try {
      const stored = localStorage.getItem(this.consentKey);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.warn("Failed to parse consent data:", e);
      return null;
    }
  }

  storeConsent(consentData) {
    const consent = {
      ...consentData,
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem(this.consentKey, JSON.stringify(consent));
    } catch (e) {
      console.warn("Failed to store consent:", e);
    }
  }

  isConsentExpired(timestamp) {
    const expiry = this.consentExpiry * 24 * 60 * 60 * 1000; // Convert to milliseconds
    return Date.now() - timestamp > expiry;
  }

  grantAdConsent() {
    // Grant ad consent specifically
    this.storeConsent({ ads: true, analytics: false });
    localStorage.setItem(this.cookiesKey, "ads-only");
    this.loadGoogleAds();
    this.hideCookieBanner();
    this.showNotification(
      "Ads enabled! Thank you for supporting us.",
      "success"
    );
  }

  acceptAllCookies() {
    // Accept all cookies including ads and analytics
    this.storeConsent({ ads: true, analytics: true, functional: true });
    localStorage.setItem(this.cookiesKey, "true");
    this.loadGoogleAds();
    this.hideCookieBanner();
    this.showNotification("All cookies accepted", "success");
  }

  rejectCookies() {
    // Only allow essential cookies
    this.storeConsent({ ads: false, analytics: false, functional: true });
    localStorage.setItem(this.cookiesKey, "false");
    this.showAdPlaceholder();
    this.hideCookieBanner();
    this.showNotification("Only essential cookies enabled", "info");
  }

  showCookieSettings() {
    alert(
      `Cookie Settings:\n\n• Essential: Always enabled (required for site function)\n• Analytics: Track usage patterns\n• Advertising: Show personalized ads\n\nUse Accept/Reject buttons to set preferences.`
    );
  }

  showConsentOptions() {
    // Remove existing modal if it exists
    const existingModal = document.getElementById("consent-modal");
    if (existingModal) {
      existingModal.remove();
    }

    // Create a modal-like consent interface
    const modal = document.createElement("div");
    modal.id = "consent-modal";
    modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

    const modalContent = document.createElement("div");
    modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;

    const currentConsent = this.getConsentStatus();

    modalContent.innerHTML = `
            <h3 style="margin-top: 0; color: #333;">Cookie Preferences</h3>
            <div style="margin: 20px 0;">
                <h4 style="color: #555;">Current Settings:</h4>
                <p>🍪 Essential: Always enabled</p>
                <p>📊 Analytics: ${
                  currentConsent.analytics ? "Enabled" : "Disabled"
                }</p>
                <p>📢 Advertising: ${
                  currentConsent.ads ? "Enabled" : "Disabled"
                }</p>
            </div>
            <div style="margin: 20px 0;">
                <h4 style="color: #555;">Choose your preferences:</h4>
                <div style="margin: 15px 0;">
                    <button data-action="accept-all" class="btn ${
                      currentConsent.ads && currentConsent.analytics
                        ? "btn-success"
                        : "btn-outline"
                    } style="margin: 5px;">Accept All</button>
                    <button data-action="ads-only" class="btn ${
                      currentConsent.ads && !currentConsent.analytics
                        ? "btn-success"
                        : "btn-outline"
                    } style="margin: 5px;">Ads Only</button>
                    <button data-action="reject-all" class="btn ${
                      !currentConsent.ads && !currentConsent.analytics
                        ? "btn-success"
                        : "btn-outline"
                    } style="margin: 5px;">Essential Only</button>
                </div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button data-action="close" class="btn btn-outline">Close</button>
            </div>
        `;

    modal.appendChild(modalContent);

    // Use event delegation - attach listeners before adding to DOM
    modalContent.addEventListener("click", (e) => {
      const action = e.target.getAttribute("data-action");
      if (!action) return;

      e.preventDefault();
      e.stopPropagation();

      switch (action) {
        case "accept-all":
          this.acceptAllCookies();
          this.updateModalContent(modal);
          break;
        case "ads-only":
          this.grantAdConsent();
          this.updateModalContent(modal);
          break;
        case "reject-all":
          this.rejectCookies();
          this.updateModalContent(modal);
          break;
        case "close":
          this.closeModal(modal);
          break;
      }
    });

    document.body.appendChild(modal);
  }

  closeModal(modal) {
    if (modal && modal.parentElement) {
      modal.remove();
    }

    // Update consent status display if on privacy page
    const statusElement = document.getElementById("consent-status");
    if (statusElement) {
      this.showCurrentConsentStatus();
    }
  }

  showCurrentConsentStatus() {
    const statusElement = document.getElementById("consent-status");
    if (!statusElement) return;

    const consent = this.getConsentStatus();

    let status = "Current Cookie Preferences:<br><br>";
    status += `• Essential Cookies: Always enabled<br>`;
    status += `• Advertising Cookies: ${
      consent.ads
        ? '<span style="color: green;">Enabled</span>'
        : '<span style="color: red;">Disabled</span>'
    }<br>`;
    status += `• Analytics Cookies: ${
      consent.analytics
        ? '<span style="color: green;">Enabled</span>'
        : '<span style="color: red;">Disabled</span>'
    }<br>`;

    statusElement.innerHTML = `<div class="info" style="margin-top: 15px; padding: 15px; border-radius: 4px; background-color: #d1ecf1; border: 1px solid #bee5eb;">
            ${status}
        </div>`;
  }

  loadGoogleAds() {
    const adContainer = document.getElementById("ad-container");
    const placeholder = document.getElementById("ad-placeholder");
    const adSlot = document.getElementById("google-ad-slot");

    if (placeholder) placeholder.style.display = "none";
    if (adSlot) adSlot.style.display = "block";

    // Add status indicator
    this.addAdStatus("consent", "Ads Enabled");

    // Load Google AdSense (demo version - replace with actual implementation)
    this.loadDemoAd();
  }

  loadDemoAd() {
    const adSlot = document.getElementById("google-ad-slot");
    if (!adSlot) return;

    // Demo ad content (replace with actual Google AdSense code)
    adSlot.innerHTML = `
            <div style="
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, #007bff, #28a745);
                color: white;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                padding: 10px;
                box-sizing: border-box;
            ">
                <h4 style="margin: 0 0 10px 0; font-size: 14px;">Demo Ad</h4>
                <p style="margin: 0; font-size: 12px; line-height: 1.3;">
                    This is where your Google Ad would appear after implementing AdSense
                </p>
                <small style="margin-top: 10px; opacity: 0.8; font-size: 10px;">
                    Advertisement
                </small>
            </div>
        `;
  }

  showAdPlaceholder() {
    const placeholder = document.getElementById("ad-placeholder");
    const adSlot = document.getElementById("google-ad-slot");

    if (placeholder) placeholder.style.display = "flex";
    if (adSlot) adSlot.style.display = "none";

    this.addAdStatus("no-consent", "Consent Required");
  }

  addAdStatus(statusClass, statusText) {
    const adContainer = document.getElementById("ad-container");
    if (!adContainer) return;

    // Remove existing status
    const existingStatus = adContainer.querySelector(".ad-status");
    if (existingStatus) {
      existingStatus.remove();
    }

    // Add new status
    const statusDiv = document.createElement("div");
    statusDiv.className = `ad-status ${statusClass}`;
    statusDiv.textContent = statusText;
    adContainer.appendChild(statusDiv);
  }

  showCookieBanner() {
    const banner = document.getElementById("cookie-banner");
    if (banner) {
      banner.style.display = "block";
    } else {
      // If no banner exists, show the consent options modal
      this.showConsentOptions();
    }
  }

  hideCookieBanner() {
    const banner = document.getElementById("cookie-banner");
    if (banner) {
      banner.style.display = "none";
    }
  }

  showNotification(message, type = "info") {
    // Use existing notification system if available
    if (window.CoreConcepts && window.CoreConcepts.showNotification) {
      window.CoreConcepts.showNotification(message, type);
    } else if (window.showNotification) {
      window.showNotification(message, type);
    } else {
      // Fallback notification
      console.log(`${type.toUpperCase()}: ${message}`);

      // Simple fallback visual notification
      const notification = document.createElement("div");
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #007bff;
        color: white;
        padding: 1rem;
        border-radius: 4px;
        z-index: 1000;
      `;
      notification.textContent = message;
      document.body.appendChild(notification);

      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 3000);
    }
  }

  // Public method to check current consent status
  getConsentStatus() {
    const consent = this.getStoredConsent();
    const cookiesAccepted = localStorage.getItem(this.cookiesKey);

    return {
      ads: (consent && consent.ads) || cookiesAccepted === "true",
      analytics: (consent && consent.analytics) || cookiesAccepted === "true",
      essential: true,
      cookiesAccepted: cookiesAccepted,
    };
  }

  // Public method to clear all consent
  clearAllConsent() {
    localStorage.removeItem(this.consentKey);
    localStorage.removeItem(this.cookiesKey);
    this.showAdPlaceholder();
    this.showConsentBannerIfNeeded();
  }

  updateModalContent(modal) {
    const modalContent = modal.querySelector("div");
    if (!modalContent) return;

    const currentConsent = this.getConsentStatus();

    modalContent.innerHTML = `
            <h3 style="margin-top: 0; color: #333;">Cookie Preferences</h3>
            <div style="margin: 20px 0;">
                <h4 style="color: #555;">Current Settings:</h4>
                <p>🍪 Essential: Always enabled</p>
                <p>📊 Analytics: ${
                  currentConsent.analytics
                    ? '<span style="color: green;">Enabled</span>'
                    : '<span style="color: red;">Disabled</span>'
                }</p>
                <p>📢 Advertising: ${
                  currentConsent.ads
                    ? '<span style="color: green;">Enabled</span>'
                    : '<span style="color: red;">Disabled</span>'
                }</p>
            </div>
            <div style="margin: 20px 0;">
                <h4 style="color: #555;">Choose your preferences:</h4>
                <div style="margin: 15px 0;">
                    <button data-action="accept-all" class="btn ${
                      currentConsent.ads && currentConsent.analytics
                        ? "btn-success"
                        : "btn-outline"
                    }" style="margin: 5px;">Accept All</button>
                    <button data-action="ads-only" class="btn ${
                      currentConsent.ads && !currentConsent.analytics
                        ? "btn-success"
                        : "btn-outline"
                    }" style="margin: 5px;">Ads Only</button>
                    <button data-action="reject-all" class="btn ${
                      !currentConsent.ads && !currentConsent.analytics
                        ? "btn-success"
                        : "btn-outline"
                    }" style="margin: 5px;">Essential Only</button>
                </div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button data-action="close" class="btn btn-outline">Close</button>
            </div>
        `;

    // Re-attach event listeners after updating content
    modalContent.addEventListener("click", (e) => {
      const action = e.target.getAttribute("data-action");
      if (!action) return;

      e.preventDefault();
      e.stopPropagation();

      switch (action) {
        case "accept-all":
          this.acceptAllCookies();
          this.updateModalContent(modal);
          break;
        case "ads-only":
          this.grantAdConsent();
          this.updateModalContent(modal);
          break;
        case "reject-all":
          this.rejectCookies();
          this.updateModalContent(modal);
          break;
        case "close":
          this.closeModal(modal);
          break;
      }
    });
  }
}

// Initialize the ad component and make it globally available
const adComponent = new AdComponent();
window.AdComponent = adComponent;
