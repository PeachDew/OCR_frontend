let ctx;
let canvas; 
let isDrawing = false;

function initCanvas(canvasElement) {
    canvas = canvasElement;
    ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '32px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Name:', 20, 50);
    ctx.fillText('Favorite Food:', 20, 150);
    ctx.font = '50px Arial';
    ctx.fillText('◻  I agree', 30, 300);

    ctx.strokeStyle = '#ddd';
    ctx.strokeRect(20, 70, 360, 40);
    ctx.strokeRect(20, 170, 360, 40);
}

function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

function clearCanvas() {
    initCanvas(canvas);
}

export { initCanvas, startDrawing, draw, stopDrawing, clearCanvas };

