/*
 * Focuses the element if the specified scope variable is true
 */
angular.module('common').directive('focus', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.$watch(attrs.focus,
                function (newValue) {
                    if (newValue) {
                        $timeout(function() {
                            element[0].focus();
                        });
                    }
                },true);
        }
    };
}]);
