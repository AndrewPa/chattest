getNewestDate = function() {
    //Returns date of the latest received chat message
    var cache = window.temp_chatCache.total;
    var last_date = cache[0].msg_date;
    
    return last_date;
};

addNewMsg = function(r_data) {
    //Returns "true" if there are any new messages
    //Also adds new messages to cache as a side-effect, if new messages exist
    window.temp_chatCache.new = r_data.data.all;
    var new_msg = window.temp_chatCache.new;
    if(new_msg[0]) {
        var all_msg = window.temp_chatCache.total;
        var merged = new_msg.concat(all_msg);
        window.temp_chatCache.total = merged;
        window.temp_chatCache.new = [];
        return true;
    }
    return false; //No new chat messages
};