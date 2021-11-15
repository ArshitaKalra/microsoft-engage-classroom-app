var app = angular.module("app", ['ngRoute']);

//Note some mixed controller assignment also found in EJS page.
app.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: './views/main.ejs',
		controller: 'userController'
	})
	.when('/dashboard', {
		templateUrl: './views/dashboard.ejs',
		controller: 'dashboardController'
	})
	.when('/topic/:id', {
		templateUrl: './views/topic.ejs',
		controller: 'topicController'
	})
	.when('/user/:id', {
		templateUrl: './views/user.ejs',
	})
	.otherwise({
		redirectTo: '/'
	})
})
