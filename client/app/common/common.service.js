
angular.module('common').factory('CommonService', [function () {

    return {

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

