getNewestDate = function() {
    //Returns date of the latest received chat message
    var cache = window.temp_chatCache.total;
    var last_date = cache[0].dt.msg_dt;
    
    return last_date;
};

addNewMsg = function(r_data) {
    //Returns "true" if there are any new messages
    //Also adds new messages to cache as a side-effect, if new messages exist
    window.temp_chatCache.new = r_data.data.all;
    var new_msg = window.temp_chatCache.new;
    if(new_msg !== undefined && new_msg[0]) {
        for(var i=0;i<new_msg.length;i++) {
            new_msg[i].dt = { 
                msg_dt: new_msg[i].dt,
                dt_ago: moment(new_msg[i].dt).from(getGMT())
            };
        }

        //Handles the addition of new messages to the temporary storage object
        var all_msg = window.temp_chatCache.total;
        var merged = new_msg.concat(all_msg);
        window.temp_chatCache.total = merged;
        window.temp_chatCache.new = [];
        window.temp_chatCache.total.splice(30,all_msg.length);
        return true;
    }
    return false; //No new chat messages
};

//Add additional formatting to the datetime property with Moment.js
updateTimeAgo = function() {
    var all_msg = window.temp_chatCache.total;
    for(var i=0;i<all_msg.length;i++) {
        var cur_msg_dt = all_msg[i].dt;
        cur_msg_dt.dt_ago = moment(cur_msg_dt.msg_dt).from(getGMT());
    }
};

getGMT = function() {
     var tz_offset = moment().zone();
     return now_gmt = moment().add('minutes', tz_offset);
};

//Extra button animation logic

//Constructor associates a button element with a given animation sequence
//that is not interrupted until the sequence is complete
//Completion of animation sequence determined by fulfillment of promise whose
//return is triggered by the completion of one of the animations (preferably
//the slowest, i.e., last to complete)
UninterruptibleButton = function(button, animations) {
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
};

changeColorScheme = function(new_style) {
    for(var i=0;i<all_styles.length;i++) {
        if(all_styles[i].disabled === false) {
            var cur_style = all_styles[i];
        }
    }
    if(cur_style !== new_style) {
        cur_style.disabled = true;
        new_style.disabled = false;
    }
};