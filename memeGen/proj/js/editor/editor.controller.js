'use strict'
var gIsSavedMeme = false
var gCurrMeme

const URL_KEY = 'URL'
const MEME_KEY = 'MEME'
const MEMES_KEY = 'MEMES'
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

var gCanvasCopy
var gCtxCopy
var gStartPos

var gMemes = []
var gCanvas
var gCtx
var gCanvasBottom
var gCtxBottom
var gOpacity = 1
var gIsStroke = false




var gMeme = {
    url: '',
    memeUrl: '',
    imgId: 0,
    lineIdx: 0,
    lines: [{
        linePos: { x: 20, y: 100 },
        text: 'ENTER TEXT',
        size: 60,
        align: 'left',
        color: 'white',
        stroke: 'black',
        isStroke: true,
        isDrag: false,
        isClicked: false
    }]

}

function init() {
    gMemes = loadFromStorage('MEMES') || []


    gMeme = loadMeme()

    setCanvas()
    renderMemeImg()
    addListeners()
    setImgId()

}

function renderCanvas() {
    renderMemeImg()
    saveMeme()

    // setText()
}

function onSave(elLink, ev) {
    ev.preventDefault()
    gMemes.push(gMeme)
    var img = new Image()
    img.src = loadFromStorage(URL_KEY)

    img.onload = () => {
        gCtxCopy.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        setCanvasCopy()
    }
    var data = gCanvasCopy.toDataURL();

    gMeme.memeUrl = data

    saveMeme()
    saveToStorage('MEMES', gMemes)
}

function downloadCanvas(elLink, ev) {
    var img = new Image()
    img.src = loadFromStorage(URL_KEY)
    img.onload = () => {
        gCtxCopy.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        setCanvasCopy()
    }
    var data = gCanvasCopy.toDataURL();
    elLink.href = data;
    elLink.download = 'meme_' + gMeme.imgId;
}

function setDownload(elLink, ev) {
    // ev.preventDefault()
    downloadCanvas(elLink)
}

function setCanvasCopy() {
    renderCopy()
}

function onPallete(val) {
    setFontColor(val)
    renderCanvas()
}
// add a new line
function onAddLine() {
    strokeOff()
    addLine()
    gMeme.lineIdx = gMeme.lines.length - 1
    renderCanvas()
    strokeOn()
}

function onInputText() {
    _strokeRect()
    setTimeout(() => {
        _clearStroke()
    }, 1000)
}

function onSetLine(direction) {
    _clearStroke()
    setLine(direction, getLine().text)
    var { x, y } = getLinePos()
    setInputVal(getLine().text)
    _strokeRect(x, y)
    setTimeout(() => {
        _clearStroke()
    }, 1000)

    saveMeme()
}

function setFontSize(size) {
    _clearStroke()
    var { x, y } = getLinePos()
    clearLine(x, y)
    getLine().size = +size
    drawText(getLine().text)
    saveMeme()
}

function onAlign(direction) {
    if (direction === 'left') return
    if (direction === 'center') getLine().align = 'center'
    if (direction === 'right') getLine().align = 'right'
}

function onDeleteLine() {
    clearCanvas()
}

function setTextDrag(isDrag) {
    var line = getLine()
    line.isDrag = isDrag
}

function getEvPos(ev) {
    //Gets the offset pos , the default pos
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    // Check if its a touch ev
    if (gTouchEvs.includes(ev.type)) {
        //soo we will not trigger the mouse ev
        ev.preventDefault()
        //Gets the first touch point
        ev = ev.changedTouches[0]
        //Calc the right pos according to the touch screen
        pos = {
            x: ev.pageX - ev.target.offsetLeft - (ev.target.clientLeft),
            y: ev.pageY - ev.target.offsetTop - (ev.target.clientTop + 150)
        }
    }
    return pos
}

function moveText(dx, dy) {
    var { x, y } = getLinePos()
    var line = getLine()
    // add diff
    var diff = (line.text.length) ? line.text.length * 16 : 160
    x += dx - diff
    y += dy
    // sets position in line object pos
    line.linePos.x = x
    line.linePos.y = y
}


// EVENT LISTENERS
// ----------------------------------------------------------------
function addListeners() {
    _addMouseListeners()
    _addTouchListeners()
    _addSizeListeners()
}

function _addMouseListeners() {
    gCanvas.addEventListener('mousedown', onDown)
    gCanvas.addEventListener('mousemove', onMove)
    gCanvas.addEventListener('mouseup', onUp)
}

function _addTouchListeners() {
    gCanvas.addEventListener('touchstart', onDown)
    gCanvas.addEventListener('touchmove', onMove)
    gCanvas.addEventListener('touchend', onUp)
}

function _addSizeListeners() {


    window.addEventListener('resize', resizeCanvas)

}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-box');

    console.log(window.innerWidth);
    var isResize = false
    if (window.innerWidth < 500 && window.innerWidth > 400 && isResize === false) {
        // isResize = true
        gCanvas.width = 250;
        gCanvas.height = 250;
        gCanvasBottom.width = 250
        gCanvasBottom.height = 250
        gCanvasCopy.width = 250;
        gCanvasCopy.height = 250;


        console.log(document.querySelector('.txt-input').style);
        document.querySelector('.txt-input').style.height = 50
        gMeme.lines.forEach((line)=>{
            line.size = 40
            line.linePos.x = 10
        })
        renderCanvas()
    }

    if (window.innerWidth > 500 &&  window.innerWidth < 600 && isResize === false) {
        isResize = true
        gCanvas.width = 500;
        gCanvas.height = 500;
        gCanvasBottom.width = 500
        gCanvasBottom.height = 500
        gCanvasCopy.width = 500;
        gCanvasCopy.height = 500;

        gMeme.lines.forEach((line)=>{
            line.size = 60
            line.linePos.x = 10
        })
        renderCanvas()
    }
    // Note: changing the canvas dimension this way clears the canvas

    // Unless needed, better keep height fixed.
    //   gCanvas.height = elContainer.offsetHeight

    
}