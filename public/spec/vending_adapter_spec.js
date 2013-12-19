describe("Vending Machine Adapter", function() {
  
  var subject = VendingMachine.Adapter;
  
  var model = {
    get : function() { return 100; }
  };
  
  var data = { balance : 15 };
  
  beforeEach(function() {
    spyOn(subject, 'get').andCallFake(function(url, success, failure) {
      success(data);
    });

  });
  
  when('updating', function() {
    
    it('calls the setBalance API method', function() {
      subject.update(model, empty, empty);
      expect(subject.get).toHaveBeenCalledWith('/machine/setBalance/100', jasmine.any(Function), jasmine.any(Function));      
    });
    
    it('returns no data', function() {
      subject.update(model, function(actualData) {
        expect(actualData).not.toBeDefined();
      }, empty);
    });
    
  });
  
  when('creating', function() {
    
    it('calls the setBalance API method', function() {
      subject.create(model, empty, empty);
      expect(subject.get).toHaveBeenCalledWith('/machine/setBalance/100', jasmine.any(Function), jasmine.any(Function));      
    });
    
    it('returns no data', function() {
      subject.create(model, function(actualData) {
        expect(actualData).not.toBeDefined();
      }, empty);
    });
    
  });
  
  when('reading', function() {
    
    it('calls the machine state API method', function() {
      subject.read(model, empty, empty);
      expect(subject.get).toHaveBeenCalledWith('/machine', jasmine.any(Function), jasmine.any(Function));
    });
    
    it ('returns the data returned by the success callback', function() {
      subject.read(model, function(actualData) {
        expect(actualData).toEqual(data);
      }, empty);
      
    });
    
  });  
  
});
