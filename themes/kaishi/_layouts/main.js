"use strict";

document.addEventListener('DOMContentLoaded', function () {
  // Mobile Nav Toggle
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      navMenu.classList.toggle('is-active');
    });
  }

  // Theme Toggle with WCAG AAA accessibility & icon state updates
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    var updateToggleUI = function (theme) {
      themeToggle.setAttribute('aria-pressed', theme === 'dark');
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    };

    var currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    updateToggleUI(currentTheme);

    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'dark';
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateToggleUI(next);
    });
  }
});

/**
 * Class to handle registration of a service worker.
 */
class ServiceWorkerSetup {
  constructor() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        this.registerServiceWorker();
      });
    }
  }

  registerServiceWorker() {
    navigator.serviceWorker
      .register("/sw.js", { scope: "./" })
      .then((registration) => {
        if (!navigator.serviceWorker.controller) return;
        if (registration.waiting) {
          this.updateServiceWorker(registration.waiting);
          return;
        }
        if (registration.installing) {
          this.trackInstallingWorker(registration.installing);
          return;
        }
        registration.addEventListener("updatefound", () => {
          this.trackInstallingWorker(registration.installing);
        });
      })
      .catch((error) => {
        console.error("ServiceWorker registration failed: ", error);
      });

    let refreshing;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      window.location.reload();
      refreshing = true;
    });
  }

  updateServiceWorker(worker) {
    worker.postMessage({ action: "skipWaiting" });
  }

  trackInstallingWorker(worker) {
    worker.addEventListener("statechange", () => {
      if (worker.state === "installed") {
        this.updateServiceWorker(worker);
      }
    });
  }
}

window.serviceWorkerSetup = new ServiceWorkerSetup();
