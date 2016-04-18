# expense-tracker

![Expenses](LaeticiaW.github.com/expense-tracker/img/expenses.jpg)

## Summary
The expense-tracker application allows users to enter and report on their expenses.

Features:
* Expense Category and Subcategory definition
* Expense Management, allowing adding, updating, deleting of expenses as well as assigning expenses to categories and subcategories
* Importing expenses from a csv file, along with automatically assigning category and subcategory to the imported expenses based on predefined category mapping text
* Yearly, monthly, and summary expense reports

## Tech Stack
This web application was written in Javascript using the MEAN tech stack: AngularJS, Node, Express, MongoDB and Bootstrap.

## Dependencies
* Node and npm, which can be installed from https://nodejs.org/en/
* MongoDB, which can be installed from https://www.mongodb.org/ and configured to run on port 27017

## To start and run the Expense Tracker web app

>Make sure that node and npm have been installed and that MongoDB is running locally on port 27017.  The mongo shell command should be in the user path.

Download and unzip the expense-tracker zip file
```shell
https://github.com/LaeticiaW/expense-tracker/archive/master.zip
```

Go to the project directory
```shell
cd expense-tracker-master
```

Install the npm packages
```shell
npm install
```

Go to the expense-tracker-master/db directory
```shell
cd db
```

Create the expenseTracker DB and Collections
```shell
mongo createDB.js
```

Import sample data into the expenseTracker DB
```shell
./importCategories.sh
./importCategoryMappings.sh
./importExpenses.sh
```

Go back to the expense-tracker-master project directory
```shell
cd ..
```

Start the node server
```shell
./start_server.sh
```

Open a browser and start the web app
```shell
http://127.0.0.1:3000/
```

Note:  To test out the Import Expenses menu item, there is a sampleImportData.csv file in the expense-tracker-master/db directory.

## Expense-Tracker Description

* There are 4 main menu options:  Home, Categories, Expenses, and Reports.
* The Home page displays a pie chart showing expenses by category for the specified year.
* The Categories page allows users to View, Add, Update, and Delete categories.  A category consists of a name and a list of subcategories.
* The Expenses menu item has 3 submenu items:  Manage Expenses, Import Expenses, and Category Mapping
    * The Manage Expenses page allows users to View, Add, Update, and Delete expense transactions.  This page allows filtering by date and category.
    * The Import Expenses page allows importing of expense transactions from a CSV file that contains 3 fields: trxDate, amount, description.  CSV files can be created from credit card and/or bank account sites with expense transactions.  The import page first loads the CSV file expenses into a grid, then allows the user to select a category and subcategory for each expense.  The import process will automatically set category and subcategory values if there any category mappings that match.  Once category and subcategory values are set, the Import button will import the expenses into the expenses collection in the DB.
    * The Category Mapping page allows users to define text strings to search for in the expenses CSV data uploaded during the Import process.  When an expense is being uploaded into the grid, if its description matches a category mapping, then that mapping is used to automatically assign the category and subcategory to the expense record prior to its being imported.
* The Report menu item has 3 submenu items for the 3 reports:
    * Monthly Expenses Report
    * Yearly Expenses Report
    * Summary Expense Report
