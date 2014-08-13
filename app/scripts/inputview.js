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
