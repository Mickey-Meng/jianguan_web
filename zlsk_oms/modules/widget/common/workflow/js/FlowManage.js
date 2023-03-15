$('#mytab').bootstrapTable({
	method : 'get',
	url : ServerUrl+"getAllWorkFlow",//请求路径
	striped : true, //是否显示行间隔色
	pageNumber : 1, //初始化加载第一页
	pagination : true,//是否分页
	sidePagination : 'client',//server:服务器端分页|client：前端分页
	pageSize : 10,//单页记录数
	pageList : [ 5, 10, 20, 30 ],//可选择单页记录数
	// showRefresh : true,//刷新按钮
	queryParams : function(params) {//上传服务器的参数
		var temp = {//如果是在服务器端实现分页，limit、offset这两个参数是必须的
			limit : params.limit, // 每页显示数量
			offset : params.offset
			 , // SQL语句起始索引
			page : (params.offset / params.limit) + 1, //当前页码

			// Name : $('#search_name').val(),
			// Tel : $('#search_tel').val()
		};
		return temp;
	},
	responseHandler:function(data){
		//在ajax获取到数据，渲染表格之前，修改数据源
		return data.data;
		},
	columns : [
		 {
		title : 'ID',
		field : 'ID',
		// sortable : true,
		formatter: function (value, row, index) {
			return row.flow.ID;
		}
	}, {
		title : '流程名称',
		field : 'NAME',
		formatter: function (value, row, index) {
			return row.flow.NAME;
		}
	}, {
		title : '添加时间',
		field : 'STTIME',
		formatter: function (value, row, index) {
			return row.flow.STTIME;
		}
	},
	 {
		title : '操作',
		field : 'id',
		formatter : operation,//对资源进行操作
	}]
})

//value代表该列的值，row代表当前对象
function formatSex(value, row, index) {
	return value == 1 ? "男" : "女";
	//或者 return row.sex == 1 ? "男" : "女";
}

//删除、编辑操作
function operation(value, row, index) {
	var htm = "<button class=\"btn btn-link\" onclick=SetFlow("+row.flow.ID+")>编辑</button>"
	+"<button class=\"btn btn-link\" onclick=FlowDesign("+row.flow.ID+")>流程设计</button>"
	+"<button class=\"btn btn-link\" onclick=DeleteFlow("+row.flow.ID+")>删除</button>"
	return htm;
}

//查询按钮事件
$('#search_btn').click(function() {
	$('#mytab').bootstrapTable('refresh', {
		url : ServerUrl+"getAllWorkFlow"
	});
})

$("#AddFlow").click(function(){
    location.href = 'FlowSet.html';
})

function FlowDesign(intFlowId){
	// window.open("FlowDesign.html?FlowId="+intFlowId)；
	window.parent.addTab('流程节点','nodes','/modules/widget/common/Flowdesign/FlowDesign.html?FlowId='+intFlowId,true);
}

function SetFlow(intFlowId){
	location.href="FlowSet.html?FlowId="+intFlowId;
}

function DeleteFlow(intFlowId){
  var bool = window.confirm("确定要删除该流程？")
  if (bool) {
	$.get(ServerUrl+"deleteFlow",{"id":intFlowId},function(result){
		console.log(result);
		if (result.meow == 0) {
			$('#mytab').bootstrapTable('refresh', {
				url : ServerUrl+"getAllWorkFlow"
			});
		}
	})
  }



}



