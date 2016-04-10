var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CategoryMappingSchema = new Schema({
    searchText: {
        type: String
    },    
    category: {
        type: String
    },
    subcategory: {
        type: String
    } 
},
{
    collection: 'categoryMappings'
});

mongoose.model('CategoryMapping', CategoryMappingSchema);