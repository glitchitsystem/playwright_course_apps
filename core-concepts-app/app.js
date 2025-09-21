// Shared JavaScript functionality for the Core Concepts app

document.addEventListener("DOMContentLoaded", function () {
  // Add active navigation highlighting
  updateActiveNavigation();

  // Add page load analytics for learning purposes
  trackPageLoad();

  // Initialize common UI features
  initializeCommonFeatures();
});

function updateActiveNavigation() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach((link) => {
    link.classList.remove("active");
    const linkPage = link.getAttribute("href");

    if (
      linkPage === currentPage ||
      (currentPage === "" && linkPage === "index.html")
    ) {
      link.classList.add("active");
    }
  });
}

function trackPageLoad() {
  const pageName = document.title;
  const loadTime = performance.now();

  console.log(
    `📊 Page Analytics: ${pageName} loaded in ${loadTime.toFixed(2)}ms`
  );

  // Store for potential test verification
  window.pageLoadData = {
    page: pageName,
    loadTime: loadTime,
    timestamp: new Date().toISOString(),
  };
}

function initializeCommonFeatures() {
  // Add smooth scrolling to anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Add keyboard navigation support
  document.addEventListener("keydown", function (e) {
    // ESC key to clear notifications
    if (e.key === "Escape") {
      clearNotifications();
    }
  });
}

function clearNotifications() {
  const notifications = document.querySelectorAll(".notification");
  notifications.forEach((notification) => {
    notification.remove();
  });
}

// Utility function for showing notifications (used across pages)
function showNotification(message, type = "info", duration = 3000) {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background:none;border:none;color:white;margin-left:1rem;cursor:pointer;">&times;</button>
    `;

  // Add to page
  document.body.appendChild(notification);

  // Position the notification
  const notifications = document.querySelectorAll(".notification");
  const offset = (notifications.length - 1) * 70;
  notification.style.cssText = `
        position: fixed;
        top: ${20 + offset}px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1000;
        display: flex;
        align-items: center;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;

  // Auto-remove after duration
  if (duration > 0) {
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = "slideOut 0.3s ease-out";
        setTimeout(() => notification.remove(), 300);
      }
    }, duration);
  }
}

function getNotificationColor(type) {
  const colors = {
    info: "#17a2b8",
    success: "#28a745",
    warning: "#ffc107",
    error: "#dc3545",
  };
  return colors[type] || colors.info;
}

// Add CSS for notification animations
const notificationStyles = document.createElement("style");
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Export functions for use in other scripts
window.CoreConcepts = {
  showNotification,
  clearNotifications,
  trackPageLoad,
};
