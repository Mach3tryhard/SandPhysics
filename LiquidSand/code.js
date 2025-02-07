var grainA= [];
var nb=200;
var amp=300;
var caca=1000;

function makegrain(xpoz,ypoz){
    let grain = {};
    grain.acc={x:0,y:0};
    grain.vel={x:0,y:0};
    grain.pos={x:window.innerWidth/2+xpoz,y:window.innerHeight/2+ypoz};
    grain.mass = 1;

    grain.getball=document.createElement("div");
    grain.getball.style.width = 10 + 'px';
    grain.getball.style.height = 10 + 'px';
    grain.getball.style.borderRadius = '50%';
    grain.getball.style.position = 'absolute';

    grain.getball.style.left = grain.pos.x+'px';
    grain.getball.style.top = grain.pos.y+'px';

    grain.getball.style.background = '#f7b176';
    grain.getball.style.borderColor = 'white';

    document.body.appendChild(grain.getball);
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


function updategrainpos(grain){
    grain.getball.style.left = grain.pos.x+'px';
    grain.getball.style.top = grain.pos.y+'px';
}

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
        updategrainpos(grainA[i]);
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
    updategrainpos(grain1);
    updategrainpos(grain2);    
}

var time = new Date().getTime();
function ApplyForces(){
    let _time = new Date().getTime();
    let dt = _time - time;
    time = _time;
    //USER FORCE
    for(var i=0;i<nb;i++){
        if(isMouseDown==true){
            grainA[i].acc.y=(userposy - grainA[i].pos.y)/caca;
            grainA[i].acc.x=(userposx - grainA[i].pos.x)/caca;
        }
        else{
            grainA[i].acc.y=0;
            grainA[i].acc.x=0;
        }
    }
    ///GRAVITY
    for(var i=0;i<nb;i++){
        grainA[i].acc.y+=9.81/caca;
    }
    ///FRICTION
    for(var i=0;i<nb;i++){
        //if(isMouseDown==false){
            grainA[i].acc.y-=grainA[i].vel.y/300;
            grainA[i].acc.x-=grainA[i].vel.x/700;
        //}
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
    //UPDATE MOVE
    // UPDATE MOVE
for (var i = 0; i < nb; i++) {
    grainA[i].vel.x += grainA[i].acc.x;
    grainA[i].vel.y += grainA[i].acc.y;

    let newY = grainA[i].pos.y + grainA[i].vel.y;
    if (newY > window.innerHeight - 10) {
        grainA[i].pos.y = window.innerHeight - 10;
        grainA[i].vel.y *= -0.5;
    } else if (newY < 0) {
        grainA[i].pos.y = 0;
        grainA[i].vel.y *= -0.5;
    } else {
        grainA[i].pos.y = newY;
    }

    // Handle X-axis movement and collisions
    let newX = grainA[i].pos.x + grainA[i].vel.x;
    if (newX > window.innerWidth - 10) {
        grainA[i].pos.x = window.innerWidth - 10;
        grainA[i].vel.x *= -0.5;
    } else if (newX < 0) {
        grainA[i].pos.x = 0;
        grainA[i].vel.x *= -0.5;
    } else {
        grainA[i].pos.x = newX;
    }

    updategrainpos(grainA[i]);
}
}

Generategrain(nb);
Positiongrain(nb,amp);

setInterval(ApplyForces,16);
