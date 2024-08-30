document.addEventListener("DOMContentLoaded", function () {

  if(localStorage.getItem('username') !== 'iamgraphicdesign'){
    window.location.href = 'index.html';  
  }
  const navLinks = document.querySelectorAll("nav a:not(.logout)"); // Exclude logout links
  const contentSections = document.querySelectorAll(".content-section");
  const themeToggleButton = document.getElementById("theme-toggle");

  // Check for saved user preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.classList.add(savedTheme);
    updateIcon(savedTheme);
  } else {
    document.body.classList.add("dark-mode");
    updateIcon("dark-mode");
  }

  // Toggle theme
  themeToggleButton.addEventListener("click", function () {
    if (document.body.classList.contains("dark-mode")) {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light-mode");
      updateIcon("light-mode");
    } else {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark-mode");
      updateIcon("dark-mode");
    }
  });

  // Update icon based on theme
  function updateIcon(theme) {
    const moonIcon = themeToggleButton.querySelector(".fa-moon");
    const sunIcon = themeToggleButton.querySelector(".fa-sun");
    if (theme === "dark-mode") {
      moonIcon.style.display = "inline";
      sunIcon.style.display = "none";
    } else {
      moonIcon.style.display = "none";
      sunIcon.style.display = "inline";
    }
  }

  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
  
      const contentId = this.getAttribute("data-content");
      
      // Check if the clicked link has the id="board"
      if (this.getAttribute("id") === "board") {
        // Do nothing, return early
        return;
      }
  
      // Remove active class from all content sections
      contentSections.forEach(section => {
        section.classList.remove("active");
      });
  
      // Remove active class from all nav links
      navLinks.forEach(navLink => {
        navLink.classList.remove("active");
      });
  
      // Add active class to the clicked link
      this.classList.add("active");
  
      // Show the corresponding content section
      if (contentId) {
        const contentSection = document.getElementById(contentId);
        if (contentSection) {
          contentSection.classList.add("active");
        }
      }
    });
  });
  
});

document.addEventListener('DOMContentLoaded', function() {
  const themeSelect = document.getElementById('theme');
  const saveButton = document.getElementById('save-settings');

  // Load saved settings from localStorage
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.classList.toggle('light-mode', savedTheme === 'light');
  themeSelect.value = savedTheme;

  // Save settings on button click
  saveButton.addEventListener('click', function() {
    const theme = themeSelect.value;
    localStorage.setItem('theme', theme);

    // Apply theme
    document.body.classList.toggle('light-mode', theme === 'light');

    alert('Settings saved successfully!');
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // Accordion functionality
  const accordions = document.querySelectorAll('.accordion-title');

  accordions.forEach(accordion => {
    accordion.addEventListener('click', function() {
      const content = this.nextElementSibling;
      content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });
  });

  // Form submission
  const helpForm = document.getElementById('help-form');
  helpForm.addEventListener('submit', function(event) {
    event.preventDefault();
    // You can add form submission logic here
    alert('Your message has been sent!');
    helpForm.reset();
  });
});
function updateText1(){
  const diaplayText= document.getElementById('progress3');
  diaplayText.textContent=`50% progress`;

  const button = document.getElementById('updateButton');
  button.disabled=true;
}
function updateText2(){
  const diaplayText= document.getElementById('progress3');
  diaplayText.textContent=`100% progress`;

  const button = document.getElementById('updateButton');
  button.disabled=true;
}

function logout(){
  localStorage.removeItem('username');
  window.location.href= 'index.html';
}

document.querySelectorAll('.shorthead').forEach(function(header) {
  header.addEventListener('click', function() {
    const details = header.nextElementSibling;
    const arrow = header.querySelector('.arrow');

    if (details.style.display === "block") {
      details.style.display = "none";
      arrow.classList.remove('rotate');
    } else {
      details.style.display = "block";
      arrow.classList.add('rotate');
    }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const videoPopup = document.getElementById("videoPopup");
  const popupVideo = document.getElementById("popupVideo");
  const closePopup = document.querySelector(".close-popup");

  // Function to open the video in a fullscreen popup
  document.querySelectorAll(".vdo2").forEach((video) => {
    video.addEventListener("click", function () {
      popupVideo.src = this.src;
      videoPopup.style.display = "flex";
      popupVideo.play();
    });
  });

  // Function to close the popup
  function closePopupFn() {
    videoPopup.style.display = "none";
    popupVideo.pause();
    popupVideo.src = ""; // Clear the source to stop the video
  }

  closePopup.addEventListener("click", closePopupFn);

  // Close popup when clicking outside the video
  videoPopup.addEventListener("click", function (event) {
    if (event.target === videoPopup) {
      closePopupFn();
    }
  });

  // Close popup when pressing the 'Esc' key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closePopupFn();
    }
  });
});


// document.getElementById("continueButton").addEventListener("click", function() {
//   window.location.href = "videos.html"; // Replace with your videos page URL
// });
document.addEventListener("click", function(event) {
  if (event.target && event.target.id === "continueBtn") {
    const currentActiveSection = document.querySelector(".content-section.active");
    const targetSectionId = event.target.getAttribute("data-target");
    const targetSection = document.getElementById(targetSectionId);

    if (currentActiveSection) {
      currentActiveSection.classList.remove("active");
    }

    if (targetSection) {
      // Show the target section
      targetSection.classList.add("active");
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  }
});

