Parse.initialize("CGiH8mU7FWqmYhm2HXL1KZ2yusLAYc6uLGLxWKOE", "pFMs3sr9uuLC8ITdi6mK2unnU4xVARJ97grozseD");

var Task = Parse.Object.extend("Task", {
  defaults: {
    name: '',
    estimatedTime: 0,
    description: '',
    done: false
  },
  toggle: function(){
    this.save({done: !this.get("done")});
  }
});

var Tasks = Parse.Collection.extend("Tasks", {
  model: Task
});

var Goal = Parse.Object.extend("Goal", {
  name: '',
  description: '',
  totalTime: 0
});

var Goals = Parse.Collection.extend("Goals", {
  model: Goal
});

var InputView = Parse.View.extend({
  events: {
    "click #add-task": "addTask"
  },

  template: _.template($("#input-template").html()),

  initialize: function(){
    $(".container").html(this.el);
    this.render();
  },

  render: function(){
    this.$el.html(this.template(this.model));
  },

  addTask: function(e){
    if ($("#goal-name").val() !== ''){
      var goal = new Goal();
      goal.set("name", $("#goal-name").val());
      goal.set("description", $("#goal-description").val());
      goal.set("user", Parse.User.current());
      var task = new Task();
      task.set("name", $("#name").val());
      task.set("estimatedTime", $("#estimatedTime").val());
      task.set("description", $("#description").val());
      task.set("user", Parse.User.current());
      task.set("parent", goal);
      task.save();
   } else {
     alert('please enter content for the goal name');
   }
  }
});



var HomepageView = Parse.View.extend({
    el: ".container",
    events: {
      "click .log-out": "logOut"
    },

    initialize: function() {
      this.render();
    },

    render: function(){
      this.$el.html(_.template($("#home").html()));
    },


    logOut: function(e) {
      Parse.User.logOut();
      new LogInView();
    }
  });


  var GoalView = Parse.View.extend({
    events: {
      "click #toggle": "toggleDone",
      "click destroy": "clear",
      "click .showTasks": "showTasks"
    },

    template: _.template($("#goal-template").html()),

    initialize: function(){
      $(".container").html(this.el);
      this.render();
    },

    render: function(){
      this.$el.html(this.template(this.model));
      var query = new Parse.Query(Goal);
      query.include("user");
      query.equalTo("user", Parse.User.current());
      query.find({
        success: function(goals) {
          for(i=0; i < goals.length; i++){
            $("#goalnames").append("<li>Goal name: " + goals[i].attributes.name + "</br> Time Required: " + goals[i].attributes.totalTime + "</br> Goal Description: " + goals[i].attributes.description + "</li> <div class='progress-bar'> <span class='meter' style='width: 60%'></span> </div> <button class='showTasks'>Show Goal's Tasks</button> </br>  <div class='" + goals[i].id + "'></div> </br>");
          }
        },
        error: function(object, error) {
          console.error(error);
        }
      });
    },

    toggleDone: function(){
      this.model.toggle();
    },

    clear: function(){
      this.model.destroy();
    },

    showTasks: function(){
      var query = new Parse.Query(Task);
      query.include('user');
      query.equalTo("user", Parse.User.current());
      query.find({
        success: function(tasks){
          for(i=0; i < tasks.length; i++){
            $("." + tasks[i].attributes.parent.id).append("<li> Task name: " + tasks[i].attributes.name + "</br> Task Time: " + tasks[i].attributes.estimatedTime + "</br> Done?: </li>");
          }
        }
      });
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
      setTimeout(function(){
        $("#non-logo").css("display", "initial");
        $("#logo").css("display", "none");
      }, 4000);
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
    routes: {
      "":"homePage",
      "goallist": "goalList",
      "input": "inputList"
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
        new GoalView();
      } else {
        new LogInView();
      }
    },

    inputList: function(){
      if (Parse.User.current()){
        new InputView();
      } else {
        new LogInView();
      }
    }
  });
  var approuter = new AppRouter();

Parse.history.start();
