$(function(){
	$(".jt-int").live("keyup blur", function(){
		checkNum(this);
	});

	$(".jt-num-scope").live("keyup blur", function(){
		checkNumScope(this);
	});

	$(".jt-str-scope").live("keyup blur", function(){
		checkStrScope(this);
	});
	
	
})

function checkNum(obj){
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
			$(obj).parent().append("<p class=\"help-block\">请输入数字.</p>");
		}
		return false;
	}
}

function checkNumScope(obj) {
    if(checkNum(obj)) {
		var min = $(obj).attr('min');
		if(min != undefined) {
			if(parseInt($(obj).val()) < parseInt(min)) {
				addHelpMsg(obj, "请输入大于" + min + "的数字.");
				return false;
			} else {
				removeHelpMsg(obj);
			}
		}
		var max = $(obj).attr('max');
		if(max != undefined) {
			if(parseInt($(obj).val()) > parseInt(max)) {
				addHelpMsg(obj, "请输入小于" + max + "的数字.");
				return false;
			} else {
				removeHelpMsg(obj);
			}
		}
	}

	return true;
}

function checkStrScope(obj) {
	var min = $(obj).attr('min');
	if(min != undefined) {
		if(parseInt($(obj).val().length) < parseInt(min)) {
			addHelpMsg(obj, "请输入大于" + min + "长度的字符.");
			return false;
		} else {
			removeHelpMsg(obj);
		}
	}
	
	var max = $(obj).attr('max');
	if(max != undefined) {
		if(parseInt($(obj).val().length) > parseInt(max)) {
			addHelpMsg(obj, "请输入小于" + max + "长度的字符.");
			return false;
		} else {
			removeHelpMsg(obj);
		}
	}
	
	return true;
}


function addHelpMsg(obj, message) {
	if(!$(obj).parent().parent().hasClass("has-error")) {
		$(obj).parent().parent().addClass("has-error");
	}
	if($(obj).next().length == 0) {
		$(obj).parent().append("<p class=\"help-block\">"+ message +"</p>");
	}
}

function removeHelpMsg(obj) {
	if($(obj).parent().parent().hasClass("has-error")) {
		$(obj).parent().parent().removeClass("has-error");
	}
	if($(obj).next().length != 0) {
		$(obj).next().remove();
	}
}