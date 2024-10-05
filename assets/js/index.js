const url = 'http://gateway.marvel.com/';
const urlComics = 'v1/public/comics';
const urlCharacters = 'v1/public/characters';
const keyHash = '?ts=1&apikey=20ef376510097f50f89a7cf2b98cc1ce&hash=3c0bdb616f415c7a9a47908b7f5d4814';
const modeLightDark = document.getElementById('mode-light-dark');
const divModeButton = document.getElementById('div-mode-button');
let mode = 'dark';
const iconMode = document.getElementById('icon-mode');
const tipoComicCharacter = document.getElementById('tipo-comic-character');
const searchInput = document.getElementById('search-input');
const marvelList = document.getElementById('marvel-list');

async function getApiMarvel(){
    try{
        let inputType = tipoComicCharacter.value
        let inputSearch = searchInput.value
        console.log('input searh',inputType)
        if (inputType == 'comic'){
            search_param = '&titleStartsWith='
            url_type = urlComics
        } else {
            search_param = '&nameStartsWith='
            url_type = urlCharacters
        }

        let filter_title ='';
        if (inputSearch){
            filter_title = search_param + inputSearch;   
        }

        url_final = url+url_type+keyHash + filter_title;

        marvelList.innerHTML = '';
        const response = await fetch(url_final);
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

function modeLD(){
    if (mode === 'dark'){
        document.body.style.background = '#181818';
        // divModeButton.style.background = '#181818';
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
        // divModeButton.style.background = '#e2e8f0';
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

function searchComics(titleComic){
    
}

function displayTotal(total){
    let comicsResults = document.getElementById('comics-results');
    comicsResults.innerText = total + ' RESULTADOS';
}

function styleCardComics(comics){
    console.log('comics',comics)
    comics.forEach(comic => {
        const list = document.createElement('li');
        const image = document.createElement('img');
        const tittle = document.createElement('h3');
        // if (comic.images.length > 0){
        //     console.log(comic.images)
            image.src = comic.thumbnail.path + '.' + comic.thumbnail.extension;
        // }
        
        tittle.innerText = comic.title;
        list.style.width = '90%';
        list.style.display = 'flex';
        list.style.flexDirection = 'column';
        list.style.gap = '10px';
        image.style.width = '100%';
        tittle.style.fontSize = '1.2rem';
        tittle.style.color = '#607d8b';
        list.appendChild(image);
        list.appendChild(tittle);
        marvelList.appendChild(list);
    });
}

function styleCardCharacters(comics){
    console.log('chares',comics)
    comics.forEach(comic => {
        const list = document.createElement('li');
        const image = document.createElement('img');
        const name = document.createElement('h3');
        // if (comic.images.length > 0){
        //     console.log(comic.images)
            image.src = comic.thumbnail.path + '.' + comic.thumbnail.extension;
        // }
        
        name.innerText = comic.name;
        list.style.width = '90%';
        list.style.display = 'flex';
        list.style.flexDirection = 'column';
        list.style.gap = '10px';
        image.style.width = '100%';
        name.style.fontSize = '1.2rem';
        name.style.color = '#607d8b';
        list.appendChild(image);
        list.appendChild(name);
        marvelList.appendChild(list);
    });
}

function styleCard(data, type){
    if (type=='comic'){
        styleCardComics(data)
    }
    else{
        styleCardCharacters(data)
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getApiMarvel();
});