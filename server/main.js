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
        let find = Likes.find({idFilm: films[i].id.toString()})
        //console.log(films[i].title , find.count())
        if (find.count() != 0){
            console.log(find.fetch()[0].likes)
            films[i].likes = find.fetch()[0].likes
        }else{
            films[i].likes = 0
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
        console.log(result)
        res.end(JSON.stringify(result))
    });

    //Like
    router.post('/api/like/:idMovie', (req, res, next) => {
        let result = "already liked"
        let id = req.params.idMovie;
        console.log(req.params)
        let find = Likes.find({idFilm : id.toString()})
        console.log(find.count() == 0 ? "Need add" : "need update")
        if(find.count() == 0 && id != undefined && id != null){
            let filmLiked = {
                idFilm: id.toString(),
                likes: 1,
            }

            Likes.insert(filmLiked)
            result = JSON.stringify(filmLiked)
        }
        else if(id != undefined || find.fetch().id != undefined && id != null){

            console.log(find.fetch())
            Likes.update({idFilm: id.toString()}, {$inc: {likes:1}} )
            result = JSON.stringify(Likes.findOne({idFilm: id.toString()}))

        }
        res.end(result)

    })
}))

