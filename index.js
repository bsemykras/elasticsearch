/**
 * Created by okostiuk on 25.03.15.
 */
var elasticsearch = require('elasticsearch');//подключаем elasticsearch
var async = require('async');
var mongoose = require('mongoose');//подлючаем базу данних mongoose

mongoose.connect('mongodb://127.0.0.1:27017/ads');//создаем безу данних на mongoose

//має бути var db = mongoose.connection;

db.on('error', function (err) {
    console.log('connection error:', err.message);//виводим ошибку если не удалось подключиться к базе
});

db.once('open', function () {
    var db = mongoose.connection;//поблючаемся к базе (незнаю или робочие изменения)
    console.log("Connected to DB!");//виводим сообщение об вдалом подключении
});

var Schema = mongoose.Schema;//создаем схему mongoose бази

var ads = new Schema({
    origin_id: { type: Number, required: true, default: 9332342 },//создаем таблицу
    realty_id: { type: Number, required: true },
    ads_proc: { type: Number, required: true }
});

var adsModel = mongoose.model('ads', ads);//создаем модель бази

var adsField;

var client = new elasticsearch.Client({//создаем клиент для elasticsearch
    host: '10.1.18.18:9200',
    log: 'trace'
});

client.search({//создаем запрос для elasticsearch
    index: 'search_index',
    type: 'search_type',
    body: {
        _source: 'realty_id',
        query: {
            match: {
                city_name: "Винница"
            }
        },
        from : 0,
        size : 250
    }
}).then(function (resp) {

var hits = resp.hits.hits;

hits.forEach(
    function(itm){
        adsField = new adsModel({
            realty_id: itm._source.realty_id,
            ads_proc: Math.random()*100
        });

        adsField.save(function (err,res){
            console.log(err,res); //process.exit(0);
        });
    }
);
mongoose.disconnect();

}, function (err) {
    console.trace(err.message);//виводим сообщение об ошибке если не удалось получить ответ от elasticsearch
});





