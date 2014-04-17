$(document).ready(function() {
    window.main_container = $("#main-container");
    window.terms_container = $("#terms-container");
    window.about_container = $("#about-container");
    window.about_button = $("#about");
    window.terms_button = $("#terms");
    window.about_back = $("#about-back");
    window.terms_back = $("#terms-back");

    terms_container.hide();
    about_container.hide();

    about_button.click(function() {
        main_container.slideUp(function() {
            about_container.slideDown();
        });
    });
    terms_button.click(function() {
        main_container.slideUp(function() {
            terms_container.slideDown();
        });
    });
    about_back.click(function() {
        about_container.slideUp(function() {
            main_container.slideDown();
        });
    });
    terms_back.click(function() {
        terms_container.slideUp(function() {
            main_container.slideDown();
        });
    });
});