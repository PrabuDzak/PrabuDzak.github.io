(function () {
  var navTrigger = document.querySelectorAll('.nav-trigger');
  for(var i = 0; i<navTrigger.length; i++){
    navTrigger.item(i).addEventListener('click', function(){
      document.querySelector('.page-overlay.nav-trigger').classList.toggle('active');
      document.querySelector('.nav-wrap').classList.toggle('active');
    });
  }

  var links = document.querySelectorAll('.site-links a');
  for(var i = 0; i < links.length; i++){
    links.item(i).addEventListener('click', function(){
      document.querySelector('.page-overlay.nav-trigger').classList.remove('active');
      document.querySelector('.nav-wrap').classList.remove('active');
    });
  }
}());