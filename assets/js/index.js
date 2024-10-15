const url = 'http://gateway.marvel.com/';
const urlComics = 'v1/public/comics';
const urlCharacters = 'v1/public/characters';
const keyHash = '?ts=1&apikey=20ef376510097f50f89a7cf2b98cc1ce&hash=3c0bdb616f415c7a9a47908b7f5d4814';
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
        
        if(orderBy == 'az' && inputType == 'comic'){
            orderParam = '&orderBy=title';
        } 
        else if (orderBy == 'za' && inputType == 'comic'){
            orderParam = '&orderBy=-title';
        }
        else if (orderBy == 'new' && inputType == 'comic'){
            orderParam = '&orderBy=focDate';
        }
        else if (orderBy == 'old' && inputType == 'comic'){
            orderParam = '&orderBy=-focDate';
        }
        else if (orderBy == 'az' && inputType == 'character'){
            orderParam = '&orderBy=name';
        }
        else if (orderBy == 'za' && inputType == 'character'){
            orderParam = '&orderBy=-name';
        }

        url_final = url + urlType + keyHash + orderParam + filterTitle;

        marvelList.innerHTML = '';
        console.log(url_final)
        const response = await fetch(url_final);
        console.log('hola',url_final)
        console.log(response)
        const parsedMarvel = await response.json();
        console.log(parsedMarvel);
        // displayTotal(parsedMarvel.data.total);
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

// theme
function modeLD(){
    if (mode === 'dark'){
        document.body.style.background = '#181818';
        iconMode.className = "fa-solid fa-sun";
        iconMode.style.fontSize = '1.5rem';
        iconMode.style.textAlign = 'center';
        iconMode.style.lineHeight = '2rem';
        iconMode.style.background = '#b91c1c';
        iconMode.style.color = '#cbd5e1';
        iconMode.style.width = '2rem';
        iconMode.style.borderRadius = '0.375rem';
        mode = 'light';
    } 
    else{
        document.body.style.background = '#e2e8f0';
        iconMode.className = "fa-solid fa-moon";
        iconMode.style.fontSize = '1.5rem';
        iconMode.style.textAlign = 'center';
        iconMode.style.lineHeight = '2rem';
        iconMode.style.background = '#b91c1c';
        iconMode.style.color = '#cbd5e1';
        iconMode.style.width = '2rem';
        iconMode.style.borderRadius = '0.375rem';
        mode = 'dark';
    }
}

modeLightDark.addEventListener('click', ()=> {
    modeLD();
});

// function displayTotal(total){
//     let comicsResults = document.getElementById('comics-results');
//     comicsResults.innerText = total + ' RESULTADOS';
// }

function styleCardComics(comics) {
    comics.forEach(comic => {
        // Crear elementos
        const list = createElement('li', {
            style: { width: '200px', height: '400px', display: 'flex', flexDirection: 'column', gap: '10px' }
        });
        const figure = document.createElement('figure');
        const image = createElement('img', { src: `${comic.thumbnail.path}.${comic.thumbnail.extension}`, style: { width: '100%', height: '300px' } });
        const title = createElement('h3', { innerText: comic.title, style: { fontSize: '1.2rem', color: '#607d8b' } });

        // Añadir elementos a la lista
        figure.appendChild(image);
        list.append(figure);
        list.append(title);
        marvelList.append(list);

        // Evento para comic individual
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
    // console.log(comic.title)
    containerCards.style.display = 'none';
    sectionCardComicsCharacters.style.display = 'flex';
    setComicDetails(comic);
    fetchCharacters(comic);
}

// Configurar detalles del comic
function setComicDetails(comic) {
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
function setCharacterDetails(character) {
    // card small g
    const list = createElement('li', {
        style: { width: '200px', height: '400px', display: 'flex', flexDirection: 'column', gap: '10px' }
    });
    const matchImage = createElement('img', { src: `${character.thumbnail.path}.${character.thumbnail.extension}` });
    const matchNameP = createElement('p', { innerText: character.name, style: { fontSize: '1.2rem', color: '#607d8b' } });

    list.append(createElement('figure').appendChild(matchImage), matchNameP);
    matchList.append(list);

    list.addEventListener('click', ()=> {
        matchTotal.innerText = character.comics.available > 0 ? `${character.comics.available} RESULTADOS` : 'NO SE ENCONTRARON';
        matchList.innerHTML = "";
        big_card_char(character);
    });
}

function fetchCharacters(comic) {
    comic.characters.items.forEach(elem => {
        fetch(`${elem.resourceURI}${keyHash}`)
            .then(res => res.json())
            .then(data => {
                const character = data.data.results[0];
                setCharacterDetails(character);
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
                    style: { width: '200px', height: '400px', display: 'flex', flexDirection: 'column', gap: '10px' }
                });
                const matchImage = createElement('img', { src: `${comics.thumbnail.path}.${comics.thumbnail.extension}` });
                const matchTitleP = createElement('p', { innerText: comics.title, style: { fontSize: '1.2rem', color: '#607d8b' } });

                list.append(createElement('figure').appendChild(matchImage), matchTitleP);
                matchList.append(list);
            });
    });
}
// ------------------------------------------------------------------------

function big_card_char(character) {
    // Mostrar la tarjeta grande
    containerCards.style.display = 'none';
    sectionCardComicsCharacters.style.display = 'flex';
    publishedTitle.style.display = 'none';
    published.style.display = 'none';
    screenwriterTitle.style.display = 'none';
    screenwriter.style.display = 'none';
    // hideAdditionalDetails();

    individualImgCard.src = `${character.thumbnail.path}.${character.thumbnail.extension}`;
    individualTitleCard.innerText = character.name;
    description.innerText = character.description;

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
    matchList.innerHTML = ""; // Limpiar lista antes de agregar nuevos elementos

    comics.forEach(comic => {
        const list = createComicListItem(comic);
        matchList.appendChild(list);
    });
}

function createComicListItem(comic) {
    // const list = document.createElement('li');
    const list = createElement('li', {
        style: { width: '200px', height: '400px', display: 'flex', flexDirection: 'column', gap: '10px' }
    });
    const matchFigure = document.createElement('figure');
    // const matchImage = document.createElement('img');
    const matchImage = createElement('img', { src: `${comic.thumbnail.path}.${comic.thumbnail.extension}`, style: { width: '100%', height: '300px' } });
    // const matchNameP = document.createElement('p');
    const matchNameP = createElement('h3', { innerText: comic.title, style: { fontSize: '1.2rem', color: '#607d8b' } });

    // matchImage.src = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
    // matchNameP.innerText = comic.title;

    // list.style.width = '200px';
    // list.style.height = '400px';
    // list.style.display = 'flex';
    // list.style.flexDirection = 'column';
    // list.style.gap = '10px';

    // matchImage.style.width = '100%';
    // matchNameP.style.fontSize = '1.2rem';
    // matchNameP.style.color = '#607d8b';

    matchFigure.appendChild(matchImage);
    list.appendChild(matchFigure);
    list.appendChild(matchNameP);
    // list.appendChild(matchNameP);

    list.addEventListener('click', () => {
        matchList.innerHTML = "";
        handleComicClick(comic);
    });

    return list;
}

function styleCardCharacters(characters) {
    console.log('characters', characters);
    characters.forEach(character => {
        const list = createCharacterListItem(character);
        marvelList.appendChild(list);

        list.addEventListener('click', () => {
            matchList.innerHTML = "";
            big_card_char(character);
        });
    });
}

function createCharacterListItem(character) {
    const list = document.createElement('li');
    const image = document.createElement('img');
    const name = document.createElement('h3');

    image.src = `${character.thumbnail.path}.${character.thumbnail.extension}`;
    name.innerText = character.name;

    list.style.width = '200px';
    list.style.height = '400px';
    list.style.display = 'flex';
    list.style.flexDirection = 'column';
    list.style.gap = '10px';

    image.style.width = '100%';
    name.style.fontSize = '1.2rem';
    name.style.color = '#607d8b';

    list.appendChild(image);
    list.appendChild(name);

    return list;
}

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