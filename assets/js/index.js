async function getApiMarvel(){
    try{
        const response = await fetch('http://gateway.marvel.com/v1/public/comics?ts=1&apikey=20ef376510097f50f89a7cf2b98cc1ce&hash=3c0bdb616f415c7a9a47908b7f5d4814');
        const parsedMarvel = await response.json();
        console.log(parsedMarvel);
        
        let totalComics = parsedMarvel.data.total;
        display_total(totalComics)
        styleCardComics(parsedMarvel.data.results);
    }
    catch(error){
        console.error(error);
    }
}

getApiMarvel();

const tipoComicCharacter = document.getElementById('tipo-comic-character');
function display_total(total){
    let comicsResults = document.getElementById('comics-results');
    comicsResults.innerText = total + ' RESULTADOS';
}

const marvelList = document.getElementById('marvel-list');
function styleCardComics(comics){
    console.log(comics)
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