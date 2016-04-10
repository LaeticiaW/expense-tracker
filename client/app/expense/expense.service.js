angular.module('expense').factory('Expense', ['$resource', '$http',
    function($resource, $http) {

        return $resource('/expense/:expenseId', {
            expenseId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            query: {
                method: 'GET',
                isArray: true,
                transformResponse: $http.defaults.transformResponse.concat(convertDates)
            },
            isCategoryInUse: {
                url: '/expense-usage/:categoryId',
                method: 'GET'
            }
        });

        function convertDate(expense) {

            // "created_at" is declared as NOT NULL in the database
            expense.trxDate = new Date(expense.trxDate);

            return expense;
        }

        function convertDates(expenses) {
            if (expenses && expenses.length && expenses.map) {
                return expenses.map(convertDate);
            }
            return expenses;
        }
    }]);