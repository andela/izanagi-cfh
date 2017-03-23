var async = require('async');

module.exports = function(app, passport, auth) {
    // User Routes
    var users = require('../app/controllers/users');
    const usersApi = require('../app/controllers/api/users');
    const appInvites = require('../app/controllers/api/appInvites');


    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/chooseavatars', users.checkAvatar);
    app.get('/signout', users.signout);

    //Setting up the users api
    app.post('/api/auth/login', users.signin);
    app.post('/api/auth/signup', users.create);
    app.post('/users/avatars', users.avatars);

    // Donation Routes
    app.post('/donations', users.addDonation);

    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: 'Invalid email or password.'
    }), users.session);

    app.get('/users/me', users.me);
    app.get('/users/:userId', users.show);

    //Setting the facebook oauth routes
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email'],
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the github oauth routes
    app.get('/auth/github', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/github/callback', passport.authenticate('github', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the twitter oauth routes
    app.get('/auth/twitter', passport.authenticate('twitter', {
        failureRedirect: '/signin'
    }), users.signin);

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Setting the google oauth routes
    app.get('/auth/google', passport.authenticate('google', {
        failureRedirect: '/signin',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }), users.signin);

    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/signin'
    }), users.authCallback);

    //Finish with setting up the userId param
    app.param('userId', users.user);

    // Answer Routes
    var answers = require('../app/controllers/answers');
    app.get('/answers', answers.all);
    app.get('/answers/:answerId', answers.show);
    // Finish with setting up the answerId param
    app.param('answerId', answers.answer);

    // Question Routes
    var questions = require('../app/controllers/questions');
    app.get('/questions', questions.all);
    app.get('/questions/:questionId', questions.show);
    // Finish with setting up the questionId param
    app.param('questionId', questions.question);

    // Avatar Routes
    var avatars = require('../app/controllers/avatars');
    app.get('/avatars', avatars.allJSON);

    //Home route
    var index = require('../app/controllers/index');
    app.get('/play', index.play);
    app.get('/', index.render);

    // Search Route
    const search = require('../app/controllers/search');
    app.get('/api/search/users/:inviteeUsername', search.searchUsers);

    var startGame = require('../app/controllers/start-game');
    app.get('/api/games/:id', startGame.getGameRecords);
    app.post('/api/games/:id/start', startGame.saveRecords);
    app.post('/api/games/:id/end', startGame.updateRecords);

    // Mail Invite Route
    const mailer = require('../app/controllers/mailer');
    app.post('/api/invite/user', mailer.invite);

    // Add friends api
    app.post('/api/users/friends', usersApi.addFriend);

    // Search Friends api
    app.get('/api/users/search/friends/:email', usersApi.searchFriends);

    // Send in-app message api
    app.post('/api/users/friends/send-invites', appInvites.appNotify);
    app.get('/api/users/get-notifications', appInvites.getNotifications);
    app.put('/api/users/notifications/:notificationId', appInvites.viewNotification);
};
