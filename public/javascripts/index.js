var socket = io.connect(window.location.hostname);
var lastdate = '';

socket.on("connect", function() {
    socket.on("text", function (data) {
        if (lastdate != data.date) {
            lastdate = data.date;
            var block = $("<div>", {"class": "message"})
                .append($("<div>", {
                    "class": "text",
                    text: data.msg}))
                .append($("<div>", {"class": "navcontainer"})
                    .append($("<ul>")
                        .append($("<li>", {"class": "link"})
                            .append($("<a>", {href: data.id, text: "link"})))
                        .append($("<li>", {"class": "date", text: data.date}))
                    ));
            
            block.prependTo("#messages")
            .hide()
            .css("opacity", 0)
            .slideDown(500,
                function() {
                    $(this).animate({opacity:1}, 1000);
                });
        }
    });
});