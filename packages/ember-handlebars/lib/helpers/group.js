require('ember-handlebars/ext');

var get = Ember.get, set = Ember.set;

var EmberHandlebars = Ember.Handlebars;
var GroupHelper = EmberHandlebars.GroupHelper = {};

EmberHandlebars.GroupView = Ember.View.extend(Ember.Metamorph);

GroupHelper.helper = function(thisContext, options) {
  var data = options.data,
      fn   = options.fn,
      view = data.view;

  var groupView = EmberHandlebars.GroupView.create({
    preserveContext: true,
    template: fn,
    init: function() {
      set(this, 'templateData', {groupView: this});
      this._super();
    }
  });

  view.appendChild(groupView);
};

EmberHandlebars.registerHelper('group', function(options) {
  EmberHandlebars.GroupHelper.helper(this, options);
});
