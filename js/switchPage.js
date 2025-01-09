const projectBtn = document.getElementById('project-btn');
const aboutBtn = document.getElementById('about-btn');
const otherBtn = document.getElementById('other-btn');


// Project Page
projectBtn.addEventListener('click', () => {
  projectBtn.classList.add('active');
  window.open('https://discordrpc-web.has-a.page', '_blank');
});
// About Page
aboutBtn.addEventListener('click', () => {
  aboutBtn.classList.add('active');
  window.open('https://stuffmaker.org', '_blank');
});
//Other Website
otherBtn.addEventListener('click', () => {
  otherBtn.classList.add('active');
  window.open('https://stuffmaker.ch/', '_blank');
});