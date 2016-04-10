/*
 *
 *      <div loading-state="app.expenses">Loading... <img src="app/images/spinner.gif"/></div>
 */
angular.module('common').directive('loadingState', function ($rootScope) {

    var loadingStates = {};

    $rootScope.$on('$stateChangeStart', function (event, toState) {
        loadingStates[toState.name] = true;
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState) {
        delete loadingStates[toState.name];
    });

    $rootScope.$on('$stateChangeError', function (event, toState) {
        delete loadingStates[toState.name];
    });

    $rootScope.$on('$stateNotFound', function (event, toState) {
        delete loadingStates[toState.name];
    });

    return {
        template: '<div ng-show="loading[state]" ng-transclude></div>',
        transclude: true,
        scope: {
            state: '@loadingState'
        },
        controller: function ($scope) {
            $scope.loading = loadingStates;
        }
    };
});