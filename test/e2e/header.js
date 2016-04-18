describe('Header View', function() {
/*
    beforeEach(function() {
        browser.get('/');
    });

    it('Should have a title', function() {

        expect(browser.getTitle()).toEqual('Expense Tracker');
    });

    it('Should display the header menu items', function() {

        var menuItems = element.all(by.css('.expense-tracker-menu > li'));
        expect(menuItems.count()).toEqual(4);
        expect(menuItems.get(0).getText()).toEqual('Home');
        expect(menuItems.get(1).getText()).toEqual('Categories');
        expect(menuItems.get(2).getText()).toEqual('Expenses');
        expect(menuItems.get(3).getText()).toEqual('Reports');
    });

    it("Should display the Expenses submenu when the Expenses menu is clicked", function() {

        var submenuItems;

        expect(element.all(by.css('.expenses-menu')).count()).toEqual(1);

        submenuItems = element.all(by.css('.expenses-menu li')).filter(function(elem) {
            return elem.isDisplayed().then(function (isDisplayed) {
                return isDisplayed;
            });
        });
        expect(submenuItems.count()).toEqual(0);

        element(by.css('.expenses-menu > a')).click();

        submenuItems = element.all(by.css('.expenses-menu li')).filter(function(elem) {
            return elem.isDisplayed().then(function (isDisplayed) {
                return isDisplayed;
            });
        });
        expect(submenuItems.count()).toEqual(3);

        expect(submenuItems.get(0).getText()).toEqual('Manage Expenses');
        expect(submenuItems.get(1).getText()).toEqual('Import Expenses');
        expect(submenuItems.get(2).getText()).toEqual('Category Mapping');
    });

    it("Should display the Reports submenu when the Reports menu is clicked", function() {

        var submenuItems;

        expect(element.all(by.css('.reports-menu')).count()).toEqual(1);

        submenuItems = element.all(by.css('.reports-menu li')).filter(function(elem) {
            return elem.isDisplayed().then(function (isDisplayed) {
                return isDisplayed;
            });
        });
        expect(submenuItems.count()).toEqual(0);

        element(by.css('.reports-menu > a')).click();

        submenuItems = element.all(by.css('.reports-menu li')).filter(function(elem) {
            return elem.isDisplayed().then(function (isDisplayed) {
                return isDisplayed;
            });
        });
        expect(submenuItems.count()).toEqual(3);

        expect(submenuItems.get(0).getText()).toEqual('Monthly Expenses');
        expect(submenuItems.get(1).getText()).toEqual('Yearly Expenses');
        expect(submenuItems.get(2).getText()).toEqual('Expense Summary');
    });
    */
});
