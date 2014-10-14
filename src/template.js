$(function(){
	$('#genBtn').click(function(){
		
		generateJSON($('#div1'));
	});

	$('.jt-btn-add').live('click', function(){
		arrayAdd(this);
	});
	$('.jt-btn-del-last').live('click', function(){
		arrayDelLast(this);
	});
});

function arrayAdd(obj) {
	var row = $(obj).parent().prev().find('tbody>tr')[0];
	var text = '<tr>' + $(row).html() + '</tr>';
	var tableBody = $(obj).parent().prev().find('tbody');
	tableBody.append(text);
	if($(obj).next().hasClass('disabled')) {
		$(obj).next().toggleClass('disabled');
	}
}

function arrayDelLast(obj) {
	var row = $(obj).parent().prev().find('tbody>tr');
	row[row.length - 1].remove();
	var row = $(obj).parent().prev().find('tbody>tr');
	if(row == undefined || row.length == 0 || row.length == 1) {
		$(obj).toggleClass('disabled');
	}
}

/**
 * analysis schema
 */
function analysis(schema, _dis) {
	var template = eval("("+schema+")");
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
	$("#div1").attr('style', 'width:700px');
}

/**
 * json to template
 */
function json2Template(alias, entity) {
	var template = new Object();
	template.type = entity.type;
	template.properties = entity.properties;
	template.name = alias;
	template.default = entity.default;
	template.enum = entity.enum;
	template.min = entity.min;
	template.max = entity.max;
	return template;
}

/**
 * template to html
 */
function template2Html(template) {
	var name = template.name;
	var type = template.type;
	var text = "";
	if(template.type == 'string' || template.type == 'integer') {
		if(template.enum == undefined) {
			text += addWidget(template);
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
					innerText += "<td><select class=\"form-control\" name=\"" + title + "\">";

					$.each(item.enum, function(index, item){
						innerText += "<option value=\"" + item + "\">" + item + "</option>";
					});
					innerText += "</select></td>\r\n";
				} else {
					innerText += "<td>";
					innerText += addWidget(item);
					innerText += "</td>\r\n";
				}
				
			});
			innerText += "</tr>\r\n";
		} else {
			$.each(template.properties, function(title, item){
				innerText += "<td>";
				innerText += addWidget(item);
				innerText += "</td>\r\n";
			});
			innerText += "</tr>\r\n";
		}
		text += innerText;
		text += "</tr>";
		text += "</tbody>\r\n";
		text += "</table>\r\n";
		text += '<p><button type="button" class="jt-btn-add btn btn-success"><i class="glyphicon glyphicon-plus"></i> Add</button>&nbsp;&nbsp;&nbsp;<button type="button" class="jt-btn-del-last btn btn-danger disabled"><i class="glyphicon glyphicon-remove"></i> Del last</button></p>'
	} else if(template.type == 'object') {
		var floorDiv = "";
		$.each(template.properties, function(title, item){
			var floor = template2Html(json2Template(title, item));
			floorDiv += addFloor(title, floor);
		});
		text += addFloorStartAndEnd(floorDiv);
	}
	
	
	return text;
}

function addWidget(template) {
	var name = template.name;
	var extraText = "";
	var text = "";
	var cls = "form-control";
	if(template.type == 'integer') {
		cls += " jt-int";
		if(template.min != undefined || template.max != undefined) {
			cls += " jt-num-scope";
			if(template.min != undefined) {
				extraText += ' min="'+ template.min +'"';
			}
			if(template.max != undefined) {
				extraText += ' max="'+ template.max +'"';
			}
		}
		
	} else {
		if(template.min != undefined || template.max != undefined) {
			cls += " jt-str-scope";
			if(template.min != undefined) {
				extraText += ' min="'+ template.min +'"';
			}
			if(template.max != undefined) {
				extraText += ' max="'+ template.max +'"';
			}
		}
	}


	text += "<input type=\"text\" class=\""+ cls + "\" id=\"" + name + "\" name=\"" + name + "\"";
	if(template.default != undefined && template.default != 'undefined') {
		text += "placeholder=\"" + template.default + "\"";
	}
	text += extraText;
	text += ">\r\n";
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

var floorSize = 0;
function addFloorStartAndEnd(middle) {
	var text = "";
	if(floorSize % 2 == 0) {
		
		// change the bg color
		text += "<div class=\"well well-small jt-bg-white\">\r\n";
	} else {
		text += "<div class=\"well well-small\">\r\n";
	}
	
	text += "<div class=\"container-fluid\">\r\n";
	text += "<div>\r\n";
	text += middle;
	text += "</div>\r\n";
	text += "</div>\r\n";
	text += "</div>\r\n";
	floorSize++;
	return text;
}

function generateJSON(obj){
	var intWidgets = $(".jt-int");
	var intScopes = $(".jt-num-scope");
	var strScopes = $(".jt-str-scope");
	var resultArr = new Array();
	$.each(intWidgets, function(index, item){
		resultArr.push(checkNum(item));
	}); 

	$.each(intScopes, function(index, item){
		resultArr.push(checkNumScope(item));
	});
	$.each(strScopes, function(index, item){
		resultArr.push(checkStrScope(item));
	});

	var resultStr = resultArr.join(",");
	if(resultStr.indexOf("false") < 0) {
		var result = '';
		var formGroups = $(obj).find('.form-group');
		$.each(formGroups, function(index, item){
			result = generateFloorJSON(result, item);
		});
		if(result.substring(result.length - 1) == ',') {
			result = result.substring(0, result.length - 1);
		}
		result = '{' + result + '}';
		$(resText).text(result);
		console.log(result);
	}

}

function generateFloorJSON(str, item) {
	var result = str;
	var floor = $(item).find('.col-sm-10>.well>.container-fluid>div>.row-fluid');
	var allFloor = $(item).find('.well>.container-fluid>div>.row-fluid');
	var floors = new Array();
	if(allFloor != undefined && allFloor.length > 0) {
		var f = allFloor[0];
		floors.push(f);
		
		while($(f).next() != undefined && $(f).next().length != 0) {
			f = $(f).next()[0];
			floors.push(f);
			
		}
	}
	allFloor = floors;
	var needEnd = 0;
	if((floor != undefined && floor.length > 0) || (allFloor != undefined && allFloor.length > 0)) {
		var isInnerFloor = false;
		if(floor == undefined || floor.length == 0) {
			floor = allFloor;
			isInnerFloor = true;
		}
		// nesting form
		
		$.each(floor, function(index, everyFloor){
			
			var label = $($(item).find('.control-label')[0]).text();
			var innerInFloor = $(item).find('.well>.container-fluid>div>.row-fluid');
			if(index != 0 && allFloor.length > 0) {
				label = $($(everyFloor).find('.control-label')[0]).text();
				innerInFloor = $(everyFloor).find('.well>.container-fluid>div>.row-fluid');
			}
			console.log(result);
			if(isInnerFloor) {
				
				// not need to add the outer label
				
				if(innerInFloor == undefined || innerInFloor.length == 0) {
					result = generateFloorJSON(result, everyFloor);
					
					// jedge if has next node
					var nextNode = $(everyFloor).next();
					if(nextNode == undefined || nextNode.length == 0) {
						if(result.substring(result.length - 1) == ',') {
							result = result.substring(0, result.length - 1);
						}
						result += '}';

						// jedge parent has next node
						
					} else {
						if(result.substring(result.length - 1) != ',') {
							result += ",";
						}
					}
					console.log("inner false======" + result);
				} else {
					result = generateFloorJSON(result + '"' + label + '":{', everyFloor);
					var nextNode = $(everyFloor).next();
					if(nextNode == undefined || nextNode.length == 0) {
						if(result.substring(result.length - 1) == ',') {
							result = result.substring(0, result.length - 1);
						}
						result += '}';
					} else {
						if(result.substring(result.length - 1) != ',') {
							result += ",";
						}
						
					}
					console.log("inner true======" + result);
				}
				

			} else {

				// need to add outer label
				
				if(innerInFloor == undefined || innerInFloor.length == 0) {
					result = generateFloorJSON(result, everyFloor);
					var nextNode = $(everyFloor).next();
					if(nextNode == undefined || nextNode.length == 0) {
						if(result.substring(result.length - 1) == ',') {
							result = result.substring(0, result.length - 1);
						}
					} else {
						if(result.substring(result.length - 1) != ',') {
							result += ",";
						}
					}

					console.log("outer false======" + result);
				} else {
					result = generateFloorJSON(result + '"' + label + '":{', everyFloor);
					var nextNode = $(everyFloor).next();
					if(nextNode == undefined || nextNode.length == 0) {
						if(result.substring(result.length - 1) == ',') {
							result = result.substring(0, result.length - 1);
						}
						
					} else {
						if(result.substring(result.length - 1) != ',') {
							result += ",";
							needEnd++;
						}
					}
					console.log("outer true======" + result);
				}
			}
			
			
			
		});
		if(needEnd > 0) {
			console.log(needEnd);
			for(var i = 0; i < needEnd; i++) {
				result += '}';
			}
		}
		
		
	} else {

		// array
		if($(item).find('table') != undefined && $(item).find('table').length > 0) {
			var ths = $(item).find('table').find('th');
			var titles = new Array();
			$.each(ths, function(index, item){
				titles.push($(item).text());
			});

			var label = $(item).find('.control-label');
			var labelVal = $(label[0]).text();
			var values = $(item).find('table').find('.form-control');
			var arr = '';
			var text = '';
			$.each(values, function(index, item){
				var i = index % titles.length;
				text += generateJSONStr(titles[i], $(item).val());
				
				if((index + 1) % titles.length == 0 || index + 1 == values.length) {
					if(text.substring(text.length - 1) == ',') {
						text = text.substring(0, text.length - 1);
					}
					text = '{' + text + '},';
					arr += text;
					text = '';
				}
			});
			if(arr.substring(arr.length - 1) == ',') {
				arr = arr.substring(0, arr.length - 1);
			}
			arr = '[' + arr + ']';
			if(result.substring(result.length - 1) != ',') {
				result += ",";
			}
			result += generateArrayJSONStr(labelVal, arr);
			
		} else {
			
			// simple input
			$.each($(item).find('.form-control'), function(index, item2){
				result += generateJSONStr($(item2).attr('name'), $(item2).val());
			});
		}
		
	}

	return result;
}

function generateJSONStr(key, value){
	return '"'+ key +'":"' + value+ '",';
}

function generateArrayJSONStr(key, value) {
	return '"'+ key +'":' + value+ ',';
}

function activeGenBtn() {
	$("#genBtn").removeClass("disabled");
}