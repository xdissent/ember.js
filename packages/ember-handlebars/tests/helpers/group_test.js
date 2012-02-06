var view;

module("Ember.Handlebars - group helper", {
  setup: function() {},

  teardown: function() {
    view.destroy();
  }
});

function createView(template, options) {
  options = options || {};
  options.template = Ember.Handlebars.compile(template);
  view = Ember.View.create(options);
}

function appendView() {
  Ember.run(function() { view.appendTo('#qunit-fixture'); });
}

function stripAndTrim(str) {
  return str.replace(/\s+/g, ' ').trim();
}

test("should properly modify behavior inside the block", function() {
  createView("{{#group}}{{ohai}} {{there}}{{/group}}", {ohai: 'ohai', there: 'there'});
  appendView();
  equals(view.$('script').length, 2, "Only one set of Metamorph markers");
  equals(view.$().text(), 'ohai there', "Values are output correctly");
});

test("should rerender the group upon a property change", function() {
  createView("{{#group}}{{msg}}{{/group}}", {msg: 'ohai'});
  appendView();
  equals(view.$().text(), 'ohai', 'Original value was rendered');

  Ember.run(function() {
    view.set('msg', 'ohbai');
  });
  equals(view.$().text(), 'ohbai', 'Updated value was rendered');
});

test("an #each can be nested", function() {
  createView(
    "{{#group}}{{#each numbers}}{{this}}{{/each}}{{/group}}",
    {numbers: [1, 2, 3, 4, 5]}
  );
  appendView();
  equals(view.$('script').length, 2, "Only one set of Metamorph markers");
  equals(view.$().text(), '12345');
});

test("a #view can be nested", function() {
  createView(
    '{{#group}}' +
    '  {{#view Ember.View ohaiBinding="ohai"}}' +
    '    {{ohai}}' +
    '  {{/view}}' +
    '{{/group}}',
    {ohai: 'ohai'}
  );
  appendView();
  equals(view.$().text().trim(), 'ohai');
  equals(view.$('script').length, 2, "Only one set of Metamorph markers");
});

test("property changes inside views should only rerender their view", function() {
  var rerenderWasCalled = false;
  Ember.Handlebars.GroupView.reopen({
    rerender: function() { rerenderWasCalled = true; this._super(); }
  });
  createView(
    '{{#group}}' +
    '  {{#view Ember.View ohaiBinding="ohai"}}' +
    '    {{msg}}' +
    '  {{/view}}' +
    '{{/group}}',
    {msg: 'ohai'}
  );
  appendView();
  equals(view.$('script').length, 2, "Only one set of Metamorph markers");
  equals(view.$().text().trim(), 'ohai', 'Original value was rendered');

  Ember.run(function() {
    view.set('msg', 'ohbai');
  });
  ok(!rerenderWasCalled, "The GroupView rerender method was not called");
  equals(view.$().text().trim(), 'ohbai', "The updated value was rendered");
});
