<h1>JSON TEMPLATE 可视化配置工具</h1>
<h2>为什么做JSON TEMPLATE</h2>

<p>
  &nbsp;&nbsp;前端组件越来越多，组件的配置一般都是JSON格式的。有些面向用户展示的组件，很多时候运营人员是要修改配置的的，但是把代码暴漏给运营人员是相当不靠谱的，无论是json还是html。一直想有个工具，可以直接按照一定格式，生成一套html的表单，运营人员通过修改表单的值，来修改json中的内容。之前搜索过很多json编辑器，但是对json不熟悉的人，使用成本略高。于是就做了这个JSON TEMPLATE，可以直接把按照模版，生成一套html表单，然后按照模版定义的格式，转换成JSON。
</p>
<h2>JSON TEMPLATE 可以做什么</h2>
<p>
	<ul>
		<li>不侵入后端逻辑，改造需要手写json的后端管理系统，也可搭配template工具改造填写html版的后端管理系统。编写组件demo配置页面，让用户自己动手修改组件的展示。</li>
		<li>可以做到前后端数据分离，HTML页面只需要解析生成的JSON来用作页面显示。</li>
	</ul>
</p>
<h2>JSON TEMPLATE 快速入门</h2>
<h3>
  数据类型
</h3>
<ul>
	<li>object</li>
	<li>string</li>
	<li>integer</li>
	<li>array</li>
</ul>
<h4>object</h4>
<p>
	&nbsp;&nbsp;如果此属性为object, 则该属性有子属性, 该属性为json object, 必须要有properties属性. 例如: 
	<pre>
		{
		    "location": {
		        "type": "object",
		        "properties": {
		            "city": {
		                "type": "string"
		            }
		        }
		    }
		}
	</pre>
</p>
<h4>string</h4>
<p>
	&nbsp;&nbsp;如果此属性为string, 则该属性为单纯的input标签. 例如: 
	<pre>
		{
		    "city": {
		        "type": "string"
		    }
		}
	</pre>
</p>
<h4>integer</h4>
<p>
	&nbsp;&nbsp;如果此属性为integer, 则该属性为单纯的input标签并带有检验数字类型. 例如: 
	<pre>
		{
		    "city": {
		        "type": "integer"
		    }
		}
	</pre>
</p>
<h4>array</h4>
<p>
	&nbsp;&nbsp;如果此属性为array, 则该属性为表格, 表格的"头"(th)为properties中的元素. 例如: 
	<pre>
		{
		    "pets": {
		        "type": "array",
		        "properties": {
		            "animal": {
		                "type:": "string",
		                "default": "your animal name"
		            },
		            "category": {
		                "type": "string",
		                "enum": [
		                    "dog",
		                    "cat"
		                ]
		            }
		        }
		    }
		}
	
	</pre>
	anaimal与category为th. 生成的字符串为json array.
</p>
<h3>
  属性
</h3>
<ul>
	<li>type</li>
	<li>enum</li>
	<li>default</li>
</ul>
<h4>type</h4>
<p>
	&nbsp;&nbsp;标识该属性类型.
</p>
<h4>enum</h4>
<p>
	&nbsp;&nbsp;标识该属性为select下拉框, enum中为每一个option. 例如:
	<pre>
		{
		    "gender": {
		        "type": "string",
		        "enum": [
		            "man",
		            "woman"
		        ]
		    }
		}
	</pre>
</p>
<h4>default</h4>
<p>
	&nbsp;&nbsp;标识此属性default值. 例如:
	<pre>
		{
		    "city": {
		        "type": "string",
		        "default": "Bei jing"
		    }
		}
	</pre>
</p>

<p><b>To be continued...</b></p>
