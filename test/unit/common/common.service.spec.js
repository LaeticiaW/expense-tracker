
describe("Common Service Tests", function () {

    var CommonService;

    beforeEach(module("common"));

    beforeEach(inject(function (_CommonService_) {
        CommonService = _CommonService_;
    }));

    it("Should sort an object array", function () {

        var sortByNumber = {
                property: 'numberField',
                subProperty: undefined,
                direction: 'ascending',
                type: 'number'
            },
            sortByString = {
                property: 'stringField',
                subProperty: undefined,
                direction: 'ascending',
                type: 'string'
            },
            emptyInputArray = [],
            inputArray = [
                {numberField: 32, stringField: "def"},
                {numberField: -2, stringField: "nop"},
                {numberField: 405, stringField: "xyz"},
                {numberField: 10000, stringField: "hij"},
                {numberField: 23, stringField: "abc"}
            ];

        CommonService.sortObjectArray(undefined, undefined);

        CommonService.sortObjectArray(emptyInputArray, null);
        expect(emptyInputArray.length).toEqual(0);

        CommonService.sortObjectArray(emptyInputArray, {});
        expect(emptyInputArray.length).toEqual(0);

        sortByNumber.direction = 'ascending';
        sortByString.direction = 'ascending';

        CommonService.sortObjectArray(inputArray, sortByNumber);
        expect(inputArray.length).toEqual(5);
        expect(inputArray[0].numberField).toEqual(-2);
        expect(inputArray[1].numberField).toEqual(23);
        expect(inputArray[2].numberField).toEqual(32);
        expect(inputArray[3].numberField).toEqual(405);
        expect(inputArray[4].numberField).toEqual(10000);
        expect(inputArray[0].stringField).toEqual('nop');
        expect(inputArray[1].stringField).toEqual('abc');
        expect(inputArray[2].stringField).toEqual('def');
        expect(inputArray[3].stringField).toEqual('xyz');
        expect(inputArray[4].stringField).toEqual('hij');

        CommonService.sortObjectArray(inputArray, sortByString);
        expect(inputArray.length).toEqual(5);
        expect(inputArray[0].stringField).toEqual('abc');
        expect(inputArray[1].stringField).toEqual('def');
        expect(inputArray[2].stringField).toEqual('hij');
        expect(inputArray[3].stringField).toEqual('nop');
        expect(inputArray[4].stringField).toEqual('xyz');
        expect(inputArray[0].numberField).toEqual(23);
        expect(inputArray[1].numberField).toEqual(32);
        expect(inputArray[2].numberField).toEqual(10000);
        expect(inputArray[3].numberField).toEqual(-2);
        expect(inputArray[4].numberField).toEqual(405);

        sortByNumber.direction = 'descending';
        sortByString.direction = 'ascending';

        CommonService.sortObjectArray(inputArray, sortByNumber);
        expect(inputArray.length).toEqual(5);

        CommonService.sortObjectArray(inputArray, sortByString);
        expect(inputArray.length).toEqual(5);
    });

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