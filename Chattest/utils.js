getNewestDate = function() {
    var cache = window.temp_chatCache.chatData;
    var last_date = cache[0].msg_date;
    
    return last_date;
};