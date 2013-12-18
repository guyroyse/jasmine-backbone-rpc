describe("Vending Machine", function() {

  describe("Model", function() {

    var subject;

    beforeEach(function() {
      subject = new VendingMachine.Model();
      spyOn(subject, 'save').andCallFake(function() {}); 
      spyOn(subject, 'fetch').andCallFake(function() {});
    });
    
    when("created", function() {

      it('fetches its state', function() {
        expect(subject.fetch).toHaveBeenCalledWith("[]");
      });
      
      and('the balance is 0', function() {
        
        it("displays 'INSERT COIN'", function() {
          expect(subject.display()).toBe('INSERT COIN');
        });
        
        it("has a balance of 0", function() {
          expect(subject.get('balance')).toBe(0);
        });
        
      });    
      
    });

    when('a coin is inserted', function() {
      
      beforeEach(function() {
        subject.insertCoin('NICKEL');
      });
      
      it('saves the state', function() {
        expect(subject.save).toHaveBeenCalled();
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
        expect($('#display').text()).toEqual('INIT');      
      });
      
    });
    
    when ('the model is changed', function () {
      
      beforeEach (function () {
        displayContents = 'CHANGED';
        model.trigger('change');
      });

      it('updates the display', function() {
        expect($('#display').text()).toEqual('CHANGED');
      });
      
    });
    
    when ('a coin is chosen', function () {
      beforeEach (function () {
        $('#coin').val ('GLARMPH');
      });
      
      and ('it is inserted', function (){
        beforeEach (function () {
          spyOn(model, 'insertCoin');
          $('#insertCoin').click();
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
