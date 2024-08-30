document.addEventListener('DOMContentLoaded', (event) => {
    const body = document.body;
    const lightModeButton = document.getElementById('light_button');
    const darkModeButton = document.getElementById('dark_button');

    // Function to apply the theme based on the stored preference
    const applyTheme = (theme) => {
        if (theme === 'dark-mode') {
            body.classList.add('dark-mode');
            lightModeButton.style.display = 'block';
            darkModeButton.style.display = 'none';
        } else {
            body.classList.remove('dark-mode');
            lightModeButton.style.display = 'none';
            darkModeButton.style.display = 'block';
        }
    };


    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    applyTheme(savedTheme);

    const enableDarkMode = () => {
        body.classList.add('dark-mode');
        lightModeButton.style.display = 'block';
        darkModeButton.style.display = 'none';
        localStorage.setItem('theme', 'dark-mode');
    };

    const enableLightMode = () => {
        body.classList.remove('dark-mode');
        lightModeButton.style.display = 'none';
        darkModeButton.style.display = 'block';
        localStorage.setItem('theme', 'light-mode');
    };

    darkModeButton.addEventListener('click', enableDarkMode);
    lightModeButton.addEventListener('click', enableLightMode);
});
