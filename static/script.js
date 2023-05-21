let canvas = document.getElementById("zplane-canvas");
let ctx = canvas.getContext("2d");

canvas.height = 500;
canvas.width = 500;
const rect = canvas.getBoundingClientRect(); //store position and size info of the canvas on the screen

// For deleting individual poles and zeros

//const menu = document.querySelector(".wrapper");
//var delete_button = document.getElementById("delete");
//var close_button = document.getElementById("close");


// Drawing the unit circle and axis
function setUpCanvas() {
    ctx.beginPath();
    ctx.arc(180, 180, 160, 0, 2 * Math.PI, false);  //(xcenter,ycenter,radius,startangle,endangle,counterclock)
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 180);  //drawing axes (Real axis)
    ctx.lineTo(360, 180);
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(180, 0);  //drawing axes (Imaginary axis)
    ctx.lineTo(180, 360);
    ctx.lineWidth = 0.5;
    ctx.stroke();
};

setUpCanvas();

//Get control buttons

var zero_btn = document.getElementById("draw-zeros");
var pole_btn = document.getElementById("draw-poles");

//clear buttons
var All_clear_button = document.getElementById("clear-all"); 
var clear_zeros_button = document.getElementById("clear-zeros");
var clear_poles_button = document.getElementById("clear-poles");


//Setting draw shape variable to zero or pole  
var draw_shape = "zero"; // default
zero_btn.style.backgroundColor =" rgba(18, 82, 119, 1)" ;
zero_btn.onclick = function(){

    draw_shape = "zero";
    zero_btn.style.backgroundColor =" rgba(18, 82, 119, 1)" ;
    pole_btn.style.backgroundColor = "black";
};

pole_btn.onclick = function(){

    draw_shape = "pole";
    pole_btn.style.backgroundColor =" rgba(18, 82, 119, 1)" ;
    zero_btn.style.backgroundColor = "black";
};

//Set variables for drawing 

var start_x = 0; // start_x and start_y for current mouse position
var start_y = 0;
var end_x = 360;
var end_y = 360;

let shapes = []
let zeros_list = []
let poles_list = []

let  selected_shape = null; //Zero / Pole
var to_draw = false;
var to_move = false;

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
//Function checks if new point in complex domain is within boundries of another existing point (shape object)
function is_mousepointer_in_shape(shape)
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


function Shapes_Draw(shapes){

ctx.clearRect(0,0,canvas.width,canvas.height);
setUpCanvas();

for(let shape of shapes)
{
if(shape.type == "zero"){

    drawZero(shape.x,shape.y);
}
else{

    drawPole(shape.x,shape.y);
}

}

};

// Mouse Events / clicks on canvas

canvas.onclick = (event)=>{
//menu.style.visibility = "hidden";
to_draw = true;
start_x = parseInt(event.offsetX); 
start_y = parseInt(event.offsetY);

let distance = Math.sqrt(Math.pow(start_x - 180, 2) + Math.pow(start_y - 180, 2));
let radius = 160;

// check if new point is within boundries of already existing point
for(let shape of shapes)
{
  if(is_mousepointer_in_shape(shape))
  {
    to_draw = false;
  }
}

if(distance<radius){
if(to_draw)
{

if(draw_shape == "zero")
{
    drawZero(start_x,start_y);
    shapes.push({x:start_x, y:start_y,type:"zero"});
}
else{

    drawPole(start_x,start_y);
    shapes.push({x:start_x,y:start_y,type:"pole"});

}
to_draw = false;
convert_to_cartesian(shapes);
}


}


}


canvas.onmousedown = (event)=>{

start_x = parseInt(event.clientX - rect.left);
start_y = parseInt(event.clientY - rect.top);
let index = 0;
// Check is click is in boundries of any existing point or shape 
for(let shape of shapes){
if(is_mousepointer_in_shape(shape)){
selected_shape = index;
to_move = true;

}
index++;
}

};

//User has hand off the mouse click 
canvas.onmouseup = ()=>{
if(to_move){
to_move = false;
}

};

canvas.onmousemove = (event) =>{
//Shape currently being moved    
if(to_move){
end_x = parseInt( event.clientX - rect.left); //calc current mouse coordinates relative to canvas
end_y = parseInt(event.clientY - rect.top);

let diff_x = end_x - start_x;  //differences between the current and starting coordinates of the mouse movement in the x-axis and y-axis
let diff_y = end_y - start_y;
// get shape selected by  indexing the shapes by (selected_shapes)
let current_shape_selected = shapes[selected_shape];
//Move the selected shape according to mouse movement
current_shape_selected.x +=diff_x;
current_shape_selected.y +=diff_y;

//Clear canvas, redraw unit circle and axis, then draw all shapes in shapes array
Shapes_Draw(shapes);

convert_to_cartesian(shapes);

//
// Update starting coordinates to be equal to the current coordinates
start_x = end_x;
start_y = end_y;

}


};

// Delete single zeros or poles
canvas.addEventListener('contextmenu',function(e){
e.preventDefault();
start_x = e.offsetX, start_y = e.offsetY;

let menu_appear = false;
let index = 0;
for(let shape of shapes){
if(is_mousepointer_in_shape(shape)){

    selected_shape = index;
    menu_appear = true;
}

index++;

}

// if(menu_appear){

//     menu.style.left = '${start_x}px';
//     menu.style.top = '${start_y + 180}px';
//     menu.style.visibility = "visible";

// }

});


//Delete menu buttons
//Arrow function
// close_button.onclick = ()=>{

// menu.style.visibility = "hidden";

// };

// delete_button.onclick = ()=>{
// //menu.style.visibility = "hidden";
// shapes.splice(selected_shape,1);
// Shapes_Draw(shapes);
// convert_to_cartesian(shapes);
// };

//Clear buttons(All,zeros,poles)

All_clear_button.onclick = ()=>{
shapes=[];
Shapes_Draw(shapes);
convert_to_cartesian(shapes);

};

clear_zeros_button.onclick = ()=>{
shapes = shapes.filter(shape=> shapes.type!=="zero");
Shapes_Draw(shapes);
convert_to_cartesian(shapes);

};

clear_poles_button.onclick = ()=>{
shapes = shapes.filter(shape => shapes.type!=="pole")
convert_to_cartesian(shapes);
};

function convert_to_cartesian(shapes){
zeros_list = []
poles_list = []

let x = 0;
let y = 0;
for (let shape of shapes ){
x= (shape.x - 180)/160;
y = -(shape.y - 180)/160;

if(shape.type=="zero"){

    zeros_list.push({real:x , img:y})
    console.log(zeros_list);
}

else{
poles_list.push({real : x,img:y})

}

}
    
//BACKEND RESPONSE FUNC

};

function convert_to_pixels(zeros_list,poles_list){
shapes = []
let x = 0; 
let y = 0;
for(let zero of zeros_list){
x=(zeros_list["real"]*160) + 180
y=(zeros_list["img"]*160) +180
shapes.push({x: x,y: y,type: "zero"});

}
for(let pole of poles_list){
    x=(poles_list["real"]*160) + 180
    y=(poles_list["img"]*160) +180
    shapes.push({x: x,y: y,type: "pole"});
    
    }

    Shapes_Draw(shapes);

    //BACKEND RESPONSE
};

// Magnitude and phase response 
// Client side send poles and zeros ---=> Get Mag and phase from backend

function getMagnitude_Phase_response(){

  $.ajax({

  





  })


};