document.addEventListener("DOMContentLoaded", function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll("nav ul li a");

    // Loop through each navigation link
    navLinks.forEach(function(link) {
        // Add click event listener to each link
        link.addEventListener("click", function(event) {
            // Prevent default link behavior
            event.preventDefault();

            // Get the href attribute of the clicked link
            const href = this.getAttribute("href");

            // Navigate to the corresponding page
            window.location.href = href;
        });
    });
});
