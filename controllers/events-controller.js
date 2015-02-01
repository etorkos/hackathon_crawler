app.controller('eventsController', ['$scope', '$resource', function ($scope, $resource) {
  var Event = $resource('/api/meetups');

  Event.query(function (results) {
    $scope.meetups = results;
  });

  $scope.meetups = []

  $scope.createMeetup = function () {
    var meetup = new Meetup();
    meetup.name = $scope.meetupName;
    meetup.$save(function (result) {
      $scope.meetups.push(result);
      $scope.meetupName = '';
    });
  }
}]);