const titles = [
    'Developer',
    'Programmer',
    'Designer'
];

let titlesIndex = 0;

const changeTitle = function(){
    const title = document.getElementById("title");
    title.textContent = titles[titlesIndex];
    titlesIndex = (titlesIndex + 1) % titles.length;

};

setInterval(changeTitle, 2500);