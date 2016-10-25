angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$state) {
    $scope.phone = window.localStorage.getItem('phone');
    $scope.first_name = window.localStorage.getItem('first_name');
    $scope.last_name = window.localStorage.getItem('last_name');
    if($scope.phone == null){
      $state.go('login');
    }
})

.controller('SavingsCtrl', function($scope,$ionicLoading,$http,$state,$ionicPopup) {
  $scope.show = function() {$ionicLoading.show({template: '<p>Loading...</p><ion-spinner></ion-spinner>'});};
  $scope.hide = function(){$ionicLoading.hide();};
  $scope.phone = window.localStorage.getItem('phone');
  $scope.user = {};
  $scope.savings = {};

  $scope.showAlert = function($message) {
    var alertPopup = $ionicPopup.alert({
      title: 'iNuka Pap',
      template: $message
    });
    alertPopup.then(function(res) {
      //console.log('Thank you for not eating my delicious ice cream cone');
    });
  };

  $scope.facebook = function(){
    window.open('https://www.facebook.com/inukapap', '_system')
  };

  $scope.auth = function(user){
    var pin = "";
    var phone = window.localStorage.getItem("phone");
    if(user.pin == "" || user.pin == null ){
      $scope.showAlert("Kindly enter your pin");
      return;
    }
    else{      
      $scope.show($ionicLoading);
      $http({
        method: 'POST',
        url : 'http://app.inukapap.co.ke/api/authPinApp',      
        data: {'pin':user.pin, 'phone':phone, 'savings':true},
        headers : {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      }).then(function(response){
          $scope.hide($ionicLoading);
          if(response.data.error){
            $scope.showAlert(response.data.error);
          }else{
            var balance = parseInt(response.data.deposit);
            $scope.balance = Math.abs(balance);
          }

        },
        function (response){
          $scope.hide($ionicLoading);
          $scope.showAlert("Network problem, Try Again");
        }
      );
    }
    $scope.user.pin = ""; 
  };

  $scope.savingsRequest = function(savings){
    
    var phone = window.localStorage.getItem("phone");
    var pin   = savings.pin;
    if(savings.pin == null || savings.pin == ""){
          $scope.showAlert("Kindly enter your pin");
          return;
    }else if(savings.amount == null || savings.amount == ""){
          $scope.showAlert("Type Amount to Withdraw");
          return;
    }else{
      $scope.show($ionicLoading);
      $http({
        method: 'POST',
        url : 'http://localhost:8000/api/authPinApp',      
        data: {'pin':savings.pin, 'phone':phone,'amount':savings.amount, 'savingsRequest':true },
        headers : {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      }).then(function(response){
          $scope.hide($ionicLoading);
          if(response.data.error){
            $scope.showAlert(response.data.error);
            console.log(response.data);
          }else{
            if(response.data.error){
              //console.log(response);
              $scope.showAlert(response.data.error);
            }
            var balance = parseInt(response.data.balance);
            if(balance < 0){
              $scope.balance = Math.abs(balance);
            }else{
              $scope.balance = 0;
            }
            $scope.loan_limit = response.data.loan_limit;
            console.log(response.data);
          }
        },
        function (response){
          $scope.hide($ionicLoading);
          $scope.showAlert("Network problem, Try Again");
        }
      );
    }
    $scope.savings.pin = ""; 
    $scope.savings.amount = ""; 
  };

  var phone = window.localStorage.getItem("phone");
  $http({
      method: 'POST',
      url : 'http://app.inukapap.co.ke/api/readBeneficiaries',      
      data: {'phone':phone},
      headers : {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    }).then(function(response){
        $scope.hide($ionicLoading);
        $scope.nobeneficiaries  = true;
        if(response.data.error){
          $scope.showAlert(response.data.error);                   
        }else if(response.data.info){
          if(response.data.info.length >= 0){
            $scope.beneficiaries  = response.data.info;
          }
          $scope.user_id        = response.data.user_id;
        }else{
          console.log(response);
        }
      },
      function (response){
        $scope.hide($ionicLoading);
        $scope.showAlert("Network problem, Try Again");
      }
    );
})

.controller('RegisterCtrl', function($scope,$ionicLoading,$http,$state,$ionicPopup,ionicDatePicker) {
  
  $scope.show = function() {$ionicLoading.show({template: '<p>Loading...</p><ion-spinner></ion-spinner>'});};
  $scope.user = {};
  $scope.hide = function(){$ionicLoading.hide();};

  $scope.currentDate = new Date();

  var ipObj1 = {
      callback: function (val) {  //Mandatory
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        $scope.currentDate = new Date(val);
      },
    };
  $scope.openDatePicker = function(){
      ionicDatePicker.openDatePicker(ipObj1);
  };

  $scope.showAlert = function($message) {
    var alertPopup = $ionicPopup.alert({
      title: 'iNuka Pap',
      template: $message
    });
    alertPopup.then(function(res) {
      //console.log('Thank you for not eating my delicious ice cream cone');
    });
  };

  $scope.register = function(user){
    var dob = $scope.currentDate.getFullYear()+"-"+$scope.currentDate.getMonth()+"-"+$scope.currentDate.getDate();
    if(user.first_name == null || user.first_name == ""){
          $scope.showAlert("Kindly enter your first name");
          return;
    }else if(user.location == null || user.location == ""){
          $scope.showAlert("Type your location please");
          return;
    }else if(user.pin == null || user.pin == ""){
          $scope.showAlert("Type your pin please");
          return;
    }else if(user.confirmpin == null || user.confirmpin == ""){
          $scope.showAlert("Please confirm your pin");
          return;
    }else if(user.pin != user.confirmpin){
          $scope.showAlert("Pin don't match");
          return;
    }else if(user.employed == null || user.employed == ""){
          $scope.showAlert("Select your occupation type please");
          return;
    }else if(user.last_name == null || user.last_name == ""){
          $scope.showAlert("Type your last name");
          return;
    }else if(user.phone == null || user.phone == ""){
          $scope.showAlert("Please enter your phone number");
          return;
    }else if(user.idno == "" || user.idno == null){
          $scope.showAlert("Please enter your ID number");
          return;
    }else{
      $http({
        method: 'POST',
        url : 'http://app.inukapap.co.ke/api/regUser',      
        data: {'first_name': user.first_name,'last_name': user.last_name,'phone':user.phone,'idno':user.idno,
              'location': user.location, 'dob': dob, 'employed':user.employed, 'pin': user.pin
            },
        headers : {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      }).then(function(response){
          $scope.hide($ionicLoading);
          if(response.data.error){
            console.log(response.data);
            $scope.showAlert(response.data.error);
          }else{
            console.log(response);
          }
        },
        function (response){
          $scope.hide($ionicLoading);
          $scope.showAlert("Network problem, Try Again");
        }
      );
    }
    
  };
})

.controller('FunctionsCtrl', function($scope, $stateParams) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('LoanCtrl', function($scope,$ionicLoading,$http,$state,$ionicPopup){

  //200 = status for loan request;
  $scope.show = function() {$ionicLoading.show({template: '<p>Loading...</p><ion-spinner></ion-spinner>'});};
  $scope.hide = function(){$ionicLoading.hide();};
  $scope.phone = window.localStorage.getItem('phone');
  $scope.user = {};
  $scope.loan = {};

  $scope.facebook = function(){
    window.open('https://www.facebook.com/inukapap', '_system')
  };

  $scope.showAlert = function($message) {
    var alertPopup = $ionicPopup.alert({
      title: 'iNuka Pap',
      template: $message
    });
    alertPopup.then(function(res) {
      //console.log('Thank you for not eating my delicious ice cream cone');
    });
  };

  $scope.auth = function(user){
    
    var phone = window.localStorage.getItem("phone");
    var pin   = user.pin;
    if(user.pin == null || user.pin == ""){
          $scope.showAlert("Kindly enter pin");
    }else{
      $scope.show($ionicLoading);
      $http({
        method: 'POST',
        url : 'http://app.inukapap.co.ke/api/authPinApp',      
        data: {'pin':user.pin, 'phone':phone},
        headers : {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      }).then(function(response){
          $scope.hide($ionicLoading);
          if(response.data.error){
            $scope.showAlert(response.data.error);
          }else{
            var balance = parseInt(response.data.balance);
            if(balance < 0){
              $scope.balance = Math.abs(balance);
            }else{
              $scope.balance = 0;
            }
            $scope.loan_limit = response.data.loan_limit;
            console.log(response);
          }
        },
        function (response){
          $scope.hide($ionicLoading);
          $scope.showAlert("Network problem, Try Again");
        }
      );
    }
    $scope.user.pin = ""; 
  };


  $scope.loanRequest = function(loan){
    
    var phone = window.localStorage.getItem("phone");
    var pin   = loan.pin;
    if(loan.pin == null || loan.pin == ""){
          $scope.showAlert("Kindly enter your pin");
          return;
    }else if(loan.amount == null || loan.amount == ""){
          $scope.showAlert("Type Amount to Borrow");
          return;
    }else{
      $scope.show($ionicLoading);
      $http({
        method: 'POST',
        url : 'http://app.inukapap.co.ke/api/authPinApp',      
        data: {'pin':loan.pin, 'phone':phone,'amount':loan.amount, 'loanRequest':true },
        headers : {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      }).then(function(response){
          $scope.hide($ionicLoading);
          if(response.data.error){
            $scope.showAlert(response.data.error);
            console.log(response.data);
          }else{
            if(response.data.error){
              //console.log(response);
              $scope.showAlert(response.data.error);
            }
            var balance = parseInt(response.data.balance);
            if(balance < 0){
              $scope.balance = Math.abs(balance);
            }else{
              $scope.balance = 0;
            }
            $scope.loan_limit = response.data.loan_limit;
            console.log(response.data);
          }
        },
        function (response){
          $scope.hide($ionicLoading);
          $scope.showAlert("Network problem, Try Again");
        }
      );

    }
    $scope.loan.pin = ""; 
    $scope.loan.amount = ""; 
  };
})

.controller('Login', function($scope,$state,$http,$ionicLoading,$ionicPopup,$ionicHistory){
  $ionicHistory.clearHistory();
  $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
  });
  $scope.show = function() {$ionicLoading.show({template: '<p>Loading...</p><ion-spinner></ion-spinner>'});};
  
  $scope.hide = function(){$ionicLoading.hide(); };
  $scope.user = {};

  $scope.showAlert = function($message) {
    var alertPopup = $ionicPopup.alert({
      title: 'iNuka Pap',
      template: $message
    });
    alertPopup.then(function(res) {
      //console.log('Thank you for not eating my delicious ice cream cone');
    });
  };

  $scope.signin = function(user){
    //console.log(user);
    //alert(user);


    if(user.idno == null || user.idno == ""){
          $scope.showAlert("Kindly enter your ID number");
          return;
    }else if(user.phone == null || user.phone == ""){
          $scope.showAlert("Kindly enter your Phone Number");
          return;
    }else if(user.code == null || user.code == ""){
          $scope.showAlert("Kindly enter the code sent via SMS from iNuka Pap");
          return;
    }else{
        $scope.show($ionicLoading);
        $http({
          method: 'POST',
          url : 'http://app.inukapap.co.ke/api/authRegApp',      
          data: {'idno':user.idno, 'phone':user.phone,'confirmation_code':user.code},
          headers : {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function(response){
            $scope.hide($ionicLoading);
            if(response.data.error){
              $scope.showAlert(response.data.error);
            }else{
              window.localStorage.setItem('phone',user.phone);
              window.localStorage.setItem('idno',user.idno);
              window.localStorage.setItem('first_name',response.data.first_name);
              window.localStorage.setItem('last_name',response.data.last_name);
              console.log(response.data);
              $state.go('tab.dash');
            }
          },
          function (response){
            $scope.hide($ionicLoading);
            $scope.showAlert("Network problem, Try Again");
          }
        );
    }
  }

  $scope.confirmation = function(user){
    //console.log(user);
    //alert(user);


    if(user.idno == null || user.idno == ""){
          $scope.showAlert("Kindly enter your ID number");
          return;
    }else if(user.phone == null || user.phone == ""){
          $scope.showAlert("Kindly enter your Phone Number");
          return;
    }else{
        $scope.show($ionicLoading);
        $http({
          method: 'POST',
          url : 'http://app.inukapap.co.ke/api/authConfirmation',      
          data: {'idno':user.idno, 'phone':user.phone},
          headers : {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function(response){
            $scope.hide($ionicLoading);
            if(response.data.error){
              $scope.showAlert(response.data.error);
            }else{
              $scope.showAlert(response.data.info);
            }
          },
          function (response){
            $scope.hide($ionicLoading);
            $scope.showAlert("Network problem, Try Again");
          }
        );
    }
  }
})

.controller('AccountCtrl', function($scope,$state,$ionicHistory,$ionicLoading,$http,$cordovaCamera,$cordovaFileTransfer,$ionicPopup,ionicDatePicker,$cordovaCamera) {
  
  $scope.show = function() {$ionicLoading.show({template: '<p>Loading...</p><ion-spinner></ion-spinner>'});};
  $scope.hide = function(){$ionicLoading.hide();};

  $scope.currentDate = new Date();

  var ipObj1 = {
      callback: function (val) {  //Mandatory
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        $scope.currentDate = new Date(val);
      },
    };
  $scope.openDatePicker = function(){
      ionicDatePicker.openDatePicker(ipObj1);
  };
  $scope.showAlert = function($message) {
    var alertPopup = $ionicPopup.alert({
      title: 'iNuka Pap',
      template: $message
    });
    alertPopup.then(function(res) {
      //console.log('Thank you for not eating my delicious ice cream cone');
    });
  };

  $scope.facebook = function(){
    window.open('https://www.facebook.com/inukapap', '_system')
  };

  $scope.signout = function(){
    window.localStorage.removeItem('phone');
    window.localStorage.removeItem('idno');
    window.localStorage.removeItem('first_name');
    window.localStorage.removeItem('last_name');
    $ionicHistory.clearHistory();
    $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
    });
    window.close();
    ionic.Platform.exitApp();
  };

  $scope.upload = function(id){
    
      var options = {
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      };

      $cordovaCamera.getPicture(options).then(function(imageURI) {
        //var image = document.getElementById(id);
        //image.src = imageURI;
        $scope.photo = imageURI;
        $scope.showAlert(imageURI);

        $cordovaFileTransfer.upload('http://app.inukapap.co.ke/api/uploadImage', imageURI, options)
          .then(function(result) {
            $scope.showAlert(result);
          }, function(err) {
            $scope.showAlert(err);
          }, function (progress) {
          });

      }, function(err) {
        // error
        $scope.showAlert(err);
      });

      //$cordovaCamera.cleanup().then(); // only for FILE_URI
  }

  $scope.beneficiary = function(user){
    var dob = $scope.currentDate.getFullYear()+"-"+$scope.currentDate.getMonth()+"-"+$scope.currentDate.getDate();
    var phone = window.localStorage.getItem("phone");
    $http({
      method: 'POST',
      url : 'http://app.inukapap.co.ke/api/beneficiary',      
      data: {'names':user.names,'phone':phone,'idno':user.idno,'dob':dob,'employed':user.relation
          },
      headers : {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    }).then(function(response){
        $scope.hide($ionicLoading);
        if(response.data.error){
          $scope.showAlert(response.data.error);
        }else{
          console.log(response);
        }
      },
      function (response){
        $scope.hide($ionicLoading);
        $scope.showAlert("Network problem, Try Again");
      }
    );
  };

  $scope.resetPin = function(user){
    var phone = window.localStorage.getItem("phone");
    if(user.idno == null || user.idno == ""){
          $scope.showAlert("Kindly enter your ID number");
          return;
    }else{
      $scope.show($ionicLoading);
      $http({
        method: 'POST',
        url : 'http://app.inukapap.co.ke/api/resetPin',      
        data: {'phone':phone,'idno':user.idno
            },
        headers : {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      }).then(function(response){
          $scope.hide($ionicLoading);
          if(response.data.error){
            $scope.showAlert(response.data.error);
          }else{
            console.log(response);
          }
        },
        function (response){
          $scope.hide($ionicLoading);
          $scope.showAlert("Network problem, Try Again");
        }
      );
    }
  };

});
