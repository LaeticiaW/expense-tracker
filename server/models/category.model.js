var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CategorySchema = new Schema({
    name: {
        type: String,
        default: '',
        trim: true,
        required: 'Category name cannot be blank'
    },
    subcategories: {
        type: Array, "defaults": []
    }    
}, {
    collection: 'categories'
});

mongoose.model('Category', CategorySchema);