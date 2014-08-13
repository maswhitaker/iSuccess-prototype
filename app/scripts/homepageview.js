Parse.initialize("CGiH8mU7FWqmYhm2HXL1KZ2yusLAYc6uLGLxWKOE", "pFMs3sr9uuLC8ITdi6mK2unnU4xVARJ97grozseD");

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
