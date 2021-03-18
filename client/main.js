import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.home.onCreated(function homeOnCreated() {
  let ctrl = this;
  this.movies = new ReactiveVar();
  HTTP.call('GET', 'http://localhost:3000/api/discover/movie', {},
      function(error, response) {
        // Handle the error or response here.
          ctrl.movies.set(JSON.parse(JSON.parse(response.content).content).results);
          console.log(JSON.parse(JSON.parse(response.content).content).results)
      });
});
Template.home.helpers({
  movies() {
    return Template.instance().movies.get();
  }
});
