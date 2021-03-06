var api = "http://daqya.herokuapp.com"; // change for production
// var api = "http://localhost:8080"; // change for production

angular.module("contactsApp", ['ngRoute', 'ngStorage'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/about", {
                controller: "aboutCtrl",
                templateUrl: "about.html"
            })
            .when("/new", {
                controller: "newCtrl",
                templateUrl: "new.html"
            })
            .when("/email", {
                controller: "addCtrl",
                templateUrl: "email.html"
            })
            .when("/search", {
                controller: "searchCtrl",
                templateUrl: "search.html"
            })
            .when("/post/:id", {
                controller: "postCtrl",
                templateUrl: "post.html"
            })
            .when("/faq", {
                controller: "faqCtrl",
                templateUrl: "faq.html"
            })
            .when("/signin", {
                controller: "signinCtrl",
                templateUrl: "signin.html"
            })
            .when("/signup", {
                controller: "signupCtrl",
                templateUrl: "signup.html"
            })
            .when("/signup-2", {
                controller: "signuppCtrl",
                templateUrl: "signup2.html"
            })
            .when("/signup-complete", {
                controller: "signupppCtrl",
                templateUrl: "signup-complete.html"
            })
            .when("/faq", {
                controller: "faqCtrl",
                templateUrl: "faq.html"
            })
            .when("/howitworks", {
                controller: "howitworksCtrl",
                templateUrl: "howitworks.html"
            })
            .when("/messenger", {
                controller: "messengerCtrl",
                templateUrl: "messenger.html"
            })
            .when("/profile", {
                controller: "profileCtrl",
                templateUrl: "profile.html"
            })
            .when("/taxlaws", {
                controller: "taxlawsCtrl",
                templateUrl: "taxlaws.html"
            })
            .when("/", {
                controller: "landingCtrl",
                templateUrl: "landing.html"
            })
            // ADMIN PANEL
            .when("/admin", {
                controller: "adminCtrl",
                templateUrl: "admin-login.html"
            })
            .when("/admin/home", {
                controller: "adminHomeCtrl",
                templateUrl: "admin-home.html"
            })
            .when("/admin/admins", {
                controller: "adminAdminsCtrl",
                templateUrl: "admin-admins.html"
            })
            .when("/admin/admins/new", {
                controller: "adminAdminsNewCtrl",
                templateUrl: "admin-admins-new.html"
            })
            .when("/admin/users", {
                controller: "adminUsersCtrl",
                templateUrl: "admin-users.html"
            })
            .when("/admin/users/new", {
                controller: "adminUsersNewCtrl",
                templateUrl: "admin-users-new.html"
            })
            .otherwise({
                redirectTo: "/"
            })
    })

     


//     .controller("postCtrl", function($http, $scope, $localStorage, $routeParams) {
//         // $scope.contacts = contacts.data;
        
// var currentId = $routeParams.id;
//         console.log("1423423fdsf234faef")


//         if($localStorage.daqyaUser) {
//             $scope.name = $localStorage.daqyaUser.fname
//         }
//         $scope.logout = function() {
//             $localStorage.daqyaUser = {}
//             $scope.name = false
//         }

//     })

    .controller("landingCtrl", function($http, $scope, $localStorage) {
        // $scope.contacts = contacts.data;
        

        if($localStorage.daqyaUser) {
            $scope.name = $localStorage.daqyaUser.fname
        }
        $scope.logout = function() {
            $localStorage.daqyaUser = {}
            $scope.name = false
        }


    })


    .controller("signupCtrl", function($http, $scope, $localStorage, $location) {



        if($localStorage.daqyaUser) {
            $scope.name = $localStorage.daqyaUser.fname
        }
        $scope.logout = function() {
            $localStorage.daqyaUser = {}
            $scope.name = false
        }


        $scope.user = {}


        $scope.emptyfields = 0

        $scope.create = function(user) {
            


                if(user.password==user.password2) {
            

                    user.reviews = []
                    user.posts = []
                    user.wallet = {}
                    user.wallet.amount = 0
                    user.wallet.payment_methods = []
                    $http({ url: api + '/users/register', method: "POST", data: user})
                    .then(function(response) {
            

                        // success
                        $scope.success = 1

                        // $localStorage.userId = response.data._id
                       

                    },
                    function(response) { // failed
                        console.log(response.data)
                        $scope.error = response.data
                    });
                }
                else {
                    $scope.passwordmismatch = 1
                }

            
        }

    })
    .controller("aboutCtrl", function($http, $scope, $localStorage) {



        if($localStorage.daqyaUser) {
            $scope.name = $localStorage.daqyaUser.fname
        }
        $scope.logout = function() {
            $localStorage.daqyaUser = {}
            $scope.name = false
        }
       
    })
    .controller("newCtrl", function($http, $scope, $localStorage) {


        $scope.makePost = function(user) {

             $http({ url: api + '/users/post/'+$localStorage.daqyaUser._id, method: "POST", data: user})
                    .then(function(response) {
                        // success
                        // $location.path('/signup-complete')]
                        $scope.success = 1
                    },
                    function(response) { // failed
                        console.log(response.data)
                        // $scope.error = response.data
                    });
        }


        if($localStorage.daqyaUser) {
            $scope.name = $localStorage.daqyaUser.fname
        }
        $scope.logout = function() {
            $localStorage.daqyaUser = {}
            $scope.name = false
        }
       $scope.today = new Date();
    })
    .controller("signuppCtrl", function($http, $scope, $location, $localStorage) {



        if($localStorage.daqyaUser) {
            $scope.name = $localStorage.daqyaUser.fname
        }
        $scope.logout = function() {
            $localStorage.daqyaUser = {}
            $scope.name = false
        }


        $scope.user = {}
        $scope.success = 0

        $scope.update = function(user) {
            $http({ url: api + '/users/update/'+$localStorage.userId, method: "POST", data: user})
                    .then(function(response) {
                        // success
                        $location.path('/signup-complete')


                    },
                    function(response) { // failed
                        console.log(response.data)
                        $scope.error = response.data
                    });
        }

       
    })
    .controller("signupppCtrl", function($http, $scope) {



        if($localStorage.daqyaUser) {
            $scope.name = $localStorage.daqyaUser.fname
        }
        $scope.logout = function() {
            $localStorage.daqyaUser = {}
            $scope.name = false
        }
       
    })
    .controller("signinCtrl", function($http, $scope, $location, $localStorage) {



        if($localStorage.daqyaUser) {
            $scope.name = $localStorage.daqyaUser.fname
        }
        $scope.logout = function() {
            $localStorage.daqyaUser = {}
            $scope.name = false
        }
       
        $scope.signin = function(user) {
            $http({ url: 'http://daqya.herokuapp.com/users/login', method: "POST", data: user})
                    .then(function(response) {
                        // success
                        $localStorage.daqyaUser = response.data.user
                        $location.path('/')
                    },
                    function(response) { // failed
                        console.log(response.data)
                        $scope.error = response.data
                    });
        }
    
    })
    .controller("faqCtrl", function($http, $scope) {


        if($localStorage.daqyaUser) {
            $scope.name = $localStorage.daqyaUser.fname
        }
        $scope.logout = function() {
            $localStorage.daqyaUser = {}
            $scope.name = false
        }
       
    })
    .controller("howitworksCtrl", function($http, $scope) {


        if($localStorage.daqyaUser) {
            $scope.name = $localStorage.daqyaUser.fname
        }
        $scope.logout = function() {
            $localStorage.daqyaUser = {}
            $scope.name = false
        }
       
    })
    .controller("messengerCtrl", function($http, $scope) {


        if($localStorage.daqyaUser) {
            $scope.name = $localStorage.daqyaUser.fname
        }
        $scope.logout = function() {
            $localStorage.daqyaUser = {}
            $scope.name = false
        }
       
    })
    .controller("postCtrl", function($http, $scope, $routeParams,$localStorage) {


        if($localStorage.daqyaUser) {
            $scope.name = $localStorage.daqyaUser.fname
        }
        $scope.logout = function() {
            $localStorage.daqyaUser = {}
            $scope.name = false
        }


        $scope.opt = function() {
            $http({ url: api + '/opt/'+$scope.post.email, method: "GET"}).then(function(response) {
                        // success
                        console.log(response.data)
                    },
                    function(response) { // failed
                        console.log(response.data)
                    });
        }

        $scope.post = {}
        var did = $routeParams.id;
        $http({ url: api + '/posts/'+did, method: "GET"})
                    .then(function(response) {
                        // success
                        $scope.post = response.data
                        console.log($scope.post)
                    },
                    function(response) { // failed
                        console.log(response.data)
                    });
    })
    .controller("searchCtrl", function($http, $scope, $localStorage) {


        if($localStorage.daqyaUser) {
            $scope.name = $localStorage.daqyaUser.fname
        }
        $scope.logout = function() {
            $localStorage.daqyaUser = {}
            $scope.name = false
        }

        $scope.post = {}
        $scope.posts = {}
       $scope.step1 = 1
       $scope.step2 = 0
       $scope.step3 = 0
       // $scope.step4 = 0

       function getPosts() {
             $http({ url: api + '/posts/', method: "GET"})
                    .then(function(response) {
                        var a = response.data
                        var b = []

                        for (var i = 0; i < a.length; i++) {
                          for (var j = 0; j < a[i].length; j++) {
                            b.push(a[i][j])
                          }
                        }

                        $scope.posts = b


                    },
                    function(response) { // failed
                        console.log(response.data)
                        // $scope.error = response.data
                    });

       }
       getPosts()
        $scope.makePost = function(user) {

        

             $http({ url: api + '/users/post/'+$localStorage.userId, method: "POST", data: user})
                    .then(function(response) {
                        // success
                        // $location.path('/signup-complete')
                        $scope.step1 = 0
                        $scope.step2 = 0
                        $scope.step3 = 0
                        $scope.step4 = 1
       getPosts()


                    },
                    function(response) { // failed
                        console.log(response.data)
                        // $scope.error = response.data
                    });
        }



       $scope.step1f = function() {
        $scope.step1 = 1
        $scope.step2 = 0
        $scope.step3 = 0
       }
       $scope.step2f = function() {
        $scope.step1 = 0
        $scope.step2 = 1
        $scope.step3 = 0
       }
       $scope.step3f = function() {
        $scope.step1 = 0
        $scope.step2 = 0
        $scope.step3 = 1
       }

    })
    .controller("taxlawsCtrl", function($http, $scope) {
       
    })
    .controller("profileCtrl", function($http, $scope) {
       
    })
    .controller("adminCtrl", function($scope, $http, $location, $localStorage) {
        $scope.error = false
        $scope.login = function(data) {
             $http({
                    url: api + '/admin/login',
                    method: "POST",
                    data: data
                })
                .then(function(response) {
                    // success
                    console.log(response.data)
                    $localStorage.admin = response.data
                    $location.path('/admin/home')
                }, 
                function(response) {
                    // failed
                    $scope.error = true
                });
        }
    })
    .controller("adminHomeCtrl", function($scope, $http, $location) {

    })
    .controller("adminAdminsCtrl", function($scope, $http, $location) {
        $scope.admins = {}
        
        function getAdmins() {
            $http({ url: api + '/admins/all', method: "GET"})
            .then(function(response) {
                // success
                $scope.admins = response.data
            },
            function(response) { // failed
                console.log(response.data)
            });
        }
        getAdmins()
        $scope.newAdmin = function() { $location.path('/admin/admins/new') }

        $scope.delete = function(id) {
            $http({ url: api + '/admins/delete/'+id, method: "DELETE"})
            .then(function(response) {
                // success
                getAdmins()
            },
            function(response) { // failed
                console.log(response)
            });

        }
    })
    .controller("adminAdminsNewCtrl", function($scope, $http, $location) {
        $scope.success = 0

        $scope.back = function() { $location.path('/admin/admins') }

        $scope.create = function(admin) {
            $http({ url: api + '/admins/create', method: "POST", data: admin})
            .then(function(response) {
                // success
                $scope.success = 1
            },
            function(response) { // failed
                console.log(response.data)
            });
        }
    })
    .controller("adminUsersNewCtrl", function($scope, $http, $location) {
        $scope.success = 0

        $scope.back = function() { $location.path('/admin/users') }

        $scope.create = function(user) {
            // user.type = "user"
            // user.location = "Lahore"
            user.wallet = {}
            user.wallet.amount = 0
            user.wallet.payment_methods = []
            $http({ url: '/users/register', method: "POST", data: user})
            .then(function(response) {
                // success
                $scope.success = 1
            },
            function(response) { // failed
                console.log(response.data)
            });
        }
    })
    .controller("adminUsersCtrl", function($scope, $http, $location) {
       $scope.users = {}
        
        function getUsers() {
            $http({ url: api + '/users/all', method: "GET"})
            .then(function(response) {
                // success
                $scope.users = response.data
            },
            function(response) { // failed
                console.log(response.data)
            });
        }
        getUsers()
        $scope.newUser = function() { $location.path('/admin/users/new') }
        $scope.view = function(id) { $location.path('/admin/user/'+id) }

        $scope.delete = function(id) {
            $http({ url: api + '/users/delete/'+id, method: "DELETE"})
            .then(function(response) {
                // success
                getUsers()
            },
            function(response) { // failed
                console.log(response)
            });

        }

    });



//city dropdown start


//city dropdown end