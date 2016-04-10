angular.module('expense').controller('ExpenseController', ['$scope', '$timeout', 'Expense',
   'expenseFilter', 'CommonService', 'categories',

    function($scope, $timeout, Expense, expenseFilter, CommonService, categories) {

        initialize();

        function initialize() {

            $scope.categories = categories;
            $scope.expenses = [];
            $scope.filteredExpenses = [];

            $scope.editing = false;
            $scope.isDatePickerOpen = false;
            $scope.isFilterFromDatePickerOpen = false;
            $scope.isFilterToDatePickerOpen = false;
            $scope.focusExpenseInput = true;
            $scope.subcategories = [];

            $scope.sort = {
                property: 'trxDate',
                subProperty: undefined,
                direction: 'ascending',
                type: 'number'
            };

            $scope.filter = {
                fromDate: CommonService.getMonthStartDate(),
                toDate: CommonService.getMonthEndDate(),
                categoryId: '-1'
            };

            getExpenseData();
        }

        $scope.find = function() {

            $scope.expenses = Expense.query();
        };

        $scope.addExpense = function() {

            if ($scope.editing) {
                resetExpenses();
            }

            $scope.filteredExpenses.unshift({
                trxDate: '',
                category: '',
                subcategory: '',
                description: '',
                amount: '',
                mode: 'edit',
                state: 'add'
            });

            $scope.editing = true;
            $scope.subcategories = [];
        };

        $scope.editExpense = function(exp) {

            var items;

            if ($scope.editing) {
               resetExpenses();
            }

            exp.mode = 'edit';
            exp.state = '';

            $scope.editing = true;
            $scope.subcategories = [];

            items = $scope.categories.filter(function(cat) {
                return cat._id === exp.category._id;
            });
            exp.selectedCategory = items.length ? items[0] : '';

            if (exp.selectedCategory) {
                $scope.subcategories = exp.selectedCategory.subcategories;
                items = $scope.subcategories.filter(function(subcat) {
                    return subcat.name === exp.subcategory;
                });
                exp.selectedSubcategory = items.length ? items[0] : '';
            }
        };

        $scope.saveExpense = function(expense) {

            expense.category = expense.selectedCategory;
            expense.categoryId = expense.selectedCategory._id;
            expense.subcategory = expense.selectedSubcategory.name;

            expense.amount = parseInt(expense.amount, 10);

            var exp = new Expense(expense);

            if (expense.state === 'add') {
                exp.$save(function() {
                    CommonService.addCategory(expense, $scope.categories, 'category');
                    expense.trxDate = new Date(expense.trxDate);
                    $scope.expenses.push(expense);
                    $scope.filteredExpenses = expenseFilter($scope.expenses, $scope.filter);
                    CommonService.sortObjectArray($scope.filteredExpenses, $scope.sort);
                }, function(errorResponse) {
                    console.log("Save expense failed: ", errorResponse);
                });
            } else {
                exp.$update(function() {
                    $scope.filteredExpenses = expenseFilter($scope.expenses, $scope.filter);
                    CommonService.sortObjectArray($scope.filteredExpenses, $scope.sort);
                }, function(errorResponse) {
                    console.log("Update expense failed: ", errorResponse);
                });
            }

            expense.mode = 'view';
            $scope.editing = false;
        };

        $scope.cancelExpense = function(expense) {

            expense.mode = 'view';
            $scope.editing = false;

            if (expense.state === 'add') {
                $scope.expenses = $scope.expenses.filter(function(exp) {
                    return exp._id !== expense._id;
                });
            } else {
                delete expense.state;
            }

            $scope.filteredExpenses = expenseFilter($scope.expenses, $scope.filter);
            CommonService.sortObjectArray($scope.filteredExpenses, $scope.sort);
        };

        $scope.deleteExpense = function(expense) {

            var exp = new Expense(expense);

            exp.$remove(function() {
                $scope.expenses = $scope.expenses.filter(function(exp) {
                    return exp._id !== expense._id;
                });

                $scope.filteredExpenses = expenseFilter($scope.expenses, $scope.filter);
                CommonService.sortObjectArray($scope.filteredExpenses, $scope.sort);
            }, function(errorResponse) {
                console.log("Expense remove failed: ", errorResponse);
            });
        };

        $scope.sortExpenses = function(property, subProperty) {

            if ($scope.sort.property === property) {
                if ($scope.sort.direction === 'ascending') {
                    $scope.sort.direction = 'descending';
                } else {
                    $scope.sort.direction = 'ascending';
                }
            } else {
                $scope.sort.direction = 'ascending';
            }

            $scope.sort.property = property;
            $scope.sort.subProperty = subProperty;
            $scope.sort.type = (property === 'trxDate' || property === 'amount') ? 'number' : 'string';

            CommonService.sortObjectArray($scope.filteredExpenses, $scope.sort);
        };

        $scope.categorySelected = function(cat) {

            $scope.subcategories = cat.subcategories;
         };

        $scope.filterExpenses = function() {

            if ($scope.filter.fromDate && $scope.filter.toDate) {
                $scope.filter.fromDate = new Date($scope.filter.fromDate);
                $scope.filter.toDate = new Date($scope.filter.toDate);
            }

            getExpenseData();
        };

        $scope.filterDatePickerOpen = function($event, which) {

            if (which === 'from') {
                $scope.isFilterFromDatePickerOpen = true;
            } else {
                $scope.isFilterToDatePickerOpen = true;
            }
        };

        $scope.datePickerOpen = function($event, exp) {

            $scope.isDatePickerOpen = true;
            exp.isDatePickerOpen = true;
        };

        function getExpenseData() {

            Expense.query({
                fromDate: $scope.filter.fromDate,
                toDate: $scope.filter.toDate,
                categoryId: $scope.filter.categoryId
            }, function(response) {
                $scope.expenses = response;

                CommonService.addCategoryToArray($scope.expenses, $scope.categories, 'categoryId');

                $scope.filteredExpenses = expenseFilter($scope.expenses, $scope.filter);

                CommonService.sortObjectArray($scope.filteredExpenses, $scope.sort);
            }, function(errorResponse) {
                console.log("Error retrieving expense data");
                errorResponse.statusText = "Unable to retrieve expense";
            });
        }

        function resetExpenses() {

            $scope.expenses.forEach(function(exp) {
                delete exp.mode;
                delete exp.state;
            });
        }
}]);