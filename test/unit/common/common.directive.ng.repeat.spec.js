describe('Directive Test: ngRepeat', function () {

    var $scope, $element, repeatDone;

    beforeEach(module('common'));

    beforeEach(inject(function($rootScope, $compile) {

        $scope = $rootScope.$new();

        repeatDone = false;

        $scope.$on('test-repeat-done', function() {
            repeatDone = true;
        });

        $element = '<div ng-repeat="item in [12, 34, 56]" repeat-done-event="test-repeat-done">{{item}}</div>';

        $element = $compile($element)($scope);

        $scope.$digest();
    }));

    it('Should emit a specified event when ngRepeat has completed rendering', function() {

        expect(repeatDone).toEqual(true);
    });

});
