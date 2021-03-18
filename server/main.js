import { Meteor } from 'meteor/meteor';

import { localDatas } from './local-datas.js';

Meteor.startup(() => {});
WebApp.connectHandlers.use('/api/discover/movie', (req, res, next) => {


    const result = HTTP.call('GET', 'https://api.themoviedb.org/3/discover/movie?api_key=8cce820f4a3f0e0254ff5512352682fe&language=fr-FR', {});


    res.end(JSON.stringify(result))
});
