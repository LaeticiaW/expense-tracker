module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'client/lib/jquery/dist/jquery.js',
      'client/lib/angular/angular.js',
      'client/lib/angular-ui-router/release/angular-ui-router.js',
      'client/lib/angular-resource/angular-resource.js',
      'client/lib/angular-animate/angular-animate.js',
      'client/lib/Chart.js/Chart.js',
      'client/lib/angular-chart.js/dist/angular-chart.js',
      'client/lib/angular-ui-grid/ui-grid.min.js',
      'client/lib/angular-toastr/dist/angular-toastr.tpls.min.js',
      'client/lib/angular-mocks/angular-mocks.js',
      'client/lib/papaparse/papaparse.min.js',
      'client/lib/bootstrap/dist/js/bootstrap.js',
      'client/lib/ui-bootstrap-tpls-1.1.2.js',
      'client/lib/angular-sanitize/angular-sanitize.min.js',
      'client/lib/angular-bootstrap-confirm/dist/angular-bootstrap-confirm.min.js',

      'client/app/common/common.module.js',
      'client/app/common/common.service.js',
      'client/app/common/directives/focus.directive.js',
      'client/app/common/directives/auto-focus.directive.js',
      'client/app/common/directives/ng-repeat.directive.js',
      'client/app/common/directives/file-model.directive.js',
      'client/app/home/home.module.js',
      'client/app/home/home.controller.js',
      'client/app/home/home.service.js',
      'client/app/category/category.module.js',
      'client/app/category/category.controller.js',
      'client/app/category/category.service.js',
      'client/app/expense/expense.module.js',
      'client/app/expense/expense.filter.js',
      'client/app/expense/expense.controller.js',
      'client/app/expense/expense.service.js',
      'client/app/import/import.module.js',
      'client/app/import/import.filter.js',
      'client/app/import/import.controller.js',
      'client/app/import/import.service.js',
      'client/app/category-mapping/category-mapping.module.js',
      'client/app/category-mapping/category-mapping.filter.js',
      'client/app/category-mapping/category-mapping.controller.js',
      'client/app/category-mapping/category-mapping.service.js',

      'client/app/report/**/*.module.js',
      'client/app/report/**/*.js',

      'client/app/app.js',
      'client/app/app.routes.js',
      'client/app/app.config.js',

      'test/unit/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],
    //browsers : ['Chrome'],
    //browsers : ['Chrome', 'Firefox'],

    plugins : [
        'karma-chrome-launcher',
        'karma-firefox-launcher',
        'karma-jasmine',
        'karma-spec-reporter',
        'karma-phantomjs-launcher'
    ],

    phantomjsLauncher: {
      exitOnResourceError: true
    },

    //reporters: ['progress']
    reporters: ["spec"],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },

    specReporter: {
        maxLogLines: 10,              // limit number of lines logged per test
        suppressErrorSummary: false, // do not print error summary
        suppressFailed: false,       // do not print information about failed tests
        suppressPassed: false,       // do not print information about passed tests
        suppressSkipped: true,       // do not print information about skipped tests
        showSpecTiming: false        // print the time elapsed for each spec
    }

  });
};

