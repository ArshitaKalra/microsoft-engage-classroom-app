//Kept all factories together due to small scope.

app.factory('userFactory', function($http, $location) {
	var factory = {};
	var thisUser = null;

	factory.readUsers = function(user, callback) {
		var newUser = true;
		$http.get('/user').success(function(data) {
			angular.forEach(data, function(regUser) {
				if(user.name == regUser.name) {
					console.log(user.name, "matches", regUser.name);
					newUser = false;
					thisUser = regUser;
					sessionStorage.setItem("currentuser", thisUser.name);
					sessionStorage.setItem("currentuserid", thisUser._id);
					$location.path('/dashboard');
				}
			})
// If user does not exist, create new user and redirect to dashboard
			if(newUser == true) {
				console.log("User is new, Creating...");
				$http.post('/user', user).success(function(data) {
					console.log("New user has been created...", data)
					thisUser = data;
					//using session storage to avoid losing data over refresh of dashboard
					sessionStorage.setItem("currentuser", thisUser.name);
					sessionStorage.setItem("currentuserid", thisUser._id);
					$location.path('/dashboard');
				})
			}
		})
		callback(thisUser);
	}

	factory.readUser = function(callback) {
		//getting from session storage to avoid losing data over refresh of dashboard
		var currentuser = sessionStorage.getItem("currentuser");
		var currentuserid = sessionStorage.getItem("currentuserid");
		var user = {_id:currentuserid, name:currentuser}
		callback(user);
	}

	factory.viewUser = function(id, callback) {
		$http.get('/user/'+id).success(function(data) {
			callback(data[0]);
		})
	}

	factory.updateUserTopics = function(data, name, callback) {
		var topics = [];
		angular.forEach(data, function(topic) {
			if(topic.user_id == name._id)
				topics.push(topic);
		})
		$http.post('/user/topics/'+name._id, {topics: topics}).success(function(data) {})
	}

	factory.updateUserPosts = function(info, name, callback) {
		var posts = [];
		angular.forEach(info, function(post) {
			if(post.user_id == name._id)
				posts.push(post);
		})
		$http.post('/user/posts/'+name._id, {posts: posts}).success(function(data) {
		})
	}

	return factory;
})

app.factory('topicFactory', function($http) {
	var factory = {};
	var currentUser = null;

	factory.createTopic = function(newTopic, callback) {
		$http.post('/topics', newTopic).success(function(data) {
			callback(data);
		})
	}

	factory.readTopics = function(callback) {
		$http.get('/topics').success(function(data) {
			callback(data);
		})
	}

	factory.getTopic = function(id, callback) {
		$http.get('/topics/'+id).success(function(data) {
			callback(data);
		})
	}

	factory.setUser = function(user, callback) {
		this.currentUser = user;
		callback(currentUser);
	}

	factory.getUser = function(data, callback) {
		this.currentUser = data;
		callback(currentUser);
	}

	factory.updateTopic = function(numOfPosts, id, callback) {
		$http.post('/topics/'+id, {posts: numOfPosts}).success(function(data) {
			callback(data);
		})
	}

	return factory;
})

app.factory('postFactory', function($http) {
	var factory = {};
	var topic_id = null;

	factory.setId = function(idForPost, callback) {
		idForPost = topic_id;
		callback(topic_id);
	}

	factory.readPosts = function(id, callback) {
		$http.get('/posts/'+id).success(function(data) {
			callback(data);
		})
	}

	factory.createPost = function(newPost, callback) {
		$http.post('/posts', newPost).success(function(data) {
			callback(data);
		})
	}

	factory.createComment = function(newComment, post, name, callback) {
		newComment.name = name.name
		newComment.user_id = name._id;
		newComment.topic_id = post.topic_id;
		newComment.post_id = post._id;
		$http.post('/comments', newComment).success(function(data) {
			var allComments = [];
			var comments = [];
			angular.forEach(data, function(comment) {
				allComments.push(comment);
				if(comment.user_id == name._id)
					comments.push(comment);
			})
			$http.post('/posts/'+post._id, {comments: allComments}).success(function(info) {
				callback(info);
			})
			console.log("comments from this post that match user", comments);
		})
	}
	return factory;
})
