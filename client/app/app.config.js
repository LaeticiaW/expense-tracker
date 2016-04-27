angular.module('expense-tracker').config(function(toastrConfig) {

    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 0,
        newestOnTop: true,
        positionClass: 'toast-top-right',
        preventDuplicates: false,
        preventOpenDuplicates: true,
        target: 'body',
        allowHtml: true,
        closeButton: true,
        closeHtml: '<button>&times;</button>',
        extendedTimeOut: 1000,
        iconClasses: {
          error: 'toast-error',
          info: 'toast-info',
          success: 'toast-success',
          warning: 'toast-warning'
        },
        messageClass: 'toast-message',
        onHidden: null,
        onShown: null,
        onTap: null,
        progressBar: false,
        tapToDismiss: true,
        templates: {
          toast: 'directives/toast/toast.html',
          progressbar: 'directives/progressbar/progressbar.html'
        },
        timeOut: 5000,
        titleClass: 'toast-title',
        toastClass: 'toast'
    });
});

angular.module('expense-tracker').config(function($provide) {

    $provide.decorator('$exceptionHandler', function($delegate, $injector) {
        return function(exception, cause) {
            console.log("Exception Handler:", exception, cause);
            $delegate(exception, cause);
            var msg = "An unexpected error occurred";
            console.log("typeof exception=", typeof exception);
            if (typeof exception === 'string') {
                msg = exception;
            } else if (typeof exception === 'object') {
                if (exception.msg) {
                    msg = exception.msg;
                }
            }
            $injector.get('toastr').error(msg, "Expense Tracker Error");
        };
    });
});

angular.module('expense-tracker').config(function($httpProvider) {

     $httpProvider.interceptors.push(function($q, $injector) {
        return {
          responseError: function(errorResponse) {
                var msg = errorResponse.statusText ? errorResponse.statusText : "The server is unavailable";
                $injector.get('toastr').error(msg, "Expense Tracker HTTP Error");
                return $q.reject(errorResponse);
            }
        };
    });
});

angular.module('expense-tracker').run(['$document', function($document) {

    // Fix bug in Bootstrap so that mobile navbar collapses after clicking link
    // $(document).on('click','.navbar-collapse.in', function(e) {
    //     if ($(e.target).is('a')) {
    //         $(this).collapse('hide');
    //     }
    // });
}]);

angular.module('expense-tracker').run(function(confirmationPopoverDefaults) {

  confirmationPopoverDefaults.confirmText = 'OK';
  confirmationPopoverDefaults.cancelText = 'Cancel';
  confirmationPopoverDefaults.placement = 'top';
  confirmationPopoverDefaults.confirmButtonType = 'primary';
  confirmationPopoverDefaults.cancelButtontype = 'default';
});
