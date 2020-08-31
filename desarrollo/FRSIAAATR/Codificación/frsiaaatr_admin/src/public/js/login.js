$(document).ready(function() {

    $("#btnLogin").on("click", function() {

        let data = {
            email: $("#email").val(),
            password: $("#password").val()
        };

        $.ajax({
            type: "POST",
            url: "../../exec-login",
            data: JSON.stringify(data),
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json');
            }
        }).done(function(response) {
            //console.log(response);
            window.location.href = '/';
        }).fail(function(xhr) {
            console.log("Error");
        });

    });

    //Logout en global.js

});