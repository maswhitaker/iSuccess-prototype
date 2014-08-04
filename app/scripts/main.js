Parse.initialize("CGiH8mU7FWqmYhm2HXL1KZ2yusLAYc6uLGLxWKOE", "pFMs3sr9uuLC8ITdi6mK2unnU4xVARJ97grozseD");

var Task = Parse.Object.extend("Task", {
  defaults: {
    name: '',
    estimatedTime: 0,
    description: ''
  }
});

var Tasks = Parse.Collection.extend("Tasks", {
  model: Task
});

var Goal = Parse.Object.extend("Goal");

var Goals = Parse.Collection.extend("Goals", {
  model: Goal
});


  var HomepageView = Parse.View.extend({
    el: ".container",
    events: {
      "click .log-out": "logOut",
      "click #add-task": 'addTask',
      "click #extra-task-button": "newTask",
      "click #show-add": "showAdd"
    },

    initialize: function() {
      this.$el.html(_.template($("#home").html()));
    },

    logOut: function(e) {
      Parse.User.logOut();
      new LogInView();
    },

    addTask: function(e){
      var goal = new Goal();
      goal.set("name", $("#goal-name").val());
      goal.set("description", $("#goal-description").val());
      goal.set("user", Parse.User.current());
      goal.save().done(function(){
        console.log("new task")
        var task = new Task();
        task.set("name", $("#name").val());
        task.set("estimatedTime", $("#estimatedTime").val());
        task.set("description", $("#description").val());
        task.set("user", Parse.User.current());
        task.set("parent", goal);
        task.save().done(function(){
          var extraName = $('#extra-name').val();
          var extraTime = $("#extra-estimatedTime").val();
          var extraDescription = $("#extra-description").val();
          if(extraName != ''){
            var task = new Task();
            task.set("name", extraName);
            task.set("estimatedTime", extraTime);
            task.set("description", extraDescription);
            task.set("user", Parse.User.current());
            task.set("parent", goal);
            task.save().done(function(){
              console.log('extra task saved');
            })
          }
        })
      });
    },
    newTask: function(){
      $("#extra-task").show();
    },

    showAdd: function(){
      $("#adding").show();
    }
  });



  var GoalView = Parse.View.extend({
    template: _.template($("#goal-template").html()),
    initialize: function(){
      $(".container").html(this.el);
      this.render();
    },
    render: function(){
      this.$el.html(this.template(this.model.attributes))
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



  var AppRouter = Parse.Router.extend({
    initialize: function(){
    //  this.fetch = collection.fetch();
    },
    routes: {
      "":"homePage",
      "goallist": "goalList",
      "goallist/:id": "goal",
      "goallist/:id/input": ""
    },
    homePage: function(){
      if (Parse.User.current()) {
        new HomepageView();
      } else {
        new LogInView();
      }
    },
    goalList: function(){
      if (Parse.User.current()){
        this.fetch.done(function(){
          $('.container').html('')
            collection.each(function(item){
              new GoalView({model: item})
            });
          });
      } else {
        new LogInView();
      }
    }
  });
  var approuter = new AppRouter();

Parse.history.start();
