jQuery.noConflict();

var VendingMachine = {};
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
  
  VendingMachine.Adapter = (function() {
    
    var self = _.extend({}, NotBackbone.jQueryModelAdapter);
    
    self.create = function(model, success, failure) {
      self.update(model, success, failure);
    };
    
    self.read = function(model, success, failure) {
      self.get('/machine', success, failure);
    };
    
    self.update = function(model, success, failure) {
      var balance = model.get('balance');
      var url = '/machine/setBalance/' + balance;
      self.get(url, success, failure);
    };
    
    return self;
    
  })();;
    
  VendingMachine.Model = (function() {
  
    var COIN_VALUES = {
      NICKEL  : 5,
      DIME    : 10,
      QUARTER : 25
    };
    
    var translateBalance = function(balance) {
      if (balance === 0) {return 'INSERT COIN';}
      return (balance / 100).toFixed(2);
    };
    
    var computeNewBalance = function(model, coin) {
      return model.get('balance') + COIN_VALUES[coin];
    };
    
    var model = Backbone.Model.extend({
      
      adapter : VendingMachine.Adapter,
      
      initialize : function() {
        this.fetch();
      },
      
      display : function() {
        return translateBalance(this.get('balance'));
      },
  
      insertCoin : function(coin) {
        this.set({ balance : computeNewBalance(this, coin) });
        this.save();
      }
  
    });
    
    return model;
  
  })();
  
  VendingMachine.View = Backbone.View.extend ({
      
    el: '#machine',
    
    events: {
      'click #insertCoin' : 'insertCoin' 
    },
    
    initialize: function () {
      var template = NotBackbone.loadTemplate('templates/machine-template.html');
      var instantiated = _.template(template, {brand: "AwesomeCo Vending"});
      this.$el.html(instantiated);
      this.render();
      this.listenTo(this.model, 'change', this.render);
    },
    
    insertCoin: function () {
      var coin = $('#coin').val ();
      this.model.insertCoin (coin);
    },
    
    render: function () {
      this.$('#display').text (this.model.display ());
    }
    
  });
      
})(jQuery);

var model = new VendingMachine.Model();
var view = new VendingMachine.View({ model : model });
