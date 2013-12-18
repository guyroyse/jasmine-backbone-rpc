var when = function(description, callback) {
  describe('when '.concat(description), callback);
};

var and = function(description, callback) {
  describe('and '.concat(description), callback);
};

var createViewRoot = function(id) {
  var element = document.createElement('div');
  element.setAttribute('id', id);
  jQuery('body').append(element);
};

var removeViewRoot = function(id) {
  jQuery('#' + id).remove();
};
