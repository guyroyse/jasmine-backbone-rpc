jQuery.noConflict();

var NotBackbone = {};

(function($) {

  NotBackbone.loadTemplate = function(template) {
    
    var result = '';
    
    var success = function (data, status) {
      result = data;
    };
      
    var failure = function(xhr, textStatus, errorThrown) {
      console.log('Problem loading template ' + template + ': ' + errorThrown);
    };
    
    $.ajax ({ url: template, async: false }).done(success).fail(failure);
    
    return result;
    
  };
  
  NotBackbone.ModelAdapter = (function() {
    
    var unimplemented = function(method) {
      return function() {
        console.log("Unimplemented method on ModelAdapter: " + method);        
      };
    };
    
    var self = {};
  
    self.create = unimplemented('create');    
    self.read = unimplemented('read');
    self.update = unimplemented('update');
    self.delete = unimplemented('delete');
    self.patch = unimplemented('patch');
      
    return self;
      
  })();

  NotBackbone.jQueryModelAdapter = (function() {

    var self = _.extend({}, NotBackbone.ModelAdapter);

    self.get = function(url, success, failure) {
      $.get(url).done(success).fail(failure);
    };

    return self;

  })();
        
  NotBackbone.originalSync = Backbone.sync;
  
  Backbone.sync = function(method, model, options) {
    
    var adapter = model.adapter;
    
    if (adapter === undefined) 
      return NotBackbone.originalSync(method, model, options);
    
    options || ( options = {} );
      
    var success = function(result) {
      if (options.success) options.success(result);
    };

    var error = function(result) {
      if (options.error) options.error(result);
    };
    
    return adapter[method](model, success, error);
      
  };
  
})(jQuery);
