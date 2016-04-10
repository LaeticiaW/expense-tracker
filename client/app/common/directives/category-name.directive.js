/*
 * categoryNameValidator:
 *
 * For new categories, makes an asynchronous server call to check whether the new category
 * name is unique.
 *
 * Usage:
 *    - add category-name-validator attribute to element
 *    - add state attribute to element, with value 'add' when adding a new category
 */
angular.module('common').directive('categoryNameValidator', function($http, $q) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelController) {
            if (attrs.state === 'add') {
                ngModelController.$asyncValidators.categoryName = function(modelValue, viewValue) {
                    return $http.get('/category-name/' + viewValue).then(
                        function(response) {
                            if (response.data && response.data._id) {
                                return $q.reject("Duplicate category name");
                            }
                            return true;
                        }
                    );
                };
            }
        }
    };
});