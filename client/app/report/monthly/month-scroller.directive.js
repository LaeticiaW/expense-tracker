/*
 * The monthScroller directive can be used in conjunction with a report/table that has month columns to make the
 * report display responsive at smaller breakpoints.
 *
 * At the smaller breakpoints, it only shows 3 months (corresponding to a quarter) and hides the rest,
 * and it also displays 'Prev Months' and 'Next Months' buttons which the user can use to show the next
 * or previous 3 months.
 *
 * Usage: Add the month-scroller tag just before the report/table with the month columns,
 *        and add the hidden-cell class to each month column (for each quarter Q1 through Q4) via
 *        ng-class="{'hidden-cell' : hideQuarter.Q1}"

 *   <month-scroller report-class="tableClassName" init-event="ngRepeatDoneEvent"></month-scroller>
 *      init-event   - event triggered when the table row ng-repeat is complete
 *                     (see the ngRepeat extension directive which will trigger this event)
 *
 */
angular.module('report').directive('monthScroller', function() {

    return {
        restrict: 'E',
        templateUrl: 'app/report/monthly/month-scroller.html',
        link: function(scope, element, attrs) {

            var mql = window.matchMedia("(max-width: 1200px)");

            mql.addListener(hideMonths);

            if (attrs.initEvent) {
                scope.$on(attrs.initEvent, function () {
                    hideMonths(mql);
                });
            } else {
                 hideMonths(mql);
            }

            scope.disablePrevButton = true;
            scope.disableNextButton = false;

            scope.quarter = 1;

            scope.hideQuarter = {
                Q1: false,
                Q2: true,
                Q3: true,
                Q4: true
            };

            scope.showPrevMonths = function() {

                if (scope.quarter > 1) {
                    scope.quarter--;
                } else {
                    return;
                }

                hideMonths(mql);
            };

            scope.showNextMonths = function() {

                if (scope.quarter < 4) {
                    scope.quarter++;
                } else {
                    return;
                }

                hideMonths(mql);
            };

            function hideMonths(mql) {

                if (mql.matches) {
                    scope.hideQuarter = {
                        Q1: scope.quarter === 1 ? false : true,
                        Q2: scope.quarter === 2 ? false : true,
                        Q3: scope.quarter === 3 ? false : true,
                        Q4: scope.quarter === 4 ? false : true
                    };
                } else {
                    scope.hideQuarter = {
                        Q1: false,
                        Q2: false,
                        Q3: false,
                        Q4: false
                    };
                }

                disableMonthButtons();
            }

            function disableMonthButtons() {

                if (scope.quarter === 4) {
                    scope.disableNextButton = true;
                } else {
                    scope.disableNextButton = false;
                }

                if (scope.quarter === 1) {
                    scope.disablePrevButton = true;
                } else {
                    scope.disablePrevButton = false;
                }
            }
        }
    };
});