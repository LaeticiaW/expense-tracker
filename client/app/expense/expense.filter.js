
angular.module('expense').filter("expense", function() {

    return function(expenses, filter) {

        var filteredExpenses = [];

        expenses.forEach(function(expense) {

            var dateMatches = false,
                categoryMatches = false;

            if (expense.trxDate) {
                if (expense.trxDate >= filter.fromDate && expense.trxDate <= filter.toDate) {
                    dateMatches = true;
                }
            } else {
                dateMatches = true;
            }

            if (filter.categoryId === '-1' || expense.categoryId === filter.categoryId) {
                categoryMatches = true;
            }

            if (dateMatches && categoryMatches) {
                filteredExpenses.push(expense);
            }
        });

        return filteredExpenses;
    };
});
