var _root = "http://" + window.location.host.toString() + "/Code9000";
var _setpwd = false;

$(function(){
	$(".npwd").hide();
});

function setNewPassword(){
	if (_setpwd) {
		$(".npwd").hide();
		$("#pwdc").val("Change password");
		_setpwd = false;
	}
	else
	{
		$(".npwd").show();
		$("#pwdc").val("Cancel password change");
		_setpwd = true;
	}
}