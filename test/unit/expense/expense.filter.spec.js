describe('Expense Filter Tests', function() {

    var expenseFilter,
        expenses = [
            {_id: "exp1", "trxDate": new Date(2016, 2, 2), amount:40.26,
              subcategory: "Gas", categoryId: "cat1"},
            {_id: "exp2", "trxDate": new Date(2016, 2, 3), amount:60.00,
              subcategory: "Lawn Care", categoryId: "cat3"},
            {_id: "exp3", "trxDate": new Date(2016, 2, 4), amount:23.00,
              subcategory: "Virlies Diner", categoryId: "cat2"},
            {_id: "exp4", "trxDate": new Date(2016, 2, 19), amount:115.48,
              subcategory: "Electric", categoryId: "cat1"}
        ],
        filter = {
            fromDate: null,
            toDate: null,
            categoryId: null
        };

    beforeEach(module('expense'));

    beforeEach(inject(function(_expenseFilter_) {
        expenseFilter = _expenseFilter_;
    }));

    it('Should filter expenses by date for all categories', function() {

        var filteredExpenses;

        filter.fromDate = new Date('2016/03/01');
        filter.toDate = new Date('2016/03/31');
        filter.categoryId = '-1';

        filteredExpenses = expenseFilter(expenses, filter);

        expect(filteredExpenses.length).toEqual(4);
        expect(filteredExpenses[0]._id).toEqual('exp1');
        expect(filteredExpenses[1]._id).toEqual('exp2');
        expect(filteredExpenses[2]._id).toEqual('exp3');
        expect(filteredExpenses[3]._id).toEqual('exp4');
    });

    it('Should filter expenses by date and category', function() {

        var filteredExpenses;

        filter.fromDate = new Date('2016/03/03');
        filter.toDate = new Date('2016/03/04');
        filter.categoryId = 'cat2';

        filteredExpenses = expenseFilter(expenses, filter);

        expect(filteredExpenses.length).toEqual(1);
        expect(filteredExpenses[0]._id).toEqual('exp3');
    });

});