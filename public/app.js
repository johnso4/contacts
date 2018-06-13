ons.bootstrap()

  // controlls sign in page
  .controller('signInController', function($scope, $http, Auth, $window) {

    var app = this;

    this.init = function(e) {
      // Ensure the emitter is the current page, not a nested one
      if (e.target === e.currentTarget) {
        var page = e.target;
        //check if logged in 
        if(!$window.localStorage.getItem('loggedIn')) {
          $window.localStorage.setItem('loggedIn', 'false');
          $window.localStorage.setItem('userName','none');
        }
        // if logged in, retrieve the username of user and go to contacts page
        if($window.localStorage.getItem('loggedIn') == "true") {
          var userName = $window.localStorage.getItem('userName');
          var nav = document.getElementById('nav');
          nav.resetToPage('contacts.html');      
        }  
        else {
          // no user logged in currently
        } 
      }
    };


    this.doLogin = function(loginData) {
      // show login modal
      var loadMod = document.getElementById('loadModal');
      loadModal.show();

      // if successful login, close modal and go to the contacts page
      // if not successful, show the appropriate error message
      Auth.login(app.loginData).then(function(data) {
        if(data.data.success) {
          setTimeout(function() {
            loadModal.hide(); 
            $window.localStorage.setItem('loggedIn', 'true');
            $window.localStorage.setItem('userName', data.data.username);          
            var nav = document.getElementById('nav');
            nav.pushPage('contacts.html');               

          }, 1200);       
        }
        else {
          setTimeout(function() {
            loadModal.hide(); 
            ons.notification.alert(data.data.message);
          }, 1200);
        }
      });
    };
  })


  // controlls registration page
  .controller('regController', function($http, User, $window) {

    var app = this;

    this.regUser = function(regData) {
      // if successfully registered, log in and go to the contacts page
      // otherwise show the appropriate error message
      User.create(app.regData).then(function(data) {
        if (data.data.success) {
          $window.localStorage.setItem('loggedIn', 'true');
          $window.localStorage.setItem('userName', app.regData.username);             
          
          var nav = document.getElementById('nav');
          nav.pushPage('contacts.html');
        }

        else {
          // Create an error message
          ons.notification.alert(data.data.msg);          
        }
      });
    };
  })


  //controlls add Contact page
  .controller('addController', function($http, $timeout, Contact, $window) {

    var app = this;

    this.addContact = function(contactData) {
      var currentUser = $window.localStorage.getItem('userName');  
      app.contactData.username = currentUser;    
      app.loading = true;
      app.errorMsg = false;

      // attempt to create a contact and add it to the datase
      // if successfull let the user know.
      // if unsuccessfull, display the appropriate error message
      Contact.create(app.contactData).then(function(data) {
        if (data.data.success) {
          
          var mod = document.getElementById("modal");
          $('#modalMsg').text("contact added successfully");
          modal.show();
        }

        else {
          // Create an error message
          var mod = document.getElementById("modal");
          $('#modalMsg').text("Contact failed to add");
          modal.show();       
        }          
      });
    };
    this.init = function(e) {
      // Ensure the emitter is the current page, not a nested one
      // if the emitter is the current page, retrieve the username of 
      // logged in user
      if (e.target === e.currentTarget) {
          var currentUser = $window.localStorage.getItem('userName');
      }  
    };   
    this.hideModal = function() {
      var nav = document.getElementById('nav');
      nav.popPage();
      $timeout(function() {
        nav.resetToPage('contacts.html');
      }, 500);      
    }; 
  })


  //Controls contact page
  .controller('contactController', function($scope, $http, $window) {
    $http.get('/api/contacts').success(function(response) {
      $scope.contactlist = response;
    });

    this.logout = function() {
      $window.localStorage.setItem('loggedIn', 'false');
      $window.localStorage.setItem('userName','none');      
      var nav = document.getElementById('nav');
      nav.resetToPage('signIn.html');  
    }

    this.clickAdd = function() {
      var nav = document.getElementById('nav');
      nav.pushPage('addContact.html');
    };

    this.display = function(contact) {
      if(contact.username == $window.localStorage.getItem('userName') ) {
        return true;
      }
      else {
        return false;
      }
    };

  })

  //User service
  .factory('User', function($http) {
    var userFactory = {};

    userFactory.create = function(regData) {
      return $http.post('/api/user', regData);
    }

    return userFactory;

  })  


  //Auth service
  .factory('Auth', function($http) {
    var authFactory = {};

    // User.create(regData)
    authFactory.login = function(loginData) {
      return $http.post('/api/authenticate', loginData)
    }

    return authFactory;
  })

  //Contact service
  .factory('Contact', function($http) {
    var contactFactory = {};

    contactFactory.create = function(contactData) {
      return $http.post('/api/contact', contactData);
    }

    return contactFactory;
  }) 