const titles = [
    'Python',
    'JavaScript',
    'React',
    'Node.js',
    'Express',
    'MySQL',
    'GNU/Linux',
    'Git',
    'HTML',
    'CSS',
    'TCP/IP',
    'Bash',

];

let titlesIndex = 0;

const changeTitle = function(){
    const title = document.getElementById("title");
    title.textContent = titles[titlesIndex];
    titlesIndex = (titlesIndex + 1) % titles.length;

};

setInterval(changeTitle, 2500);

document.addEventListener('DOMContentLoaded', function() {
    const flexBoxes = document.querySelectorAll('.flex-box');
  
    flexBoxes.forEach(function(box) {
      box.addEventListener('mouseover', function() {
        flexBoxes.forEach(function(otherBox) {
          if (otherBox !== box) {
            otherBox.classList.add('darken');
          }
        });
      });
  
      box.addEventListener('mouseout', function() {
        flexBoxes.forEach(function(otherBox) {
          otherBox.classList.remove('darken');
        });
      });
    });
  });

  document.addEventListener('DOMContentLoaded', function() {
    const flexBoxes = document.querySelectorAll('.flex-box');
  
    flexBoxes.forEach(function(box) {
      box.addEventListener('mouseover', function() {
        document.body.classList.add('darken');
      });
  
      box.addEventListener('mouseout', function() {
        document.body.classList.remove('darken');
      });
    });
  });

  // Select all flexboxes
const flexBoxes = document.querySelectorAll('.flex-box');

// Select the background image
const backgroundImage = document.querySelector('#background_image');

// Loop over each flexbox
flexBoxes.forEach(flexBox => {
  // Add event listener for mouseover event
  flexBox.addEventListener('mouseover', function() {
    // Darken the background image
    backgroundImage.style.filter = 'brightness(90%)';
  });

  // Add event listener for mouseout event
  flexBox.addEventListener('mouseout', function() {
    // Remove the filter from the background image
    backgroundImage.style.filter = '';
  });
});