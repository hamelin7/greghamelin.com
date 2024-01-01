// this function is called when the page is loaded
window.onload = function() {

    //get the width and height of the browser window
    var widthDisplay = document.querySelector('.width');
    var heightDisplay = document.querySelector('.height');

    // Display the width and height of the browser window
    function displaySize() {
        widthDisplay.textContent = window.innerWidth;
        heightDisplay.textContent = window.innerHeight;
    }
    // Call the displaySize function when the browser window is resized
    window.onresize = displaySize;
    // Call the displaySize function when the page is loaded
    displaySize();  
}