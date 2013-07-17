function htmlEncode(value){
	return $('<div/>').text(value).html().replace("'", "&#39;");
}