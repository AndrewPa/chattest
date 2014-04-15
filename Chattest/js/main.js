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

$(document).ready(function() {
    //Stylesheet queries
    window.pbc_style = document.getElementsByTagName("link")[2];
    window.lmt_style = document.getElementsByTagName("link")[3];
    window.asb_style = document.getElementsByTagName("link")[4];

    window.all_styles = [pbc_style, lmt_style, asb_style];
    
    //JavaScript DOM queries
    window.chat_msg = document.getElementById("chat-msg");
    window.set_name = document.getElementById("set-name");
    window.send_msg = document.getElementById("send-msg");
    window.message_box = document.getElementById("message-box");
    window.message_area = document.getElementById("message-area");

    //jQuery DOM queries
    window.user_list = $("#user-list");
    window.control_panel_tab = $("#control-panel-tab");
    window.control_panel_area = $("#control-panel-area");
    window.color_options = $("#color-options");
    window.layout_options = $("#layout-options");
    window.system_options = $("#system-options");
    window.color_options_buttons = $("#color-options-buttons");
    window.layout_options_buttons = $("#layout-options-buttons");
    window.system_options_buttons = $("#system-options-buttons");

    window.asb_button = $("#color-options-skyblue");
    window.lmt_button = $("#color-options-mint");
    window.pcb_button = $("#color-options-pbc");

    user_list.resizable({
       handles: "s",
       maxHeight: 250,
       minHeight: 75
   });

    window.main_buttons = [color_options, layout_options, system_options,
        control_panel_tab];
    window.sub_buttons = [color_options_buttons, layout_options_buttons,
        system_options_buttons];

    for(var i=0;i<sub_buttons.length;i++) {
        sub_buttons[i].hide();
    }
    user_list.toggle();

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
    
    //Click function assignment
    window.asb_button.click(function() { changeColorScheme(asb_style); } );
    window.lmt_button.click(function() { changeColorScheme(lmt_style); } );
    window.pcb_button.click(function() { changeColorScheme(pbc_style); } );
    
    //Init operations
    window.message_area.scrollTop = message_area.scrollTopMax;
});