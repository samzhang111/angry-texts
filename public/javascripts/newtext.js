var socket = io.connect(window.location.hostname);

socket.on("connect", function() {
    console.log("socket.io connected");
    socket.on("text", function (data) {
        console.log(data["msg"]);
        var block = $("<div>", {"class": "message"})
            .append($("<div>", {
                "class": "text",
                text: data["msg"]}))
            .append($("<div>", {
                "class": "date",
            text: data["date"]}));

        block.prependTo("#messages")
        .hide()
        .css("opacity", 0)
        .slideDown(500,
            function() {
                $(this).animate({opacity:1}, 1000);
            });
    });
});
