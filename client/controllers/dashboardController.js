//Controls the dashboard.ejs
app.controller('dashboardController', function($scope, topicFactory, userFactory) {
	$scope.newTopic = {};

	//get single user data
	userFactory.readUser(function(data) {
		$scope.user = data;
	})

	//create a new topic from form
	$scope.createTopic = function(newTopic, name) {
		newTopic.name = name.name;
		newTopic.user_id = name._id;
		topicFactory.createTopic(newTopic, function(data, info) {
			userFactory.updateUserTopics(data, name, function(info) {});
			$scope.topics = data.data;
			$scope.newTopic = {};
			socket.emit('created_topic', data.info);
		})
	}

	//monitors creation of new topics
	socket.on('topic_added', function(data) {
		$scope.$broadcast("new_topic", data);
	})

	//gets all topics for display
	topicFactory.readTopics(function(data) {
		$scope.topics = data;
	})
})
