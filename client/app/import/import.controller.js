
angular.module('import').controller('ImportController', ['$scope', 'Papa', 'ImportService',
                                    'CommonService', 'toastr', 'categories', 'categoryMappings',
    function($scope, Papa, ImportService, CommonService, toastr, categories, categoryMappings) {

        initialize();

        function initialize() {

            $scope.categories = categories;
            $scope.categoryMappings = categoryMappings;
            $scope.dataUploaded = false;
            $scope.selectedRows = [];

            // Define the grid options for the angular ui-grid
            $scope.gridOptions = {
                enableColumnMenus: false,
                enableSorting: true,
                showGridFooter: true,
                showColumnFooter: false,
                multiselect: true,
                enableRowSelection: true,
                showSelectionCheckbox: true,
                selectedItems : $scope.selectedRows,
                enableFooterTotalSelected: true,
                enableHorizontalScrollbar: 0,

                columnDefs: getColumnDefs(),

                onRegisterApi: function(gridApi) {

                    $scope.gridApi = gridApi;

                    gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue) {
                        if (colDef.name === 'categoryName') {
                            var category = $scope.categories.filter(function(cat) {
                                return cat._id === newValue;
                            });
                            if (category.length) {
                                rowEntity.category = category[0];
                            }
                        }
                    });
                }
            };
        }

        $scope.selectFile = function() {

            $('.import-input').click();
        };

        $scope.uploadFile = function() {

            Papa.parse($scope.csvFile, {
                complete: function(results) {

                    var amount, description, categoryMapping;

                    $scope.dataUploaded = true;
                    $scope.gridOptions.data = [];

                    results.data.forEach(function(row) {
                        if (row.length >= 3) {

                            amount = row[1] * -1;
                            description = row[4];

                            if (amount > 0) {
                                categoryMapping = getCategoryMapping(description);
                                $scope.gridOptions.data.push({
                                    trxDate: new Date(row[0]),
                                    amount: amount,
                                    description: row[4],
                                    category: categoryMapping.category,
                                    subcategory: categoryMapping.subcategory
                                });
                            }
                        }
                    });

                    CommonService.addCategoryToArray($scope.gridOptions.data, $scope.categories, 'category');

                    if (!$scope.$$phase) {
                        $scope.$digest($scope);
                    }
                }
            });
        };

        $scope.deleteSelected = function() {

            $scope.selectedRows = $scope.gridApi.selection.getSelectedRows();

            angular.forEach($scope.selectedRows, function(rowItem) {
                $scope.gridOptions.data.splice($scope.gridOptions.data.indexOf(rowItem),1);
            });

            $scope.clearSelected();
        };

        $scope.clearSelected = function() {

             $scope.gridApi.selection.clearSelectedRows();
        };

        $scope.importData = function() {

            var numImportRows = $scope.gridOptions.data.length,
                numImported = 0,
                msg = "";

            $scope.expenses = $scope.gridOptions.data.filter(function(expense) {
                return expense.category._id && expense.subcategory && expense.trxDate;
            });

            $scope.expenses.forEach(function(exp) {
                exp.categoryId = exp.category._id;
            });

            ImportService.insertExpenses($scope.expenses).then(
                function() {
                    $scope.gridOptions.data = $scope.gridOptions.data.filter(function(expense) {
                        return !expense.category._id || !expense.subcategory || !expense.trxDate;
                    });
                    numImported = numImportRows - $scope.gridOptions.data.length;
                    msg = "Imported " + numImported + " of " + numImportRows + " expenses. ";
                    console.log(msg);
                    if ($scope.gridOptions.data.length) {
                        msg += "Please select category and subcategory on remaining rows to import";
                    }
                    toastr.info(msg);
                },
                function(response) {
                    console.log("import expenses error:", response);
                    toastr.error('Unable to import the expense', 'Expense Tracker Processing Error');
                }
            );
        };

        function getSubcategoryOptions(row) {

            if (row.category) {
                return row.category.subcategories;
            }

            return [];
        }

        function getCategoryMapping(description) {

            var done = false,
                desc = description.toUpperCase(),
                categoryMapping = {
                    category: '',
                    subcategory: ''
                };

            for (var i = 0; i < $scope.categoryMappings.length && !done; i++) {
                if (desc.indexOf($scope.categoryMappings[i].searchText.toUpperCase()) !== -1) {
                    angular.copy($scope.categoryMappings[i], categoryMapping);
                    done = true;
                }
            }

            return categoryMapping;
        }

        function getColumnDefs() {

            return [
                {
                    field: 'trxDate',
                    displayName: 'Trx Date',
                    width: 100, minWidth: 100,
                    cellClass: 'import-grid-cell',
                    type: 'date',
                    enableCellEdit: false,
                    cellFilter: 'date:\'yyyy-MM-dd\''
                }, {
                    field: 'amount',
                    displayName: 'Amount',
                    type: 'number',
                    width: 90,
                    minWidth: 90,
                    cellClass: 'import-grid-cell amount',
                    enableCellEdit: false
                }, {
                    field: 'description',
                    displayName: 'Description',
                    minWidth: 200,
                    enableSorting: false,
                    cellTooltip: true,
                    cellClass: 'import-grid-cell',
                    enableCellEdit: false
                }, {
                    field: 'category.name',
                    name: 'categoryName',
                    displayName: 'Category',
                    width: 150,
                    minWidth: 80,
                    cellClass: 'import-grid-cell',
                    enableCellEdit: true,
                    editDropdownOptionsArray: $scope.categories,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownIdLabel: '_id',
                    editDropdownValueLabel: 'name'
                }, {
                    field: 'subcategory',
                    displayName: 'Subcategory',
                    width: 150,
                    minWidth: 80,
                    enableSorting: false,
                    cellClass: 'import-grid-cell',
                    enableCellEdit: true,
                    editDropdownOptionsFunction: getSubcategoryOptions,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownIdLabel: 'name',
                    editDropdownValueLabel: 'name'
                }
            ];
        }
    }
]);
