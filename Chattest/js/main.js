var chattestApp = angular.module('chattestApp', ['chattestServices', 'chattestControllers']);

var temp_chatCache = {
    total: [],
    new: []
};

//Initial main option tab positions
var tab_pos = {
    main: {
        color: "0px",
        layout: "60px",
        system: "158px"
    }
};

/*  //Elements altered by color scheme
    body-mint
    message-area-mint
    user-message-dt-mint
    control-panel-tab-mint
    control-panel-mint
    control-panel-option-mint
    control-panel-sub-option-mint
    input-toolbar-mint
*/

$(document).ready(function() {
    window.chat_msg = document.getElementById("chat-msg");
    window.set_name = document.getElementById("set-name");
    window.send_msg = document.getElementById("send-msg");
    window.message_box = document.getElementById("message-box");

    window.main_body = $("body");
    window.message_area = $("#message-area");

    window.control_panel_tab = $("#control-panel-tab");
    window.control_panel_area = $("#control-panel-area");
    window.color_options = $("#color-options");
    window.layout_options = $("#layout-options");
    window.system_options = $("#system-options");
    window.color_options_buttons = $("#color-options-buttons");
    window.layout_options_buttons = $("#layout-options-buttons");
    window.system_options_buttons = $("#system-options-buttons");

    window.main_buttons = [color_options, layout_options, system_options,
        control_panel_tab];
    window.sub_buttons = [color_options_buttons, layout_options_buttons,
        system_options_buttons];

    for(var i=0;i<sub_buttons.length;i++) {
        sub_buttons[i].hide();
    }

    //Pass animation sequence associated with button as a function into the
    //constructor to ensure the animation is not interrupted until it is complete
    color_options_button = new UninterruptibleButton(color_options, function() {
        if(color_options_buttons.css("display") === "none") {
            layout_options.animate({left: "-30px"}, 400);
            system_options.animate({left: "-30px"}, 500);
        } else {
            layout_options.animate({left: tab_pos.main.layout }, 400);
            system_options.animate({left: tab_pos.main.system }, 380);
        }
        return color_options_buttons.fadeToggle("slow").promise();
        //Return the promise of the slowest animation to complete
    });
    layout_options_button = new UninterruptibleButton(layout_options, function() {
        if(layout_options_buttons.css("display") === "none") {
            layout_options.animate({left: "0px"}, 400);
            color_options.animate({left: "-80px"}, 500);
            system_options.animate({left: "0px"}, 500);
        } else {
            layout_options.animate({left: tab_pos.main.layout }, 400);
            color_options.animate({left: tab_pos.main.color}, 300);
            system_options.animate({left: tab_pos.main.system }, 500);
        }
        return layout_options_buttons.fadeToggle("slow").promise();
    });
    system_options_button = new UninterruptibleButton(system_options, function() {
        if(system_options_buttons.css("display") === "none") {
            layout_options.animate({left: "-110px"}, 550);
            color_options.animate({left: "-80px"}, 500);
            system_options.animate({left: "0px"}, 480);
        } else {
            layout_options.animate({left: tab_pos.main.layout }, 400);
            color_options.animate({left: tab_pos.main.color }, 450);
            system_options.animate({left: tab_pos.main.system }, 600);
        }
        return system_options_buttons.fadeToggle("slow").promise();
    });
    control_panel_tab_button = new UninterruptibleButton(control_panel_tab, function() {
        if(control_panel_area.css("bottom") !== "0px") {
            return control_panel_area.animate({bottom: "0px"}, 200).promise();
        } else {
            return control_panel_area.animate({bottom: "-27px"}, 200).promise();
        }
    });
    
    window.b_instances = {
        "color-options": color_options_button,
        "layout-options": layout_options_button, 
        "system-options": system_options_button,
        "control-panel-tab": control_panel_tab_button
    };
});