/*
 * Extends ng-repeat by emitting an event when ng-repeat has finished rendering
 */
angular.module('common').directive('ngRepeat', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            if (scope.$last) {
                if (attrs.repeatDoneEvent) {
                    scope.$emit(attrs.repeatDoneEvent, elem);
                }
            }
        }
    };
});