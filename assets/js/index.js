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

async function getApiMarvel(){
    try{
        let inputType = tipoComicCharacter.value;
        let inputSearch = searchInput.value;
        let orderBy = order.value;

        console.log('input searh',inputType)
       
        if (inputType == 'comic'){
            search_param = '&titleStartsWith=';
            urlType = urlComics;
        } else {
            search_param = '&nameStartsWith=';
            urlType = urlCharacters;
        }

        let filterTitle = '';
        if (inputSearch){
            filterTitle = search_param + inputSearch;   
        }

        if(orderBy == 'az' && inputType == 'comic') {orderParam = '&orderBy=title';} 
        else if (orderBy == 'za' && inputType == 'comic') {orderParam = '&orderBy=-title';}
        else if (orderBy == 'new' && inputType == 'comic') {orderParam = '&orderBy=focDate';}
        else if (orderBy == 'old' && inputType == 'comic') {orderParam = '&orderBy=-focDate';}
        else if (orderBy == 'az' && inputType == 'character') {orderParam = '&orderBy=name';}
        else if (orderBy == 'za' && inputType == 'character') {orderParam = '&orderBy=-name';}

        url_final = url + urlType + keyHash + orderParam + filterTitle;

        marvelList.innerHTML = '';
        console.log(url_final)
        const response = await fetch(url_final);
        console.log('hola',url_final)
        console.log(response)
        const parsedMarvel = await response.json();
        console.log(parsedMarvel);
        displayTotal(parsedMarvel.data.total);
        styleCard(parsedMarvel.data.results, inputType);
    }
    catch(error){
        console.error(error);
    }
}

document.getElementById("form-search").addEventListener("submit", function(event){
    getApiMarvel();
    event.preventDefault()
});

tipoComicCharacter.addEventListener('input', ()=>{
    if(tipoComicCharacter.value == 'character'){
        newOption.style.display = 'none';
        oldOption.style.display = 'none';
    } else{
        newOption.style.display = 'flex';
        oldOption.style.display = 'flex';
    }
});

function displayTotal(total){
    let comicsResults = document.getElementById('comics-results');
    comicsResults.innerText = total + ' RESULTADOS';
}

function styleCardComics(comics) {
    console.log(comics)
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

// Manejo del click en el comic
function handleComicClick(comic) {
    containerCards.style.display = 'none';
    sectionCardComicsCharacters.style.display = 'flex';
    bigCardComic(comic);
    fetchCharacters(comic);
}

// Configurar detalles del comic
function bigCardComic(comic) {
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
    matchTotal.innerText = comic.characters.items.length > 0 ? `${comic.characters.items.length} RESULTADOS` : 'NO SE ENCONTRARON';
}

// Fetch y mostrar personajes
function fetchCharacters(character) {
    character.characters.items.forEach(elem => {
        fetch(`${elem.resourceURI}${keyHash}`)
            .then(res => res.json())
            .then(data => {
                const character = data.data.results[0];
                const list = createElement('li', {
                    style: { width: '270px', height: '503px', border: '1px #ffffff', padding: '10px', background: 'linear-gradient(120deg, #ff7575 0%, #4e4e4e 90%)', display: 'flex', flexDirection: 'column', gap: '10px' }
                });
                const matchFigure = createElement('figure');
                matchFigure.style.width = '250px';
                matchFigure.style.height = '400px';
                const matchImage = createElement('img', { src: `${character.thumbnail.path}.${character.thumbnail.extension}`, style: { width: '100%', height: '100%', border: '3px solid #00137d' } });
                const matchNameP = createElement('p', { innerText: character.name, style: { height: '70px', fontSize: '0.8rem', color: '#ffffff', fontWeight: 'bold', textShadow: '-2px 2px 2px #00003c' } });
                titleIndivualListCard.innerText = 'Personajes';
                matchFigure.appendChild(matchImage);
                list.append(matchFigure);
                list.append(matchNameP);
                matchList.append(list);
            
                list.addEventListener('click', ()=> {
                    matchTotal.innerText = character.comics.available > 0 ? `${character.comics.available} RESULTADOS` : 'NO SE ENCONTRARON';
                    matchList.innerHTML = "";
                    big_card_char(character);
                });
            });
    });
}

//Fetch y mostrar comics
function fetchComics(comic) {
    comic.comics.forEach(elem => {
        fetch(`${elem.resourceURI}${keyHash}`)
            .then(res => res.json())
            .then(data => {
                const comics = data.data.results[0];
                const list = createElement('li', {
                    style: { width: '270px', height: '503px', border: '1px #ffffff', padding: '10px', background: 'linear-gradient(120deg, #ff7575 0%, #4e4e4e 90%)', display: 'flex', flexDirection: 'column', gap: '10px' }
                });
                const figureCaracter = document.createElement('figure');
                matchFigure.style.width = '250px';
                matchFigure.style.height = '400px';
                const matchImage = createElement('img', { src: `${comics.thumbnail.path}.${comics.thumbnail.extension}`, style: { width: '100%', height: '100%', border: '3px solid #00137d' } });
                const matchTitleP = createElement('p', { innerText: comics.title, style: { height: '70px', fontSize: '1rem', color: '#ffffff', fontWeight: 'bold', textShadow: '-2px 2px 2px #00003c' } });
                titleIndivualListCard.innerText = 'Comics';
                figureCaracter.appendChild(matchImage);
                list.append(figureCaracter);
                list.append(matchTitleP);
                matchList.append(list);
            });
    });
}

function big_card_char(character) {
    containerCards.style.display = 'none';
    sectionCardComicsCharacters.style.display = 'flex';
    publishedTitle.style.display = 'none';
    published.style.display = 'none';
    screenwriterTitle.style.display = 'none';
    screenwriter.style.display = 'none';

    individualImgCard.src = `${character.thumbnail.path}.${character.thumbnail.extension}`;
    individualTitleCard.innerText = character.name;
    description.innerText = character.description || 'No se encontró descripción';

    Promise.all(character.comics.items.map(fetchComicDetails))
        .then(comics => {
            displayComics(comics);
        });
}

function fetchComicDetails(elem) {
    const url_comic = `${elem.resourceURI}${keyHash}`;
    return fetch(url_comic)
        .then(res => res.json())
        .then(data => data.data.results[0]);
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
            big_card_char(character);
        });
    });
}

// Theme
function modeLD(){
    if (mode === 'dark'){
        document.body.style.background = '#181818';
        iconMode.className = "fa-solid fa-sun";
        iconMode.style.fontSize = '1.5rem';
        iconMode.style.lineHeight = '2rem';
        iconMode.style.color = '#fbbf24';
        iconMode.style.width = '2rem';
        iconMode.style.border = '1px solid #fbbf24';
        iconMode.style.borderRadius = '0.25rem';
        mode = 'light';
    } 
    else{
        document.body.style.background = '#fff7ed';
        iconMode.className = "fa-solid fa-moon";
        iconMode.style.fontSize = '1.5rem';
        iconMode.style.lineHeight = '2rem';
        iconMode.style.color = '#22d3ee';
        iconMode.style.width = '2rem';
        iconMode.style.border = '1px solid #22d3ee';
        iconMode.style.borderRadius = '0.25rem';
        mode = 'dark';
    }
}

modeLightDark.addEventListener('click', ()=> {
    modeLD();
});

searchButton.addEventListener('click', ()=>{
    containerCards.style.display = 'flex';
    sectionCardComicsCharacters.style.display = 'none';
});

function styleCard(data, type){
    if (type =='comic'){
        styleCardComics(data);
    }
    else{
        styleCardCharacters(data);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getApiMarvel();
});