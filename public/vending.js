var VendingMachine = {};

(function($) {

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
      self.get(url, function() { success(); }, failure);
    };
    
    return self;
    
  })();
    
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
    
    events : {
      'click #insertCoin' : 'insertCoin'
    },
    
    initialize : function() {
      var template = NotBackbone.loadTemplate('templates/machine-template.html');
      var instantiated = _.template( template, { brand: "AwesomeCo Vending"} );
      this.$el.html(instantiated);
      this.render();
      this.listenTo(this.model, 'change', this.render);
    },
    
    insertCoin : function() {
      var coin = this.$('#coin').val();
      this.model.insertCoin(coin);
    },
    
    render : function() {
      this.$('#display').text(this.model.display());
    }
    
  });
      
})(jQuery);

var model = new VendingMachine.Model();
var view = new VendingMachine.View({ model : model });
