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
