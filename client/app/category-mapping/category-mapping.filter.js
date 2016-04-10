angular.module('categoryMapping').filter("categoryMapping", function() {

    return function(mappings, filterCategory) {

        var filteredMappings = [];

        mappings.forEach(function(mapping) {

            var categoryMatches = false;

            if (filterCategory === 'all' || mapping.category.name === filterCategory) {
                categoryMatches = true;
                filteredMappings.push(mapping);
            }
        });


        return filteredMappings;
  };
});

