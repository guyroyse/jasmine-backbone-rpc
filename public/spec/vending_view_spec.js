describe("Vending Machine View", function() {
  
  var subject, model, displayContents;

  beforeEach(function() {
    createViewRoot('machine');
    model = new VendingMachine.Model();
    spyOn(model, 'display').andCallFake(function() {
      return displayContents;
    });
    displayContents = 'INIT';
    subject = new VendingMachine.View({ model : model });
  });
  
  when ("created", function() {
    
    it('updates the display', function() {
      expect(jQuery('#display').text()).toEqual('INIT');      
    });
    
  });
  
  when ('the model is changed', function () {
    
    beforeEach (function () {
      displayContents = 'CHANGED';
      model.trigger('change');
    });

    it('updates the display', function() {
      expect(jQuery('#display').text()).toEqual('CHANGED');
    });
    
  });
  
  when ('a coin is chosen', function () {
    
    beforeEach (function () {
      jQuery('#coin').val ('GLARMPH');
    });
    
    and ('it is inserted', function (){
      
      beforeEach (function () {
        spyOn(model, 'insertCoin').andCallFake(empty);
        jQuery('#insertCoin').click();
      });
      
      it ('inserts the coin into the model', function () {
        expect(model.insertCoin).toHaveBeenCalledWith('GLARMPH');
      });
      
    });
  });
  
  afterEach(function() {
    removeViewRoot('machine');
  });

});
