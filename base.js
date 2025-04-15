let navbar = document.createElement('div');

fetch('../HomePage/navbar.html')
  .then(response => response.text())
  .then(data => {
    navbar.innerHTML = data;
    console.log(navbar.innerHTML);
  });

const container = document.querySelector('.navbar-container');
container.appendChild(navbar);