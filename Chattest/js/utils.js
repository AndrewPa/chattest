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

function changeColorScheme(new_style) {
    for(var i=0;i<all_styles.length;i++) {
        if(all_styles[i].style.disabled === false) {
            var cur_style = all_styles[i].style;
            var cur_style_no = i;
        }
    }
    if(cur_style !== new_style) {
        cur_style.disabled = true;
        new_style.disabled = false;
    }
}

function changeVolume() {
    var cur_volume = volume_slider.value;

    for (var i=0;i<window.all_sounds.length;i++) {
        window.all_sounds[i].sound.volume = cur_volume/10;
    }

    document.cookie = 'vol=' + cur_volume;
}

function showPopup(url) {
    popupWindow = window.open(
        url,'popUpWindow','height=350,width=750,left=10,top=10,' +
            'resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,' + 
            'location=no,directories=no,status=yes');
}