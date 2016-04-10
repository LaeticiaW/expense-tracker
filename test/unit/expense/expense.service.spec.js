describe('Expense Service Tests', function () {

    var Expense, $httpBackend;

    beforeEach(module('expense'));

    beforeEach(function () {
        inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            Expense = $injector.get('Expense');
        });
    });

    it('Should get an expense', function() {

        $httpBackend.expectGET('/expense/exp1')
            .respond([{
            _id: "exp1",
            trxDate: new Date(2016, 2, 5),
            amount:40.26,
            categoryId: "cat1",
            subcategory: "Gas"
        }]);

        var result = Expense.query({expenseId: 'exp1'});

        $httpBackend.flush();

        expect(result[0]._id).toEqual('exp1');
        expect(result[0].trxDate.toISOString().substring(0, 10)).toEqual('2016-03-05');
        expect(result[0].amount).toEqual(40.26);
        expect(result[0].categoryId).toEqual('cat1');
        expect(result[0].subcategory).toEqual('Gas');
    });

    it('Should update an expense', function() {

        var expense = {
            _id: "exp1",
            trxDate: new Date(2016, 2, 5),
            amount:40.26,
            categoryId: "cat1",
            subcategory: "Gas"
        };

        $httpBackend.expectPUT('/expense/exp1').respond(expense);

        var result = Expense.update(expense);

        $httpBackend.flush();

        expect(result._id).toEqual('exp1');
        expect(result.trxDate.toISOString().substring(0, 10)).toEqual('2016-03-05');
        expect(result.amount).toEqual(40.26);
        expect(result.categoryId).toEqual('cat1');
        expect(result.subcategory).toEqual('Gas');
    });

    it('Should create a category', function() {

        var expense = {
            _id: "exp1",
            trxDate: new Date(2016, 2, 5),
            amount:40.26,
            categoryId: "cat1",
            subcategory: "Gas"
        };

        $httpBackend.expectPOST('/expense/exp1', expense).respond(expense);

        var result = Expense.save(expense);

        $httpBackend.flush();

        expect(result._id).toEqual('exp1');
        expect(result.trxDate.toISOString().substring(0, 10)).toEqual('2016-03-05');
        expect(result.amount).toEqual(40.26);
        expect(result.categoryId).toEqual('cat1');
        expect(result.subcategory).toEqual('Gas');
    });

    // it('Should delete an expense', function() {

    //     var expense = {
    //         _id: "exp1",
    //         trxDate: new Date(2016, 2, 5),
    //         amount:40.26,
    //         categoryId: "cat1",
    //         subcategory: "Gas"
    //     };

    //     $httpBackend.expectDELETE('/expense/exp1').respond(expense);

    //     var result = Expense.delete(expense);

    //     $httpBackend.flush();

    //     expect(result._id).toEqual('exp1');
    //     expect(result.trxDate.toISOString().substring(0, 10)).toEqual('2016-03-05');
    //     expect(result.amount).toEqual(40.26);
    //     expect(result.categoryId).toEqual('cat1');
    //     expect(result.subcategory).toEqual('Gas');
    // });

});
