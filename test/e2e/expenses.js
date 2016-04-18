describe('Expenses View', function() {

    beforeEach(function() {
        browser.get('/');
    });

    it('Should display the Manage Expenses view when the header Manage Expenses submenu item is clicked', function() {

        var submenuItem;

        element(by.css('.expenses-menu > a')).click();

        submenuItem = element(by.css('.expenses-menu > ul > li:first-child > a'));

        expect(submenuItem.getText()).toEqual('Manage Expenses');

        submenuItem.click();

        expect(element(by.css('h2.page-title')).getText()).toEqual('Expenses');
    });
});
