var util = require('util');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dburl = 'mongodb://localhost/mesktop';
exports.connect = function(callback) {
    mongoose.connect(dburl);
};
exports.disconnect = function(callback) {
    mongoose.disconnect(callback);
};
exports.setup = function(callback) {
    callback(null);
};
var AppSchema = new Schema({
    ts: {
        type: Date,
        default: Date.now
    },
    type: String,
    size: String,
    src: String,
    link: String,
    title: String,
    thumb: String,
    content: String,
    subtitle: String,
    direction: String
});
mongoose.model('App', AppSchema);
var App = mongoose.model('App');
exports.emptyApp = {
    "_id": '',
    type: '',
    size: '',
    src: '',
    link: '',
    title: '',
    thumb: '',
    content: '',
    subtitle: '',
    direction: ''
};
exports.add = function(type, size, src, link, title, thumb, content, subtitle, direction, callback) {
    var newApp = new App();
    newApp.type = type;
    newApp.size = size;
    newApp.src = src;
    newApp.link = link;
    newApp.title = title;
    newApp.thumb = thumb;
    newApp.content = content;
    newApp.subtitle = subtitle;
    newApp.direction = direction;
    newApp.save(function(err) {
        if (err) {
            util.log('FATAL ' + err);
            callback(err);
        } else callback(null);
    });
};
exports.delete = function(id, callback) {
    exports.findAppById(id, function(err, doc) {
        if (err) callback(err);
        else {
            util.log(util.inspect(doc));
            doc.remove();
            callback(null);
        }
    });
};
exports.edit = function(id, type, size, src, link, title, thumb, content, subtitle, direction, callback) {
    exports.findAppById(id, function(err, doc) {
        if (err) callback(err);
        else {
            doc.ts = new Date();
            doc.type = type;
            doc.size = size;
            doc.src = src;
            doc.link = link;
            doc.title = title;
            doc.thumb = thumb;
            doc.content = content;
            doc.subtitle = subtitle;
            doc.direction = direction;
            doc.save(function(err) {
                if (err) {
                    util.log('FATAL ' + err);
                    callback(err);
                } else callback(null);
            });
        }
    });
};
exports.allApps = function(callback) {
    App.find({},
    callback);
};
exports.forAll = function(doEach, done) {
    App.find({},
    function(err, docs) {
        if (err) {
            util.log('FATAL ' + err);
            done(err, null);
        }
        docs.forEach(function(doc) {
            doEach(null, doc);
        });
        done(null);
    });
};
var findAppById = exports.findAppById = function(id, callback) {
    App.findOne({
        _id: id
    },
    function(err, doc) {
        if (err) {
            util.log('FATAL ' + err);
            callback(err, null);
        }
        callback(null, doc);
    });
};

