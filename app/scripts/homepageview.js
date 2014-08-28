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
