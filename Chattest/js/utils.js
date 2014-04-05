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
                dt_ago: moment(new_msg[i].dt).fromNow()
            };
        }

        //Handles the addition of new messages to the temporary storage object
        var all_msg = window.temp_chatCache.total;
        var merged = new_msg.concat(all_msg);
        window.temp_chatCache.total = merged;
        window.temp_chatCache.new = [];
        window.temp_chatCache.total.splice(50,all_msg.length);
        return true;
    }
    return false; //No new chat messages
};

//Add additional formatting to the datetime property with Moment.js
updateTimeAgo = function() {
    var all_msg = window.temp_chatCache.total;
    for(var i=0;i<all_msg.length;i++) {
        var cur_msg_dt = all_msg[i].dt;
        cur_msg_dt.dt_ago = moment(cur_msg_dt.msg_dt).fromNow();
    }
};