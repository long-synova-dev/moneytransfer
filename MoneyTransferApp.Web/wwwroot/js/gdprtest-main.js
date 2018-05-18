$(document).ready(function(){
    $(window).on('load resize', function () {

        var h = $(window).height();
        var height_view = $('.complyto-quizz-page').height();
        // console.log(h);
        var header = $('#header').height();
        var footer = $('#footer').height();
        var heightcontent = h - header - 213;
        var hg = $('.content-start').outerHeight();
        var height_mobile = h - header - 100;
        var height_next_pre = $('.next-pre-question').height();
        console.log(height_next_pre);

        var height_question = $('.item-questions .questions').outerHeight();
        var hei = h - header - height_next_pre - height_question - 110;
        var height_questiona_mobile = h - header - height_next_pre - height_question - 200;

        var height_anwser = $(".answer").outerHeight();
        var height_help = h - header - 310;
        var height_help_mobile = h - header - 250;
        var height_help_mobile_320 = h - header - 150;

        var height_anwser_content = height_view - header - height_next_pre - 240;


        if ($(window).width() <= 991) {
            $('.content-start').height(heightcontent);
            $(".content-start").mCustomScrollbar({});

            $('.item-questions .answer').height(height_questiona_mobile);
            $(".answer").mCustomScrollbar({});
            // var a = $('.complyto-quizz-page').height(window.innerHeight + 'px');
            if (window.innerHeight < window.innerWidth) {
                // alert("Please use Landscape!");
                $('.answer').css('height', '100%');
            }

        }
        if ($(window).width() <= 600) {
            $('.item-questions .answer').height(hei);
            $(".answer").mCustomScrollbar({});

            $('.content-start').height(height_mobile);
        }
        if ($(window).width() <= 320) {
            $('.content-start').height(height_mobile);
            $(".content-start").mCustomScrollbar({
            });
        }
        if ($(window).width() > 320 && $(window).width() <= 600) {
            // $('.content-start').css({'height': 'inherit'});
        }
        if ($(window).width() >= 1000) {
            $('.content-start').css({ 'height': 'inherit' });
            if ($(".answer").height() > 320) {
                $(".answer").mCustomScrollbar({});
                $(".answer").height(height_anwser_content);
            }
            else {
                // $(".answer").css({'height': 'inherit'});
            }
        }
        if ($(window).width() <= 800) {
            // $('.content-help').height(height_help);
            $('.content-help').css({ 'height': height_help });
            // alert(height_help);
            $('.content-help').mCustomScrollbar({});
        }
        if ($(window).width() <= 640) {
            $('.content-help').height(height_help_mobile);
            $('.content-help').mCustomScrollbar({});
        }
        if ($(window).width() == 414) {
            $('.content-help').css({ 'height': 'inherit' });
            // $('.content-help').mCustomScrollbar({});
        }
        if ($(window).width() <= 320) {
            $('.content-help').height(height_help_mobile_320);
            $('.content-help').mCustomScrollbar({});
        }
        if ($(window).width() >= 1000) {
            $('.content-help').css({ 'height': 'inherit' });
        }
        if (window.innerHeight < window.innerWidth) {
            $('.content-help').mCustomScrollbar('destroy');
            // alert('landscape');
        }

    });

    
    $('.form-help').on('show.bs.modal', function () {
      $('#showhelp').addClass('open-help');
    });
    $('.form-help').on('hidden.bs.modal', function () {
      $('#showhelp').removeClass('open-help');
    });
    
    function customScrollBar() {
        if ($(window).width() <= 900) {
            var heightcontent;
            var h = $(window).height();
            var header = $('#header').height();

            if ($(window).width() <= 900) {
                heightcontent = h - header - 213;
            } else if ($(window).width() <= 480) {
                heightcontent = h - header - 150;
            }
            $('.content-start').height(heightcontent);
            $(".content-start").mCustomScrollbar({});
        }
    }

    setInterval(function () {
        if ($('.close-test').length > 0) {
            customScrollBar();
        }
    }, 500);
 
});
