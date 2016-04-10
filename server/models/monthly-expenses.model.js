var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MonthlyExpensesSchema = new Schema({
    month: {
        type: Number
    },
    category : {
        type: Schema.Types.ObjectId,
        ref: 'Category'
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

mongoose.model('MonthlyExpenses', MonthlyExpensesSchema);