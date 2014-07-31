Array.prototype.getObjectsById = function(x){
  var catcher = [], i = 0;
  for(var i = 0; i < this.length; i++){
    if(this[i].id == value){
      catcher.push(this[i]);
    }
    i++;
  }
  return catcher.length == 1 ? catcher[0] : catcher;
}

