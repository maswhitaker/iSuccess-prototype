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

Parse.initialize("CGiH8mU7FWqmYhm2HXL1KZ2yusLAYc6uLGLxWKOE", "pFMs3sr9uuLC8ITdi6mK2unnU4xVARJ97grozseD");

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

Parse.initialize("CGiH8mU7FWqmYhm2HXL1KZ2yusLAYc6uLGLxWKOE", "pFMs3sr9uuLC8ITdi6mK2unnU4xVARJ97grozseD");

var HomepageView = Parse.View.extend({
    el: ".container",
    events: {
      "click .log-out": "logOut"
    },

    initialize: function() {
      this.render();
      var query = new Parse.Query(Parse.User);
      query.equalTo("objectId", Parse.User._currentUser.id);
      query.find({
        success: function(results){
          console.log(results[0].attributes.username)
          $("#account").append("<h1>" + results[0].attributes.username + "</h1>");
        },
        error: function(object, error){
          console.log('damn')
        }
      });
    },

    render: function(){
      this.$el.html(_.template($("#home").html()));
    },

    logOut: function(e) {
      Parse.User.logOut();
      new LogInView();
    }
  });

Parse.initialize("CGiH8mU7FWqmYhm2HXL1KZ2yusLAYc6uLGLxWKOE", "pFMs3sr9uuLC8ITdi6mK2unnU4xVARJ97grozseD");

var InfoView = Parse.View.extend({

  template: _.template($("#info-template").html()),

  initialize: function(){
    $(".container").html(this.el);
    this.render();
  },

  render: function(){
    this.$el.html(this.template(this.model));
  }
});

Parse.initialize("CGiH8mU7FWqmYhm2HXL1KZ2yusLAYc6uLGLxWKOE", "pFMs3sr9uuLC8ITdi6mK2unnU4xVARJ97grozseD");

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
      var task2 = new Task();
      task2.set("name", $("#extra-name").val());
      task2.set("estimatedTime", $("#extra-estimatedTime").val());
      task2.set("description", $("#extra-description").val());
      task2.set("user", Parse.User.current());
      task2.set("parent", goal);
      task2.save();
   } else {
     alert('please enter content for the goal name');
   }
  }
});

Parse.initialize("CGiH8mU7FWqmYhm2HXL1KZ2yusLAYc6uLGLxWKOE", "pFMs3sr9uuLC8ITdi6mK2unnU4xVARJ97grozseD");

var LogInView = Parse.View.extend({
    events: {
      "submit form.login-form": "logIn",
      "submit form.signup-form": "signUp"
    },

    el: ".container",

    initialize: function() {
      _.bindAll(this, "logIn", "signUp");
      this.render();
      // setTimeout(function(){
      //   $("#non-logo").css("display", "initial");
      //   $("#logo").css("display", "none");
      //   $("#loginSignup").css("display", "none");
      // }, 4000);
      // setTimeout(function(){
      //   $("#infoDiv").css("display", "none");
      //   $("#loginSignup").css("display", "initial");
      // }, 11000);
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

Parse.initialize("CGiH8mU7FWqmYhm2HXL1KZ2yusLAYc6uLGLxWKOE", "pFMs3sr9uuLC8ITdi6mK2unnU4xVARJ97grozseD");

var AppRouter = Parse.Router.extend({
  routes: {
    "":"homePage",
    "goallist": "goalList",
    "input": "inputList",
    "goallist/:id": "singleGoal",
    "goallist/:id/:task": "checkDone",
    "developerInfo": "info"
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
  },

  checkDone: function(id, task){
    if (Parse.User.current()){
      var query = new Parse.Query(Goal);
      query.include("user");
      query.equalTo('user', Parse.User.current());
      query.equalTo("objectId", id);
      query.find({
        success: function(result){
          var completed = null;
          var newQory = new Parse.Query(Goal);
          newQory.equalTo("objectId", id);
          var qory = new Parse.Query(Task);
          qory.equalTo("user", Parse.User.current());
          qory.matchesQuery("parent", newQory);
          qory.equalTo("objectId", task);
          qory.find({
            success: function(stuff){
               completed = stuff[0].attributes.estimatedTime;
            }
          }).done(function(){
            var item = result[0];
            item.set("completed", completed);
            new SingleGoalView({
              model: item
            });
          });
        }
      });
    } else {
      new LogInView();
    }
  },

  info: function(){
    if(Parse.User.current()){
      new InfoView();
    } else {
      new LogInView();
    }
  }

});

var approuter = new AppRouter();

Parse.history.start();

Parse.initialize("CGiH8mU7FWqmYhm2HXL1KZ2yusLAYc6uLGLxWKOE", "pFMs3sr9uuLC8ITdi6mK2unnU4xVARJ97grozseD");

var SingleGoalView = Parse.View.extend({

  events:{
    "click #image": "remove"
  },

  remove: function(){
    var newQuery = new Parse.Query(Goal);
    newQuery.equalTo("objectId", this.model.id);
    var query = new Parse.Query(Task);
    query.equalTo("user", Parse.User.current());
    query.matchesQuery("parent", newQuery);
    query.find({
      success: function(result){
          $("#"+ result[0].id +"").css("display", "none");
      }
    })
    $("")
  },

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
      }
    });
    var query = new Parse.Query(Task);
    query.equalTo("user", Parse.User.current());
    query.matchesQuery("parent", newQuery);
    query.find({
      success: function(results){
        for(i=0;i<results.length;i++){
          console.log(results[i].id);
          $("#tasks").append("<ul id='" + results[i].id + "'><li><h4>" + results[i].attributes.name + "</h4><li><h4>" + results[i].attributes.description + "</h4></li><li><h4>" + results[i].attributes.estimatedTime + "</h4></li><li><a href='#/goallist/" + results[i].attributes.parent.id + "/" + results[i].id +"'><img id='image' src='images/done-mark.png'></a></li></ul>");
        }
      },
      error: function(object, error){
        console.log(error);
      }
    }).done(function(){
      var newQoory = new Parse.Query(Goal);
      newQoory.equalTo("objectId", that.model.id);
      newQoory.find({
        success: function(result){
        }
      });
      var qoory = new Parse.Query(Task);
      qoory.equalTo("user", Parse.User.current());
      qoory.matchesQuery("parent", newQoory);
      qoory.find({
        success: function(results){
          var time = [];
           for(i=0;i<results.length;i++){
             time.push(Number(results[i].attributes.estimatedTime));
           }
           var sum = _.reduce(time, function(memo, num){
             return memo + num;
           });
           that.model.set("goalTime", sum);
        },
        error: function(object, error){
          console.log(error);
        }
      });
      that.model.save();
    });
    var that = this;

  }
});
