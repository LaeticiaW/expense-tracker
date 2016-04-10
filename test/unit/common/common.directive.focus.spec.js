describe('Directive Test: focus', function () {

    var $scope, $element;

    beforeEach(module('common'));

    beforeEach(inject(function($rootScope) {
        $scope = $rootScope.$new();
        $element = '<input class="test-focus" focus="testing"/>';
    }));

    it('Should focus the element when the scope variable is set to true', inject(function ($timeout, $compile) {

        $scope.testing = true;

        $element = $compile($element)($scope);
        $scope.$digest();
        spyOn($element[0],'focus');
        $timeout.flush();

        expect($element[0].focus).toHaveBeenCalled();
    }));

    it('Should not focus the element when the scope variable is set to false', inject(function($timeout, $compile) {

        $scope.testing = false;

        $element = $compile($element)($scope);
        $scope.$digest();
        spyOn($element[0],'focus');
        try {$timeout.flush();} catch(e) {}

        expect($element[0].focus).not.toHaveBeenCalled();
    }));
});
