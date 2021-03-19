import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import './script'


Template.home.onCreated(function homeOnCreated() {
  let ctrl = this;
  this.movies = new ReactiveVar();
  HTTP.call('GET', 'http://localhost:3000/api/discover/movie', {},
      function(error, response) {
        // Handle the error or response here.
          console.log(JSON.parse(response.content))
          ctrl.movies.set(JSON.parse(response.content));

      });
});
Template.home.helpers({
  movies() {
    return Template.instance().movies.get();
  }
});

Template.home.events({
    "click .likeButton": (elmt)=>{
        let button = elmt.target
        likeFilm(button)
    }
});



function likeFilm(button){

    let id = button.dataset.id
    console.log(id)
    HTTP.call('POST', "http://localhost:3000/api/like/"+id,{}, (error, response)=>{
        console.log("fn",response.content)
        console.log(button.children)
        if(response.content == "liked"){
            button.children[0] = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill h-100 " viewBox="0 0 16 16">'+
                                        '<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>'+
                                    '</svg>'
        }
    });
}


