/**
 * analysis schema
 */

function analysis(schema, _dis) {
	var template = eval("("+schema+")");
	console.log(template);
	var title = template.title;                // title
	var description = template.description;    // description
	var properties = template.properties;
	var array = new Array();
	var htmlText = "<form class=\"form-horizontal\" role=\"form\">";
	$.each(properties, function(index, item){
		var _tem = json2Template(index, item);
		array.push(_tem);
		htmlText += addStartAndEnd(index, template2Html(_tem));
	});
	htmlText += "</form>";
	
	$("#div1").html(htmlText);
	$("#div1").attr('style', 'width:500px');
}

/**
 * json to template
 */
function json2Template(alias, entity) {
	console.log(entity);
	var template = new Object();
	template.type = entity.type;
	template.properties = entity.properties;
	template.name = alias;
	template.default = entity.default;
	template.enum = entity.enum;
	return template;
}

/**
 * template to html
 */
function template2Html(template) {
	var name = template.name;
	var type = template.type;
	//var text = "<div class=\"form-group\">\r\n"
	//text += "<label for=\""+ name +"\" class=\"col-sm-2 control-label\">" + name + "</label>\r\n";
	//text += "<div class=\"col-sm-10\">\r\n";
	var text = "";
	if(template.type == 'string' || template.type == 'integer') {
		if(template.enum == undefined) {
			text += "<input type=\"text\" class=\"form-control\" id=\"" + name + "\"";
			if(template.default != undefined && template.default != 'undefined') {
				text += "placeholder=\"" + template.default + "\">\r\n";
			} else {
				text += ">\r\n";
			}
		} else {
			text += "<select class=\"form-control\" name=\"" + name + "\">";
			$.each(template.enum, function(index, item){
				text += "<option value=\"" + item + "\">" + item + "</option>";
			});
			text += "</select>";
		}
	} else if(template.type == 'array'){
		text += "<table class=\"table table-bordered\">\r\n";
		text += "<thead>\r\n";
		text += "<tr>\r\n";
		var hasSigned = false;
		$.each(template.properties, function(title, item){
			text += "<th>" + title + "</th>";
			if(!hasSigned && item.enum != undefined) {
				hasSigned = true;	
			}
		});
		text += "</tr>\r\n";
		text += "</thead>\r\n";
		text += "<tbody>\r\n";
		var innerText = "";
		if(hasSigned) {
			innerText += "<tr>\r\n";
			$.each(template.properties, function(title, item){
				if(item.enum != undefined) {
					innerText += "<td><select class=\"form-control\" name=\"" + name + "\">";

					$.each(item.enum, function(index, item){
						innerText += "<option value=\"" + item + "\">" + item + "</option>";
					});
					innerText += "</select></td>\r\n";
				} else {
					innerText += "<td><input type=\"text\" class=\"form-control\" name=\""+ title +"\"";
					if(item.default != undefined && item.default != 'undefined') {
						innerText += "placeholder=\"" + item.default + "\">\r\n";
					} else {
						innerText += ">\r\n";
					}
					innerText += "</td>\r\n";
				}
				
			});
			innerText += "</tr>\r\n";
		} else {
			$.each(template.properties, function(title, item){
				innerText += "<td><input type=\"text\" class=\"form-control\" name=\""+ title +"\"";
				if(item.default != undefined && item.default != 'undefined') {
					innerText += "placeholder=\"" + item.default + "\">\r\n";
				} else {
					innerText += ">\r\n";
				}
				innerText += "</td>\r\n";
			});
			innerText += "</tr>\r\n";
		}
		text += innerText;
		text += "</tr>";
		text += "</tbody>\r\n";
		text += "</table>\r\n";
	} else if(template.type == 'object') {
		var floorDiv = "";
		$.each(template.properties, function(title, item){
			var floor = template2Html(json2Template(title, item));
			console.log(floor);
			floorDiv += addFloor(title, floor);
			//console.log(floorDiv);
		});
		text += addFloorStartAndEnd(floorDiv);
	}
	
	//text += "</div>\r\n</div>\r\n";
	return text;
}

function addStartAndEnd(name, str) {
	var text = "<div class=\"form-group\">\r\n"
	text += "<label for=\""+ name +"\" class=\"col-sm-2 control-label\">" + name + "</label>\r\n";
	text += "<div class=\"col-sm-10\">\r\n";
	text += str;
	text += "</div>\r\n</div>\r\n";
	return text;
}

function addFloor(title, text) {
	var result = "";
	result += "<div class=\"row-fluid\">\r\n";
	result += "<div class=\"span12\">\r\n";
	result += "<div class=\"control-group\">\r\n";
	result += "<label class=\"control-label\" style=\"display: inline-block; font-weight: bold;\">" + title + "</label>\r\n";
	result += "<div class=\"controls\">\r\n";
	result += text;
	result += "</div>\r\n";
	result += "</div>\r\n";
	result += "</div>\r\n";
	result += "</div>\r\n";
	return result;
}

function addFloorStartAndEnd(middle) {
	var text = "";
	text += "<div class=\"well well-small\">\r\n";
	text += "<div class=\"container-fluid\">\r\n";
	text += "<div>\r\n";
	text += middle;
	text += "</div>\r\n";
	text += "</div>\r\n";
	text += "</div>\r\n";
	return text;
}

