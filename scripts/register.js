var _root = "http://" + window.location.host.toString() + "/Code9000";

$(function(){
	$("#emailinfo").hide();
	$("#regbtn").attr('disabled', 'disabled');
	$("#email").keyup(function(){
		checkEmail();
	});

	$("#passwordre").keyup(function(){
		checkpwd();
	});

	$("#regbtn").click(function(){
		if(checkForm())
			document.forms["registerform"].submit();
			$("#regbtn").attr('disabled', 'disabled');

	})
});

function checkEmail()
{
	var email = $("#email").val();
	console.log(email);
	var datae = {"email": email};
	var json = JSON.stringify(datae);

	$.ajax({
		type: "POST",
        dataType: "json",
        contentType: "application/json",
        cache: false,
        data: json,
        url: _root + "/checkemail",
        success: function(data){
            if (data.status == "used") {
            	$("#emailinfo").html("Email address is already in use.");
            	$("#emailinfo").show();
            	$("#regbtn").attr('disabled', 'disabled');
            }
            else
            {
            	$("#emailinfo").hide();
            	document.getElementById("regbtn").removeAttribute("disabled");       
            }
        }
	});
}

function checkpwd(){
	var pwd = $("#password").val();
	var pwdre = $("#passwordre").val();
	if (pwd!=pwdre) {
		$("#emailinfo").html("Passwords do not match.");
    	$("#emailinfo").show();
    	$("#regbtn").attr('disabled', 'disabled');
    	return false;
	}else
	{
		$("#emailinfo").hide();
    	$("#regbtn").attr('disabled', 'none');
    	document.getElementById("regbtn").removeAttribute("disabled");
    	return true;
	}
}

function checkForm(){

	if(!checkpwd())
	{
		console.log("pwd");
		return false;
	}

	return true;
}