let ctx;
let canvas; 
let isDrawing = false;

function getCoords(e) {
    const rect = canvas.getBoundingClientRect();
    
    // Check if it's a touch event and get the first touch point
    if (e.touches && e.touches.length > 0) {
        return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top
        };
    }
    
    // Otherwise, assume it's a mouse event
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function initCanvas(canvasElement) {
    canvas = canvasElement;
    ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '32px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Name:', 20, 50);
    ctx.fillText('Favorite Food:', 20, 200);
    ctx.font = '50px Arial';
    ctx.fillText('◻  I agree', 30, 370);

    ctx.strokeStyle = '#ddd';
    ctx.strokeRect(20, 60, 500, 100);
    ctx.strokeRect(20, 210, 500, 100);
}

function startDrawing(e) {
    isDrawing = true;
    const { x, y } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);

    // const rect = canvas.getBoundingClientRect();
    // ctx.beginPath();
    // ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function draw(e) {
    // if (!isDrawing) return;
    // const rect = canvas.getBoundingClientRect();
    // ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    // ctx.strokeStyle = '#000';
    // ctx.lineWidth = 3;
    // ctx.lineCap = 'round';
    // ctx.stroke();
    
    if (!isDrawing) return;
    
    // Prevent default touch behavior (scrolling/zooming)
    if (e.touches) {
        e.preventDefault();
    }
    
    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
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

