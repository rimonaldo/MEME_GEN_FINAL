'use strict'

function initGallery() {

    loadMemes()

    renderMemesGallery()
}

function loadMemes(){
    if (!loadFromStorage('MEMES')) {
        gMemes = []
    } else gMemes = loadFromStorage('MEMES')
}

function renderMemesGallery() {
    var elGallery = document.querySelector('.meme-gallery-container')
    var innerHTML = ""
    var memes = loadFromStorage('MEMES') || []

    memes.forEach((img) => {
        console.log(img.imgId);
        var id = img.imgId
        innerHTML += ` <a href="editor.html"> <img onclick="onLoadMeme('${id}')"  onclick="renderSavedMeme('${id}')" class="gallery-img" id="${id}" src='${img.memeUrl}' alt=""></a>`
        console.log(elGallery.innerHTML);
    })
    elGallery.innerHTML = innerHTML

}

function findMemeById(id){
    return gMemes.find((meme) => { return meme.imgId === id })
    
}

function onLoadMeme(id){
    console.log(id);
    gMemes = loadFromStorage('MEMES')
    gCurrMeme = findMemeById(id)
    console.log(findMemeById(id));
    saveToStorage(MEME_KEY,findMemeById(id))
    saveToStorage(URL_KEY , findMemeById(id).url)  
}

function renderLines() {
    for (var i = 0; i < gMeme.lines.length; i++) {
        var text = gMeme.lines[i].text
        var { x, y } = gMeme.lines[i].linePos
        drawText(text, i)
    }
}

function renderSavedMeme(id) {
    gMemes = loadFromStorage('MEMES')
    var meme = gMemes.find((meme) => { return meme.imgId === id }) 
    saveToStorage(URL_KEY, meme.url)
    saveToStorage(MEME_KEY,meme)
}

function getMeme(img) {
    var id = img.id
    var idx = _findIdxById(id, gImgs)
    gUrl = gImgs[idx].url
    saveToStorage(URL_KEY, gUrl)
    saveToStorage(ID_KEY, id)
}
