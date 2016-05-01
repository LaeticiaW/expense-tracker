describe('Directive Test: Month Scroller', function() {

    var $scope, $compile, $rootScope,
        reportHtml = '<div>'
                    + '<month-scroller></month-scroller>'
                    + '<table class="table table-bordered table-hover table-condensed monthly-report">'
                    + '  <thead><tr>'
                    + '    <th scope="col" class="category"><span>Category</span></th>'
                    + '    <th scope="col" class="subcategory"><span>Subcategory</span></th>'
                    + '    <th scope="col" ng-class=\'{"hidden-cell" : hideQuarter.Q1}\'>Jan</th>'
                    + '    <th scope="col" ng-class=\'{"hidden-cell" : hideQuarter.Q1}\'>Feb</th>'
                    + '    <th scope="col" ng-class=\'{"hidden-cell" : hideQuarter.Q1}\'>Mar</th>'
                    + '    <th scope="col" ng-class=\'{"hidden-cell" : hideQuarter.Q2}\'>Apr</th>'
                    + '    <th scope="col" ng-class=\'{"hidden-cell" : hideQuarter.Q2}\'>May</th>'
                    + '    <th scope="col" ng-class=\'{"hidden-cell" : hideQuarter.Q2}\'>Jun</th>'
                    + '    <th scope="col" ng-class=\'{"hidden-cell" : hideQuarter.Q3}\'>Jul</th>'
                    + '    <th scope="col" ng-class=\'{"hidden-cell" : hideQuarter.Q3}\'>Aug</th>'
                    + '    <th scope="col" ng-class=\'{"hidden-cell" : hideQuarter.Q3}\'>Sep</th>'
                    + '    <th scope="col" ng-class=\'{"hidden-cell" : hideQuarter.Q4}\'>Oct</th>'
                    + '    <th scope="col" ng-class=\'{"hidden-cell" : hideQuarter.Q4}\'>Nov</th>'
                    + '    <th scope="col" ng-class=\'{"hidden-cell" : hideQuarter.Q4}\'>Dec</th>'
                    + '    <th scope="col">{{reportFilterYear}}</th>'
                    + '  </tr></thead><tbody></tbody></table>'
                    + '</div>';

    var checkMonthVisibility = function(thElem, visibleStartIndex) {

        var th;

        angular.forEach(thElem, function(value, key) {
             th = angular.element(value);
             if (key === 0 || key === 1 || key === 14) {
                // not month column
             } else if (key >= visibleStartIndex && key <= visibleStartIndex + 2) {
                // Visible quarter
                expect(th.hasClass('hidden-cell')).toEqual(false);
             } else {
                // Hidden quarters
                expect(th.hasClass('hidden-cell')).toEqual(true);
             }
        });
    };

    beforeEach(module('report', 'templates'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $scope = $rootScope.$new();
        angular.element(document.body).empty();
    }));

    it('Should display initial state of month scroller with only Jan, Feb, Mar report month columns visible', function() {

        var element = angular.element(reportHtml);

        element = $compile(element)($rootScope);

        angular.element(document.body).append(element);

        $rootScope.$digest();

        expect(window.innerWidth).toBeLessThan(750);

        expect(document.querySelectorAll('.month-scroller button').length).toEqual(2);
        expect(document.querySelector('.month-scroller .prev-button').innerHTML).toEqual("Prev Months");
        expect(document.querySelector('.month-scroller .prev-button').getAttribute('disabled')).toBeDefined();
        expect(document.querySelector('.month-scroller .next-button').innerHTML).toEqual("Next Months");
        expect(document.querySelector('.month-scroller .next-button').getAttribute('disabled')).toBeNull();

        expect(document.querySelectorAll('table.monthly-report th').length).toEqual(15);
        expect(document.querySelector('th:nth-child(3)').innerHTML).toEqual('Jan');
        expect(document.querySelector('th:nth-child(14)').innerHTML).toEqual('Dec');

        checkMonthVisibility(element.find('th'), 2);
    });

    it('Should allow scrolling through the months via the Prev/Next Months buttons', function() {

        var element = angular.element(reportHtml);

        angular.element(document.body).append(element);

        element = $compile(element)($rootScope);

        $rootScope.$digest();

        expect(document.querySelectorAll('.month-scroller button').length).toEqual(2);
        expect(document.querySelector('.month-scroller button:first-child').innerHTML).toEqual("Prev Months");
        expect(document.querySelector('.month-scroller button:first-child').getAttribute('disabled')).toBeDefined();
        expect(document.querySelector('.month-scroller button:last-child').innerHTML).toEqual("Next Months");
        expect(document.querySelector('.month-scroller button:last-child').getAttribute('disabled')).toBeNull();

        expect(document.querySelectorAll('table.monthly-report th').length).toEqual(15);
        expect(document.querySelector('th:nth-child(3)').innerHTML).toEqual('Jan');
        expect(document.querySelector('th:nth-child(14)').innerHTML).toEqual('Dec');

        angular.element(document.querySelector('.next-button')).triggerHandler('click');

        expect(document.querySelector('.month-scroller .prev-button').getAttribute('disabled')).toBeNull();
        expect(document.querySelector('.month-scroller .next-button').getAttribute('disabled')).toBeNull();

        checkMonthVisibility(element.find('th'), 5);

        angular.element(document.querySelector('.next-button')).triggerHandler('click');

        expect(document.querySelector('.month-scroller .prev-button').getAttribute('disabled')).toBeNull();
        expect(document.querySelector('.month-scroller .next-button').getAttribute('disabled')).toBeNull();

        checkMonthVisibility(element.find('th'), 8);

        angular.element(document.querySelector('.next-button')).triggerHandler('click');

        expect(document.querySelector('.month-scroller .prev-button').getAttribute('disabled')).toBeNull();
        expect(document.querySelector('.month-scroller .next-button').getAttribute('disabled')).toBeDefined();

        checkMonthVisibility(element.find('th'), 11);

        angular.element(document.querySelector('.prev-button')).triggerHandler('click');

        expect(document.querySelector('.month-scroller .prev-button').getAttribute('disabled')).toBeNull();
        expect(document.querySelector('.month-scroller .next-button').getAttribute('disabled')).toBeNull();

        checkMonthVisibility(element.find('th'), 8);

         angular.element(document.querySelector('.prev-button')).triggerHandler('click');

        expect(document.querySelector('.month-scroller .prev-button').getAttribute('disabled')).toBeNull();
        expect(document.querySelector('.month-scroller .next-button').getAttribute('disabled')).toBeNull();

        checkMonthVisibility(element.find('th'), 5);

         angular.element(document.querySelector('button.prev-button')).triggerHandler('click');

        expect(document.querySelector('.month-scroller button:first-child').getAttribute('disabled')).toBeDefined();
        expect(document.querySelector('.month-scroller button:last-child').getAttribute('disabled')).toBeNull();

        checkMonthVisibility(element.find('th'), 2);
    });
});
