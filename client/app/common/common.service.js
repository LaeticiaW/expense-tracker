
angular.module('common').factory('CommonService', [function () {

    return {
        sortObjectArray: function(arr, sort) {

            if (!arr || !sort) {
                return;
            }

            var multiplier = (sort.direction === 'ascending' ? 1 : -1);

            if (!arr || arr.length === 0) {
                return;
            }

            if (sort.type === 'number') {

                arr.sort(function(obj1, obj2) {

                    if (obj1[sort.property] && obj2[sort.property]) {
                        return (obj1[sort.property] - obj2[sort.property]) * multiplier;
                    } else if (obj1[sort.property]) {
                        return 1 * multiplier;
                    } else if (obj2[sort.property]) {
                        return -1 * multiplier;
                    } else {
                        return 0;
                    }
                });

            } else if (sort.type === 'string') {

                arr.sort(function(obj1, obj2) {

                    var prop1 = obj1[sort.property],
                        prop2 = obj2[sort.property];

                    if (sort.subProperty) {
                        if (prop1) {
                            prop1 = obj1[sort.property][sort.subProperty];
                        }
                        if (prop2) {
                            prop2 = obj2[sort.property][sort.subProperty];
                        }
                    }

                    if (prop1 && prop2) {
                        prop1 = prop1.toLowerCase();
                        prop2 = prop2.toLowerCase();

                        if (prop1 > prop2) {
                            return 1 * multiplier;
                        }
                        if (prop1 < prop2) {
                            return -1 * multiplier;
                        }
                        return 0;
                    } else if (prop1) {
                        return 1 * multiplier;
                    } else if (prop2) {
                        return -1 * multiplier;
                    } else {
                        return 0;
                    }

                });
            }
        },

        isYearValid: function(year) {

            if (year >= 1900 && year <= 3000) {
                return true;
            } else {
                return false;
            }
        },

        getMonthStartDate: function(dt) {

            var monthDate = dt ? dt : new Date();

            return new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        },

        getMonthEndDate: function(dt) {

            var monthDate = dt ? dt : new Date();

            return new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
        },

        addCategoryToArray: function(dataArray, categories, categoryIdProperty) {

            var self = this;

            dataArray.forEach(function(arrayItem) {
                self.addCategory(arrayItem, categories, categoryIdProperty);
            });
        },

        addCategory: function(item, categories, categoryIdProperty) {

            var propertyLevels = categoryIdProperty.split('\.'),
                category = [],
                itemCategoryId;

            if (propertyLevels.length === 1) {
                itemCategoryId = item[propertyLevels[0]];
            } else if (propertyLevels.length === 2) {
                itemCategoryId = item[propertyLevels[0]][propertyLevels[1]];
            } else if (propertyLevels.length === 3) {
                itemCategoryId = item[propertyLevels[0]][propertyLevels[1]][propertyLevels[3]];
            }

            category = categories.filter(function(cat) {
                return cat._id === itemCategoryId;
            });

            if (category.length) {
                item.category = category[0];
            }
        }
    };
}]);

