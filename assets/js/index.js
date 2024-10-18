const url = 'http://gateway.marvel.com/';
const urlComics = 'v1/public/comics';
const urlCharacters = 'v1/public/characters';
// const keyHash = '?ts=1&apikey=20ef376510097f50f89a7cf2b98cc1ce&hash=3c0bdb616f415c7a9a47908b7f5d4814&hash=';
keyHash = '?ts=wolverine&apikey=0099ad43a2ad46ed152e880db181665f&hash=6983ba77caa15f7496e6989c74b39ba5';
const modeLightDark = document.getElementById('mode-light-dark');
const divModeButton = document.getElementById('div-mode-button');
let mode = 'dark';
const iconMode = document.getElementById('icon-mode');
let tipoComicCharacter = document.getElementById('tipo-comic-character');
let searchInput = document.getElementById('search-input');
const marvelList = document.getElementById('marvel-list');
let order = document.getElementById('order');
const newOption = document.getElementById('new-option');
const oldOption = document.getElementById('old-option');
const containerCards = document.getElementById('container-cards');
const sectionCardComicsCharacters = document.getElementById('section-card-comics-characters');
const searchButton = document.getElementById('search-button');
const individualImgCard = document.getElementById('individual-img-card');
const publishedTitle = document.getElementById('published-title');
const individualTitleCard = document.getElementById('individual-title-card');
const published = document.getElementById('published');
const screenwriterTitle = document.getElementById('screenwriter-title');
const screenwriter = document.getElementById('screenwriter');
const description = document.getElementById('description');
const matchList = document.getElementById('match-list');
let matchTotal = document.getElementById('match-total');
let comicsResults = document.getElementById('comics-results');
const titleIndivualListCard = document.getElementById('title-indivual-list-card');
let startPag = document.getElementById('startPag');
let previewPag = document.getElementById('previewPag');
let actualPage = 0
let nextPag = document.getElementById('nextPag');
let endPag = document.getElementById('endPag');
const sizePage = 20;
const limitParam = "&limit=" + sizePage;

async function getApiMarvel(page=0){
    try{
        let inputType = tipoComicCharacter.value;
        let inputSearch = searchInput.value;
        let orderBy = order.value;

        offsetParam = "";
        if (page){offsetParam = "&offset=" + page*sizePage}

        if (inputType == 'comic'){
            searchParam = '&titleStartsWith=';
            urlType = urlComics;
        } else {
            searchParam = '&nameStartsWith=';
            urlType = urlCharacters;
        }

        let filterTitle = '';
        if (inputSearch){ filterTitle = searchParam + inputSearch;   }

        if(orderBy == 'az' && inputType == 'comic') {orderParam = '&orderBy=title';} 
        else if (orderBy == 'za' && inputType == 'comic') {orderParam = '&orderBy=-title';}
        else if (orderBy == 'new' && inputType == 'comic') {orderParam = '&orderBy=focDate';}
        else if (orderBy == 'old' && inputType == 'comic') {orderParam = '&orderBy=-focDate';}
        else if (orderBy == 'az' && inputType == 'character') {orderParam = '&orderBy=name';}
        else if (orderBy == 'za' && inputType == 'character') {orderParam = '&orderBy=-name';}

        url_final = url + urlType + keyHash + orderParam + filterTitle + offsetParam + limitParam;

        marvelList.innerHTML = '';

        const response = await fetch(url_final);
        const parsedMarvel = await response.json();

        actualPage = page
        finalPage = (parsedMarvel.data.total / sizePage).toFixed()

        startPag.dataset["page"] = 0
        if (actualPage>0){ previewPag.dataset["page"] = actualPage-1 }
        else{ previewPag.dataset["page"] = 0 }

        if (actualPage<finalPage){ nextPag.dataset["page"] = actualPage+1 }
        else{ nextPag.dataset["page"] = finalPage }

        endPag.dataset["page"] = finalPage

        displayTotal(parsedMarvel.data.total);
        styleCard(parsedMarvel.data.results, inputType);
    }
    catch(error){
        console.error(error);
    }
}


function displayTotal(total){
    let comicsResults = document.getElementById('comics-results');
    comicsResults.innerText = total + ' RESULTADOS';
}

function styleCardComics(comics) {
    comics.forEach(comic => {
        // Crear elementos
        const list = createElement('li', {
            style: { width: '270px', height: '503px', border: '1px #ffffff', padding: '10px', background: 'linear-gradient(120deg, #ff7575 0%, #4e4e4e 90%)', display: 'flex', flexDirection: 'column', gap: '10px' }
        });
        const figureComic = document.createElement('figure');
        figureComic.style.width = '250px';
        figureComic.style.height = '400px';
        const image = createElement('img', { src: `${comic.thumbnail.path}.${comic.thumbnail.extension}`, style: { width: '100%', height: '100%', border: '3px solid #00137d' } });
        const title = createElement('h3', { innerText: comic.title, style: { height: '70px', fontSize: '0.8rem', color: '#ffffff', fontWeight: 'bold', textShadow: '-2px 2px 2px #00003c' } });

        figureComic.appendChild(image);
        list.append(figureComic);
        list.append(title);
        marvelList.append(list);

        list.addEventListener('click', () => {
            matchList.innerHTML = ""
            handleComicClick(comic)});
    });
}

// Función para crear elementos con atributos
function createElement(tag, { innerText, src, style } = {}) {
    const element = document.createElement(tag);
    if (innerText) element.innerText = innerText;
    if (src) element.src = src;
    if (style) Object.assign(element.style, style);
    return element;
}

// Configurar detalles del comic
function bigCardComic(comic) {
    containerCards.style.display = 'none';
    sectionCardComicsCharacters.style.display = 'flex';
    individualImgCard.src = comic.thumbnail.path + '.' + comic.thumbnail.extension;
    individualTitleCard.innerText = comic.title;
    publishedTitle.style.display = 'flex';
    published.style.display = 'flex';
    screenwriterTitle.style.display = 'flex';
    screenwriter.style.display = 'flex';

    const dia = new Date(comic.dates[0].date);
    published.innerText = dia.toDateString() ? `${dia.getDate()} / ${dia.getMonth() + 1} / ${dia.getFullYear()}` : 'No se encontró fecha de publicación';
    
    const writers = comic.creators.items.filter(c => c.role === 'writer').map(c => c.name).join(', ') || 'No se encontraron guionistas';
    screenwriter.innerText = writers;

    description.innerText = comic.description || 'No se encontró descripción';
    titleIndivualListCard.innerText = 'Personajes';
    matchTotal.innerText = comic.characters.items.length > 0 ? `${comic.characters.items.length} RESULTADOS` : 'NO SE ENCONTRARON';
}

// Manejo del click en el comic
function handleComicClick(comic) {

    bigCardComic(comic);
    individualSourceUrl = comic.resourceURI
    fetchCharacters(individualSourceUrl);
}

// Fetch y mostrar personajes
function fetchCharacters(individualSourceUrl, page=0) {

    offsetParam = ""
    if (page){ offsetParam = "&offset=" + page*sizePage }
  
    charInComicUrl = `${individualSourceUrl}/characters${keyHash}${offsetParam}` + limitParam
    matchList.innerHTML = "";
    fetch(charInComicUrl)
        .then(res => res.json())
        .then(data => {
            let characters = data.data.results;
            characters.forEach(character=>{
                const list = createElement('li', {
                    style: { width: '270px', height: '503px', border: '1px #ffffff', padding: '10px', background: 'linear-gradient(120deg, #ff7575 0%, #4e4e4e 90%)', display: 'flex', flexDirection: 'column', gap: '10px' }
                });
                const matchFigure = createElement('figure');
                matchFigure.style.width = '250px';
                matchFigure.style.height = '400px';
                const matchImage = createElement('img', { src: `${character.thumbnail.path}.${character.thumbnail.extension}`, style: { width: '100%', height: '100%', border: '3px solid #00137d' } });
                const matchNameP = createElement('p', { innerText: character.name, style: { height: '70px', fontSize: '0.8rem', color: '#ffffff', fontWeight: 'bold', textShadow: '-2px 2px 2px #00003c' } });
                matchFigure.appendChild(matchImage);
                list.append(matchFigure);
                list.append(matchNameP);
                matchList.append(list);
            
                list.addEventListener('click', ()=> {
                    matchTotal.innerText = character.comics.available > 0 ? `${character.comics.available} RESULTADOS` : 'NO SE ENCONTRARON';
                    titleIndivualListCard.innerText = 'Comics';
                    matchList.innerHTML = "";
                    handleCharacters(character);
                });

                actualPage = page
                finalPage = (data.data.total / sizePage).toFixed()
                
                startPag.dataset["page"] = 0
                if (actualPage>0){ previewPag.dataset["page"] = actualPage-1 }
                else{ previewPag.dataset["page"] = 0 }
        
                if (actualPage<finalPage){ nextPag.dataset["page"] = actualPage+1 }
                else{ nextPag.dataset["page"] = finalPage }
        
                endPag.dataset["page"] = finalPage;

                dataType = "chars_in_comic";
                startPag.dataset["typeURL"] = dataType;
                previewPag.dataset["typeURL"] = dataType;
                nextPag.dataset["typeURL"] = dataType;
                endPag.dataset["typeURL"] = dataType;
                startPag.dataset["individualSourceUrl"] = individualSourceUrl;
                previewPag.dataset["individualSourceUrl"] = individualSourceUrl;
                nextPag.dataset["individualSourceUrl"] = individualSourceUrl;
                endPag.dataset["individualSourceUrl"] = individualSourceUrl;

            });
        });

}

// Configurar detalles del character
function bigCardChard(character){
    containerCards.style.display = 'none';
    sectionCardComicsCharacters.style.display = 'flex';
    publishedTitle.style.display = 'none';
    published.style.display = 'none';
    screenwriterTitle.style.display = 'none';
    screenwriter.style.display = 'none';

    individualImgCard.src = `${character.thumbnail.path}.${character.thumbnail.extension}`;
    individualTitleCard.innerText = character.name;
    description.innerText = character.description || 'No se encontró descripción';
    titleIndivualListCard.innerText = 'Comics';
}

// Manejo del click en el personaje
function handleCharacters(character) {
    bigCardChard(character)
    individualSourceUrl = character.resourceURI
    fetchComicFromChar(individualSourceUrl)
}

function fetchComicFromChar(individualSourceUrl, page=0){
    offsetParam = ""
    if (page){ offsetParam = "&offset=" + page*sizePage }

    comic_in_char_url = `${individualSourceUrl}/comics${keyHash}${offsetParam}` + limitParam
    fetch(comic_in_char_url)
        .then(res => res.json())
        .then(data => {
            let comics = data.data.results;
            displayComics(comics);

            actualPage = page
            finalPage = (data.data.total / sizePage).toFixed()
            
            startPag.dataset["page"] = 0
            if (actualPage>0){ previewPag.dataset["page"] = actualPage-1 }
            else{ previewPag.dataset["page"] = 0}
    
            if (actualPage<finalPage){ nextPag.dataset["page"] = actualPage+1 }
            else{ nextPag.dataset["page"] = finalPage }
    
            endPag.dataset["page"] = finalPage;

            dataType = "comics_in_char";
            startPag.dataset["typeURL"] = dataType;
            previewPag.dataset["typeURL"] = dataType;
            nextPag.dataset["typeURL"] = dataType;
            endPag.dataset["typeURL"] = dataType;
            startPag.dataset["individualSourceUrl"] = individualSourceUrl;
            previewPag.dataset["individualSourceUrl"] = individualSourceUrl;
            nextPag.dataset["individualSourceUrl"] = individualSourceUrl;
            endPag.dataset["individualSourceUrl"] = individualSourceUrl;
        });
}

function displayComics(comics) {
    matchList.innerHTML = "";
    comics.forEach(comic => {
        const list = createComicListItem(comic);
        matchList.appendChild(list);
    });
}

function createComicListItem(comic) {
    const list = createElement('li', {
        style: { width: '270px', height: '503px', border: '1px #ffffff', padding: '10px', background: 'linear-gradient(120deg, #ff7575 0%, #4e4e4e 90%)', display: 'flex', flexDirection: 'column', gap: '10px' }
    });
    const matchFigure = document.createElement('figure');
    matchFigure.style.width = '250px';
    matchFigure.style.height = '400px';
    const matchImage = createElement('img', { src: `${comic.thumbnail.path}.${comic.thumbnail.extension}`, style: { width: '100%', height: '100%', border: '3px solid #00137d' } });
    const matchNameP = createElement('h3', { innerText: comic.title, style: { height: '70px', fontSize: '1rem', color: '#ffffff', fontWeight: 'bold', textShadow: '-2px 2px 2px #00003c' } });

    matchFigure.appendChild(matchImage);
    list.appendChild(matchFigure);
    list.appendChild(matchNameP);

    list.addEventListener('click', () => {
        titleIndivualListCard.innerText = 'Personajes';
        matchList.innerHTML = "";
        handleComicClick(comic);
    });

    return list;
}

function styleCardCharacters(characters) {
    characters.forEach(character => {
        const list = createElement('li', {
            style: {  width: '270px', height: '503px', border: '1px #ffffff', padding: '10px', background: 'linear-gradient(120deg, #ff7575 0%, #4e4e4e 90%)', display: 'flex', flexDirection: 'column', gap: '10px' }
        });
        const figureCaracter = document.createElement('figure');
        figureCaracter.style.width = '250px';
        figureCaracter.style.height = '400px';
        const image = createElement('img', { src: `${character.thumbnail.path}.${character.thumbnail.extension}`, style: { width: '100%', height: '100%', border: '3px solid #00137d' } });
        const name = createElement('h3', { innerText: character.name, style: {  height: '70px', fontSize: '0.8rem', color: '#ffffff', fontWeight: 'bold', textShadow: '-2px 2px 2px #00003c' } });
        
        figureCaracter.appendChild(image);
        list.append(figureCaracter);
        list.append(name);
        marvelList.append(list);

        list.addEventListener('click', () => {
            matchList.innerHTML = "";
            handleCharacters(character);
        });
    });
}

// Theme
function modeLD(){
    const darkMode = mode === 'dark';
    document.body.style.background = darkMode ? '#201910' : '#fff7ed';
    iconMode.className = darkMode ? "fa-solid fa-sun" : "fa-solid fa-moon";
    iconMode.style = `font-size: 1.5rem;
    line-height: 2rem;
    color: ${darkMode ? '#fbbf24' : '#22d3ee'};
    width: 2rem;
    background: ${darkMode ? '#450a0a' : '#082f49'}`;
    mode = darkMode ? 'light' : 'dark';
}


function styleCard(data, type){
    if (type =='comic'){ styleCardComics(data) }
    else{ styleCardCharacters(data) }
}

// start
document.addEventListener("DOMContentLoaded", () => {
    getApiMarvel();

    // submit button for search form
    document.getElementById("form-search").addEventListener("submit", function(event){
        containerCards.style.display = 'flex';
        sectionCardComicsCharacters.style.display = 'none';
        getApiMarvel();
        event.preventDefault()
    });
    // select input from search form
    tipoComicCharacter.addEventListener('input', ()=>{
        if(tipoComicCharacter.value == 'character'){
            newOption.style.display = 'none';
            oldOption.style.display = 'none';
        } else{
            newOption.style.display = 'flex';
            oldOption.style.display = 'flex';
        }
    });

    // theme button
    modeLightDark.addEventListener('click', ()=> {
        modeLD();
    });

    // pagination buttons
    document.querySelectorAll(".page-control").forEach(elem=>{
        elem.addEventListener("click", (e) =>{
            typeURL = e.target.dataset.typeURL
            data_page = e.target.dataset.page
            individualSourceUrl = endPag.dataset["individualSourceUrl"]
            page = parseInt(data_page)

            if (typeURL == undefined){ getApiMarvel(page=page) } 
            else if (typeURL=="chars_in_comic"){ fetchCharacters(individualSourceUrl, page=page) } 
            else if (typeURL=="comics_in_char"){ fetchComicFromChar(individualSourceUrl, page=page) }
        });
    });

})