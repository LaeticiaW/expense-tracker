
describe('Category Mapping Controller Tests', function() {

    var $scope, CategoryMappingController, MockCategoryMapping;

    beforeEach(module('categoryMapping'));

    beforeEach(inject(function($rootScope, $controller, CommonService) {

        $scope = $rootScope.$new();

        MockCategoryMapping = function() {
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

        MockCategoryMapping.query = function(success) {

            return success([
                    {_id: 'catmap1', searchText: 'TWC', category: 'cat1', subcategory: 'Time Warner Cable'},
                    {_id: 'catmap2', searchText: 'Chilis', category: 'cat2', subcategory: 'Chilis Restaurant'},
                    {_id: 'catmap3', searchText: 'Evergreen Lawn Maintenance', category: 'cat3', subcategory: 'Lawn Care'}
                ]);
        };

        CategoryMappingController = $controller('CategoryMappingController', {
            $scope: $scope,
            categories: [
                {_id: 'cat1', name: 'Utilities', subcategories: [{name:'Electric'}, {name: 'Gas'}, {name: 'Time Warner Cable'}]},
                {_id: 'cat2', name: 'Restaurants', subcategories: [{name: 'Chilis Restaurant'}, {name: 'Virlies Diner'}]},
                {_id: 'cat3', name: 'Yard', subcategories: [{name: 'Lawn Care'}]}
            ],
            CommonService: CommonService,
            CategoryMapping: MockCategoryMapping,
            toastr: {error: function() {}}
        });
    }));

    it('Should initialize the category mappings', function() {

        expect($scope.mappings.length).toEqual(3);
        expect($scope.mappings[0]._id = 'catmap1');
        expect($scope.mappings[0].searchText = 'TWC');
        expect($scope.mappings[0].category = 'cat1');
        expect($scope.mappings[0].subcategory = 'Time Warner Cable');
        expect($scope.mappings[1]._id = 'catmap2');
        expect($scope.mappings[2]._id = 'catmap3');
    });

    it('Should add a category mapping', function() {

        $scope.addMapping();

        expect($scope.editing).toBe(true);
        expect($scope.mappings.length).toEqual(4);
        expect($scope.mappings[0].name).not.toBeDefined();
        expect($scope.mappings[0].mode).toEqual('edit');
        expect($scope.mappings[0].state).toEqual('add');
    });

    it('Should cancel a category mapping', function() {

        var mapping = $scope.mappings[2];
        mapping.mode = 'edit';

        $scope.cancelMapping(mapping);

        expect($scope.editing).toBe(false);
        expect($scope.mappings.length).toEqual(3);
        expect($scope.mappings[2].state).not.toBeDefined();
        expect($scope.mappings[2].mode).toEqual('view');
        expect($scope.mappings[2]._id).toEqual('catmap3');
        expect($scope.mappings[2].searchText).toEqual('Evergreen Lawn Maintenance');
        expect($scope.mappings[2].category._id).toEqual('cat3');
    });

    it('Should edit a category', function() {

        var mapping = $scope.mappings[1];

        $scope.editMapping(mapping);

        expect($scope.editing).toBe(true);
        expect(mapping.mode).toEqual('edit');
    });

    it('Should save a new category mapping', function() {

        var mapping = {
            _id: 'catmap4',
            searchText: 'Duke Energy',
            category: 'cat1',
            subcategory: [{name: 'Electric'}],
            state: 'new',
            selectedSubcategory: {name: 'Electric'}
        };

        $scope.saveMapping(mapping);

        expect($scope.editing).toBe(false);
        expect(mapping.mode).toEqual('view');
    });

    it('Should save an updated category mapping', function() {

        var mapping = {
            _id: 'catmap1',
            searchText: 'Time Warner',
            category: 'cat1',
            subcategory: 'Time Warner Cable',
            selectedSubcategory: {name: 'Time Warner Cable'}
        };

        $scope.saveMapping(mapping);

        expect($scope.editing).toBe(false);
        expect(mapping.mode).toEqual('view');
    });

    it('Should delete a category mapping', function() {

        var mapping = $scope.mappings[1];

        $scope.deleteMapping(mapping);

        expect($scope.mappings.length).toEqual(2);
        expect($scope.mappings[0]._id).toEqual('catmap1');
        expect($scope.mappings[1]._id).toEqual('catmap3');
    });

    it('Should select a category', function() {

        $scope.categorySelected($scope.categories[0]);

        expect($scope.subcategories.length).toEqual(3);
        expect($scope.subcategories[0].name).toEqual('Electric');
        expect($scope.subcategories[1].name).toEqual('Gas');
        expect($scope.subcategories[2].name).toEqual('Time Warner Cable');
    });

});
