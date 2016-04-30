//Extra button animation logic

//Constructor associates a button element with a given animation sequence
//that is not interrupted until the sequence is complete
//Completion of animation sequence determined by fulfillment of promise whose
//return is triggered by the completion of one of the animations (preferably
//the slowest, i.e., last to complete)
function UninterruptibleButton(button, animations) {
    var self = this;
    this.animations = animations;
    this.toggleOptions = function(e) {
        e.preventDefault();
        //Binding/unbinding must be applied to all buttons during animations as
        //the user can still activate most buttons during other buttons' animations
        for(var i=0;i<main_buttons.length;i++) {
            main_buttons[i].unbind();
        }
        var promise = self.animations();
        promise.done(function() {
            for(var i=0;i<main_buttons.length;i++) {
                main_buttons[i].bind('click',
                    b_instances[main_buttons[i].attr("id")].toggleOptions);
            }
        });
    };
    button.bind('click', self.toggleOptions);
}

function changeColors(new_style) {
    for (var i=0;i<all_color_schemes.length;i++) {
        if (all_color_schemes[i].style.disabled === false) {
            all_color_schemes[i].style.disabled = true;
            break;
        }
    }
    all_color_schemes[new_style].style.disabled = false;
}

function changeVolume() {
  
    var cur_volume = volume_slider.value;

    for (var i=0;i<window.all_sounds.length;i++) {
        window.all_sounds[i].sound.volume = cur_volume/10;
    }

    document.cookie = 'vol=' + cur_volume + '; expires=' + cookie_exp +
      '; path=/';

}

function scrollToBottom() {
    //window.scroll_init_count is the number of times the $watch function in
    //the chatMsgArea directive has been fired

    //Count = 1: first new message $digest cycle completed: force initial scroll
    if (window.scroll_init_count === 1) {
        window.message_area.scrollTop = message_area.scrollHeight;
    }
    //Count = 0: first new message $digest cycle not completed: do not scroll
    window.scroll_init_count++;

    //Subsequent new message $digest cycles: force scroll with check
    if (window.scroll_init_count === 2) {
        //$watch in chatMsgArea directive call count = 3:
        delete window.scroll_init_count;
        //Scroll utility function to be used after initialization
        window.scrollToBottom = function () {
            if (window.scroll_toggle) {
                window.message_area.scrollTop = message_area.scrollHeight;
            }
        };
    }
}