storeApp.directive("myMenuDirective", function () {
    return{
        templateUrl: "templates/menu.html"
    }
})
storeApp.directive('usernameAvailable', function ($q, $http) {
    return {
        restrict: 'AE',
        require: 'ngModel',
        link: function (scope, elm, attr, model) {
            elm.on('keyup', function (evt) {
                model.$asyncValidators.usernameExists = function () {
                    var defer = $q.defer();
                    $http.post("http://192.168.1.84/angular/angularci/webservice/check_sku_duplicate", {sku: elm.val(), id: attr.watchMe}).then(function (response) {
                        if (response.data.status == 'success') {
                            model.$setValidity('usernameExists', true);
                        } else {
                            model.$setValidity('usernameExists', false);
                        }
                    });
                    scope.sku = elm.val();
                    defer.resolve;
                    return defer.promise;
                };
            });
        }

    }
});

storeApp.directive('validFile', function () {
    var validFormats = ['jpg', 'gif', 'jpeg'];
    return {
        require: 'ngModel',
        link: function (scope, el, attrs, ngModel) {

            ngModel.$render = function () {
                ngModel.$setViewValue(el.val());
            };

            el.bind('change', function () {
                scope.$apply(function () {
                    ngModel.$render();
                });
                var value = el.val(), ext = value.substring(value.lastIndexOf('.') + 1).toLowerCase();
                if (validFormats.indexOf(ext) !== -1) {
                    ngModel.$setValidity('validFile', true);
                } else {
                    ngModel.$setValidity('validFile', false);
                }
                //alert('File size:' + this.files[0].size);

            });
        }
    };
});

storeApp.directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign; 
                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);



