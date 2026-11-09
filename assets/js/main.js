/* ==========================================================================
   Karim Boulad — Portfolio interactions
   Vanilla JavaScript. No dependencies.
   ========================================================================== */
(function () {
    "use strict";

    document.documentElement.classList.add("js");

    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var header = document.getElementById("site-header");
    var nav = document.getElementById("primary-nav");
    var navToggle = document.getElementById("nav-toggle");
    var toTop = document.getElementById("to-top");
    var navLinks = Array.prototype.slice.call(
        document.querySelectorAll('.nav a[href^="#"]')
    );

    var navSections = navLinks
        .map(function (link) {
            var id = link.getAttribute("href");
            return id && id.length > 1 ? document.querySelector(id) : null;
        })
        .filter(Boolean);

    /* ------------------------------------------------------------------
       Mobile navigation
       ------------------------------------------------------------------ */
    function setNav(open) {
        if (!nav || !navToggle) return;
        nav.classList.toggle("is-open", open);
        navToggle.setAttribute("aria-expanded", open ? "true" : "false");
        navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        document.body.classList.toggle("nav-open", open);
    }

    function closeNav() {
        setNav(false);
    }

    if (navToggle && nav) {
        navToggle.addEventListener("click", function () {
            setNav(!nav.classList.contains("is-open"));
        });

        nav.addEventListener("click", function (event) {
            if (event.target.closest("a")) closeNav();
        });

        document.addEventListener("click", function (event) {
            if (!nav.classList.contains("is-open")) return;
            if (event.target.closest("#primary-nav") || event.target.closest("#nav-toggle")) return;
            closeNav();
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") closeNav();
        });

        var desktopQuery = window.matchMedia("(min-width: 841px)");
        if (typeof desktopQuery.addEventListener === "function") {
            desktopQuery.addEventListener("change", function (event) {
                if (event.matches) closeNav();
            });
        }
    }

    /* ------------------------------------------------------------------
       Scroll state: header, active section, back-to-top
       ------------------------------------------------------------------ */
    var ticking = false;

    function updateScrollUI() {
        var y = window.scrollY || document.documentElement.scrollTop;

        if (header) {
            header.classList.toggle("is-scrolled", y > 12);
        }

        if (toTop) {
            toTop.classList.toggle("is-visible", y > 650);
        }

        if (navSections.length) {
            var offset = y + (header ? header.offsetHeight : 76) + 130;
            var current = navSections[0];

            navSections.forEach(function (section) {
                if (section.offsetTop <= offset) current = section;
            });

            // Near the bottom of the page, highlight the last section.
            if (window.innerHeight + y >= document.body.offsetHeight - 8) {
                current = navSections[navSections.length - 1];
            }

            navLinks.forEach(function (link) {
                link.classList.toggle(
                    "is-active",
                    current && link.getAttribute("href") === "#" + current.id
                );
            });
        }

        // Case study sidebar navigation.
        var caseLinks = document.querySelectorAll('.case-nav a[href^="#"]');
        if (caseLinks.length) {
            var caseOffset = y + 180;
            var activeId = null;

            caseLinks.forEach(function (link) {
                var target = document.querySelector(link.getAttribute("href"));
                if (target && target.offsetTop <= caseOffset) {
                    activeId = target.id;
                }
            });

            caseLinks.forEach(function (link) {
                link.classList.toggle(
                    "is-active",
                    link.getAttribute("href") === "#" + activeId
                );
            });
        }

        ticking = false;
    }

    function onScroll() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(updateScrollUI);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateScrollUI();

    if (toTop) {
        toTop.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? "auto" : "smooth"
            });
        });
    }

    /* ------------------------------------------------------------------
       Reveal on scroll
       ------------------------------------------------------------------ */
    var revealElements = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

    revealElements.forEach(function (element) {
        var parent = element.parentElement;
        if (!parent) return;

        var siblings = Array.prototype.filter.call(parent.children, function (child) {
            return child.classList.contains("reveal");
        });

        var index = siblings.indexOf(element);
        if (index > 0) {
            element.style.setProperty("--reveal-delay", Math.min(index, 6) * 70 + "ms");
        }
    });

    if (!prefersReducedMotion && "IntersectionObserver" in window) {
        var revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
        );

        var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        revealElements.forEach(function (element) {
            var rect = element.getBoundingClientRect();

            // Show anything already in (or above) the first screen immediately.
            if (rect.top < viewportHeight * 0.95) {
                element.classList.add("is-visible");
            } else {
                revealObserver.observe(element);
            }
        });
    } else {
        revealElements.forEach(function (element) {
            element.classList.add("is-visible");
        });
    }

    /* ------------------------------------------------------------------
       Animated counters
       ------------------------------------------------------------------ */
    var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));

    function animateCounter(element) {
        var target = parseInt(element.getAttribute("data-count"), 10) || 0;

        if (prefersReducedMotion) {
            element.textContent = String(target);
            return;
        }

        var duration = 1300;
        var startTime = null;

        function step(timestamp) {
            if (startTime === null) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = String(Math.round(target * eased));

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = String(target);
            }
        }

        window.requestAnimationFrame(step);
    }

    if (counters.length) {
        if (!prefersReducedMotion && "IntersectionObserver" in window) {
            var counterObserver = new IntersectionObserver(
                function (entries, observer) {
                    entries.forEach(function (entry) {
                        if (!entry.isIntersecting) return;
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    });
                },
                { threshold: 0.6 }
            );

            counters.forEach(function (counter) {
                counterObserver.observe(counter);
            });
        } else {
            counters.forEach(function (counter) {
                counter.textContent = counter.getAttribute("data-count");
            });
        }
    }

    /* ------------------------------------------------------------------
       Copy email address
       ------------------------------------------------------------------ */
    function copyText(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }

        return new Promise(function (resolve, reject) {
            var helper = document.createElement("textarea");
            helper.value = text;
            helper.setAttribute("readonly", "");
            helper.style.position = "fixed";
            helper.style.opacity = "0";
            document.body.appendChild(helper);
            helper.select();

            try {
                var ok = document.execCommand("copy");
                helper.remove();
                ok ? resolve() : reject();
            } catch (error) {
                helper.remove();
                reject(error);
            }
        });
    }

    Array.prototype.forEach.call(document.querySelectorAll("[data-copy-email]"), function (button) {
        button.addEventListener("click", function () {
            var email = button.getAttribute("data-copy-email");
            var label = button.querySelector("[data-copy-label]");
            if (!email || !label) return;

            copyText(email)
                .then(function () {
                    var original = label.textContent;
                    label.textContent = "Copied!";
                    button.classList.add("is-copied");

                    window.setTimeout(function () {
                        label.textContent = original;
                        button.classList.remove("is-copied");
                    }, 1800);
                })
                .catch(function () {
                    label.textContent = "Copy failed";
                    button.classList.add("is-copy-failed");

                    window.setTimeout(function () {
                        label.textContent = "Copy address";
                        button.classList.remove("is-copy-failed");
                    }, 1800);
                });
        });
    });

    /* ------------------------------------------------------------------
       Footer year
       ------------------------------------------------------------------ */
    Array.prototype.forEach.call(document.querySelectorAll("[data-year]"), function (element) {
        element.textContent = String(new Date().getFullYear());
    });

    /* ------------------------------------------------------------------
       Lightbox (case study gallery)
       ------------------------------------------------------------------ */
    var lightbox = document.getElementById("lightbox");

    if (lightbox) {
        var lightboxImage = document.getElementById("lb-image");
        var lightboxCaption = document.getElementById("lb-caption");
        var lightboxClose = document.getElementById("lb-close");
        var lightboxPrev = document.getElementById("lb-prev");
        var lightboxNext = document.getElementById("lb-next");
        var galleryItems = Array.prototype.slice.call(
            document.querySelectorAll("[data-lightbox]")
        );
        var lightboxIndex = 0;
        var previouslyFocused = null;

        function updateLightbox() {
            var item = galleryItems[lightboxIndex];
            if (!item) return;

            var thumb = item.querySelector("img");
            var full = item.getAttribute("data-full") || (thumb ? thumb.src : "");
            var caption = item.getAttribute("data-caption") || (thumb ? thumb.alt : "");

            if (lightboxImage) {
                lightboxImage.src = full;
                lightboxImage.alt = thumb ? thumb.alt : caption;
            }

            if (lightboxCaption) {
                lightboxCaption.textContent = caption;
            }
        }

        function openLightbox(index) {
            lightboxIndex = index;
            updateLightbox();
            previouslyFocused = document.activeElement;
            lightbox.classList.add("is-open");
            lightbox.setAttribute("aria-hidden", "false");
            document.body.classList.add("lightbox-open");

            if (lightboxClose) lightboxClose.focus();
        }

        function closeLightbox() {
            lightbox.classList.remove("is-open");
            lightbox.setAttribute("aria-hidden", "true");
            document.body.classList.remove("lightbox-open");

            if (previouslyFocused && typeof previouslyFocused.focus === "function") {
                previouslyFocused.focus();
            }
        }

        function showNext(step) {
            if (!galleryItems.length) return;
            lightboxIndex = (lightboxIndex + step + galleryItems.length) % galleryItems.length;
            updateLightbox();
        }

        galleryItems.forEach(function (item, index) {
            item.addEventListener("click", function () {
                openLightbox(index);
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener("click", closeLightbox);
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener("click", function () {
                showNext(-1);
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener("click", function () {
                showNext(1);
            });
        }

        lightbox.addEventListener("click", function (event) {
            if (event.target === lightbox) closeLightbox();
        });

        document.addEventListener("keydown", function (event) {
            if (!lightbox.classList.contains("is-open")) return;

            if (event.key === "Escape") {
                closeLightbox();
            } else if (event.key === "ArrowLeft") {
                showNext(-1);
            } else if (event.key === "ArrowRight") {
                showNext(1);
            }
        });
    }
})();
