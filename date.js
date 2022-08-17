
exports.getDate = function(){
    var today= new Date();
        var currentDay = today.getDay();
        var day = "";
        var options = {
            weekday: "long",
            day: "numeric",
            month: "long",
            hour: "numeric",
            minute: "numeric",
            // second: "numeric"
        };

        return today.toLocaleDateString("en-IN",options);
        
}
exports.getDay = function (){
    var today= new Date();
        var currentDay = today.getDay();
        var day = "";
        var options = {
            weekday: "long",
            day: "numeric",
            month: "long",
            // hour: "numeric",
            // minute: "numeric",
            // second: "numeric"
        };

        return today.toLocaleDateString("en-IN",options);
   
}
 