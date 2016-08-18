angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$state) {
    var phone = window.localStorage.getItem('phone');
    if(phone === null){
      //console.log(phone);
      $state.go('login');
    }
    $scope.phone = phone;
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('LoanDetails', function($scope){})

.controller('Login', function($scope,$state){
  $scope.signin = function(user){
    //console.log(user);
    //alert(user);
    window.localStorage.setItem('phone',user.phone);
    $state.go('tab.dash');
  }
})

.controller('AccountCtrl', function($scope,$state) {
  $scope.signout = function(){
    window.localStorage.removeItem('phone');
    $state.go('login');
  };
});
