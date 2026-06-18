(function () {
  "use strict";

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetId = link.getAttribute("href");
      if (targetId === "#") return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Download buttons placeholder
  document.querySelectorAll("[data-download]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var type = btn.getAttribute("data-download");
      var labels = {
        brochure: "Brochure",
        "fact-sheet": "Fact Sheet",
        "floor-plans": "Floor Plans"
      };
      // Map download types to PDF URLs (relative to site root)
      var urls = {
        brochure: "src/1428-Brickell-Brochure-68b8d620120fc.pdf",
        "fact-sheet": "src/1428_Mini Booklet Fact Sheet-68b71bbe8e4b1.pdf",
        "floor-plans": "src/floorplans all-68b71b5d49d5c.pdf"
      };

      var url = urls[type];
      if (!url) {
        alert((labels[type] || "Document") + " download is not configured. Add your PDF URLs in production.");
        return;
      }

      // Create a temporary link to trigger download
      try {
        var a = document.createElement("a");
        a.href = encodeURI(url);
        a.setAttribute("download", "");
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (e) {
        // Fallback: open in new tab
        window.open(url, "_blank");
      }
    });
  });

  // Weather widget + live clock
  var timeEl = document.getElementById("weather-time");
  var tempEl = document.getElementById("weather-temp");

  function updateClock() {
    if (!timeEl) return;
    // Show time for Miami (Eastern Time) regardless of user's local timezone
    var now = new Date();
    var options = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "America/New_York"
    };
    try {
      timeEl.textContent = new Intl.DateTimeFormat("en-US", options).format(now) + " ET";
    } catch (e) {
      // Fallback to local formatting if Intl API fails
      timeEl.textContent = now.toLocaleString("en-US", options);
    }
  }

  function fetchWeather() {
    if (!tempEl) return;
    // Request Miami current temperature in Fahrenheit
    fetch("https://api.open-meteo.com/v1/forecast?latitude=25.7617&longitude=-80.1918&current_weather=true&temperature_unit=fahrenheit&hourly=temperature_2m")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        // open-meteo returns current_weather.temperature for current_weather=true
        var temp = null;
        if (data.current_weather && data.current_weather.temperature != null) temp = data.current_weather.temperature;
        // fallback to hourly temperature_2m latest value
        if (temp == null && data.hourly && data.hourly.temperature_2m && data.hourly.temperature_2m.length) {
          temp = data.hourly.temperature_2m[data.hourly.temperature_2m.length - 1];
        }
        if (temp != null) {
          tempEl.textContent = Math.round(temp) + "°F";
        }
      })
      .catch(function () {
        tempEl.textContent = "90°F";
      });
  }

  updateClock();
  fetchWeather();
  setInterval(updateClock, 60000);

  // Populate country select with flags and dialing codes
  (function populateCountries() {
    var countrySelect = document.getElementById('countryCode');
    if (!countrySelect) return;

    // Minimal but broad country list with ISO2, name and dial code
    var countries = [
      {name: 'United States', iso2: 'US', dial_code: '+1'},
      {name: 'Canada', iso2: 'CA', dial_code: '+1'},
      {name: 'United Kingdom', iso2: 'GB', dial_code: '+44'},
      {name: 'Australia', iso2: 'AU', dial_code: '+61'},
      {name: 'France', iso2: 'FR', dial_code: '+33'},
      {name: 'Germany', iso2: 'DE', dial_code: '+49'},
      {name: 'Spain', iso2: 'ES', dial_code: '+34'},
      {name: 'Italy', iso2: 'IT', dial_code: '+39'},
      {name: 'Brazil', iso2: 'BR', dial_code: '+55'},
      {name: 'Mexico', iso2: 'MX', dial_code: '+52'},
      {name: 'Argentina', iso2: 'AR', dial_code: '+54'},
      {name: 'Colombia', iso2: 'CO', dial_code: '+57'},
      {name: 'Chile', iso2: 'CL', dial_code: '+56'},
      {name: 'Peru', iso2: 'PE', dial_code: '+51'},
      {name: 'India', iso2: 'IN', dial_code: '+91'},
      {name: 'China', iso2: 'CN', dial_code: '+86'},
      {name: 'Japan', iso2: 'JP', dial_code: '+81'},
      {name: 'South Korea', iso2: 'KR', dial_code: '+82'},
      {name: 'South Africa', iso2: 'ZA', dial_code: '+27'},
      {name: 'Nigeria', iso2: 'NG', dial_code: '+234'},
      {name: 'Egypt', iso2: 'EG', dial_code: '+20'},
      {name: 'Morocco', iso2: 'MA', dial_code: '+212'},
      {name: 'Saudi Arabia', iso2: 'SA', dial_code: '+966'},
      {name: 'United Arab Emirates', iso2: 'AE', dial_code: '+971'},
      {name: 'Israel', iso2: 'IL', dial_code: '+972'},
      {name: 'Russia', iso2: 'RU', dial_code: '+7'},
      {name: 'Netherlands', iso2: 'NL', dial_code: '+31'},
      {name: 'Sweden', iso2: 'SE', dial_code: '+46'},
      {name: 'Norway', iso2: 'NO', dial_code: '+47'},
      {name: 'Denmark', iso2: 'DK', dial_code: '+45'},
      {name: 'Switzerland', iso2: 'CH', dial_code: '+41'},
      {name: 'Belgium', iso2: 'BE', dial_code: '+32'},
      {name: 'Portugal', iso2: 'PT', dial_code: '+351'},
      {name: 'Greece', iso2: 'GR', dial_code: '+30'},
      {name: 'Turkey', iso2: 'TR', dial_code: '+90'},
      {name: 'Poland', iso2: 'PL', dial_code: '+48'},
      {name: 'Ireland', iso2: 'IE', dial_code: '+353'},
      {name: 'New Zealand', iso2: 'NZ', dial_code: '+64'},
      {name: 'Singapore', iso2: 'SG', dial_code: '+65'},
      {name: 'Malaysia', iso2: 'MY', dial_code: '+60'},
      {name: 'Indonesia', iso2: 'ID', dial_code: '+62'},
      {name: 'Philippines', iso2: 'PH', dial_code: '+63'},
      {name: 'Thailand', iso2: 'TH', dial_code: '+66'}
    ];

    function iso2ToFlag(iso) {
      // Create emoji flag from ISO2
      return iso.toUpperCase().replace(/./g, function(c){ return String.fromCodePoint(127397 + c.charCodeAt()); });
    }

    countries.forEach(function(c){
      var opt = document.createElement('option');
      opt.value = c.dial_code;
      opt.textContent = iso2ToFlag(c.iso2) + ' ' + c.name + ' ' + c.dial_code;
      countrySelect.appendChild(opt);
    });
  })();

  // Form validation
  var form = document.getElementById("inquiry-form");
  if (!form) return;

  var successEl = document.getElementById("form-success");

  function showError(groupId, errorId, message) {
    var group = document.getElementById(groupId);
    var error = document.getElementById(errorId);
    if (group) group.classList.add("form-group--error");
    if (error) error.textContent = message;
  }

  function clearErrors() {
    form.querySelectorAll(".form-group--error").forEach(function (g) {
      g.classList.remove("form-group--error");
    });
    form.querySelectorAll(".form-error").forEach(function (e) {
      e.textContent = "";
    });
    if (successEl) successEl.classList.remove("is-visible");
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();
    var valid = true;

    var typeChecked = form.querySelector('input[name="type"]:checked');
    if (!typeChecked) {
      showError("group-type", "error-type", "Please select Buyer or Realtor.");
      valid = false;
    }

    var firstName = document.getElementById("firstName");
    if (!firstName.value.trim()) {
      showError("group-firstName", "error-firstName", "First name is required.");
      valid = false;
    }

    var lastName = document.getElementById("lastName");
    if (!lastName.value.trim()) {
      showError("group-lastName", "error-lastName", "Last name is required.");
      valid = false;
    }

    var email = document.getElementById("email");
    if (!email.value.trim()) {
      showError("group-email", "error-email", "Email is required.");
      valid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showError("group-email", "error-email", "Please enter a valid email address.");
      valid = false;
    }

    var phone = document.getElementById("phone");
    if (!phone.value.trim()) {
      showError("group-phone", "error-phone", "Phone number is required.");
      valid = false;
    }

    var consent = document.getElementById("consent");
    if (!consent.checked) {
      showError("group-consent", "error-consent", "You must agree to be contacted.");
      valid = false;
    }

    if (valid) {
      // Gather form data
      var comments = document.getElementById("comments");
      var countryCode = document.getElementById("countryCode");

      var payload = {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        email: email.value.trim(),
        phone: (countryCode ? countryCode.value : "") + " " + phone.value.trim(),
        comments: comments ? comments.value.trim() : ""
      };

      // Disable submit while sending
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      fetch('/api/fub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          return res.json().then(function (data) { return { ok: res.ok, status: res.status, data: data }; });
        })
        .then(function (result) {
          if (submitBtn) submitBtn.disabled = false;
          if (result.ok) {
            if (successEl) {
              successEl.classList.add("is-visible");
              successEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
            form.reset();
          } else {
            // Show detailed error message for debugging (server returns `error` and `details`)
            var errMsg = 'Submission failed.';
            if (result.data) {
              if (result.data.error) errMsg = result.data.error;
              if (result.data.details) {
                try {
                  var d = result.data.details;
                  // If details has a message field, append it
                  if (d.message) errMsg += ' ' + d.message;
                  else errMsg += ' ' + JSON.stringify(d);
                } catch (e) {
                  errMsg += ' (could not parse error details)';
                }
              }
            }
            alert(errMsg);
          }
        })
        .catch(function () {
          if (submitBtn) submitBtn.disabled = false;
          alert('Submission failed. Please check your connection and try again.');
        });
    }
  });

  // Header blur on scroll
  (function headerScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    function onScroll() {
      if (window.scrollY > 20) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    // initialize
    onScroll();
  })();
})();
