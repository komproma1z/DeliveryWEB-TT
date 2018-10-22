const index = angular.module('myApp', ['ngRoute']);
index.config($routeProvider => {
    $routeProvider
    .when("/", {
        templateUrl : "views/signin.html"
    })
    .when("/profile", {
        templateUrl : "views/profile.html"
    })
    .otherwise({
        templateUrl : "views/404.html"
    });
});

index.controller('siCtrl', ($location, $http) => {
    let currentURL = $location.url().split('=');
    currentURL = currentURL[1].split('&');
    const accessToken = currentURL[0];
    $http.get(`https://api.vk.com/method/users.get?fields=photo_50&access_token=${accessToken}&v=5.52`)
    .then(res => {
        localStorage.setItem('user', JSON.stringify(res.data.response[0]));
        $http.get(`https://api.vk.com/method/friends.search?count=50&fields=photo_50&access_token=${accessToken}&v=5.52`)
        .then(res => {
        localStorage.setItem('friends', JSON.stringify(res.data.response.items));
        $location.url("/profile")
    });});
    
    
});

index.controller('pCtrl', $scope => {
    const user = JSON.parse(localStorage.getItem('user'));
    const friends = JSON.parse(localStorage.getItem('friends'));
    $scope.userPhoto = user.photo_50;
    $scope.userData = user.first_name + ' ' + user.last_name;
    $scope.friendList = []
    if (friends.length !== 0) {
        const count = friends.length >= 5 ? 5 : friends.length;
        for (let i = 0; i < count; i++) {
            $scope.friendList.push(
            {
                Photo: friends[i].photo_50,
                Fullname: friends[i].first_name + ' ' + friends[i].last_name
            });
    }}});