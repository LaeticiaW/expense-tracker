
describe('Category Controller Tests', function() {

    var $scope, CategoryController, MockCategory, MockExpense;

    beforeEach(module('category'));

    beforeEach(inject(function($rootScope, $controller, CommonService) {

        $scope = $rootScope.$new();

        MockCategory = function() {
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

        MockCategory.query = function(success) {
            return success([]);
        };

        MockExpense = function() {};

        MockExpense.isCategoryInUse = function(parms, success) {
            return success({isCategoryInUse: false});
        };

        CategoryController = $controller('CategoryController', {
            $scope: $scope,
            categories: [
                {_id: 'cat1', name: 'Category 1', subcategories: [{name:'subcat1'}]},
                {_id: 'cat2', name: 'Category 2', subcategories: [{name: 'subcat2'}, {name: 'anothersubcat2'}]},
                {_id: 'cat3', name: 'Category 3', subcategories: [{name: 'subcat3'}]}
            ],
            CommonService: CommonService,
            Category: MockCategory,
            toastr: {error: function() {}},
            Expense: MockExpense
        });
    }));

    it('Should initialize the categories', function() {

        expect($scope.categories.length).toEqual(3);
        expect($scope.categories[0]._id = 'cat1');
        expect($scope.categories[1].name = 'Category 2');
        expect($scope.categories[2]._id = 'cat3');
    });

    it('Should add a category', function() {

        $scope.addCategory();

        expect($scope.editing).toBe(true);
        expect($scope.categories.length).toEqual(4);
        expect($scope.categories[0].name).toEqual('');
        expect($scope.categories[0].mode).toEqual('edit');
        expect($scope.categories[0].state).toEqual('add');
    });

    it('Should cancel a category', function() {

        var category = $scope.categories[2];
        category.mode = 'edit';

        $scope.cancelCategory(category);

        expect($scope.editing).toBe(false);
        expect($scope.categories.length).toEqual(3);
        expect($scope.categories[2].state).not.toBeDefined();
        expect($scope.categories[2].mode).toEqual('view');
        expect($scope.categories[2]._id).toEqual('cat3');
        expect($scope.categories[2].name).toEqual('Category 3');
    });

    it('Should edit a category', function() {

        var category = $scope.categories[1];

        $scope.editCategory(category);

        expect($scope.editing).toBe(true);
        expect(category.mode).toEqual('edit');
    });

    it('Should save a new category', function() {

        var category = {_id: 'cat4', name: 'Category 4', subcategories: [{name: 'SubCat'}], state: 'add'};

        $scope.saveCategory(category);

        expect($scope.editing).toBe(false);
        expect(category.mode).toEqual('view');
    });

    it('Should save an updated category', function() {

        var category = {_id: 'cat2', name: 'Updated Category 2', subcategories: [{name: 'SubCat'}]};

        $scope.saveCategory(category);

        expect($scope.editing).toBe(false);
        expect(category.mode).toEqual('view');
    });

    it('Should delete a category', function() {

        var category = $scope.categories[1];

        $scope.deleteCategory(category);

        expect($scope.categories.length).toEqual(2);
        expect($scope.categories[0]._id).toEqual('cat1');
        expect($scope.categories[1]._id).toEqual('cat3');
    });

    it('Should add a subcategory', function() {

        var category = $scope.categories[1];

        $scope.addSubcategory(category);

        expect(category.subcategories.length).toEqual(3);
        expect(category.subcategories[0].name).toEqual('');
        expect(category.subcategories[1].name).toEqual('subcat2');
        expect(category.subcategories[2].name).toEqual('anothersubcat2');
    });

    it('Should delete a subcategory', function() {

        var category = $scope.categories[1];

        $scope.deleteSubcategory(category, {name: 'anothersubcat2'});

        expect(category.subcategories.length).toEqual(1);
        expect(category.subcategories[0].name).toEqual('subcat2');
    });

});
