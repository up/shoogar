(function (){
  
  var i, links,

  activate = function(list) {
    links = list.getElementsByTagName('A');
    for (i=0;i<links.length;i++) {
      if (links[i].href === window.location.href) {
        links[i].className = 'active';
      }
    }    
  };

  window.onload = function () {
    activate(document.getElementById('menu'));
    activate(document.getElementById('examples'));
  };
  
}());
