describe('Directive Test: autofocus', function () {

    var $scope, $element;

    beforeEach(module('common'));

    beforeEach(inject(function($rootScope) {
        $scope = $rootScope.$new();
    }));

    it('Should auto focus the element with the auto-focus attribute', inject(function ($timeout, $compile) {

        $scope.testing = true;


        $element = $compile('<input auto-focus/>')($scope);
        spyOn($element[0],'focus');
        $scope.$digest();
        $timeout.flush();

        expect($element[0].focus).toHaveBeenCalled();
    }));

    it('Should not focus the element without the auto-focus attribute', inject(function($timeout, $compile) {

        $scope.testing = false;

        $element = $compile('<input class="test-focus"/>')($scope);
        spyOn($element[0],'focus');
        $scope.$digest();
        try {$timeout.flush();} catch(e) {}

        expect($element[0].focus).not.toHaveBeenCalled();
    }));
});