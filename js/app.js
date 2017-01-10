'use strict';
// App Module: the name AngularStore matches the ng-app attribute in the main <html> tag
// the route provides parses the URL and injects the appropriate partial page
var storeApp = angular.module('AngularStore', ['ngRoute', 'ngStorage', 'angularUtils.directives.dirPagination', 'angular-loading-bar', 'ngCookies']);

storeApp.config(function ($routeProvider) {
    $routeProvider.
            when('/store', {
                templateUrl: 'partials/store.htm',
                controller: "storeController"
            }).
            when('/login', {
                templateUrl: 'partials/login.htm',
                controller: "userController"
            }).
            when('/products/:id', {
                templateUrl: 'partials/product.htm',
                controller: "productController"
            }).
            when('/cart', {
                templateUrl: 'partials/shoppingCart.htm',
                controller: "storeController"
            }).
            when('/add_product', {
                templateUrl: 'partials/addProduct.htm',
                controller: "productController"
            }).
            when('/edit_product/:id', {
                templateUrl: 'partials/addProduct.htm',
                controller: "productController"
            }).
            when('/register', {
                templateUrl: 'partials/register.htm',
                controller: "userController"
            }).
            otherwise({
                redirectTo: '/store'
            });
});

storeApp.run(function ($rootScope, $cookies, $http, $location, AuthenticationService) {

    // keep user logged in after page refresh
    $rootScope.globals = $cookies.getObject('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
    }
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page        
        var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
        //console.log(restrictedPage)
        var loggedIn = $rootScope.globals.currentUser;
        if (restrictedPage && !loggedIn) {
            $location.path('/login');
        } else if (!restrictedPage && loggedIn) {
            $location.path('/store');
        }
    });

    $rootScope.logout = function () {
        AuthenticationService.ClearCredentials();
        $location.path('/login');
    };

});
