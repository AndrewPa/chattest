$(document).ready(function() {
    window.main_body = document.getElementsByTagName("body")[0];

    window.main_container = document.getElementById("main-container");
    window.terms_container = document.getElementById("terms-container");
    window.about_container = document.getElementById("about-container");
    window.privacy_container = document.getElementById("privacy-container");
    window.devdiary_container = document.getElementById("devdiary-container");
    window.signup_page_container = document.getElementById("signup-page-container");

    window.terms_link = document.getElementById("terms-link");
    window.about_link = document.getElementById("about-link");
    window.privacy_link = document.getElementById("privacy-link");
    window.signup_page_link = document.getElementById("signup-page-link");
    window.devdiary_link = document.getElementById("devdiary-link");

    window.terms_back = document.getElementById("terms-back");
    window.about_back = document.getElementById("about-back");
    window.privacy_back = document.getElementById("privacy-back");
    window.signup_page_back = document.getElementById("signup-page-back");
    window.devdiary_back = document.getElementById("devdiary-back");
    
    window.about_footer = document.getElementById("about-footer");

    var swapFunctionFactory = function(sc, dc, th, tw, ch) {
        this.start_cont = sc;
        this.dest_cont = dc;
        this.targ_height = th;
        this.compat_height = ch;
        var self = this;

        tw === undefined ? this.targ_width = "280px" : this.targ_width = tw;

        this.swapInner = function() {
            self.dest_cont.style.opacity = "1";

            window.main_body.removeEventListener("transitionend", self.swapInner, true);
        };
        this.swapOuter = function() {
            window.main_body.addEventListener("transitionend", self.swapInner, true);
            //cssText validation removes empty and incompatible height settings
            window.main_body.style.cssText += "height: " + self.compat_height +
                "; height: " + self.targ_height + ";";
            window.main_body.style.maxWidth = self.targ_width;
            self.start_cont.style.display = "none";
            self.dest_cont.style.display = "";

            self.start_cont.removeEventListener("transitionend", self.swapOuter, true);
        };
    };

    var terms1 = new swapFunctionFactory(main_container, terms_container, "436px");
    var terms2 = new swapFunctionFactory(terms_container, main_container, "500px");
    var about1 = new swapFunctionFactory(main_container, about_container, "436px");
    var about2 = new swapFunctionFactory(about_container, main_container, "500px");
    var priv1 = new swapFunctionFactory(main_container, privacy_container, "436px");
    var priv2 = new swapFunctionFactory(privacy_container, main_container, "500px");
    var sign1 = new swapFunctionFactory(main_container, signup_page_container, "408px");
    var sign2 = new swapFunctionFactory(signup_page_container, main_container, "500px");
    var dev1 = new swapFunctionFactory(main_container, devdiary_container, "calc(100% - 118px)", "85%", "80%");
    var dev2 = new swapFunctionFactory(devdiary_container, main_container, "500px");

    window.terms_link.onclick = function() {
        main_container.addEventListener("transitionend", terms1.swapOuter, true);
        main_container.style.opacity = "0";
    };
    window.terms_back.onclick = function() {
        terms_container.addEventListener("transitionend", terms2.swapOuter, true);
        terms_container.style.opacity = "0";
    };

    window.about_link.onclick = function() {
        main_container.addEventListener("transitionend", about1.swapOuter, true);
        main_container.style.opacity = "0";
    };
    window.about_back.onclick = function() {
        about_container.addEventListener("transitionend", about2.swapOuter, true);
        about_container.style.opacity = "0";
    };

    window.privacy_link.onclick = function() {
        main_container.addEventListener("transitionend", priv1.swapOuter, true);
        main_container.style.opacity = "0";
    };
    window.privacy_back.onclick = function() {
        privacy_container.addEventListener("transitionend", priv2.swapOuter, true);
        privacy_container.style.opacity = "0";
    };

    window.signup_page_link.onclick = function() {
        main_container.addEventListener("transitionend", sign1.swapOuter, true);
        main_container.style.opacity = "0";
    };
    window.signup_page_back.onclick = function() {
        signup_page_container.addEventListener("transitionend", sign2.swapOuter, true);
        signup_page_container.style.opacity = "0";
    };

    window.devdiary_link.onclick = function() {
        main_container.addEventListener("transitionend", dev1.swapOuter, true);
        main_container.style.opacity = "0";
    };
    window.devdiary_back.onclick = function() {
        devdiary_container.addEventListener("transitionend", dev2.swapOuter, true);
        devdiary_container.style.opacity = "0";
    };

    if (start_page === "login") {
        signup_page_container.style.display = "none";
        signup_page_container.style.opacity = "0";
    }
    else if (start_page === "signup") {
        main_container.style.display = "none";
        main_container.style.opacity = "0";
        //Disable shrinking animation when signup form reloads
        main_body.classList.remove("body-expand");
        main_body.style.height = "408px";
        setTimeout(function() {
            main_body.classList.add("body-expand");
        }, 0);
    }

    terms_container.style.opacity = "0";
    about_container.style.opacity = "0";
    privacy_container.style.opacity = "0";
    devdiary_container.style.opacity= "0";

    terms_container.style.display = "none";
    about_container.style.display = "none";
    privacy_container.style.display = "none";
    devdiary_container.style.display = "none";
});