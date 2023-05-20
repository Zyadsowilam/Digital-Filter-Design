let canvas = document.getElementById("zplane-canvas");
let ctx = canvas.getContext("2d");

canvas.height = 360;
canvas.width = 360;
const rect = canvas.getBoundingClientRect(); //store position and size info of the canvas on the screen


// Drawing the unit circle and axis
function setUpCanvas() {
    ctx.beginPath();
    ctx.arc(180, 180, 160, 0, 2 * Math.PI, false);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 180);
    ctx.lineTo(360, 180);
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(180, 0);
    ctx.lineTo(180, 360);
    ctx.lineWidth = 0.5;
    ctx.stroke();
};

setUpCanvas();

//Get control buttons

var zero_btn = document.getElementById("draw-zeros");
var pole_btn = document.getElementById("draw-poles");

var draw_shape = "zero"; // default

zero_btn.onclick = function(){

    draw_shape = "zero";
};

pole_btn.onclick = function(){

    draw_shape = "pole";
};

//Set variables for drawing 

var start_x = 0;
var start_y = 0;
var end_x = 360;
var end_y = 360;

let shapes = []
let zeros_list = []
let poles_list = []

let  selected_shape = null; //Zero / Pole
var is_drawing = false;
var is_moving = false;

//Drawing shapes

function drawZero(x,y)
{
ctx.beginPath();

ctx.arc(x,y,6,0, 2* Math.PI, false);
ctx.lineWidth= 1;

ctx.fillStyle = "#296d98";
ctx.fill();
ctx.strokeStyle = "black";
ctx.stroke();


};

function drawPole(x, y) {
    ctx.beginPath();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "red";

    ctx.moveTo(x - 6, y - 6);
    ctx.lineTo(x + 6, y + 6);

    ctx.moveTo(x + 6, y - 6);
    ctx.lineTo(x - 6, y + 6);

    ctx.stroke();
};

//Move shape

function is_mousepointer_in_shape()
{
let left = shape.x - 6;
let right = shape.x +6;
let top = shape.y - 6;
let bottom = shape.y +6;

if(left<start_x && right>start_x && top<start_y && bottom>start_y)
{
    return true
}
return false;

};