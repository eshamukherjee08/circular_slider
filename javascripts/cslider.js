;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "circularSlider",
        defaults = {
            // propertyName: "value"
            auto : true,
            auto_duration : 6000,
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method that merges the 
        // contents of two or more objects, storing the 
        // result in the first object. The first object 
        // is generally empty because we don't want to alter 
        // the default options for future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = pluginName;
        
        this.init();
        
    }
    
    Plugin.prototype.init = function () {
        // Place initialization logic here
        // We already have access to the DOM element and
        // the options via the instance, e.g. this.element 
        // and this.options        
        dynamicInitializer();
        readyOnLoad();
        
        if(this.options.auto == true){
          setInterval(function() {
            autoRotateSlider();
          },this.options.auto_duration);
        }
    };
    
    $(window).resize(function () { 
      //here goes code to be called on resize
      dynamicInitializer();
    });
    
    function dynamicInitializer(){
      //setting dimensions
      setListWidth();
      
    }
    
    function setListWidth(){
      var elementWidth = parseInt($('#cslider').width());
      var listCount = parseInt($('#cslider ul li').length);
      $('#cslider ul').outerWidth(elementWidth*listCount);
    }
    
    //setting the initial structure on 1st load
    function readyOnLoad(){
      var lastElement = $('#cslider ul li').last();
      var elementWidth = -(parseInt($('#cslider').width()));
      $('#cslider ul li').last().remove();
      $('#cslider ul li').first().addClass('current');
      lastElement.prependTo('#cslider ul');
      slideView(elementWidth,$('#cslider ul'), 0)
    }
    
    function autoRotateSlider(){
      // var elementWidth = -(parseInt($('#cslider').width()));
      // slideView(elementWidth,$('#cslider ul'), 500);
      // setTimeout(function(){
      //   addPrevViewElement();
      // },3000)
      addPrevViewElement();
    }
    
    //adding element to starting of list on left movement
    function addPrevViewElement(){
      console.log('now')
      var copyPrevSlide = $('.current').prev().clone();
      var nextCurrent = $('.current').next();
      var elementWidth = -(parseInt($('#cslider').width()));
      slideView(elementWidth,$('#cslider ul'), 500);
      copyPrevSlide.appendTo('#cslider ul');
      setTimeout(function(){
        $('.current').prev().remove();
        nextCurrent.addClass('current')
        nextCurrent.siblings().removeClass('current');
      },1000)
    }
    
    //adding element to send of list on right movement
    function addNextViewElement(){

      // var copyPrevSlide = $('.current').prev().clone();
      
      //  copyPrevSlide.css('left', endLeft);
      //  $('#slider_wrapper div.main').last().after(copyPrevSlide);
      //  $('#slider_wrapper div.main').first().remove();
    }
    
    //setting slider left position
    function slideView(slideDistance, elementToMove, duration){
      console.log('here')
      var ua = navigator.userAgent;
      var isMoz = /firefox/i.test(ua);
      var isWebKit = /webkit/i.test(ua);
      if(isWebKit){
        elementToMove.css('-webkit-transition-duration',''+duration+'ms');
        elementToMove.css('-webkit-transform', 'translate3d(' + slideDistance + 'px,0px,0px)');
      }else if(isMoz){
        elementToMove.css('-moz-transition-duration',''+duration+'ms');
        elementToMove.css('-moz-transform', 'translate3d(' + slideDistance + 'px,0px,0px)');
      }else{
        elementToMove.animate({left : slideDistance}, {queue:false, duration:600, easing:'linear'});
      }

    }
    

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if ( !$.data(this, "plugin_" + pluginName )) {
                $.data( this, "plugin_" + pluginName, 
                new Plugin( this, options ));
            }
        });
    }

})( jQuery, window, document );