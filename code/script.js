console.log("hello");
document.addEventListener('DOMContentLoaded', function() {
    // Get all links with the class 'smooth-scroll'
    var smoothScrollLinks = document.querySelectorAll('.smooth-scroll');
  
    // Add smooth scrolling to each smooth scroll link
    smoothScrollLinks.forEach(function(link) {
      link.addEventListener('click', function(event) {
        // Prevent default click behavior
        event.preventDefault();
  
        // Get the target element's ID from the link's href attribute
        var targetId = this.getAttribute('href');
  
        // Scroll smoothly to the target element
        document.querySelector(targetId).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
  });
  