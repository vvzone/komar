function sleep(millis, callback) {
    setTimeout(function()
        { callback(); }
        , millis);
}

/*
function foobar_cont(){
    console.log("after 3000ms, collection:");
    console.log(Ranks.toJSON());
}

sleep(300, foobar_cont);
*/