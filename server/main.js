import { Meteor } from 'meteor/meteor';
import crypto from 'crypto'
import connectRoute from 'connect-route'


import { localDatas } from './local-datas.js';
const Likes = new Mongo.Collection('likes')

Meteor.startup(() => {});
WebApp.connectHandlers.use('/api/discover/movie', (req, res, next) => {

    let result = HTTP.call('GET', 'https://api.themoviedb.org/3/discover/movie?api_key=8cce820f4a3f0e0254ff5512352682fe&language=fr-FR', {});

    let films = JSON.parse(result.content).results
    /*console.log(films)*/
    for (let i = 0; i < films.length; i++) {
        console.log(films[i].title , Likes.find({idFilm: films[i].id.toString()}).count() != 0 ? 'was liked' : "wasn't liked")
        if (Likes.find({idFilm: films[i].id.toString()}).count() != 0){
            films[i].liked = true
            films[i].vote_count += 1;
        }else{
            films[i].liked = false
        }
    }


    res.end(JSON.stringify(films))
});



WebApp.connectHandlers.use(connectRoute(function (router) {

    //Search
    router.post('/api/search/:textInput', (req, res, next) => {

        let content = req.params.textInput;
        console.log(JSON.stringify(req.params.textInput))
        let url = 'https://api.themoviedb.org/3/search/movie?api_key=8cce820f4a3f0e0254ff5512352682fe&language=fr-FR&page=1&include_adult=true&query='+content;
        console.log(url)
        let result = HTTP.call('GET', url, {})

        res.end(JSON.stringify(result))
    });

    //Like
    router.post('/api/like/:idMovie', (req, res, next) => {
        let result = "already liked"
        let id = req.params.idMovie;
        console.log(Likes.find({'idFilm' : id}).fetch())
        if(Likes.find({idFilm : id.toString()}).count() == 0 && id != undefined && id != null){
            console.log("id", id)

            let filmLiked = {
                idFilm: id,
                liked: true,
            }

            Likes.insert(filmLiked)
            result = "liked"
        }
        res.end(result)
    })
}))

