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
      // dynamicInitializer();
    });
    
    function dynamicInitializer(){
      //setting dimensions
      setListWidth();
      $('#test_next').click(function(){
        autoRotateSlider()
      });
      
      $('#test_prev').click(function(){
        addNextViewElement()
      });
      
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
      var listCount = parseInt($('#cslider ul li').length);
      
      var midElement = Math.floor(listCount/2)+1
      
      var initMove = elementWidth * (listCount - midElement)
      
      $('#cslider ul li:nth-child('+midElement+')').addClass('current');
      slideView(initMove,$('#cslider ul'), 0)
      generateThumbnail(listCount);
    }
    
    function generateThumbnail(listCount){
      $('.slider').append('<div class="thumbnails"></div>');
      for(var i =1; i<= listCount; i++){
        $('.thumbnails').append('<span class="thumb" id="t_'+i+'">'+i+'</span>');
      }
      $('.thumbnails .thumb').first().addClass('active');
      $('.thumbnails .thumb').on('click', function(){
        navigateSlide($(this));
      });
      $('#cslider ul li').each(function(index){
        $(this).attr('rel', (index+1));
      });
      
    }
    
    function navigateSlide(clickEle){
      var intRegex = /[0-9 -()+]+$/;
      var currThumb = parseInt(intRegex.exec($('.active').attr('id')), 10);
      var clickThumb = parseInt(intRegex.exec(clickEle.attr('id')), 10);
      if(clickThumb > currThumb){
        var diff = (clickThumb - currThumb)
        for(var j=0; j < diff; j++){
          $('#test_next').trigger('click');
        }
        console.log('remove last')
        // $('#cslider ul li').last().remove();
        
      }else if(clickThumb < currThumb){
        var diff = (currThumb - clickThumb)
        for(var k=0; k < diff; k++){
          $('#test_prev').trigger('click');
        }
        console.log('remove first')
        // $('#cslider ul li').first().remove();
      }else{
        return false
      }
      clickEle.addClass('active');
      clickEle.siblings().removeClass('active');
    }
    
    
    function autoRotateSlider(){
      var elementWidth = -(parseInt($('#cslider').width()));
      var currentLeft = getCurrentLeft($('#cslider ul'));
      slideView((elementWidth+currentLeft),$('#cslider ul'), 1000);
      addPrevViewElement();
    }
    
    //adding element to starting of list on left movement
    function addPrevViewElement(){
      console.log('next fire')
      var elementWidth = -(parseInt($('#cslider').width()));
      var remEle = $('#cslider ul li').first();
      var copyPrevSlide = remEle.clone();
      
      var listCount = parseInt($('#cslider ul li').length);
      var midElement = Math.floor(listCount/2)+1
      
      var initMove = elementWidth * (listCount - midElement)
      
      var nextCurrent = $('.current').next();
      nextCurrent.addClass('current')
      nextCurrent.siblings().removeClass('current');
      setTimeout(function(){
        slideView(initMove,$('#cslider ul'), 0);
        remEle.remove();
        copyPrevSlide.appendTo('#cslider ul');
      },0);
      
      var actThumb = $('.active').next();
      actThumb.addClass('active');
      actThumb.siblings().removeClass('active');
    }
    
    //adding element to send of list on right movement
    function addNextViewElement(){
      console.log('prev fire')
      var elementWidth = -(parseInt($('#cslider').width()));
      var currentLeft = getCurrentLeft($('#cslider ul'));
      var remEle = $('#cslider ul li').last();
      var copyLastSlide = remEle.clone();
      
      var listCount = parseInt($('#cslider ul li').length);
      var midElement = Math.floor(listCount/2)+1
      
      var initMove = elementWidth * (listCount - midElement)
      
      slideView((currentLeft - elementWidth),$('#cslider ul'), 1000);
      var nextCurrent = $('.current').prev();
      nextCurrent.addClass('current')
      nextCurrent.siblings().removeClass('current');
      setTimeout(function(){
        remEle.remove();
        copyLastSlide.prependTo('#cslider ul');
        slideView(initMove,$('#cslider ul'), 0);
      },0);
      
      var actThumb = $('.active').prev();
      actThumb.addClass('active');
      actThumb.siblings().removeClass('active');
    }
    
    //setting slider left position
    function slideView(slideDistance, elementToMove, duration){
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
    
    function getCurrentLeft(visibleSection){
      var visibleSection = visibleSection;
      var ua = navigator.userAgent;
      var isMoz = /firefox/i.test(ua);
      var isWebKit = /webkit/i.test(ua);
      if(isWebKit){
        var matrix = matrixToArray(visibleSection.css("-webkit-transform"));
        var currentLeft = parseInt(matrix[4], 10);
      }else if(isMoz){
        var matrix = matrixToArray(visibleSection.css("-moz-transform"));
        var currentLeft = parseInt(matrix[4], 10);
      }else{
        var currentLeft = parseInt(visibleSection.css('left'), 10);
      }
      return currentLeft
    }
    
    function matrixToArray(matrix) {
      if(matrix != undefined){
        return matrix.substr(7, matrix.length - 8).split(', ');
      }else{
        return ["1", "0", "0", "1", "0", "0"] 
      }
    }
    
    setInterval(function(){
      var currentLeft = -(getCurrentLeft($('#cslider ul')));
      var eleWidth = (parseInt($('#cslider').width()));
      var currEle = (currentLeft/eleWidth)+1
      var cElement = $('#cslider ul li:nth-child('+currEle+')');
      cElement.addClass('current');
      cElement.siblings().removeClass('current')
    }, 100);
    
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