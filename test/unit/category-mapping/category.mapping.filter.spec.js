describe('Category Mapping Filter Tests', function() {

    var mappingFilter,
        mappings = [
            {_id: 'catmap1', searchText: 'TWC', category: {_id:'cat1', name: 'Utilities'},
              subcategory: 'Time Warner Cable'},
            {_id: 'catmap2', searchText: 'Chilis', category: {_id: 'cat2', name: 'Restaurants'},
              subcategory: 'Chilis Restaurant'},
            {_id: 'catmap3', searchText: 'Evergreen Lawn Maintenance', category: {_id: 'cat3', name: 'Yard'},
              subcategory: 'Lawn Care'},
            {_id: 'catmap4', searchText: 'Duke Energy', category: {_id: 'cat1', name: 'Utilities'},
              subcategory: 'Electric'}
        ];

    beforeEach(module('categoryMapping'));

    beforeEach(inject(function(_categoryMappingFilter_) {
        mappingFilter = _categoryMappingFilter_;
    }));

    it('Should filter category mappings for all categories', function() {

        var filteredMappings = mappingFilter(mappings, 'all');

        expect(filteredMappings.length).toEqual(4);
        expect(filteredMappings[0]._id).toEqual('catmap1');
        expect(filteredMappings[1]._id).toEqual('catmap2');
        expect(filteredMappings[2]._id).toEqual('catmap3');
        expect(filteredMappings[3]._id).toEqual('catmap4');
    });

    it('Should filter category mappings for a specific category', function() {

        var filteredMappings = mappingFilter(mappings, 'Utilities');

        expect(filteredMappings.length).toEqual(2);
        expect(filteredMappings[0]._id).toEqual('catmap1');
        expect(filteredMappings[1]._id).toEqual('catmap4');
    });

});