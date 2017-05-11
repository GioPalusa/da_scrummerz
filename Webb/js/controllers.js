var guid;

(function () {

    angular
        .module('LoggedIn', ['firebase'])
        .factory("Auth", ["$firebaseAuth",
            function ($firebaseAuth) {
                return $firebaseAuth();
            }
        ])
        .controller('personCtrl', ["$scope", "$firebaseObject", "Auth",
            function ($scope, $firebaseObject, Auth) {
                var ref = firebase.database().ref();
                $scope.auth = Auth;
                $scope.data = $firebaseObject(ref.child('courses'));
                $scope.auth.$onAuthStateChanged(function (firebaseUser) {
                    var userId = firebaseUser.uid;
                    $scope.firebaseUser = firebaseUser;
                    $scope.user = $firebaseObject(ref.child('users').child('Pupils/' + userId));
                    $scope.userClass = $firebaseObject(ref.child('users').child('Pupils/' + userId));
                    $scope.user.$loaded().then(function () {
                        $scope.myClass = $scope.user.Class;
                        var klass = $scope.myClass;
                        $scope.myCourses = $firebaseObject(ref.child('classes/' + klass).child('Courses'));
                    });                   
                });
            }])
        .controller("AdminUserCtrl", ["$scope", "Auth",
            function ($scope, Auth) {
                $scope.createUser = function () {
                    $scope.message = null;
                    $scope.error = null;
                    // Create a new user
                    Auth.$createUserWithEmailAndPassword($scope.email, $scope.password)
                        .then(function (firebaseUser) {
                            $scope.message = "Användare skapad med UID: " + firebaseUser.uid;
                        }).catch(function (error) {
                            $scope.error = error;
                        });
                };

                $scope.deleteUser = function () {
                    $scope.message = null;
                    $scope.error = null;

                    // Delete the currently signed-in user
                    Auth.$deleteUser().then(function () {
                        $scope.message = "Användare raderad";
                    }).catch(function (error) {
                        $scope.error = error;
                    });
                };
            }
        ]);

}());