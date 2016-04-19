
describe("Common Service Tests", function () {

    var CommonService;

    beforeEach(module("common"));

    beforeEach(inject(function (_CommonService_) {
        CommonService = _CommonService_;
    }));

    it ('Should deterimine if a year value is valid', function() {

        expect(CommonService.isYearValid(undefined)).toBe(false);
        expect(CommonService.isYearValid(null)).toBe(false);
        expect(CommonService.isYearValid(0)).toBe(false);
        expect(CommonService.isYearValid(1899)).toBe(false);
        expect(CommonService.isYearValid(1900)).toBe(true);
        expect(CommonService.isYearValid(2016)).toBe(true);
        expect(CommonService.isYearValid(2555)).toBe(true);
        expect(CommonService.isYearValid(3001)).toBe(false);
    });

    it ('Should determine a month start date', function() {

        expect(CommonService.getMonthStartDate()).toBeDefined();
        expect(CommonService.getMonthStartDate(new Date('01/15/2016 00:00:00 EST'))).toEqual(new Date('01/01/2016 00:00:00 EST'));
        expect(CommonService.getMonthStartDate(new Date('02/02/2016 00:00:00 EST'))).toEqual(new Date('02/01/2016 00:00:00 EST'));
        expect(CommonService.getMonthStartDate(new Date('12/25/2016 00:00:00 EST'))).toEqual(new Date('12/01/2016 00:00:00 EST'));
    });

    it ('Should determine a month end date', function() {

        expect(CommonService.getMonthEndDate(new Date('01/15/2016 00:00:00 EST'))).toEqual(new Date('01/31/2016 00:00:00 EST'));
        expect(CommonService.getMonthEndDate(new Date('02/02/2016 00:00:00 EST'))).toEqual(new Date('02/29/2016 00:00:00 EST'));
        expect(CommonService.getMonthEndDate(new Date('12/25/2016 00:00:00 EST'))).toEqual(new Date('12/31/2016 00:00:00 EST'));
    });

    it ('Should add a category object to an object containing a category id', function() {

        var item = { field1: 'abc', id: 'catid2' },
            itemNested = { field1: 'abc', category: {id: 'catid3'}},
            categoryIdProperty = 'id',
            categoryIdPropertyNested = 'category.id',
            categories = [
                {_id: 'catid1', name: 'catname1'},
                {_id: 'catid2', name: 'catname2'},
                {_id: 'catid3', name: 'catname3'}
            ];

        CommonService.addCategory(item, categories, categoryIdProperty);
        expect(item.category).toBeDefined();
        expect(item.category._id).toEqual('catid2');
        expect(item.category.name).toEqual('catname2');

        CommonService.addCategory(itemNested, categories, categoryIdPropertyNested);
        expect(itemNested.category).toBeDefined();
        expect(itemNested.category._id).toEqual('catid3');
        expect(itemNested.category.name).toEqual('catname3');
    });


});