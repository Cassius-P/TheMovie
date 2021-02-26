import { Meteor } from 'meteor/meteor';

import { localDatas } from './local-datas.js';

Meteor.startup(() => {});
WebApp.connectHandlers.use('/api/discover/movie', (req, res, next) => {
    res.writeHead(200);
    res.end(JSON.stringify(localDatas));
});
