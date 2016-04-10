
describe('Category Service Tests', function () {

    var Category, $httpBackend;

    beforeEach(module('category'));

    beforeEach(function () {
        inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            Category = $injector.get('Category');
        });
    });

    it('Should get a category', function() {

        $httpBackend.expectGET('/category/catid1')
            .respond([{
            _id: 'catid1',
            name: 'Category name',
            subcategories: []
        }]);

        var result = Category.query({categoryId: 'catid1'});

        $httpBackend.flush();

        expect(result[0]._id).toEqual('catid1');
        expect(result[0].name).toEqual('Category name');
    });

    it('Should update a category', function() {

        var category = {_id: 'catid1', 'name': 'New Category Name', subcategories: [{name: 'Subcat'}]};

        $httpBackend.expectPUT('/category/catid1').respond(category);

        var result = Category.update(category);

        $httpBackend.flush();

        expect(result._id).toEqual('catid1');
        expect(result.name).toEqual('New Category Name');
        expect(result.subcategories.length).toEqual(1);
    });

    it('Should create a category', function() {

        var category = {_id: 'catid', name: 'Category Name', subcategories: [{name: 'Subcat'}]};

        $httpBackend.expectPOST('/category/catid', category).respond(category);

        var result = Category.save(category);

        $httpBackend.flush();

        expect(result._id).toEqual('catid');
        expect(result.name).toEqual('Category Name');
        expect(result.subcategories.length).toEqual(1);
    });

    it('Should delete a category', function() {

        // var category = {_id: 'catid', name: 'Category Name', subcategories: [{name: 'Subcat'}]};

        // $httpBackend.expectDELETE('/category/catid').respond(category);

        // var result = Category.delete(category);

        // $httpBackend.flush();

        // expect(result._id).toEqual('catid');
        // expect(result.name).toEqual('Category Name');
        // expect(result.subcategories.length).toEqual(1);
    });

});
