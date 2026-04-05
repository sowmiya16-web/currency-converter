var app = angular.module("currencyApp", []);

app.controller("CurrencyController", function($scope, $http) {

    $scope.amount = 1;
    $scope.result = 0;
    $scope.history = [];
    $scope.currencies = [];

    var BASE_URL = "https://open.er-api.com/v6/latest/";

    // Load currencies
    $http.get(BASE_URL + "USD").then(function(response) {

        if (response.data.result === "success") {
            $scope.currencies = Object.keys(response.data.rates);

            $scope.fromCurrency = "USD";
            $scope.toCurrency = "INR";

            $scope.fromSearch = "USD";
            $scope.toSearch = "INR";
        }
    });

    // Convert
    $scope.convert = function() {

        if (!$scope.amount || $scope.amount <= 0) {
            alert("Enter valid amount");
            return;
        }

        $http.get(BASE_URL + $scope.fromCurrency)
            .then(function(response) {

                if (response.data.result === "success") {

                    var rate = response.data.rates[$scope.toCurrency];

                    $scope.result = ($scope.amount * rate).toFixed(2);

                    $scope.history.unshift({
                        amount: $scope.amount,
                        from: $scope.fromCurrency,
                        to: $scope.toCurrency,
                        result: $scope.result
                    });

                } else {
                    alert("Failed to fetch rates");
                }

            }, function() {
                alert("API Error");
            });
    };

    // Swap
    $scope.swap = function() {
        var temp = $scope.fromCurrency;
        $scope.fromCurrency = $scope.toCurrency;
        $scope.toCurrency = temp;

        $scope.fromSearch = $scope.fromCurrency;
        $scope.toSearch = $scope.toCurrency;
    };

    // Select FROM
    $scope.selectFrom = function(currency) {
        $scope.fromCurrency = currency;
        $scope.fromSearch = currency;
        $scope.showFrom = false;
    };

    // Select TO
    $scope.selectTo = function(currency) {
        $scope.toCurrency = currency;
        $scope.toSearch = currency;
        $scope.showTo = false;
    };

});