/*
 * Listens to the input file element's change event and then adds the selected file name to a scope variable
 */
angular.module('common').directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            element.bind('change', function() {
                scope.$apply(function() {
                    model.assign(scope, element[0].files[0]);
                });
            });
        }
    };
}]);