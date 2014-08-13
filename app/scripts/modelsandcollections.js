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
