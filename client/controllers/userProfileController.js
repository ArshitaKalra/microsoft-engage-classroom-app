//Controls the user.ejs page
app.controller('userProfileController', function($scope, $routeParams, userFactory) {
	var id = $routeParams.id;

	//gets all single user info
	userFactory.viewUser(id,function(data) {
		$scope.user = data;
	})

})
