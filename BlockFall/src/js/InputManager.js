let swipeThreshold = 20;
let holdThreshold = 500;
let gameStarted = false;
let mouseDownTime = 0;
let mouseTapTime = 0;
let mousePressed = false;
let moved = false;
let loaded = false;
let tapStartXPos = 0;
let tapStartYPos = 0;
let deltaX = 0;
let deltaY = 0;

// There's probably a better way to deal with this, but we need to cancel the mouse events that fire
// after the touch events so that we don't get duplicate calls.
window.addEventListener('touchstart', e => {
    e.preventDefault();
    MouseDown(e, true);
}, {capture: false, passive: false});
window.addEventListener('touchmove', e => {
    e.preventDefault();
    MouseMove(e, true);
}, {capture: false, passive: false});
window.addEventListener('touchend', e => {
    e.preventDefault();
    MouseUp();
}, {capture: false, passive: false});
window.addEventListener('touchcancel', e => {
    e.preventDefault();
    MouseUp();
}, {capture: false, passive: false});

window.addEventListener('mousedown', e => MouseDown(e, false), true);
window.addEventListener('mousemove', e => MouseMove(e, false), true);
window.addEventListener('keydown', KeyDown, true);
window.addEventListener('mouseup', MouseUp, true);

function KeyDown(key) {
    if (!gameStarted && key.key === 'Enter') {
        key.preventDefault();
        gameStarted = true;
        StartGameLoop();
    }
    if (!gameStarted)
        return;
    if (key.key === 'ArrowRight') {
        key.preventDefault();
        Move(1);
    }
    if (key.key === 'ArrowLeft') {
        key.preventDefault();
        Move(-1);
    }
    if (key.key === 'ArrowUp') {
        key.preventDefault();
        Rotate()
    }
    if (key.key === 'ArrowDown') {
        key.preventDefault();
        DropBlock();
        DrawToScreen();
    }
}

function MouseDown(e, isTouch) {
    if (!gameStarted)
        return;
    if (isTouch) {
        e.preventDefault();
        tapStartXPos = e.changedTouches[0].pageX - canvas.getBoundingClientRect().left;
        tapStartYPos = e.changedTouches[0].pageY - canvas.getBoundingClientRect().top;
    } else {
        tapStartXPos = e.clientX - canvas.getBoundingClientRect().left;
        tapStartYPos = e.clientY - canvas.getBoundingClientRect().top;
    }
    mouseDownTime = performance.now();
    mousePressed = true;
}

function MouseMove(e, isTouch) {
    if (!mousePressed || !gameStarted)
        return;
    e.preventDefault();
    if (isTouch) {
        deltaX = e.changedTouches[0].pageX - canvas.getBoundingClientRect().left - tapStartXPos;
        deltaY = e.changedTouches[0].pageY - canvas.getBoundingClientRect().top - tapStartYPos;
    } else {
        deltaX = e.clientX - canvas.getBoundingClientRect().left - tapStartXPos;
        deltaY = e.clientY - canvas.getBoundingClientRect().top - tapStartYPos;
    }
    mouseTapTime = performance.now() - mouseDownTime;
    if (Math.abs(deltaX) > swipeThreshold) {
        moved = true;
        if (deltaX > 0)
            Move(1);
        else
            Move(-1);

        if (isTouch) {
            tapStartXPos = e.changedTouches[0].pageX - canvas.getBoundingClientRect().left;
            tapStartYPos = e.changedTouches[0].pageY - canvas.getBoundingClientRect().top;
        } else {
            tapStartXPos = e.clientX - canvas.getBoundingClientRect().left;
            tapStartYPos = e.clientY - canvas.getBoundingClientRect().top;
        }
    } else if (deltaY > swipeThreshold) {
        moved = true;
        DropBlock();
        DrawToScreen();

        if (isTouch) {
            tapStartXPos = e.changedTouches[0].pageX - canvas.getBoundingClientRect().left;
            tapStartYPos = e.changedTouches[0].pageY - canvas.getBoundingClientRect().top;
        } else {
            tapStartXPos = e.clientX - canvas.getBoundingClientRect().left;
            tapStartYPos = e.clientY - canvas.getBoundingClientRect().top;
        }
    }
}

function MouseUp() {
    if (!gameStarted && loaded) {
        gameStarted = true;
        StartGameLoop();
        return;
    }
    mouseTapTime = performance.now() - mouseDownTime;
    mousePressed = false;
    if (!moved && mouseTapTime < holdThreshold)
        Rotate();
    moved = false;
}
