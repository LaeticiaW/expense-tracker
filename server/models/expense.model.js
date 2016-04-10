var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ExpenseSchema = new Schema({
    trxDate: {
        type: Date
    },
    trxYear: {
        type: Number
    },
    trxMonth: {
        type: Number
    },
    categoryId: {
        type: String
    },
    subcategory: {
        type: String
    },
    amount: {
        type: Number
    }
},
{
    collection: 'expenses'
});

mongoose.model('ExpenseModel', ExpenseSchema);