var grainA= [];
var nb=3000;
var amp=450;
var caca=1000;

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function makegrain(xpoz,ypoz){
    let grain = {};
    grain.acc={x:0,y:0};
    grain.vel={x:0,y:0};
    grain.pos={x:window.innerWidth/2+xpoz,y:window.innerHeight/2+ypoz};
    grain.mass = 1;
    return grain;
}

let isMouseDown = false;
let userposx;
let userposy;

document.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    userposx=e.clientX;
    userposy=e.clientY;
});

document.addEventListener('mousemove', (e) => {
    if(isMouseDown==true){
        userposx=e.clientX;
        userposy=e.clientY;
    }
});

document.addEventListener('mouseup', () => {
    isMouseDown = false;
});

function Generategrain(number){
    for(var i=0;i<number;i++){
        grainA.push(makegrain(0,0));
    }
}

function Positiongrain(number,amplitude){
    var step=(2*Math.PI)/number;
    var parc=0;
    for(var i=0;i<number;i++){
        grainA[i].pos.x = window.innerWidth/2 + amplitude*Math.sin(parc);
        grainA[i].pos.y = window.innerHeight/2 + amplitude*Math.cos(parc);
        parc+=step;
    }
}

function dist(x1,y1,x2,y2){
    return Math.sqrt( (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2) );
}

function pushForce(grain1,grain2)
{
    var distantax = grain1.pos.x-grain2.pos.x;
    var distantay = grain1.pos.y-grain2.pos.y;
    var distanta = Math.sqrt(distantax * distantax + distantay * distantay);
    if(distanta<10)
    {
        grain1.vel.x -= distantax / distanta*-0.05;
        grain1.vel.y -= distantay / distanta*-0.05;
        grain2.vel.x -= distantax / distanta*0.05;
        grain2.vel.y -= distantay / distanta*0.05;
    }
}

function drawGrain(grain) {
    ctx.beginPath();
    ctx.arc(grain.pos.x, grain.pos.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#f7b176';
    ctx.fill();
}

var time = new Date().getTime();
function ApplyForces(){
    let _time = new Date().getTime();
    let dt = _time - time;
    time = _time;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //USER FORCE
    for(var i=0;i<nb;i++){
        if(isMouseDown==true){
            grainA[i].acc.y=(userposy - grainA[i].pos.y)/300;
            grainA[i].acc.x=(userposx - grainA[i].pos.x)/500;
        }
        else{
            grainA[i].acc.y=0;
            grainA[i].acc.x=0;
        }
    }
    ///GRAVITY
    for(var i=0;i<nb;i++){
        grainA[i].acc.y+=9.81/100;
    }
    ///FRICTION
    for(var i=0;i<nb;i++){
        grainA[i].acc.y-=grainA[i].vel.y/caca;
        grainA[i].acc.x-=grainA[i].vel.x/caca;
    }
    //PushForce
    for(var i=0;i<nb;i++){
        for(var j=i+1;j<nb;j++){
            if(i!=j){
                pushForce(grainA[i],grainA[j]);
                pushForce(grainA[j],grainA[i]);
            }
        }
    }
    // UPDATE MOVE
    for (var i = 0; i < nb; i++) {
        grainA[i].vel.x += grainA[i].acc.x;
        grainA[i].vel.y += grainA[i].acc.y;

        let newY = grainA[i].pos.y + grainA[i].vel.y;
        let newX = grainA[i].pos.x + grainA[i].vel.x;

        // Y-axis collisions
        if (newY > canvas.height - 5) {
            grainA[i].pos.y = canvas.height - 5; // Clamp to the boundary
            grainA[i].vel.y *= -0.5;
        } else if (newY < 5) {
            grainA[i].pos.y = 5; // Clamp to the boundary
            grainA[i].vel.y *= -0.5;
        } else {
            grainA[i].pos.y = newY;
        }

        // X-axis collisions
        if (newX > canvas.width - 5) {
            grainA[i].pos.x = canvas.width - 5; // Clamp to the boundary
            grainA[i].vel.x *= -0.5;
        } else if (newX < 5) {
            grainA[i].pos.x = 5; // Clamp to the boundary
            grainA[i].vel.x *= -0.5;
        } else {
            grainA[i].pos.x = newX;
        }

        drawGrain(grainA[i]);
    }
}

Generategrain(nb);
Positiongrain(nb,amp);

setInterval(ApplyForces,16);