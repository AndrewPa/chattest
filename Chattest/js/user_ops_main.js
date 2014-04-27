$(document).ready(function() {
    window.main_container = $("#main-container");
    window.terms_container = $("#terms-container");
    window.about_container = $("#about-container");
    window.privacy_container = $("#privacy-container");
    window.signup_page_container = $("#signup-page-container");

    window.about_button = $("#about");
    window.terms_button = $("#terms");
    window.privacy_button = $("#privacy");
    window.signup_page_button = $("#signup-page-button");

    window.about_back = $("#about-back");
    window.terms_back = $("#terms-back");
    window.privacy_back = $("#privacy-back");
    window.signup_page_back = $("#signup-page-back");
    window.signed_up_back = $("#signed-up-back");

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
    privacy_button.click(function() {
        main_container.slideUp(function() {
            privacy_container.slideDown();
        });
    });
    signup_page_button.click(function() {
        main_container.slideUp(function() {
            signup_page_container.slideDown();
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
    privacy_back.click(function() {
        privacy_container.slideUp(function() {
            main_container.slideDown();
        });
    });
    signup_page_back.click(function() {
        signup_page_container.slideUp(function() {
            main_container.slideDown();
        });
    });
    signed_up_back.click(function() {
        signup_page_container.slideUp(function() {
            main_container.slideDown();
        });
    });
    
    $(document).ready(function() {
        if (start_page === "login") {
            signup_page_container.hide();
        }
        else if (start_page === "signup") {
            main_container.hide();
        }
        terms_container.hide();
        about_container.hide();
        privacy_container.hide();
    });
});