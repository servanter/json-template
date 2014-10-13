$(function(){
	$(".jt-int").live("keyup", function(){
		checkInt(this);
	});
	
})

function checkInt(obj){
	var val = $(obj).val();
	var reg = new RegExp("^\\d+$");

	if(reg.test(val)) {
		if($(obj).parent().parent().hasClass("has-error")) {
			$(obj).parent().parent().removeClass("has-error");
		}
		if($(obj).next().length != 0) {
			$(obj).next().remove();
		}
		return true;
	} else {
		if(!$(obj).parent().parent().hasClass("has-error")) {
			$(obj).parent().parent().addClass("has-error");
		}
		if($(obj).next().length == 0) {
			$(obj).parent().append("<p class=\"help-block\">«Î ‰»Î ˝◊÷.</p>");
		}
		return false;
	}
}
