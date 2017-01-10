
storeApp.controller("userController", function ($scope, $parse, userService, $location, AuthenticationService, $rootScope) {

    $scope.login = function () {
        $scope.dataLoading = true;
        AuthenticationService.Login($scope.username, $scope.password, function (response) {
            if (response.status == 'success') {
                AuthenticationService.SetCredentials($scope.username, $scope.password);
                $location.path('/default.htm');
            } else {
                $scope.form.$setValidity('password', true);
                var serverMessage = $parse('form.password.$error.serverMessage');
                serverMessage.assign($scope, response.msg);
                $scope.dataLoading = false;
            }
        });
    }

    $scope.userData = {};
    $scope.saveData = function () {
        var data = this.userData;
        userService.addUser(data).success(function (response) {
            if (response.status == 'success') {
                $location.path('/default.htm');
            } else if (response.status == 'error') {
                var formFields = {first_name: "", last_name: "", email: "", username: "", password: "", confpassword: ""};
                var serverResponse = response.error;
                for (var fieldName in formFields) {
                    var serverMessage = $parse('addForm.' + fieldName + '.$error.serverMessage');
                    if (serverResponse[fieldName]) {
                        var message = serverResponse[fieldName];
                        $scope.addForm.$setValidity(fieldName, false);
                        serverMessage.assign($scope, serverResponse[fieldName]);
                    } else {
                        $scope.addForm.$setValidity(fieldName, true);
                        serverMessage.assign($scope, undefined);
                    }

                }
            }
        });
    }

});



storeApp.controller("storeController", function ($scope, $location, $localStorage, productService) {
    $scope.sortProdcut = function (keyname) {
        $scope.keyName = keyname;
        $scope.reverse = !$scope.reverse;
    }

    productService.getProductList().then(function (result) {
        $scope.products = result;
        angular.forEach($scope.products, function (product) {
            product.price = parseFloat(product.price);
        });
    });

    $scope.getTotalItem = function () {
        $scope.totalItem = 0;
        if ($localStorage.cart) {
            var cartArray = JSON.parse($localStorage.cart);
            for (var i in cartArray) {
                $scope.totalItem = $scope.totalItem + cartArray[i].qty;
            }
        }
    };
    $scope.getTotalItem();


    $scope.getTotalPrice = function () {
        $scope.totalPrice = 0;
        if ($localStorage.cart) {
            var cartArray = JSON.parse($localStorage.cart);
            for (var i in cartArray) {
                $scope.totalPrice = $scope.totalPrice + (cartArray[i].qty * cartArray[i].price);
            }
        }
    };
    $scope.getTotalPrice();


    $scope.addItem = function (sku, name, price, quantity) {
        var ItemArray = {sku: sku, name: name, price: price, qty: quantity};
        if ($localStorage.cart) {
            var oldItems = JSON.parse($localStorage.cart);
            $scope.cartItems = oldItems;
            var result = $.grep(oldItems, function (e) {
                return e.sku == sku;
            });
            if (result.length == 0) {
                oldItems.push(ItemArray);
            } else {
                for (var i in oldItems) {
                    if (oldItems[i].sku == sku) {
                        if (quantity < 0) {
                            oldItems[i].qty = oldItems[i].qty - 1;
                        } else if (quantity > 0) {
                            oldItems[i].qty = oldItems[i].qty + 1;
                        }
                        break; //Stop this loop, we found it!
                    }
                }
            }

        } else {
            var oldItems = [];
            oldItems.push(ItemArray);
        }
        $localStorage.cart = JSON.stringify(oldItems);
        $scope.getTotalItem();
        $scope.getTotalPrice();
    }
    $scope.cartItems = "";
    if ($localStorage.cart) {
        $scope.cartItems = JSON.parse($localStorage.cart);
    }

    $scope.removeItem = function (sku) {
        if ($localStorage.cart) {
            var cartArray = JSON.parse($localStorage.cart);
            for (var i in cartArray) {
                if (cartArray[i].sku == sku) {
                    cartArray.splice(i, 1);
                    $localStorage.cart = JSON.stringify(cartArray);
                    $scope.cartItems = JSON.parse($localStorage.cart);
                    $scope.getTotalItem();
                    $scope.getTotalPrice();
                }
            }
        }
    }

    $scope.deleteProduct = function (id) {
        if (confirm("Are you sure to wants delete.")) {
            var data = {};
            data.id = id;
            productService.deleteProduct(data).success(function (response) {
                if (response.status == 'success') {
                    var updatedProduct = $.grep($scope.products, function (e) {
                        return e.id != id;
                    });
                    $scope.products = updatedProduct;
                }
            });
        }
    }

    $scope.clearItems = function () {
        $localStorage.cart = "";
        $scope.cartItems = "";
        $scope.getTotalItem();
        $scope.getTotalPrice();
    }

});

storeApp.controller("productController", function ($scope, $routeParams, $localStorage, $location, productService) {


    $scope.saveData = function (form) {
        $scope.submitted = true;
        if ($scope.product_id > 0) {
            form.image.$setValidity('required', true);
        }
        if (!form.$valid) {
            return;
        } else {
            var data = new FormData();
            data.append('image', $scope.imagefile);
            data.append('name', $scope.name);
            if ($scope.product_id > 0) {
                data.append('id', $scope.product_id);
            }
            data.append('description', $scope.description);
            data.append('price', $scope.price);
            data.append('sku', $scope.sku);

            productService.addProduct(data).success(function (response) {
                if (response.status == 'success') {
                    $location.path('/default.htm');
                }
            });
        }
    }

    if ($routeParams.id) {
        var id = $routeParams.id;
        productService.getProductDetail(id).then(function (response) {
            if (response.data.status == "success") {
                var ProductData = response.data.result;
                $scope.product_id = id;
                $scope.imagesrc = ProductData.image;
                $scope.name = ProductData.name;
                $scope.description = ProductData.description;
                $scope.price = ProductData.price;
                $scope.sku = ProductData.sku;
            }
        });
    }


});






