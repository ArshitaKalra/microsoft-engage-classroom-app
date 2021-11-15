app.directive("topics", function() { // Added to an HTML just as class or id
	return {
		restrict: "A",  // E for Element
		link: function($scope, $element) {
			$scope.$on("new_topic", function(event, data) {
				$element.find("tbody").append(
					"<tr>"
						+"<td>"+data.category+"</td>"
						+"<td><a href='#/topic/"+data._id+"'>"+data.title+"</a></td>"
						+"<td><a href='#/user/"+data.user_id+"'>"+data.name+"</a></td>"
						+"<td></td>"
				   +"<tr>"
				);
			});
		}
	}
})
