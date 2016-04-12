mongo = new Mongo("localhost");
expenseTrackerDB = mongo.getDB('expenseTracker');
expenseTrackerDB.createCollection("categories");
expenseTrackerDB.createCollection("categoryMappings");
expenseTrackerDB.createCollection("expenses");
