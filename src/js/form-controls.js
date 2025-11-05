class FormControlsApp {
  constructor() {
    this.selectedSkills = new Set();
    this.currentDate = new Date();
    this.technologies = [
      "JavaScript",
      "TypeScript",
      "Python",
      "Java",
      "C#",
      "React",
      "Angular",
      "Vue.js",
      "Node.js",
      "Express",
      "Django",
      "Spring Boot",
      "ASP.NET",
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "Redis",
      "Docker",
      "Kubernetes",
      "AWS",
      "Azure",
      "Playwright",
      "Selenium",
      "Jest",
      "Cypress",
    ];
    this.locations = [
      "New York",
      "Los Angeles",
      "Chicago",
      "Houston",
      "Phoenix",
      "Philadelphia",
      "San Antonio",
      "San Diego",
      "Dallas",
      "San Jose",
      "Austin",
      "Jacksonville",
      "London",
      "Paris",
      "Berlin",
      "Madrid",
      "Rome",
      "Amsterdam",
      "Vienna",
      "Tokyo",
      "Sydney",
      "Toronto",
      "Vancouver",
      "Montreal",
    ];
    this.cityData = {
      us: ["New York", "Los Angeles", "Chicago", "Houston", "Miami"],
      uk: ["London", "Manchester", "Birmingham", "Liverpool", "Leeds"],
      ca: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
      au: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
      de: ["Berlin", "Munich", "Hamburg", "Cologne", "Frankfurt"],
      fr: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice"],
    };

    this.init();
  }

  init() {
    this.setupCustomCalendar();
    this.setupCustomDropdown();
    this.setupDynamicSelect();
    this.setupAutosuggest();
    this.setupFormSubmission();
  }

  // Custom Calendar Implementation
  setupCustomCalendar() {
    const calendarInput = document.getElementById("custom-calendar");
    const calendarPopup = document.getElementById("calendar-popup");
    const prevButton = document.getElementById("prev-month");
    const nextButton = document.getElementById("next-month");
    const currentMonthSpan = document.getElementById("current-month");
    const calendarGrid = document.getElementById("calendar-grid");

    calendarInput.addEventListener("click", () => {
      calendarPopup.style.display =
        calendarPopup.style.display === "none" ? "block" : "none";
      if (calendarPopup.style.display === "block") {
        this.renderCalendar();
      }
    });

    prevButton.addEventListener("click", () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.renderCalendar();
    });

    nextButton.addEventListener("click", () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.renderCalendar();
    });

    // Close calendar when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !calendarInput.contains(e.target) &&
        !calendarPopup.contains(e.target)
      ) {
        calendarPopup.style.display = "none";
      }
    });
  }

  renderCalendar() {
    const currentMonthSpan = document.getElementById("current-month");
    const calendarGrid = document.getElementById("calendar-grid");

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    currentMonthSpan.textContent = `${this.currentDate.toLocaleDateString(
      "en-US",
      { month: "long" }
    )} ${year}`;

    // Clear previous calendar
    calendarGrid.innerHTML = "";

    // Add day headers
    const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayHeaders.forEach((day) => {
      const dayHeader = document.createElement("div");
      dayHeader.textContent = day;
      dayHeader.className = "calendar-day-header";
      dayHeader.style.fontWeight = "bold";
      dayHeader.style.background = "#ecf0f1";
      calendarGrid.appendChild(dayHeader);
    });

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Add previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      const dayElement = document.createElement("div");
      dayElement.textContent = daysInPrevMonth - i;
      dayElement.className = "calendar-day other-month";
      calendarGrid.appendChild(dayElement);
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement("div");
      dayElement.textContent = day;
      dayElement.className = "calendar-day";
      dayElement.dataset.testid = `calendar-day-${day}`;

      dayElement.addEventListener("click", () => {
        const selectedDate = new Date(year, month, day);
        const formattedDate = selectedDate.toISOString().split("T")[0];
        document.getElementById("custom-calendar").value = formattedDate;
        document.getElementById("calendar-popup").style.display = "none";

        // Remove previous selection
        document
          .querySelectorAll(".calendar-day.selected")
          .forEach((el) => el.classList.remove("selected"));
        dayElement.classList.add("selected");
      });

      calendarGrid.appendChild(dayElement);
    }

    // Add next month's leading days
    const totalCells = calendarGrid.children.length - 7; // Subtract day headers
    const remainingCells = 42 - totalCells; // 6 rows * 7 days
    for (let day = 1; day <= remainingCells; day++) {
      const dayElement = document.createElement("div");
      dayElement.textContent = day;
      dayElement.className = "calendar-day other-month";
      calendarGrid.appendChild(dayElement);
    }
  }

  // Custom Dropdown Implementation
  setupCustomDropdown() {
    const trigger = document.getElementById("skills-trigger");
    const menu = document.getElementById("skills-menu");
    const selectedSkillsSpan = document.getElementById("selected-skills");
    const options = menu.querySelectorAll(".dropdown-option");

    trigger.addEventListener("click", () => {
      menu.style.display = menu.style.display === "none" ? "block" : "none";
    });

    options.forEach((option) => {
      option.addEventListener("click", () => {
        const value = option.dataset.value;

        if (this.selectedSkills.has(value)) {
          this.selectedSkills.delete(value);
          option.classList.remove("selected");
        } else {
          this.selectedSkills.add(value);
          option.classList.add("selected");
        }

        this.updateSelectedSkillsDisplay();
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!trigger.contains(e.target) && !menu.contains(e.target)) {
        menu.style.display = "none";
      }
    });
  }

  updateSelectedSkillsDisplay() {
    const selectedSkillsSpan = document.getElementById("selected-skills");
    if (this.selectedSkills.size === 0) {
      selectedSkillsSpan.textContent = "Select skills";
    } else {
      selectedSkillsSpan.textContent = Array.from(this.selectedSkills).join(
        ", "
      );
    }
  }

  // Dynamic Select Implementation
  setupDynamicSelect() {
    const countrySelect = document.getElementById("country-select");
    const citySelect = document.getElementById("city-select");

    countrySelect.addEventListener("change", (e) => {
      const selectedCountry = e.target.value;

      citySelect.innerHTML = '<option value="">Choose a city</option>';

      if (selectedCountry && this.cityData[selectedCountry]) {
        citySelect.disabled = false;
        this.cityData[selectedCountry].forEach((city) => {
          const option = document.createElement("option");
          option.value = city.toLowerCase().replace(/\s+/g, "-");
          option.textContent = city;
          citySelect.appendChild(option);
        });
      } else {
        citySelect.disabled = true;
        citySelect.innerHTML = '<option value="">Select country first</option>';
      }
    });
  }

  // Autosuggest Implementation
  setupAutosuggest() {
    this.setupAutosuggestField(
      "technology-search",
      "suggestions-list",
      this.technologies
    );
    this.setupAutosuggestField(
      "location-search",
      "location-suggestions",
      this.locations
    );
  }

  setupAutosuggestField(inputId, suggestionsId, dataSource) {
    const input = document.getElementById(inputId);
    const suggestionsList = document.getElementById(suggestionsId);
    let currentFocus = -1;

    input.addEventListener("input", (e) => {
      const value = e.target.value.toLowerCase();
      suggestionsList.innerHTML = "";
      currentFocus = -1;

      if (value.length < 2) {
        suggestionsList.style.display = "none";
        return;
      }

      const filteredData = dataSource
        .filter((item) => item.toLowerCase().includes(value))
        .slice(0, 8); // Limit to 8 suggestions

      if (filteredData.length === 0) {
        suggestionsList.style.display = "none";
        return;
      }

      filteredData.forEach((item, index) => {
        const suggestionItem = document.createElement("div");
        suggestionItem.className = "suggestion-item";
        suggestionItem.dataset.testid = `suggestion-${item
          .toLowerCase()
          .replace(/\s+/g, "-")}`;
        suggestionItem.textContent = item;

        suggestionItem.addEventListener("click", () => {
          input.value = item;
          suggestionsList.style.display = "none";
        });

        suggestionsList.appendChild(suggestionItem);
      });

      suggestionsList.style.display = "block";
    });

    input.addEventListener("keydown", (e) => {
      const suggestions = suggestionsList.querySelectorAll(".suggestion-item");

      if (e.key === "ArrowDown") {
        e.preventDefault();
        currentFocus =
          currentFocus < suggestions.length - 1 ? currentFocus + 1 : 0;
        this.updateAutosuggestFocus(suggestions, currentFocus);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        currentFocus =
          currentFocus > 0 ? currentFocus - 1 : suggestions.length - 1;
        this.updateAutosuggestFocus(suggestions, currentFocus);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (currentFocus >= 0 && suggestions[currentFocus]) {
          input.value = suggestions[currentFocus].textContent;
          suggestionsList.style.display = "none";
        }
      } else if (e.key === "Escape") {
        suggestionsList.style.display = "none";
        currentFocus = -1;
      }
    });

    // Close suggestions when clicking outside
    document.addEventListener("click", (e) => {
      if (!input.contains(e.target) && !suggestionsList.contains(e.target)) {
        suggestionsList.style.display = "none";
      }
    });
  }

  updateAutosuggestFocus(suggestions, focusIndex) {
    suggestions.forEach((item, index) => {
      if (index === focusIndex) {
        item.classList.add("highlighted");
      } else {
        item.classList.remove("highlighted");
      }
    });
  }

  // Form Submission
  setupFormSubmission() {
    const form = document.getElementById("test-form");
    const resultsDiv = document.getElementById("form-results");
    const resultsContent = document.getElementById("results-content");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = {};

      // Regular form data
      for (let [key, value] of formData.entries()) {
        if (data[key]) {
          if (Array.isArray(data[key])) {
            data[key].push(value);
          } else {
            data[key] = [data[key], value];
          }
        } else {
          data[key] = value;
        }
      }

      // Add custom dropdown data
      data.skills = Array.from(this.selectedSkills);

      resultsContent.textContent = JSON.stringify(data, null, 2);
      resultsDiv.style.display = "block";
      resultsDiv.scrollIntoView({ behavior: "smooth" });
    });

    form.addEventListener("reset", () => {
      this.selectedSkills.clear();
      this.updateSelectedSkillsDisplay();
      document.getElementById("city-select").disabled = true;
      document.getElementById("city-select").innerHTML =
        '<option value="">Select country first</option>';
      resultsDiv.style.display = "none";

      // Clear custom dropdown selections
      document.querySelectorAll(".dropdown-option.selected").forEach((el) => {
        el.classList.remove("selected");
      });
    });
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new FormControlsApp();
});
