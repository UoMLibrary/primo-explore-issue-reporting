// Inline eResources Report a Problem Controller - start
app.controller(
    'InlineEResourcesReportAProblemController',
    function ($scope, $http, $mdToast, kioskMode) {

        function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        var $ctrl = this;

        $ctrl.description = "";
        $ctrl.captcha = "";

	var displayButton = false;

        // Display button if E-Resource
        if ($ctrl.item.delivery) {
            for (var i = 0; i < $ctrl.item.delivery.deliveryCategory.length; i++) {
                if ($ctrl.item.delivery.deliveryCategory[i] == "Alma-E") {
                    displayButton = true;
                    break;
                }
            }
        }
        // Check for kiosk mode - ignore
        if(kioskMode.isKioskMode()) {
            displayButton = false;
        }

        $ctrl.displayButton = displayButton;

        //Form submit handler - start
        $scope.submitForm = function() {

            var bodyElement = angular.element(document.body);
            var toastDelay = 4000;    

            var data = {
                user: $ctrl.user,
                item: $ctrl.item.pnx
            };

            data.user.captcha = $ctrl.captcha;
            data.user.issueDescription = $ctrl.description;

            //Post form to a separate online (gateway) service which processes the info and sends an email to eResources team - start
            $http.post(
                settings.gatewayUrl + '/services/eresources/contact',
                data
            ).then(
                function(successResponse) {                    
                    // notifiy user using angular material toast
                    $mdToast.show($mdToast.simple().textContent('Thank you for reporting this item to the Electronic Resources Helpdesk.').position('bottom center').hideDelay(toastDelay).parent(bodyElement));                    
                    //hide form
                    $ctrl.displayForm = !$ctrl.displayForm;
                    return true;
                },
                function(errorResponse) {
                    // notifiy user using angular material toast
                    $mdToast.show($mdToast.simple().textContent('Unfortunately there was an error during the report submission').position('bottom center').hideDelay(toastDelay).parent(bodyElement));
                    //hide form
                    $ctrl.displayForm = !$ctrl.displayForm;
                    return false;
                }
            );
            //Post form to a separate online (gateway) service which processes the info and sends an email to eResources team - end
        }
        //Form submit handler - end
    }
)
;
//configure bindings, template... - start
//NB: Change the relative url to match location of html template
app.component('inlineEResourcesReportAProblem', {
    bindings: {
        item: '<'
    },
    controller: 'InlineEResourcesReportAProblemController',
    templateUrl: '/custom/inlineEResourcesReportAProblem.html'
});
//configure bindings, template... - end

// Inline eResources Report a Problem Controller - end
