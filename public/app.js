ons.bootstrap()

  // controlls sign in page
  .controller('signInController', function($scope, $http, Auth, $window) {
    console.log('signIn controller initialized');

    var app = this;

    this.init = function(e) {
      // Ensure the emitter is the current page, not a nested one
      if (e.target === e.currentTarget) {
        console.log("in init...");
        var page = e.target;
        //check if logged in 
        if(!$window.localStorage.getItem('loggedIn')) {
          $window.localStorage.setItem('loggedIn', 'false');
          $window.localStorage.setItem('userName','none');
        }
        if($window.localStorage.getItem('loggedIn') == "true") {
          var userName = $window.localStorage.getItem('userName');
          console.log("logged in as: " + userName);
          var nav = document.getElementById('nav');
          nav.resetToPage('contacts.html');      
        }  
        else {
          console.log("not logged in");
        } 
      }
    };

    this.doLogin = function(loginData) {
      app.loading = true;
      app.errorMsg = false;
      console.log('form submitted');
      console.log(app.loginData);      

      Auth.login(app.loginData).then(function(data) {
        if(data.data.success) {
          console.log("successful login");
          $window.localStorage.setItem('loggedIn', 'true');
          console.log("logging in as: " + data.data.username);
          $window.localStorage.setItem('userName', data.data.username);          
          var nav = document.getElementById('nav');
          nav.pushPage('contacts.html');          
        }
        else {
          // Create Error Message
          console.log("unseccessful login");
          console.log("error: " + data.data.message);
          ons.notification.alert(data.data.message);
        }
      });
    };
  })


  // controlls registration page
  .controller('regController', function($http, User, $window) {
    console.log('regController initialized');

    var app = this;


    this.regUser = function(regData) {
      app.loading = true;
      app.errorMsg = false;
      console.log('form submitted');
      console.log(app.regData);

      User.create(app.regData).then(function(data) {
        console.log("creating post request...");
        console.log("successful? " + data.data.success);
        console.log("message: " + data.data.msg);
        if (data.data.success) {
          console.log("form input succeeded")
          $window.localStorage.setItem('loggedIn', 'true');
          console.log("logging in as: " + app.regData.username);
          $window.localStorage.setItem('userName', app.regData.username);             
          
          var nav = document.getElementById('nav');
          nav.pushPage('contacts.html');
        }

        else {
          // Create an error message
          console.log("error: " + data.data.msg); 
          ons.notification.alert(data.data.msg);          
        }
      });
    };
  })


  //controlls add Contact page
  .controller('addController', function($http, $timeout, Contact, $window) {
    console.log('addController initialized');

    var app = this;

    this.addContact = function(contactData) {
      var currentUser = $window.localStorage.getItem('userName');  
      app.contactData.username = currentUser;    
      app.loading = true;
      app.errorMsg = false;
      console.log('form submitted');
      console.log(app.contactData);

      Contact.create(app.contactData).then(function(data) {
        console.log("creating post request...");
        if (data.data.success) {
          console.log("form input succeeded");
          
          var mod = document.getElementById("modal");
          $('#modalMsg').text("contact added successfully");
          modal.show();
        }

        else {
          // Create an error message
          console.log("error: " + data.data.msg); 
          var mod = document.getElementById("modal");
          $('#modalMsg').text("Contact failed to add");
          modal.show();       
        }          
      });
    };
    this.init = function(e) {
      // Ensure the emitter is the current page, not a nested one
      if (e.target === e.currentTarget) {
        console.log("in addControl init...");
          var currentUser = $window.localStorage.getItem('userName');
      }  
    };   
    this.hideModal = function() {
      var nav = document.getElementById('nav');
      console.log("popping and refreshing");
      nav.popPage();
      $timeout(function() {
        nav.resetToPage('contacts.html');
      }, 500);      
    }; 
  })


  //Controls contact page
  .controller('contactController', function($scope, $http, $window) {
    console.log("contact controller init");
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
    console.log("in user service");
    var userFactory = {};

    userFactory.create = function(regData) {
      console.log("creating user...");
      return $http.post('/api/user', regData);
    }

    return userFactory;

  })  


  //Auth service
  .factory('Auth', function($http) {
    console.log("in auth services")
    var authFactory = {};

    // User.create(regData)
    authFactory.login = function(loginData) {
      return $http.post('/api/authenticate', loginData)
    }

    return authFactory;
  })

  //Contact service
  .factory('Contact', function($http) {
    console.log("in contact services");
    var contactFactory = {};

    contactFactory.create = function(contactData) {
      return $http.post('/api/contact', contactData);
    }

    return contactFactory;
  }) 