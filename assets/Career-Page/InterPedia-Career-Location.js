
    document.addEventListener("DOMContentLoaded", function () {
        if (window.location.pathname === "/p/careers.html") {
            // Apply the style only on this page
            let style = document.createElement("style");
            style.innerHTML = `
            .container {
	width: 100% !important;
}

.home-title__subtitle {
	text-align: center;
	line-height: 32px;
	font-size: 22px;
	font-weight: 400;
	max-width: 980px;
	margin: auto auto 10px;
}


.post-inner-area {
	background: none;
	border: none;
	border-radius: 0;
	padding: 0;
}


.static_page .item-post h1.entry-title {
	display: none;
}

.career-hero-text p {
	color: var(--text-font-color) !important;
}

.benefits-grid .benefit-card p {
    color: #6b7280 !important;
}

.positions-grid .position-card p{
	color: #373385 !important;
}

.process-timeline .process-step h3 {
    color: var(--theme-text-color) !important;
}

.faq-item .faq-answer p{
	color: #373385 !important;
}


@media (max-width: 768px) {

	.static_page .item-post h1.entry-title {
		margin: 0px;
		font-size: 24px;
		line-height: 34px;
	}



	.home-title__subtitle {
		line-height: 25px;
		font-size: 15px;
		font-weight: 100;
	}
}
        `;
            document.head.appendChild(style);
        }
    });
