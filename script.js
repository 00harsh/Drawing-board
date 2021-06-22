const canvas = document.querySelector("#board");

//Resizing
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const context = canvas.getContext('2d');
const colors = document.querySelectorAll('#color');
const erase = document.querySelector('.erase');
const lines = document.querySelectorAll('.line');
const eraser = document.querySelectorAll('.ers');
const bg = document.querySelector('.background');
const marker = document.querySelectorAll('.style');
const redo = document.querySelector('.redo');
const undo = document.querySelector('.undo');




let drawing = false;
let color = '';
let lineSize = 2;
let restore = [];
let idx = -1;
let clr = false;

function start(e) {           //start drawing
    drawing = true;
    draw(e);


}


function stop(e) {            //stop drawing
    drawing = false;
    context.beginPath();
    if (e.type != 'mouseout') {
        restore.push(context.getImageData(0, 0, canvas.width, canvas.height));
        idx++;
        undo.style.opacity = 1;
    }



}

function draw(e) {           //Drawing function
    if (!drawing) return;

    context.lineCap = 'round';                      //round line
    context.lineTo(e.clientX, e.clientY - 80);      //get x y coordinates 
    context.strokeStyle = color;                    //color of text
    context.lineWidth = lineSize;                   //line width
    context.stroke();
    context.beginPath();
    context.moveTo(e.clientX, e.clientY - 80);      //end point
}

// EVENTLISTENERS

canvas.addEventListener('mousedown', start);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stop);
canvas.addEventListener('mouseout', stop);

for (let i = 0; i < marker.length; i++) {
    marker[i].addEventListener('click', linewidth);
}

for (let i = 0; i < colors.length; i++) {
    colors[i].addEventListener('click', changeColor)
}
for (let i = 0; i < eraser.length; i++) {
    eraser[i].addEventListener('click', ers);
}

bg.addEventListener('click', changeBg);
undo.addEventListener('click', undoBack);
redo.addEventListener('click', redoBack);

erase.addEventListener('click', clear);


// FUNCTIONS

function linewidth(e) {
    let selectedEraser = document.querySelector('.ers.selected');
    if (selectedEraser) {
        selectedEraser.classList.remove('selected');            //remove eraser if selected
    }
    let selectedMarker = document.querySelector('.style.selected');
    if (selectedMarker) {
        selectedMarker.classList.remove('selected');                //preselected marker shifted on current
    }
    e.currentTarget.classList.add('selected');
    if (e.currentTarget.classList[2] == 'small') lineSize = 2;      // decide markers length
    if (e.currentTarget.classList[2] == 'medium') lineSize = 4;
    if (e.currentTarget.classList[2] == 'large') lineSize = 8;
    let selectedColor = document.querySelector('#color.selected');
    color = selectedColor.classList[0];
}

function changeColor(e) {
    if (e.currentTarget.classList.contains('selected')) {
        e.currentTarget.classList.remove('selected');
    } else {
        let selectedColor = document.querySelector('#color.selected');
        if (selectedColor) {
            selectedColor.classList.remove('selected');

        }
        e.currentTarget.classList.add('selected');
        color = e.currentTarget.classList[0];           //color updated
    }
}


function ers(e) {
    if (e.currentTarget.classList.contains('selected')) {
        e.currentTarget.classList.remove('selected');

        let marker = document.querySelector('.style.small');
        marker.classList.add('selected');                       //marker select when eraser disable
        lineSize = 2;                                           //linesize updated
        let selectedColor = document.querySelector('#color.selected'); //color selection
        color = selectedColor.classList[0];

    } else {
        let selectedMarker = document.querySelector('.style.selected'); //remove marker if selected
        if (selectedMarker) {
            selectedMarker.classList.remove('selected');
        }
        let selectedEraser = document.querySelector('.ers.selected');
        if (selectedEraser) {                                           //preselected eraser will be removed and shift on current
            selectedEraser.classList.remove('selected');
        }
        e.currentTarget.classList.add('selected');
        let size = e.currentTarget.classList[0].split('-')[0];
        if (size == 'small') lineSize = 10;                      // decide erasers length
        if (size == 'medium') lineSize = 30;
        if (size == 'large') lineSize = 60;
        if (bg.classList.contains('change')) color = 'black';     //eraser color change for differnt back ground
        else color = 'white';
    }
}

function changeBg(e) {
    clear();
    for (let i = 0; i < eraser.length; i++) {
        eraser[i].classList.remove('selected');
    }
    let selectedColor = document.querySelectorAll('#color');
    selectedColor[0].classList.add('selected');
    for (let i = 1; i < selectedColor.length; i++) {
        selectedColor[i].classList.remove('selected');
    }


    if (bg.classList.contains('change')) color = 'black';
    else color = 'white';


    let selectedMarker = document.querySelector('.style.selected');
    if (selectedMarker) {
        selectedMarker.classList.remove('selected');
    }
    marker[1].classList.add('selected');
    lineSize = '4';


    if (e.currentTarget.classList.contains('change')) {
        colors[0].classList.remove('white');
        colors[0].classList.add('black');
    } else {
        colors[0].classList.remove('black');
        colors[0].classList.add('white');
    }

    if (e.currentTarget.classList.contains('change')) {
        e.currentTarget.classList.remove('change');
        canvas.style.backgroundColor = 'white';
    }
    else {
        e.currentTarget.classList.add('change');
        canvas.style.backgroundColor = 'black';
    }
}

function undoBack(e) {
    if (idx <= 0) {
        redo.style.opacity = 0.3;
        undo.style.opacity = 0.3;
        clear();
    }
    else {
        idx--;
        context.putImageData(restore[idx], 0, 0);
        redo.style.opacity = 1;
        
    }

}
function redoBack(e) {
    if (idx < restore.length - 1) {
        idx++;
        context.putImageData(restore[idx], 0, 0);
        
    }
    if(idx == restore.length -1){
        redo.style.opacity = 0.3;
    }

}

function clear(e) {
    context.clearRect(0, 0, 1370, 650);
    restore = [];
    idx = -1;
    undo.style.opacity = 0.3;
    redo.style.opacity = 0.3;
}