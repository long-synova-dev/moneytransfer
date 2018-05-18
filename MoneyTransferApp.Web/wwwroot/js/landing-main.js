$(document).ready(function(){
    $(window).on('load resize', function () {
      $('.content-test-om').css('height','193px').css('overflow','hidden');
      $('.test-om .dropdown .icon-click').on('click touch', function (e) {

           e.preventDefault();
         r = $('.content-test-om');
          t=$(this);
          h = r.children('.row').outerHeight();
         if(r.data('state')!='all')

            r.animate({
                  height: h
                }, 500, function() {
                    t.addClass('more');
                    t.removeClass('less');
                    r.data('state','all');
             });
          
          else
              r.animate({
                  height: '193px'
                }, 500, function() {
                      t.addClass('less');
                      t.removeClass('more');
                    r.data('state','less');
             });
              
      });

      $('.main-overblikket').css('height','126px').css('overflow','hidden');
      $('.overblikket .dropdown .icon-click').click(function(e) {

           e.preventDefault();
         r = $('.main-overblikket');
          t=$(this);
          h = r.children('.row').outerHeight();
         if(r.data('state')!='all')       
            r.animate({
                  height: h
                }, 500, function() {
                    t.addClass('more');
                    t.removeClass('less');
                    r.data('state','all');
             });
          
          else
              r.animate({
                  height: '126px'
                }, 500, function() {
                      t.addClass('less');
                      t.removeClass('more');
                    r.data('state','less');
             });
              
      });
    });

    $("#menu a").click(function() {
      var id =  $(this).attr('href');
       $('html, body').animate({         
           scrollTop: $(id).offset().top
       }, 1000);
    });

    $("#totop").click(function () {
        $("html, body").animate({scrollTop: 0}, 1000);
    });
    var abc = $('.main-overblikket').height();
});
