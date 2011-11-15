/**
 * 用户列表
 * 
 * @author HenryYan
 */
$(function() {
	// 自动根据窗口大小改变数据列表大小
	$.common.plugin.jqGrid.autoResize({
		dataGrid: '#list',
		callback: listDatas
	});
	
});

function doselect(){
	var pager=document.getElementById("pager_right");
	pager.innerHTML="<DIV class=ui-paging-info dir=ltr style='TEXT-ALIGN: left'></DIV>";
	setTimeout(writeNewHtml,100);
}

function writeNewHtml(){
	var write=$('.ui-paging-info').html();
	write=IgnoreSpaces(write);
	$('.ui-paging-info').html(write);
}

function IgnoreSpaces(Str){
      var ResultStr = "";
      Temp=Str.split(" "); //双引号之间是个空格；
      for(i = 0; i < Temp.length; i++)
      ResultStr +=Temp[i];
      return ResultStr;
}

var validator;
var moduleAction = "user";
var roleMap = new Map();

/**
 * 加载列表
 * 
 * @return
 */
function listDatas(size) {	
	$.common.plugin.jqGrid.search.text = ['eq', 'cn'];
	
    $("#list").jqGrid(
	$.extend($.common.plugin.jqGrid.settings({size: size}), {
		url: moduleAction + '.action',
		multiselect: true,
		colNames: ['工号', '姓名', '密码', '电子邮件', '部门', '角色', '操作'],
        colModel: [{
            name: 'id',
			width: 50,
			align: 'center',
			editable: true,
			searchoptions : {
    			sopt : $.common.plugin.jqGrid.search.text
    		},
			search: true
        }, {
            name: 'name',
			width: 50,
            align: 'center',
			editable: true,
			edittype: 'text',
			editoptions: {
	        	size :20,
	            maxlength: 50
            },
			searchoptions : {
    			sopt : $.common.plugin.jqGrid.search.text
    		},
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
        },{
            name: 'password',
			hidden: true,
			editable: true,
			edittype: 'password',
			searchoptions : {
    			sopt : $.common.plugin.jqGrid.search.text
    		},
            editoptions: {
	        	size :20,
	            maxlength: 50
            },
			formoptions: {
            	elmsuffix: $.common.plugin.jqGrid.form.must
            }
        }, {
            name: 'email',
			width: 100,
			hidden: true,
            align: 'center',
			editable: true,
            edittype: 'text',
            editoptions: {
                size: 20,
                maxlength: 50
            },           
            searchoptions : {
    			sopt : $.common.plugin.jqGrid.search.text
    		}
        }, {
            name: 'orgName',
            align: 'center',
			editable: false,
			editoptions: {
	            size: 20,
	            maxlength: 50
	        },
			searchoptions : {
    			sopt : $.common.plugin.jqGrid.search.text
    		}
        },  {
            name: 'roleNames',
			index: 'roleNameForFind',
            align: 'center',
			editable: true,
			edittype: 'select',
			editoptions: {
	            dataUrl: moduleAction + '!roleSelect.action',
				buildSelect: function(resp) {
					return "<select>" + resp + "</select>";
				},
				dataInit: function(e) {
					$(e).attr('multiple', 'multiple');
					setTimeout(function() {
						var rowId = $(':input[name=list_id]').val();
						var roleIds = roleMap.get(rowId);
						if (roleIds) {
							$.each(roleIds, function() {
								$('option[value=' + this + ']', e).attr('selected', true);
							});
						}
						$(e).multiselect({
						   height: 100,
						   noneSelectedText: '请选择角色', 
						   selectedText: "已选择 # 个角色"
						});
					}, 20);
				}
	        },
			sortable: false,
			stype: 'select',
			searchoptions : {
				sopt : ['eq'],
				dataUrl: moduleAction + '!roleSelectForSearch.action'
    		},
			formatter: function(cellvalue, options, rowObject) {
				doselect();
				roleMap.put(rowObject.id, rowObject.roleIds);
				return cellvalue;
			}
        }, {
			name: 'options',
			width: 50,
			align: 'center',
			formatter: function(cellvalue, options, rowObject) {
				return "<button class='reset-password ui-button-notext-secondary' rowId='" + options.rowId + "'></button>";
			}
		}],
		caption: "用户管理",
		editurl: moduleAction + '!save.action',
		gridComplete: function() {
			$.common.plugin.jqGrid.gridComplete('list');
			
			$('.reset-password').button({
				icons: { primary: 'ui-icon-carat-2-e-w', secondary: 'ui-icon-person' }
			}).unbind('click').click(resetPassword);
			
		}
	})
	).jqGrid('navGrid', '#pager', $.extend($.common.plugin.jqGrid.pager), 
	// edit options
    $.extend($.common.plugin.jqGrid.form.edit, {
		width : 450,
		editCaption: '修改',
		beforeShowForm: function() {
			commonBeforeShowForm('edit');
		},
    	beforeSubmit: beforeSubmit
	}),
	
	// add options
    $.extend($.common.plugin.jqGrid.form.add, {
		width : 450,
		editCaption: '新增',
		beforeShowForm: function() {
			commonBeforeShowForm('add');
		},
    	beforeSubmit: beforeSubmit
	}), 
	
    // delete options
    $.extend($.common.plugin.jqGrid.form.remove, {
		url: moduleAction + '!delete.action'
	}),
	
	// search optios
	$.extend($.common.plugin.jqGrid.form.search, {
		closeAfterSearch: true
	}), 
	
	// view options
	$.extend($.common.plugin.jqGrid.form.view, {
		beforeShowForm: function(formid) {
    		$.common.plugin.jqGrid.navGrid.showAllField(formid);
	    }
	})).jqGrid('navButtonAdd', '#pager', {
		caption: "转移",
		title: "转移用户",
	   	buttonicon: "ui-icon-transfer-e-w",
	   	onClickButton: showOrgTree
	});
       
}

/**
 * 表单验证
 * 
 * @return
 */
function validatorForm() {
	validator = $("#FrmGrid_list").validate({
        rules: {
			loginName: {
				required: true
			},
			name: {
				required: true
			}
		},
        errorPlacement: $.common.plugin.validator.error,
        success: $.common.plugin.validator.success
    });
}

/**
 * 显示编辑框前
 */
function commonBeforeShowForm(oper) {
	// 注册表单验证事件
    validatorForm();
	$('.CaptionTD').width(70);
	$('#tr_password').show();
	if (oper == 'edit') {
		$('#FrmGrid_list #id').attr('readonly', true);
	} else {
		$('#FrmGrid_list #id').attr('readonly', false);
	}
	$('#FrmGrid_list').animate({
		height: '255px'
	});
}

function beforeSubmit(postdata, formid) {
	var chks = $('#roleNames').multiselect('getChecked');
	var roleIds = "";
	$.each(chks, function(i, v) {
		if (i > 0) {
			roleIds += ',';
		}
		roleIds += this.value;
	});
	postdata.roleNames = null;
	postdata.roleIds = roleIds;
	var valid = $("#FrmGrid_list").valid();
	return [valid, '表单有 ' + validator.numberOfInvalids() + ' 项错误，请检查！'];
}

/**
 * 重置用户密码
 */
function resetPassword() {
	var rowId = $(this).attr('rowId');
	var info = $('#' + rowId + ' td[aria-describedby=list_name]').text() + "|" + $('#' + rowId + ' td[aria-describedby=list_employeeId]').text()
	if (!confirm('确定重置用户[' + info + ']的密码？')) {
		return;
	}
	$.ajax({
		url: ctx + '/account/user!resetPassword.action',
		data: {
			id: rowId
		},
		success: function(resp) {
			if (resp == 'success') {
				alert('用户：[' + info + ']密码已重置！');
			} else {
				alert('密码重置失败：' + e);
			}
		}
	});
}

/**
 * 部门树
 */
function showOrgTree() {
	var userIds = $.common.plugin.jqGrid.checkbox.convertToString('#list');
	if (userIds == '') {
		alert('请先选择用户！');
		return;
	}
	selectOrg = {
		orgId : '',
		orgName : '',
		orgParentName : ''
	};
	$('#orgTreeTemplate').dialog({
		modal: true,
		height: document.documentElement.clientHeight - 15,
		buttons: [{
			text: '确定',
			click: function() {
				var dialog = this;
				if (selectOrg.orgId == '') {
					alert('请选择部门！');
					return;
				} else {
					var fullOrgName = selectOrg.orgParentName;
					fullOrgName = fullOrgName == 'null' ? '' : fullOrgName; 
					if (fullOrgName != '') {
						 fullOrgName += "/";
					}
					fullOrgName += selectOrg.orgName;
					if (confirm('确定要将用户：[' + userIds + ']转移到部门：[' + fullOrgName + ']吗？')) {
						$.post(ctx + '/account/user!moveUserToOrg.action', {
							orgId: selectOrg.orgId,
							userIds: userIds
						}, function(resp) {
							if (resp == 'success') {
								$(dialog).dialog('close');
								var userIdsArray = userIds.split(',');
								$.each(userIdsArray, function() {
									$('#list').jqGrid('setCell', this, 'orgName', fullOrgName);
								});
							} else {
								alert('迁移失败，消息：' + resp);
							}
						});
					}
				}
			}
		}, {
			text: '取消',
			click: function() {
				$(this).dialog('close');
			}
		}]
	});
}
