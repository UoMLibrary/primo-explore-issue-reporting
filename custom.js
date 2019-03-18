// Service for fetching a logged-in user's details
app.service(
    'userDetails',
    function () {

        var userDetails = {};
        var loggedIn = false;

        this.isLoggedIn = function () {
            return loggedIn;
        };

        this.getUserDetails = function () {
            return userDetails;
        };

        this.setUserDetails = function (details) {
            if (details.spotID && details.displayName) {
                userDetails = details;
                loggedIn = true;
            }
        }

    }
);

app.controller(
    'ProblemReportController',
    function (userDetails, $scope, $mdToast, $mdDialog) {
        var vm = this;

        var minCharacters = 5;

        var displayButton = false;

        // Display button if E-Resource
        if (vm.item.delivery) {
            for (var i = 0; i < vm.item.delivery.deliveryCategory.length; i++) {
                if (vm.item.delivery.deliveryCategory[i] == "Alma-E") {
                    displayButton = true;
                    break;
                }
            }
        }

        $scope.displayReportButton = displayButton;

        // Put userDetails.isLoggedIn() in scope
        $scope.isLoggedIn = userDetails.isLoggedIn;

        function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        // Find an element to use as parent for mdDialog and mdToast
        var bodyElement = angular.element(document.body);

        $scope.buttonPressed = function ($event) {
            if (userDetails.isLoggedIn()) {
                showAuthenticatedDialog($event);
            } else {
                showPublicDialog($event);
            }
        };

        var toastDelay = 4000;
        var showSubmissionSucceededToast = function (success) {
            console.log(success);
            $mdDialog.hide();
            $mdToast.show($mdToast.simple().textContent('Thank you for reporting this item to the Electronic Resources Helpdesk.').position('bottom center').hideDelay(toastDelay).parent(bodyElement));
        };
        var showSubmissionFailedToast = function (error) {
            console.log(error);
            $mdToast.show($mdToast.simple().textContent('Unfortunately there was an error during the report submission').position('bottom center').hideDelay(toastDelay).parent(bodyElement));
        };
        var showReportDialogClosedToast = function () {
            $mdToast.show($mdToast.simple().textContent('Report aborted!').position('bottom center').hideDelay(toastDelay).parent(bodyElement));
        };

        var showPublicDialog = function ($event) {
            $mdDialog.show({
                parent: bodyElement,
                targetEvent: $event,
                clickOutsideToClose: true,
                preserveScope: true,
                templateUrl: 'custom/reportEResourcePublicDialog.html',
                locals: {
                    pnx: vm.item.pnx
                },
                controller: DialogController
            });

            function DialogController($scope, $mdDialog, $http, pnx) {
                $scope.pnx = pnx;
                $scope.closeDialog = function () {
                    $mdDialog.cancel();
                    showReportDialogClosedToast();
                };
                $scope.submitForm = function () {
                    if ($scope.user && $scope.user.name && validateEmail($scope.user.email) && $scope.user.captcha && $scope.user.issueDescription.length >= minCharacters) {
                        var data = {
                            user: $scope.user,
                            item: pnx.addata
                        };
                        console.log(data);
                        $http.post(
                            settings.gatewayUrl + '/services/eresources/contact',
                            data
                        ).then(
                            showSubmissionSucceededToast,
                            showSubmissionFailedToast
                        )
                    }
                };
            }
        };

        var showAuthenticatedDialog = function ($event) {
            $mdDialog.show({
                parent: bodyElement,
                targetEvent: $event,
                clickOutsideToClose: true,
                templateUrl: 'custom/reportEResourceAuthenticatedDialog.html',
                locals: {
                    pnx: vm.item.pnx
                },
                controller: DialogController
            });

            function DialogController($scope, $mdDialog, $http, pnx, userDetails) {
                $scope.pnx = pnx;
                $scope.userDetails = userDetails.getUserDetails();
                $scope.user = {};
                $scope.closeDialog = function () {
                    $mdDialog.hide();
                    showReportDialogClosedToast();
                };
                $scope.submitForm = function () {
                    $scope.user.spotID = $scope.userDetails.spotID;
                    $scope.user.name = $scope.userDetails.displayName;
                    if ($scope.user && $scope.user.spotID && $scope.user.captcha && $scope.user.issueDescription.length >= minCharacters) {
                        var data = {
                            user: $scope.user,
                            item: pnx.addata,
                            authed: true
                        };
                        $http.post(
                            settings.gatewayUrl + '/api/primo/eresources/contact',
                            data
                        ).then(
                            showSubmissionSucceededToast,
                            showSubmissionFailedToast
                        )
                    }
                };
            }
        };

    }
)
;

app.component('problemReport', {
    bindings: {item: '<'},
    controller: 'ProblemReportController',
    template: '<md-button data-ng-show="displayReportButton" data-ng-click="buttonPressed($event)" class="report-e-resource-button">Report a Problem</md-button>'
});


app.controller('AlmaViewitAfter', function () {

    var $ctrl = this;
    $ctrl.item = $ctrl.parentCtrl.item;

});

app.component('prmAlmaViewitAfter', {
    bindings: {parentCtrl: '<'},
    controller: 'AlmaViewitAfter',
    template: '<problem-report item="$ctrl.item"></problem-report>'
});