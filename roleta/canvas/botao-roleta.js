const canvas = document.querySelector('.botao-roleta');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

function radiano(ang){
    return (Math.PI/180) * ang;
}

const raio = 50;

ctx.beginPath();
ctx.fillStyle = "#161616"
ctx.moveTo(50, 0);
ctx.lineTo(5, 60);
ctx.lineTo(100, 60);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.fillStyle = "#161616"
ctx.arc(width/2, height/2, raio, radiano(0), radiano(360), true);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.arc(width/2, height/2, raio*0.6, radiano(0), radiano(360), true);
ctx.strokeStyle = "#575757";
ctx.lineWidth = 8;
ctx.stroke();
ctx.closePath();