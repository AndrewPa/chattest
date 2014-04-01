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
    if(new_msg[0]) {
        //Add formatting to the datetime property with Moment.js
        for(var i=0;i<new_msg.length;i++) {
            new_msg[i].dt = { 
                msg_dt: new_msg[i].dt,
                dt_ago: moment(this.msg_dt).fromNow()
            };
        }
        
        //Handles the addition of new messages to the temporary storage object
        var all_msg = window.temp_chatCache.total;
        var merged = new_msg.concat(all_msg);
        window.temp_chatCache.total = merged;
        window.temp_chatCache.new = [];
        all_msg.splice(50,all_msg.length);
        return true;
    }
    return false; //No new chat messages
};

function ajaxGetMessage() {
    getChatMsg.async().then(function(d) {
        var any_new = addNewMsg(d); //Mesages added as side effect if any are new
        if (any_new) {
            var display_messages = temp_chatCache.total.slice();
            $scope.messages = display_messages.reverse();
            //Showing newest chat messages at the bottom
        }
    })
};