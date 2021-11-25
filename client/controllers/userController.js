//Controls the login function
app.controller('userController', function($scope, $routeParams, userFactory) {
	var id = $routeParams.id;
	
	//see if user is an existing user or a new one.
	$scope.checkUser = function(user) {
		user={}
		user.name=$routeParams.user;
		userFactory.readUsers(user, function(data) {
			session_user = data;
		})
	}

})
