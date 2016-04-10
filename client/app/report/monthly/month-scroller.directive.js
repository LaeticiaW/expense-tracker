/*
 * The monthScroller directive can be used in conjunction with a report/table that has month columns to make the
 * report display responsive at smaller breakpoints.
 *
 * At the smaller breakpoints, it only shows 3 months (corresponding to a quarter) and hides the rest,
 * and it also displays 'Prev Months' and 'Next Months' buttons which the user can use to show the next
 * or previous 3 months.
 *
 * Usage: <month-scroller report-class="tableClassName" init-event="ngRepeatDoneEvent"></month-scroller>
 *      tableClassName    - class on table element that contains the 12 month columns
 *      ngRepeatDoneEvent - event triggered when the table row ng-repeat is complete
 *                          (see the ngRepeat extension directive which will trigger this event)
 *
 *  Note that the report table th and td cells for the months need to have Q1, Q2, Q3, and Q4 classes on them
 *  representing which quarter the month belongs to.
 */
angular.module('report').directive('monthScroller', function() {

    return {
        restrict: 'E',
        templateUrl: 'app/report/monthly/month-scroller.html',
        link: function(scope, element, attrs) {

            var $prevButton = $(element.find('.prev-button')[0]),
                $nextButton = $(element.find('.next-button')[0]),
                $monthlyReport = $('.' + attrs.reportClass),
                mql;

            mql = window.matchMedia("(max-width: 1200px)");
            mql.addListener(hideMonthCells);

            if (attrs.initEvent) {
                scope.$on(attrs.initEvent, function () {
                    hideMonthCells(mql);
                });
            } else {
                 hideMonthCells(mql);
            }

            function hideMonthCells(mql) {

                if (mql.matches) {
                    $monthlyReport.find('.Q2, .Q3, .Q4').addClass('hidden-cell');
                    $monthlyReport.find('.Q1').removeClass('hidden-cell');
                    $prevButton.prop('disabled', true);
                } else {
                    $monthlyReport.find('.Q1, .Q2, .Q3, .Q4').removeClass('hidden-cell');
                    $prevButton.prop('disabled', false);
                }
            }

            $prevButton.click(function() {

                if (!$monthlyReport.find('th.Q4.hidden-cell').length) {
                    $monthlyReport.find('.Q1, .Q2, .Q4').addClass('hidden-cell');
                    $monthlyReport.find('.Q3').removeClass('hidden-cell');
                    $prevButton.prop('disabled', false);
                    $nextButton.prop('disabled', false);
                } else if (!$monthlyReport.find('th.Q3.hidden-cell').length) {
                    $monthlyReport.find('.Q1, .Q3, .Q4').addClass('hidden-cell');
                    $monthlyReport.find('.Q2').removeClass('hidden-cell');
                    $prevButton.prop('disabled', false);
                    $nextButton.prop('disabled', false);
                } else if (!$monthlyReport.find('th.Q2.hidden-cell').length) {
                    $monthlyReport.find('.Q2, .Q3, .Q4').addClass('hidden-cell');
                    $monthlyReport.find('.Q1').removeClass('hidden-cell');
                    $prevButton.prop('disabled', true);
                    $nextButton.prop('disabled', false);
                }

                $nextButton.prop('disabled', false);

            });

            $nextButton.click(function() {

                if (!$monthlyReport.find('th.Q1.hidden-cell').length) {
                    $monthlyReport.find('.Q1, .Q3, .Q4').addClass('hidden-cell');
                    $monthlyReport.find('.Q2').removeClass('hidden-cell');
                    $prevButton.prop('disabled', false);
                    $nextButton.prop('disabled', false);
                } else if (!$monthlyReport.find('th.Q2.hidden-cell').length) {
                    $monthlyReport.find('.Q1, .Q2, .Q4').addClass('hidden-cell');
                    $monthlyReport.find('.Q3').removeClass('hidden-cell');
                    $prevButton.prop('disabled', false);
                    $nextButton.prop('disabled', false);
                } else if (!$monthlyReport.find('th.Q3.hidden-cell').length) {
                    $monthlyReport.find('.Q1, .Q2, .Q3').addClass('hidden-cell');
                    $monthlyReport.find('.Q4').removeClass('hidden-cell');
                    $prevButton.prop('disabled', false);
                    $nextButton.prop('disabled', true);
                }

                $prevButton.prop('disabled', false);
            });
        }
    };
});