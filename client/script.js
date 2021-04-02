
document.addEventListener('DOMContentLoaded', () => {
    let searchBar = document.querySelector('#searchbar');

    searchBar.addEventListener('input', (e)=>{
        searchFilm(searchBar.value)
    })

    searchBar.addEventListener('focusout', ()=>{
        let listResult = document.querySelector("#results")
        setTimeout(()=>{
            listResult.innerHTML= "";
        }, 200)
    })

    searchBar.addEventListener('focusin', ()=>{
        if(searchBar.value != ""){
            searchFilm(searchBar.value)
        }
    })

});

function searchFilm(value){
    let listResult = document.querySelector("#results")
    value = value.replace(" ", "+")

    HTTP.call('POST', "http://localhost:3000/api/search/"+value,{}, (error, response)=>{
        console.log("search");
        console.log(JSON.parse(JSON.parse(response.content).content).results);
        let results = JSON.parse(JSON.parse(response.content).content).results
        listResult.innerHTML = ""
        for (let i = 0; i < 4; i++) {
            listResult.innerHTML += "<div class='w-100 d-flex p-2 justify-content-between result'>"+
                "<a href='#' class='text-light'>"+results[i].title+"</a>"+
                "<img src='https://image.tmdb.org/t/p/w200/"+ results[i].poster_path +"' class='rounded' style='width: 70px'>"+
                "</div>"
        }
    });
}



