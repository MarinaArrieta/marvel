async function getApiMarvel(){
    try{
        const response = await fetch('http://gateway.marvel.com/v1/public/comics?ts=1&apikey=20ef376510097f50f89a7cf2b98cc1ce&hash=3c0bdb616f415c7a9a47908b7f5d4814');
        const parsedMarvel = await response.json();
        console.log(parsedMarvel);
    
    }
    catch(error){
        console.error(error);
    }
}

getApiMarvel();