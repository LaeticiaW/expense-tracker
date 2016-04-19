angular.module('expense').controller('ExpenseController', ['$scope', '$timeout', 'Expense',
   'expenseFilter', 'CommonService', 'orderByFilter', 'toastr', 'categories',

    function($scope, $timeout, Expense, expenseFilter, CommonService, orderByFilter, toastr, categories) {

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
                getPropertyName: function() {
                    return this.property + (this.subProperty ? '.' + this.subProperty : '');
                }
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

            var exp = new Expense(expense);

            if (expense.state === 'add') {
                exp.$save(function(response) {
                    expense._id = response._id;
                    CommonService.addCategory(expense, $scope.categories, 'category');
                    expense.trxDate = new Date(expense.trxDate);
                    $scope.expenses.push(expense);
                    $scope.filteredExpenses = expenseFilter($scope.expenses, $scope.filter);
                    $scope.filteredExpenses = orderByFilter($scope.filteredExpenses, $scope.sort.getPropertyName(),
                        $scope.sort.direction === 'descending');
                }, function(errorResponse) {
                    console.log("Save expense failed: ", errorResponse);
                    toastr.error('Unable to save the expense', 'Expense Tracker Processing Error');
                });
            } else {
                exp.$update(function() {
                    $scope.filteredExpenses = expenseFilter($scope.expenses, $scope.filter);
                    $scope.filteredExpenses = orderByFilter($scope.filteredExpenses, $scope.sort.getPropertyName(),
                        $scope.sort.direction === 'descending');
                }, function(errorResponse) {
                    console.log("Update expense failed: ", errorResponse);
                    toastr.error('Unable to save the expense', 'Expense Tracker Processing Error');
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
            $scope.filteredExpenses = orderByFilter($scope.filteredExpenses, $scope.sort.getPropertyName(),
                        $scope.sort.direction === 'descending');
        };

        $scope.deleteExpense = function(expense) {

            var exp = new Expense(expense);

            exp.$remove(function() {
                $scope.expenses = $scope.expenses.filter(function(exp) {
                    return exp._id !== expense._id;
                });

                $scope.filteredExpenses = expenseFilter($scope.expenses, $scope.filter);
                $scope.filteredExpenses = orderByFilter($scope.filteredExpenses, $scope.sort.getPropertyName(),
                        $scope.sort.direction === 'descending');
            }, function(errorResponse) {
                console.log("Expense delete failed: ", errorResponse);
                toastr.error('Unable to delete the expense', 'Expense Tracker Processing Error');
            });
        };

        $scope.sortExpenses = function(property, subProperty) {

            var reverse = false;

            if ($scope.sort.property === property) {
                if ($scope.sort.direction === 'ascending') {
                    $scope.sort.direction = 'descending';
                    reverse = true;
                } else {
                    $scope.sort.direction = 'ascending';
                }
            } else {
                $scope.sort.direction = 'ascending';
            }

            $scope.sort.property = property;
            $scope.sort.subProperty = subProperty;

            $scope.filteredExpenses = orderByFilter($scope.filteredExpenses, $scope.sort.getPropertyName(),
                        $scope.sort.direction === 'descending');
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

                $scope.filteredExpenses = orderByFilter($scope.filteredExpenses, $scope.sort.getPropertyName(),
                        $scope.sort.direction === 'descending');
            }, function(errorResponse) {
                console.log("Error retrieving expense data");
                errorResponse.statusText = "Unable to retrieve expense";
                toastr.error('Unable to retrieve the expenses', 'Expense Tracker Processing Error');
            });
        }

        function resetExpenses() {

            $scope.expenses.forEach(function(exp) {
                delete exp.mode;
                delete exp.state;
            });
        }
}]);