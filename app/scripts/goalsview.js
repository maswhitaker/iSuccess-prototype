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
