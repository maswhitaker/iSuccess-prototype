Parse.initialize("CGiH8mU7FWqmYhm2HXL1KZ2yusLAYc6uLGLxWKOE", "pFMs3sr9uuLC8ITdi6mK2unnU4xVARJ97grozseD");


$(function() {
  var HomepageView = Parse.View.extend({
    el: ".container",
    events: {
      "click .log-out": "logOut",
      "click .static-list": "toGoal"
    },

    initialize: function() {
      this.$el.html(_.template($("#home").html()));
    },

    logOut: function(e) {
      Parse.User.logOut();
      new LogInView();
    },

    toGoal: function(){
      console.log('hello');
      new GoalView();
    }
  });



  var GoalView = Parse.View.extend({
    el: ".container",
    initalize: function(){
      this.render();
    },
    render: function(){
      this.$el.html(_.template($("#goal-template").html()));
    }
  });

var LogInView = Parse.View.extend({
    events: {
      "submit form.login-form": "logIn",
      "submit form.signup-form": "signUp"
    },

    el: ".container",

    initialize: function() {
      _.bindAll(this, "logIn", "signUp");
      this.render();
    },

    logIn: function(e) {
      var self = this;
      var username = this.$("#login-username").val();
      var password = this.$("#login-password").val();

      Parse.User.logIn(username, password, {
        success: function(user) {
          new HomepageView();
          delete self;
        },

        error: function(user, error) {
          self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
        }
      });

      return false;
    },

    signUp: function(e) {
      var self = this;
      var username = this.$("#signup-username").val();
      var password = this.$("#signup-password").val();

      Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
        success: function(user) {
          new HomepageView();
          delete self;
        },

        error: function(user, error) {
          self.$(".signup-form .error").html(error.message).show();
        }
      });

      return false;
    },

    render: function() {
      this.$el.html(_.template($("#login-template").html()));
    }
  });

  var AppView = Parse.View.extend({

    initialize: function() {
      this.render();
    },

    render: function() {
      if (Parse.User.current()) {
        new HomepageView();
      } else {
        new LogInView();
      }
    }
  });

  new AppView;
});
