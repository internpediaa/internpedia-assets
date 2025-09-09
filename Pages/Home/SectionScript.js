// Wait for the DOM to be fully loaded
            document.addEventListener('DOMContentLoaded', function () {



                const observerOptions = {
                    root: null, // Observe in the viewport
                    rootMargin: "0px",
                    threshold: 0.2 // Trigger when 20% of the icon is visible
                };

                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach((entry, index) => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                entry.target.style.opacity = "1";
                                entry.target.style.transform = "translateY(0)";
                            }, 100 * index); // Staggered effect
                            observer.unobserve(entry.target); // Stop observing once animated
                        }
                    });
                }, observerOptions);

                document.querySelectorAll(".tech-icon-item").forEach(icon => observer.observe(icon));





                // Stats Counter Animation
                const statNumbers = document.querySelectorAll('.stat-number');
                let hasAnimated = false;

                function animateStats() {
                    if (hasAnimated) return;

                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-count'));
                        const duration = 2000; // 2 seconds
                        const step = target / (duration / 16); // 60fps
                        let current = 0;

                        const updateCounter = () => {
                            current += step;
                            if (current < target) {
                                stat.textContent = Math.floor(current);
                                requestAnimationFrame(updateCounter);
                            } else {
                                stat.textContent = target;
                            }
                        };

                        updateCounter();
                    });

                    hasAnimated = true;
                }





                // Trigger animation when stats section is in view
                const statsSection = document.getElementById('stats');

                if (statsSection) {
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                animateStats();
                                observer.unobserve(entry.target);
                            }
                        });
                    }, { threshold: 0.5 });

                    observer.observe(statsSection);
                }

                // Testimonial Carousel
                const testimonialSlides = document.querySelectorAll('.testimonial-slide');
                const dots = document.querySelectorAll('.dot');
                const prevBtn = document.querySelector('.prev-btn');
                const nextBtn = document.querySelector('.next-btn');
                let currentSlide = 0;

                function showSlide(index) {
                    // Hide all slides
                    testimonialSlides.forEach(slide => {
                        slide.classList.remove('active');
                    });

                    // Remove active class from all dots
                    dots.forEach(dot => {
                        dot.classList.remove('active');
                    });

                    // Show the current slide and activate the corresponding dot
                    testimonialSlides[index].classList.add('active');
                    dots[index].classList.add('active');
                }

                if (prevBtn && nextBtn) {
                    // Previous button click
                    prevBtn.addEventListener('click', function () {
                        currentSlide--;
                        if (currentSlide < 0) {
                            currentSlide = testimonialSlides.length - 1;
                        }
                        showSlide(currentSlide);
                    });

                    // Next button click
                    nextBtn.addEventListener('click', function () {
                        currentSlide++;
                        if (currentSlide >= testimonialSlides.length) {
                            currentSlide = 0;
                        }
                        showSlide(currentSlide);
                    });

                    // Dot click
                    dots.forEach((dot, index) => {
                        dot.addEventListener('click', function () {
                            currentSlide = index;
                            showSlide(currentSlide);
                        });
                    });

                    // Auto slide change
                    setInterval(function () {
                        currentSlide++;
                        if (currentSlide >= testimonialSlides.length) {
                            currentSlide = 0;
                        }
                        showSlide(currentSlide);
                    }, 5000); // Change slide every 5 seconds
                }

                // FAQ Accordion
                const faqItems = document.querySelectorAll('.faq-item');

                faqItems.forEach(item => {
                    const question = item.querySelector('.faq-question');

                    question.addEventListener('click', function () {
                        // Close all other items
                        faqItems.forEach(otherItem => {
                            if (otherItem !== item) {
                                otherItem.classList.remove('active');
                            }
                        });

                        // Toggle current item
                        item.classList.toggle('active');

                        // Change icon
                        const icon = this.querySelector('i');
                        if (item.classList.contains('active')) {
                            icon.classList.remove('fa-plus');
                            icon.classList.add('fa-minus');
                        } else {
                            icon.classList.remove('fa-minus');
                            icon.classList.add('fa-plus');
                        }
                    });
                });

                // Form Submission
                const contactForm = document.getElementById('contactForm');
                const newsletterForm = document.getElementById('newsletterForm');

                if (contactForm) {
                    contactForm.addEventListener('submit', function (e) {
                        e.preventDefault();

                        // Get form data
                        const name = document.getElementById('name').value;
                        const email = document.getElementById('email').value;
                        const message = document.getElementById('message').value;

                        // Here you would typically send the data to a server
                        // For demo purposes, we'll just log it and show a success message
                        console.log('Contact Form Submission:', { name, email, message });

                        // Show success message
                        alert('Thank you for your message! We will get back to you soon.');

                        // Reset form
                        contactForm.reset();
                    });
                }

                if (newsletterForm) {
                    newsletterForm.addEventListener('submit', function (e) {
                        e.preventDefault();

                        // Get email
                        const email = this.querySelector('input[type="email"]').value;

                        // Here you would typically send the data to a server
                        console.log('Newsletter Subscription:', email);

                        // Show success message
                        alert('Thank you for subscribing to our newsletter!');

                        // Reset form
                        newsletterForm.reset();
                    });
                }

                // Smooth Scrolling for Anchor Links
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', function (e) {
                        e.preventDefault();

                        const targetId = this.getAttribute('href');
                        if (targetId === '#') return;

                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            // Close mobile menu if open
                            if (navMenu.classList.contains('active')) {
                                navMenu.classList.remove('active');
                                mobileMenuBtn.classList.remove('active');
                            }

                            // Scroll to target
                            targetElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    });
                });


                // Blogger Contact Form Functionality
                const contactFormBlogger = document.querySelector('form[name="contact-form"]');
                const submitButton = document.getElementById('ContactForm1_contact-form-submit');
                const errorMessage = document.getElementById('ContactForm1_contact-form-error-message');
                const successMessage = document.getElementById('ContactForm1_contact-form-success-message');
                const nameInput = document.getElementById('ContactForm1_contact-form-name');
                const emailInput = document.getElementById('ContactForm1_contact-form-email');
                const messageInput = document.getElementById('ContactForm1_contact-form-email-message');

                if (submitButton) {
                    submitButton.addEventListener('click', function () {
                        // Reset messages
                        errorMessage.textContent = '';
                        errorMessage.classList.remove('visible');
                        successMessage.textContent = '';
                        successMessage.classList.remove('visible');

                        // Validate form
                        let isValid = true;

                        if (!nameInput.value.trim()) {
                            isValid = false;
                            errorMessage.textContent = 'Please enter your name.';
                            errorMessage.classList.add('visible');
                            nameInput.focus();
                            return;
                        }

                        if (!emailInput.value.trim()) {
                            isValid = false;
                            errorMessage.textContent = 'Please enter your email address.';
                            errorMessage.classList.add('visible');
                            emailInput.focus();
                            return;
                        }

                        // Simple email validation
                        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailPattern.test(emailInput.value.trim())) {
                            isValid = false;
                            errorMessage.textContent = 'Please enter a valid email address.';
                            errorMessage.classList.add('visible');
                            emailInput.focus();
                            return;
                        }

                        if (!messageInput.value.trim()) {
                            isValid = false;
                            errorMessage.textContent = 'Please enter your message.';
                            errorMessage.classList.add('visible');
                            messageInput.focus();
                            return;
                        }

                        if (isValid) {
                            // Simulate form submission (in a real Blogger implementation, this would be handled by Blogger's system)
                            submitButton.disabled = true;
                            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

                            // Simulate network delay
                            setTimeout(function () {
                                successMessage.textContent = 'Your message has been sent successfully!';
                                successMessage.classList.add('visible');

                                // Reset form
                                contactFormBlogger.reset();

                                // Reset button
                                submitButton.disabled = false;
                                submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                            }, 1500);
                        }
                    });
                }
            }); 
