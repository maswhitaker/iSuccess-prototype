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
