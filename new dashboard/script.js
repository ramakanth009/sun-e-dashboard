document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'iamfullstack' && password === 'hello') {
        localStorage.setItem('username', 'iamfullstack');
        window.location.href = 'fsindex.html';
    } else if
        (username === 'iamdatascience' && password === 'hello') {
        localStorage.setItem('username', 'iamdatascience');
        window.location.href = 'dsindex.html'; // Redirect to home page after successful login    
    }
    else if
        (username === 'iamdigitalmarketing' && password === 'hello') {
        localStorage.setItem('username', 'iamdigitalmarketing');
        window.location.href = 'dmindex.html'; // Redirect to home page after successful login    
    }
    else if
        (username === 'iamgraphicdesign' && password === 'hello') {
        localStorage.setItem('username', 'iamgraphicdesign');
        window.location.href = 'gdindex.html'; // Redirect to home page after successful login    
    }

    else {
        document.getElementById('error-message').style.display = 'block';
    }
});

// JavaScript to toggle between dark and light mode
document.querySelector('.theme-toggle-button').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
});
document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem('username') && localStorage.getItem('username') == 'iamfullstack') {
        window.location.href = 'fsindex.html';
    }
    else if (localStorage.getItem('username') && localStorage.getItem('username') == 'iamdatascience') {
        window.location.href = 'dsindex.html'; // Redirect to home page after successful login
    }
    else if (localStorage.getItem('username') && localStorage.getItem('username') == 'iamdigitalmarketing') {
        window.location.href = 'dmindex.html'; // Redirect to home page after successful login
    }
})