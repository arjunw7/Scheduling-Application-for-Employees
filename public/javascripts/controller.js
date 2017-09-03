var app = angular.module('smartcms', ['ngRoute']).run(function($rootScope, $http) {
    $http.get("/api/file").then(function(response) {
        console.log(response.data)
        $rootScope.allEmployees = response.data
    })
    $http.get('auth/confirm-login')
        .success(function(user) {
            if (user) {
                $rootScope.current_user_name = user.fullName;
                $rootScope.authenticated = true;
                $rootScope.current_user = user.username;
                $rootScope.current_user_email = user.email;
            }
        });
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
    $rootScope.current_user_name = '';
    $rootScope.current_user_email = '';
});

app.config(function($routeProvider, $locationProvider, $httpProvider) {
    //================================================
    // Check if the user is connected
    //================================================
    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
        // Initialize a new promise
        var deferred = $q.defer();

        // Make an AJAX call to check if the user is logged in
        $http.get('auth/isAuthenticated').success(function(user) {
            // Authenticated
            if (user !== '0')
            /*$timeout(deferred.resolve, 0);*/
                deferred.resolve();

            // Not Authenticated
            else {
                deferred.reject();
                $location.url('/login');
            }
        });

        return deferred.promise;
    };
    var checkLoggedout = function($q, $timeout, $http, $location, $rootScope) {
        // Initialize a new promise
        var deferred = $q.defer();

        // Make an AJAX call to check if the user is logged in
        $http.get('auth/isAuthenticated').success(function(user) {
            // Authenticated
            if (user == '0')
            /*$timeout(deferred.resolve, 0);*/
                deferred.resolve();

            // Not Authenticated
            else {
                deferred.reject();
                $location.url('/home');
            }
        });

        return deferred.promise;
    };
    //================================================

    //================================================
    // Add an interceptor for AJAX errors
    //================================================
    $httpProvider.interceptors.push(function($q, $location) {
        return {
            response: function(response) {
                // do something on success
                return response;
            },
            responseError: function(response) {
                if (response.status === 401)
                    $location.url('/login');
                return $q.reject(response);
            }
        };
    });
    //================================================

    //================================================
    // Define all the routes
    //================================================
    $routeProvider
    //homepage display
        .when('/', {
            templateUrl: 'partials/main.html',
            controller: 'authController',
        })
        .when('/home', {
            templateUrl: 'partials/main.html',
            controller: 'authController',
            resolve: {

            }
        })
        //the login display
        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'authController',
            resolve: {
                loggedin: checkLoggedout
            }
        })
        //the signup display
        .when('/signup', {
            templateUrl: 'partials/signup.html',
            controller: 'authController',
            resolve: {
                loggedin: checkLoggedout
            }
        })
        //the forgot password display
        // .when('/forgot', {
        //     templateUrl: 'partials/forgot.html',
        //     controller: 'authController',
        //     resolve: {
        //         loggedin: checkLoggedout
        //     }
        // })
        //reset password display
        // .when('/reset/:token', {
        //     templateUrl: 'partials/reset.html',
        //     controller: 'authController',
        //     resolve: {
        //         loggedin: checkLoggedout
        //     }
        // })

    //profile display
    .when('/profile', {
        templateUrl: 'partials/profile.html',
        controller: 'authController',
        resolve: {
            loggedin: checkLoggedin
        }
    })

    //payment success
    // .when('/dashboard', {
    //     templateUrl: 'partials/dashboard.html',
    //     controller: 'authController',
    //     resolve: {
    //         loggedin: checkAdminLoggedin
    //     }
    // });
});

app.controller('authController', function($scope, $http, $rootScope, $location, $routeParams, $window) {
    $scope.user = { username: '', password: '' };
    $scope.error_message = '';

    $scope.login = function() {
        $http.post('/auth/login', $scope.user).success(function(data) {
            if (data.state == 'success') {
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;
                $rootScope.current_user_email = data.user.email;
                $rootScope.current_user_name = data.user.fullName;
                $location.path('/');
            } else {
                angular.element(".text-warning").css({ 'display': 'block' });
                angular.element('.text-warning img').click(function() {
                    angular.element('.text-warning').hide();
                });
                $scope.error_message = data.message;

            }
        });
    };

    $scope.register = function() {
        console.log($scope.user);
        $http.post('/auth/signup', $scope.user).success(function(data) {
            if (data.state == 'success') {
                $rootScope.authenticated = true;
                $rootScope.current_user = data.user.username;
                $rootScope.current_user_name = data.user.fullName;
                $location.path('/');
            } else {
                angular.element(".text-warning").css({ 'display': 'block' });
                angular.element('.text-warning img').click(function() {
                    angular.element('.text-warning').hide();
                });
                $scope.error_message = data.message;
            }
        });
    };


    $scope.signout = function() {
        $http.get('auth/signout');
        $rootScope.authenticated = false;
        $rootScope.current_user = '';
        $location.path('/');
    };

    // $scope.forgot = function() {
    //     $http.post('/auth/forgot', $scope.user);
    //     alert('An e-mail has been sent to your email with further instructions');
    //     $location.path('/login');
    // };

    // $scope.resetPassword = function() {
    //     $http.post('/api/reset/' + $routeParams.token, $scope.user, $routeParams.token).success(function() {
    //         alert('Password reset succesful');
    //         $location.path('/login');
    //     });
    // };

    $scope.updateEmp = function(item) {
        console.log(item)
        $http.put("api/file/" + item._id, item).then(function(response) {
            console.log(response);
            $http.get("/api/file").then(function(response) {
                console.log(response.data)
                $rootScope.allEmployees = response.data;
                $(".popup").fadeIn(300);
                $(".popup").delay(1000).fadeOut(500);
            })
        })
    }

    $scope.load = function() {
        //animateSlider() function definition
        $scope.animateSlider = function() {
                angular.element(".sliderItem1, .sliderItem3").delay(5000).animate({ 'opacity': '0' }, 500);
                angular.element(".sliderItem2").delay(5000).animate({ 'opacity': '1' }, 500);

                angular.element(".sliderItem1, .sliderItem2").delay(5000).animate({ 'opacity': '0' }, 500);
                angular.element(".sliderItem3").delay(5000).animate({ 'opacity': '1' }, 500);

                angular.element(".sliderItem2, .sliderItem3").delay(5000).animate({ 'opacity': '0' }, 500);
                angular.element(".sliderItem1").delay(5000).animate({ 'opacity': '1' }, 500);
            }
            //animateSlider() function Call
        $scope.animateSlider();
        $scope.repeat = setInterval($scope.animateSlider, 15000);
        angular.element(".dropSubmit, .cancel").click(function() {
            angular.element(".dropDetails").css("right", "-300px");
        });
        angular.element(".dropdownMain").click(function() {
            angular.element(".dropdown").css({ "display": "block" });
        });
        angular.element(document).click(function() {
            angular.element(".dropdown").css({ "display": "none" });
        });
        angular.element(".dropdownMain").click(function(e) {
            e.stopPropagation();
            return false;
        });
        angular.element(".listToggle").click(function() {
            angular.element(".menu").toggle();
        });
        if (angular.element(window).width() <= 960) {
            angular.element('.sliderItem1 img').attr("src", 'images/s1.jpg');
            angular.element('.sliderItem2 img').attr("src", 'images/s2.jpg');
            angular.element('.sliderItem3 img').attr("src", 'images/s3.jpg');
        }
    };
    //Calling the load function
    $scope.load();


});