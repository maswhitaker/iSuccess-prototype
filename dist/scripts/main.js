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


var SingleGoalView = Parse.View.extend({
  template: _.template($("#single-goal-template").html()),

  initialize: function(){
    $(".container").html(this.el);
    this.render();
  },

  render: function(){
    this.$el.html(this.template(this.model));
    var newQuery = new Parse.Query(Goal);
    newQuery.equalTo("objectId", this.model.id);
    newQuery.find({
      success: function(result){
        console.log(result);
      }
    });
    var query = new Parse.Query(Task);
    query.equalTo("user", Parse.User.current());
    query.matchesQuery("parent", newQuery);
    query.find({
      success: function(results){
        for(i=0;i<results.length;i++){
          console.log("#" + results[i].attributes.parent.id + "");
          $("#tasks").append("<ul><li><h4>" + results[i].attributes.name + "</h4><li><h4>" + results[i].attributes.description + "</h4></li><li><h4>" + results[i].attributes.estimatedTime + "</h4></li></ul>");
        }
      },
      error: function(object, error){
        console.log(error);
      }
    });
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
      "click destroy": "clear"
    },

    template: _.template($("#goal-template").html()),

    initialize: function(){
      $(".container").html(this.el);
      this.render();
    },

    render: function(){
      this.$el.html(this.template(this.model));
    },

    toggleDone: function(){
      this.model.toggle();
    },

    clear: function(){
      this.model.destroy();
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
      "input": "inputList",
      "goallist/:id": "singleGoal"
    },

    initialize: function(){
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
        var query = new Parse.Query(Goal);
        query.include("user");
        query.equalTo("user", Parse.User.current());
        query.find({
          success: function(goals){
            new GoalView({
              model: goals
            });
          }
        });
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
    },

    singleGoal: function(id){
      if (Parse.User.current()){
        var query = new Parse.Query(Goal);
        query.include("user");
        query.equalTo('user', Parse.User.current());
        query.equalTo("objectId", id);
        query.find({
          success: function(result){
            var item = result[0];
            new SingleGoalView({
              model: item
            });
          }
        });
      } else {
        new LogInView();
      }
    }
  });
  var approuter = new AppRouter();

Parse.history.start();
