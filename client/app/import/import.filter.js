
angular.module('import').filter("mapCategory", function() {

  return function(input, idLabel, valueLabel, optionsArray) {

    console.log("Filter, input:", input, "idLabel:", idLabel, "valueLabel", valueLabel);

    var category;

    if (!input) {
        return '';
    } else {
        category = optionsArray.filter(function(cat) {
            return cat[idLabel] === input;
        });

        if (category) {
            return category[0][valueLabel];
        }
    }

    return input;
  };

});
