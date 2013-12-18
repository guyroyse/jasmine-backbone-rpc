describe("Vending Machine", function() {

  describe("Model", function() {

    var subject;

    beforeEach(function() {
      spyOn(VendingMachine.Model.prototype, 'save').andCallFake(function() {}); 
      spyOn(VendingMachine.Model.prototype, 'fetch').andCallFake(function() {
        this.set({ balance : 0 });
      });
      subject = new VendingMachine.Model();
    });
    
    when("created with a balance of 0", function() {

      it('fetches its state', function() {
        expect(VendingMachine.Model.prototype.fetch).toHaveBeenCalled();
      });
      
      it("displays 'INSERT COIN'", function() {
        expect(subject.display()).toBe('INSERT COIN');
      });
      
      it("has a balance of 0", function() {
        expect(subject.get('balance')).toBe(0);
      });
        
    });

    when('a coin is inserted', function() {
      
      beforeEach(function() {
        subject.insertCoin('NICKEL');
      });

      it('saves the state', function() {
        expect(VendingMachine.Model.prototype.save).toHaveBeenCalled();
      });

    });
    
    when('a NICKEL is inserted', function() {

      beforeEach(function() {
        subject.insertCoin('NICKEL');
      });
    
      it("displays '0.05'", function() {
        expect(subject.display()).toBe('0.05');
      });
    
      it("has a balance of 5", function() {
        expect(subject.get('balance')).toBe(5);
      });

      and('a DIME is inserted', function() {
  
        beforeEach(function() {
          subject.insertCoin('DIME');
        });
      
        it("displays '0.15'", function() {
          expect(subject.display()).toBe('0.15');
        });
      
        it("has a balance of 15", function() {
          expect(subject.get('balance')).toBe(15);
        });
  
        and('a QUARTER is inserted', function() {
  
          beforeEach(function() {
            subject.insertCoin('QUARTER');
          });
        
          it("displays '0.40'", function() {
            expect(subject.display()).toBe('0.40');
          });
        
          it("has a balance of 40", function() {
            expect(subject.get('balance')).toBe(40);
          });
          
        });
        
      });
      
    });

  });
  
  describe("View", function() {

    var subject, model, displayContents;

    beforeEach(function() {
      createViewRoot('machine');
      model = new VendingMachine.Model();
      displayContents = 'INIT';
      model.display = function() {
        return displayContents;
      };
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
          spyOn(model, 'insertCoin');
          jQuery('#insertCoin').click();
        });
        
        it ('calls model.insertCoin with the proper parameter', function () {
          expect(model.insertCoin).toHaveBeenCalledWith('GLARMPH');
        });
        
      });
    });
    
    afterEach(function() {
      removeViewRoot('machine');
    });

  });

});
