import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import './script'

Template.render('home', {main: 'main'})
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

    let id = button.dataset.idfilm
    console.log(button)
    if(id != null){
        HTTP.call('POST', "http://localhost:3000/api/like/"+id?.toString(),{}, (error, response)=>{
            console.log(response,error)
            let responseJSON = JSON.parse(response.content)
            if(!error && responseJSON.idFilm.toString() == id.toString()){
                let likesNb = button.parentNode.children[1]
                likesNb.innerHTML = responseJSON.likes.toString()
            }
        });
    }
}


