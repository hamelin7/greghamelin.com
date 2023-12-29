const titles = [
    'Pizza Fanatic',
    'Developer',
    'Dad',
    'Sys Admin',
    'Musician',

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