describe('Expense Controller Tests', function() {

    var $scope, ExpenseController, MockExpense,
        now = new Date(),
        year = now.getFullYear(),
        month = now.getMonth();

    beforeEach(module('expense'));

    beforeEach(inject(function($rootScope, $controller, CommonService) {

        $scope = $rootScope.$new();

        MockExpense = function() {
            this.$save = function(success) {
                return success({});
            };
            this.$update = function(success) {
                return success({});
            };
            this.$remove = function(success) {
                return success({});
            };
        };

        MockExpense.query = function(parms, success) {

            return success([
                {_id: "exp1", "trxDate": new Date(year, month, 2), amount:40.26,
                  subcategory: "Gas", categoryId: "cat1"},
                {_id: "exp2", "trxDate": new Date(year, month, 3), amount:60.00,
                  subcategory: "Lawn Care", categoryId: "cat3"},
                {_id: "exp3", "trxDate": new Date(year, month, 4), amount:23.00,
                  subcategory: "Virlies Diner", categoryId: "cat2"},
                {_id: "exp4", "trxDate": new Date(year, month, 19), amount:115.48,
                  subcategory: "Electric", categoryId: "cat1"}
            ]);
        };

        ExpenseController = $controller('ExpenseController', {
            $scope: $scope,
            categories: [
                {_id: 'cat1', name: 'Utilities', subcategories: [{name:'Electric'}, {name: 'Gas'}, {name: 'Time Warner Cable'}]},
                {_id: 'cat2', name: 'Restaurants', subcategories: [{name: 'Chilis Restaurant'}, {name: 'Virlies Diner'}]},
                {_id: 'cat3', name: 'Yard', subcategories: [{name: 'Lawn Care'}]}
            ],
            CommonService: CommonService,
            Expense: MockExpense,
            toastr: {error: function() {}}
        });
    }));

    it('Should initialize the expenses', function() {

        expect($scope.expenses.length).toEqual(4);
        expect($scope.expenses[0]._id).toEqual('exp1');
        expect($scope.expenses[0].trxDate.getFullYear()).toEqual(year);
        expect($scope.expenses[0].trxDate.getMonth()).toEqual(month);
        expect($scope.expenses[0].trxDate.getDate()).toEqual(2);
        expect($scope.expenses[0].category._id).toEqual('cat1');
        expect($scope.expenses[0].subcategory).toEqual('Gas');
        expect($scope.expenses[1]._id).toEqual('exp2');
        expect($scope.expenses[2]._id).toEqual('exp3');
        expect($scope.expenses[3]._id).toEqual('exp4');
    });

    it('Should add an expense', function() {

        $scope.addExpense();

        expect($scope.editing).toBe(true);
        expect($scope.subcategories.length).toEqual(0);
        expect($scope.expenses.length).toEqual(4);

        expect($scope.filteredExpenses.length).toEqual(5);
        expect($scope.filteredExpenses[0].amount).toEqual('');
        expect($scope.filteredExpenses[0].category).toEqual('');
        expect($scope.filteredExpenses[0].subcategory).toEqual('');
        expect($scope.filteredExpenses[0].mode).toEqual('edit');
        expect($scope.filteredExpenses[0].state).toEqual('add');
    });

    it('Should cancel an expense', function() {

        var expense = $scope.expenses[2];

        expense.mode = 'edit';
        expense.editing = true;

        $scope.cancelExpense(expense);

        expect($scope.editing).toBe(false);
        expect($scope.expenses.length).toEqual(4);
        expect($scope.expenses[2].state).not.toBeDefined();
        expect($scope.expenses[2].mode).toEqual('view');
        expect($scope.expenses[2]._id).toEqual('exp3');
    });

    it('Should edit an expense', function() {

        var expense = $scope.expenses[1];

        $scope.editExpense(expense);

        expect($scope.editing).toBe(true);
        expect(expense.mode).toEqual('edit');
    });

    it('Should save a new expense', function() {

        var expense = {
            _id: "exp5",
            trxDate: new Date(),
            amount:50,
            subcategory: "Electric",
            categoryId: "cat2",
            selectedCategory: {_id: "cat3"},
            selectedSubcategory: {name: 'Lawn Care'}
        };

        $scope.saveExpense(expense);

        expect($scope.editing).toBe(false);
        expect(expense.mode).toEqual('view');
    });

    it('Should save an updated expense', function() {

        var expense = {
            _id: "exp1",
            trxDate: new Date(),
            amount:50,
            subcategory: "Electric",
            categoryId: "cat2",
            selectedCategory: {_id: "cat3"},
            selectedSubcategory: {name: 'Lawn Care'}
        };

        $scope.saveExpense(expense);

        expect($scope.editing).toBe(false);
        expect(expense.mode).toEqual('view');
    });

    it('Should delete an expense', function() {

        var expense = $scope.expenses[1];

        $scope.deleteExpense(expense);

        expect($scope.expenses.length).toEqual(3);
        expect($scope.expenses[0]._id).toEqual('exp1');
        expect($scope.expenses[1]._id).toEqual('exp3');
        expect($scope.expenses[1]._id).toEqual('exp3');
    });

    it('Should select a category', function() {

        $scope.categorySelected($scope.categories[0]);

        expect($scope.subcategories.length).toEqual(3);
        expect($scope.subcategories[0].name).toEqual('Electric');
        expect($scope.subcategories[1].name).toEqual('Gas');
        expect($scope.subcategories[2].name).toEqual('Time Warner Cable');
    });

});
