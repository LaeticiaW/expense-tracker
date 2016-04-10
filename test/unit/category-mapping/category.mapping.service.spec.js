describe('Category Mapping Service Tests', function () {

    var CategoryMapping, $httpBackend;

    beforeEach(module('categoryMapping'));

    beforeEach(function () {
        inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            CategoryMapping = $injector.get('CategoryMapping');
        });
    });

    it('Should get a category mapping', function() {

        $httpBackend.expectGET('/category-mapping/catmapid1')
            .respond([{
            _id: 'catmapid1',
            searchText: 'TWC',
            category: 'cat1',
            subcategories: [{name: 'Time Warner Cable'}]
        }]);

        var result = CategoryMapping.query({categoryMapId: 'catmapid1'});

        $httpBackend.flush();

        expect(result[0]._id).toEqual('catmapid1');
        expect(result[0].searchText).toEqual('TWC');
        expect(result[0].category).toEqual('cat1');
        expect(result[0].subcategories[0].name).toEqual('Time Warner Cable');
    });

    it('Should update a category mapping', function() {

        var mapping = {
            _id: 'catmapid1',
            searchText: 'TWC',
            category: 'cat1',
            subcategories: [{name: 'Time Warner Cable'}]
        };

        $httpBackend.expectPUT('/category-mapping/catmapid1').respond(mapping);

        var result = CategoryMapping.update(mapping);

        $httpBackend.flush();

        expect(result._id).toEqual('catmapid1');
        expect(result.searchText).toEqual('TWC');
        expect(result.category).toEqual('cat1');
        expect(result.subcategories[0].name).toEqual('Time Warner Cable');
    });

    it('Should create a category mapping', function() {

        var mapping = {
            _id: 'catmapid1',
            searchText: 'TWC',
            category: 'cat1',
            subcategories: [{name: 'Time Warner Cable'}]
        };

        $httpBackend.expectPOST('/category-mapping/catmapid1', mapping).respond(mapping);

        var result = CategoryMapping.save(mapping);

        $httpBackend.flush();

        expect(result._id).toEqual('catmapid1');
        expect(result.searchText).toEqual('TWC');
        expect(result.category).toEqual('cat1');
        expect(result.subcategories[0].name).toEqual('Time Warner Cable');
    });

    // it('Should delete a category mapping', function() {

    //     var mapping = {
    //         _id: 'catmapid1',
    //         searchText: 'TWC',
    //         category: 'cat1',
    //         subcategories: [{name: 'Time Warner Cable'}]
    //     };

    //     $httpBackend.expectDELETE('/category-mapping/catmapid1').respond(mapping);

    //     var result = CategoryMapping.delete(mapping);

    //     $httpBackend.flush();

    //     expect(result._id).toEqual('catmapid1');
    //     expect(result.searchText).toEqual('TWC');
    //     expect(result.category).toEqual('cat1');
    //     expect(result.subcategories[0].name).toEqual('Time Warner Cable');

    // });

});
