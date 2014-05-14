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

    var transitions = {
        transition: "transitionend",
        OTransition: "oTransitionEnd",
        MozTransition: "transitionend",
        WebkitTransition: "webkitTransitionEnd"
    };

    for(var t in transitions){
        if (main_body.style[t] !== undefined) {
            var transition_str = transitions[t];
            break;
        }
    }

    function swapFunctionFactory(sc, dc, th, tw, ch) {
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

    var terms_l = new swapFunctionFactory(main_container, terms_container, "436px");
    var terms_b = new swapFunctionFactory(terms_container, main_container, "500px");
    var about_l = new swapFunctionFactory(main_container, about_container, "436px");
    var about_b = new swapFunctionFactory(about_container, main_container, "500px");
    var priv_l = new swapFunctionFactory(main_container, privacy_container, "436px");
    var priv_b = new swapFunctionFactory(privacy_container, main_container, "500px");
    var sign_l = new swapFunctionFactory(main_container, signup_page_container, "408px");
    var sign_b = new swapFunctionFactory(signup_page_container, main_container, "500px");
    var dev_l = new swapFunctionFactory(main_container, devdiary_container, "calc(100% - 118px)", "85%", "80%");
    var dev_b = new swapFunctionFactory(devdiary_container, main_container, "500px");

    function animationClickFactory(container, instance) {
        this.container = container;
        this.instance = instance;
        var self = this;

        this.assignAnimation = function() {
            self.container.addEventListener(transition_str, self.instance.swapOuter, true)
            self.container.style.opacity = "0";
        };
    }

    var animations = {
        terms: {
            cont: terms_container,
            link: terms_link,
            back: terms_back,
            insl: terms_l,
            insb: terms_b
        },
        about: {
            cont: about_container,
            link: about_link,
            back: about_back,
            insl: about_l,
            insb: about_b
        },
        privacy: {
            cont: privacy_container,
            link: privacy_link,
            back: privacy_back,
            insl: priv_l,
            insb: priv_b
        },
        devdiary: {
            cont: devdiary_container,
            link: devdiary_link,
            back: devdiary_back,
            insl: dev_l,
            insb: dev_b
        },
        signup: {
            cont: signup_page_container,
            link: signup_page_link,
            back: signup_page_back,
            insl: sign_l,
            insb: sign_b
        }
    };

    for (var ani in animations) {
        animations[ani].link.onclick = (new animationClickFactory(main_container, animations[ani].insl).assignAnimation);
        animations[ani].back.onclick = (new animationClickFactory(animations[ani].cont, animations[ani].insb).assignAnimation);
    }

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