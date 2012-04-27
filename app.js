var util = require('util');
var url = require('url');
var express = require('express');
// var nmDbEngine = 'sqlite3';
var nmDbEngine = 'mongoose';
var notesdb = require('./notesdb-' + nmDbEngine);
var app = express.createServer();
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.register('.html', require('ejs'));
app.set('views', __dirname + '/views-' + nmDbEngine);
app.set('view engine', 'ejs');

//设置静态资源目录
var static_dir = __dirname+'/public';
app.use(express.static(static_dir));

var parseUrlParams = function(req, res, next) {
    req.urlP = url.parse(req.url, true);
    next();
};
var checkAccess = function(req, res, next) {
    if (!req.cookies || ! req.cookies.notesaccess || req.cookies.notesaccess !== "AOK") {
        res.redirect('/login');
    } else {
        next();
    }
};
notesdb.connect(function(error) {
    if (error) throw error;
});
app.on('close', function(errno) {
    notesdb.disconnect(function(err) {});
});
app.get('/', function(req, res) {
    res.redirect('/view');
});
app.get('/view', checkAccess, function(req, res) {
    notesdb.allApps(function(err, apps) {
        if (err) {
            util.log('ERROR ' + err);
            throw err;
        } else res.render('viewnotes.html', {
            title: "Apps (" + nmDbEngine + ")",
            apps: apps
        });
    });
});
app.get('/add', function(req, res) {
    res.render('addedit.html', {
        title: "Apps (" + nmDbEngine + ")",
        postpath: '/add',
        app: notesdb.emptyApp
    });
});
app.post('/add', function(req, res) {
    notesdb.add(req.body.type, req.body.size, req.body.src, req.body.link, req.body.title, req.body.thumb, req.body.content, req.body.subtitle, req.body.direction, function(error) {
        if (error) throw error;
        res.redirect('/view');
    });
});
app.get('/edit', parseUrlParams, function(req, res) {
    notesdb.findAppById(req.urlP.query.id, function(error, app) {
        if (error) throw error;
        res.render('addedit.html', {
            title: "Apps (" + nmDbEngine + ")",
            postpath: '/edit',
            app: app
        });
    });
});
app.get('/del', parseUrlParams, function(req, res) {
    notesdb.delete(req.urlP.query.id, function(error) {
        if (error) throw error;
        res.redirect('/view');
    });
});
app.post('/edit', function(req, res) {
    notesdb.edit(req.body.id, req.body.type, req.body.size, req.body.src, req.body.link, req.body.title, req.body.thumb, req.body.content, req.body.subtitle, req.body.direction, function(error) {
        if (error) throw error;
        res.redirect('/view');
    });
});
app.get('/login', function(req, res) {
    res.render('login.html', {
        title: "Apps LOGIN (" + nmDbEngine + ")"
    });
});
app.post('/login', function(req, res) {
    // TBD check credentials entered in form
    res.cookie('notesaccess', 'AOK');
    res.redirect('/view');
});
app.get('/api/apps', function(req, res) {
    notesdb.allApps(function(err, apps) {
        if (err) {
            util.log('ERROR ' + err);
            throw err;
        } else {
            res.send(apps); 
        }
    });
});

app.listen(3000);

