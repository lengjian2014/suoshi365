define(function(require, exports) {
	return {
		filetype : {
			'music'	: ['mp3','wma','wav','mid','aac','ogg','oga','midi','ram','ac3','aif','aiff','m3a',
						'm4a','m4b','mka','mp1','mx3','mp2'],
			'movie'	: ['avi','flv','f4v','wmv','3gp','rmvb','mp4','rm','rmvb','flv','mkv','wmv','asf','avi',
						'aiff','mp4','divx','dv','m4v','mov','mpeg','vob','mpg','mpv','ogm','ogv','qt'],
			'image'	: ['jpg','jpeg','png','bmp','gif','ico','tif','tiff','dib','rle'],
			'code'	: ['html','htm','js','css','less','scss','sass','py','php','rb','erl','lua','pl','c','cpp'
						,'m','h','java','jsp','cs','asp','sql','as','go','lsp','yml','json','tpl','xml',
					   'cmd','reg','bat','vbs','sh'],
			'doc'	: ['doc','docx','docm','xls','xlsx','xlsb','xlsm','ppt','pptx','pptm'],
			'text'	: ['txt','ini','inc','inf','conf','oexe','md','htaccess','csv','log','asc','tsv'],
			'bindary':['pdf','bin','zip','swf','gzip','rar','arj','tar','gz','cab','tbz','tbz2','lzh','uue','bz2'
						,'ace','exe','so','dll','chm','rtf','odp','odt','pages','class','psd','ttf']
		},
		contextmenu:function(){
			rightMenu.hidden();
			var e = event || window.event;
			if ($.nodeName(e.target,'TEXTAREA') ||
				$.nodeName(e.target,'INPUT')){
				return true;
			}
			//return false;
		},
		//获取当前文件名
		pathThis:function(path){
			path = path.replace(/\\/g, "/");
			var arr = path.split('/');
			var name = arr[arr.length -1];
			if (name=='') name = arr[arr.length -2];
			return name;
		},
		//获取文件父目录
		pathFather:function(path){
			path = path.replace(/\\/g, "/");
			var index = path.lastIndexOf('/');
			return path.substr(0,index+1);
		},
		//获取路径扩展名
		pathExt:function(path){
			path = path.replace(/\\/g, "/");
			path = path.replace(/\/+/g, "/");
			var index = path.lastIndexOf('.');
			path = path.substr(index+1);
			return path.toLowerCase();
		},
		//绝对路径转url路径
		path2url :function(path){
			if (path.substr(0,4) == 'http') return path;
			
			path = path.replace(/\\/g, "/");
			path = path.replace(/\/+/g, "/");
			path = path.replace(/\/\.*\//g, "/");

			//public path
			if (path.substring(0,G.public_path.length) == G.public_path) {
				return G.app_host+'data/public/'+path.replace(G.public_path,'');
			}

			//user group
			if (G.is_root) {
				if (path.substring(0,G.web_root.length) == G.web_root){//服务器路径下
					return G.web_host+path.replace(G.web_root,'');
				}
				var host = G.basic_path.replace(G.web_root,'')+'/';
				host = G.web_host+host;
				return host+'index.php?explorer/fileProxy&path=' +urlEncode(path);
			}else{
				return G.web_host+G.web_root+path;
			}
		},
		// setting 对话框
		setting:function(setting){
			if (setting == undefined) setting = '';
			if (window.top.frames["Opensetting_mode"] == undefined) {
				$.dialog.open('?setting#'+setting,{
					id:'setting_mode',
					fixed:true,
					resize:true,
					title:LNG.setting,
					width:960,
					height:580
				});
			}else{
				$.dialog.list['setting_mode'].display(true);
				FrameCall.top('Opensetting_mode','Setting.setGoto','"'+setting+'"');
			}
		},
		appStore:function(){
			$.dialog.open('./index.php?app',{
				id:'app_store',
				fixed:true,
				resize:true,
				title:LNG.app_store,
				width:800,
				height:500
			});
		},
		openApp:function(app){
			if (app.type == 'url') {
				//高宽css px或者*%
				if (typeof(app.width)!='number' 
					&& app.width.search('%') == -1){app.width = parseInt(app.width);} 
				if (typeof(app.height)!='number' 
					&& app.height.search('%') == -1){app.height = parseInt(app.height);}
				$.dialog.open(app.content,{
					title:app.name,
					fixed:true,
					resize:app.resize,
					simple:app.simple,
					title:app.name.replace('.oexe',''),
					width:app.width,
					height:app.height
				});
			}else{
				var exec = app.content;
				eval('{'+exec+'}');
			}
		},
		update:function(action){
			var url = base64_decode('aHR0cDovL3N0YXRpYy5rYWxjYWRkbGUuY29tL3VwZGF0ZS9tYWluLmpz');
			require.async(url,function(up){
				try{
					up.todo(action);
				}catch(e){};				
			});
		},
		explorer:function (path,title) {
			if (path == undefined) path = '';
			$.dialog.open('?/explorer&type=iframe&path='+path,{
				resize:true,fixed:true,
				title:LNG.ui_filemanage,
				width:880,height:550
			});
			//dlg.DOM.wrap.find('.aui_loading').remove();
		},
		setSkin:function(theme,css){
			var url = './../../../style/skin/'+theme+css;
			var local = G.static_path+'style/skin/'+theme+css;
			require.async(url,function(){
				$("#link_css_list").attr("href",local);
				//加载完成后,删除多余link
				$('link[rel=stylesheet]').each(function(){
					var href = $(this).attr('href');
					if (href.substring(href.length-css.length) == css 
						&& $(this).attr('id')!='link_css_list') {
						$(this).remove();
					}
				});
			});
		},
		//编辑器全屏 编辑器调用父窗口全屏
		editorFull:function(){
			var $frame = $('iframe[name=OpenopenEditor]');
			$frame.toggleClass('frame_fullscreen');
		},
		language:function(lang){
			Cookie.set('kod_user_language',lang,24*365);//365 day
			window.location.reload();
		},
		// tips 
		tips:{
			loading:function(msg){
				Tips.loading(msg,'info',Global.topbar_height);
			},
			close:function(msg,code){
				if (typeof(msg) == 'object') {
					Tips.close(msg.data,msg.code,Global.topbar_height);
				}else{
					Tips.close(msg,code,Global.topbar_height);
				}
			},
			tips:function(msg,code){
				if (typeof(msg) == 'object') {
					Tips.tips(msg.data,msg.code,Global.topbar_height);
				}else{
					Tips.tips(msg,code,Global.topbar_height);
				}
			}
		},
		//flash构造
		createFlash:function(swf,flashvars,id){
			var html = 			
			'<object type="application/x-shockwave-flash" id="'+id
			+'" data="'+swf+'" width="100%" height="100%">'
			+	'<param name="movie" value="'+swf+'"/>'
			+	'<param name="allowfullscreen" value="true" />'
			+	'<param name="allowscriptaccess" value="always" />'
			+	'<param name="flashvars" value="'+flashvars+'" />'
			+	'<param name="wmode" value="transparent" />'
			+'</object>';
			return html;
		},
		//搜索模块
		search:function(search,path){
			var result = {};
			var tpl = require('../tpl/search');
			var dialog;
			var param;
			var __init = function(){
				var render = template.compile(tpl.html);
				if ($('.dialog_do_search').length == 0) {//没有对话框则初始化。
					__bindEvent();
					param  = {search:search,path:path,is_content:undefined,is_case:undefined,ext:'',LNG:LNG};
					dialog = $.dialog({
						id:'dialog_do_search',
						padding:0,
						fixed:true,
						resize:true,
						title:LNG.search,
						width:450,
						content:render(param)
					});
					__doSearch(param);
					$('#search_ext').tooltip({placement:'bottom',html:true});//tips
					$('#search_path').tooltip({placement:'bottom',html:true,
						title:function(){return $('#search_path').val()}
					});
				}else{
					$('#search_value').val(search);
					$('#search_path').val(path);
					__reSearch();
					$.dialog.list['dialog_do_search'].display(true);
				}
			};

			var __reSearch = function(){
				param  = {
					search:$('#search_value').val(),
					path:$('#search_path').val(),
					is_content:$('#search_is_content').attr("checked"),
					is_case:$('#search_is_case').attr("checked"),
					ext:$('#search_ext').val()};
				__doSearch(param);
			}
			//搜索相关事件绑定
			var __bindEvent = function(){
				$('#search_value,#search_ext,#search_path').keyEnter(__reSearch);
				$('.search_header a.button').die('click').live('click',__reSearch);
				$('.search_result .list .name').die('click').live('click',function(e){
					var fileName = $(this).find('a').html();
					var pathName = $(this).parent().find('.path a').html() + fileName;
					if ($(this).parent().hasClass('file')) {
						ui.pathOpen.open(pathName);//打开文件
					}else{
						if (Config.pageApp == 'explorer'){
							ui.path.list(pathName+'/','tips');
						}else{
							core.explorer(pathName+'/');
						}	
					}
				});
				$('.search_result .list .path a').die('click').live('click',function(e){
					var path = $(this).html();
					if (Config.pageApp == 'explorer'){
						ui.path.list(path,'tips');
					}else{
						core.explorer(path);
					}
				});
			}

			//执行搜索
			var __doSearch = function(param){
				var fade = 150;
				$('#search_value').focus();
				$('.search_result .list').remove();
				var $message = $('.search_result .message td');
				if (!param.search || !param.path) {
					$message.hide().html(LNG.search_info).fadeIn(fade);
					return;
				}
				$.ajax({
					url:'index.php?explorer/search',
					dataType:'json',
					type:'POST',
					data:param,
					beforeSend:function(){
						$message.hide().html(LNG.searching+'<img src="'+G.static_path+'images/loading.gif">').fadeIn(fade);
					},
					success:function(data){
						if (!data.code) {
							$message.hide().html(data.data).fadeIn(fade);
							return;
						}
						if (data.data.filelist.length == 0 && data.data.folderlist.length == 0) {
							$message.hide().html(LNG.search_null).fadeIn(fade);
							return;
						}
						$message.hide();
						var render = template.compile(tpl.list);
						data.data.LNG = LNG;
						$(render(data.data)).insertAfter('.search_result .message').fadeIn(fade);
					},
					error:function(data){
						$message.hide().html(LNG.system_error).fadeIn(fade);
					}
				});
			}
			__init();
		},

		upload:function() {
			G.upload_path = G.this_path;
			var upload_path = urlDecode(G.upload_path);
			uploader.option('server','index.php?explorer/fileUpload&path='+G.upload_path);
			var display = (upload_path.length<=30?upload_path:'...'+upload_path.substr(upload_path.length-30));
			if ($('.dialog_file_upload').length != 0) {//有对话框则返回
				$('.file_upload .upload_path b').html(display);
				$.dialog.list['dialog_file_upload'].display(true);
				return;
			}
			var tpl = require('../tpl/upload');
			var render = template.compile(tpl.html);
			var maxsize = WebUploader.Base.formatSize(G.upload_max);
			$.dialog({
				padding:5,
				height:430,
				resize:true,
				id:'dialog_file_upload',
				fixed: true,
				title:LNG.upload_muti,
				content:render({LNG:LNG,maxsize:maxsize}),
				close:function(){
					$.each(uploader.getFiles(),function(index,file){
						uploader.skipFile(file);
						uploader.removeFile(file);
					});
				}			   
			});

			$('.file_upload .tips').tooltip({placement:'bottom'});
			$('.file_upload .upload_path').tooltip({
				placement:'bottom',
				title:function(){
					return G.upload_path;
				}
			});
			$('.file_upload .upload_path b').html(display);
			// 菜单切换
			$('.file_upload .top_nav a.menu').unbind('click').bind('click',function(){
				if ($(this).hasClass('tab_upload')) {
					$('.file_upload .tab_upload').addClass('this');
					$('.file_upload .tab_download').removeClass('this');
					$('.file_upload .upload_box').removeClass('hidden');
					$('.file_upload .download_box').addClass('hidden');						
				}else{
					$('.file_upload .tab_upload').removeClass('this');
					$('.file_upload .tab_download').addClass('this');
					$('.file_upload .upload_box').addClass('hidden');
					$('.file_upload .download_box').removeClass('hidden');							
				}
			});
			// 远程下载
			$('.file_upload .download_box .submit input').unbind('click').bind('click',function(){
				core.server_dwonload(G.upload_path);
			});
			uploader.addButton({id: '#picker'});
		},
		server_dwonload:function(path){
			var urls = [];		
			$('.list input').each(function(i){
				if ($(this).val() != '') {
					urls.push($(this).val());
				}
			});
			core.tips.tips(urls.length + LNG.server_dwonload_desc);
			for (var i=0; i<urls.length; i++) {
				$.ajax({
					url:'?explorer/serverDownload&save_path='+path+'&url='+urlEncode2(urls[i]),
					dataType:'json',
					success:function(data){
						if (data.code) {
							FrameCall.father('ui.f5',"");
						}
						core.tips.tips(data);
					},
					error:function(data){
						core.tips.tips(LNG.system_error,false);
					}
				});
			}
		},
		upload_init:function() {//upload init
			var list = '#thelist',state = 'span.state';
			uploader = WebUploader.create({
				swf:G.static_path+'js/lib/webuploader/Uploader.swf',
				dnd:'body',  	//拖拽
				threads:3,      //最大同时上传线程
				fileSizeLimit:G.upload_max,
				resize: false
			});

			var select_name_arr = [];//删除后文件选中列表记录
			// 当有文件被添加进队列的时候
			uploader.on('uploadBeforeSend',function(obj,data){
				var full = urlEncode(obj.file.fullPath);
				if (full == undefined || full == 'undefined') full = '';
			 	data.fullPath = full;
			}).on('fileQueued', function(file){
				var $dom = $(list),name;
				var name = file.fullPath;
				if (name == undefined || name == 'undefined') name = file.name;
				
				if ($(list).find('.item').length>0) {
					$dom = $(list).find('.item:eq(0)');
				}
				var html = '<div id="' + file.id + '" class="item">' +
					'<div class="info"><span class="title" tytle="'+name+'">' + name 
					+ '</span><span class="state">'+LNG.upload_ready
					+ '</span><div style="clear:both"></div></div></div>';
				if ($(list).find('.item').length>0) {
					$(html).insertBefore($(list).find('.item:eq(0)'))
				}else{
					$(list).append(html)
				}
				select_name_arr.push(file.name);
				uploader.upload();
			}).on('uploadProgress', function( file, percentage){
				var $li = $( '#'+file.id ),
					$percent = $li.find('.progress .progress-bar');
				// 避免重复创建
				if ( !$percent.length ) {
					$percent = $('<div class="progress progress-striped active">' +
					  '<div class="progress-bar" role="progressbar" style="width: 0%">' +
					  '</div>' +
					'</div>').appendTo( $li ).find('.progress-bar');
				}
				$li.find(state).text((percentage*100).toFixed(2)+'%');
				$percent.css( 'width', percentage*100+'%' );
			}).on('uploadAccept', function(obj,server) {
				obj.file.serverData = server;//添加服务器返回变量
			}).on('uploadSuccess', function(file){
				var data = file.serverData
				if (data.code) {
					$( '#'+file.id ).find(state).text(data.data);
				}else{
					$( '#'+file.id ).find(state).addClass('error').text(data.data);
				}
				uploader.removeFile(file);
				$('#'+file.id).find('.progress').fadeOut();
				var select = select_name_arr;//copy一份，因为刷新数据为异步
				ui.f5_callback(function(){
					ui.path.setSelectByFilename(select);
				});
			}).on('uploadError', function(file,reason){
				$('#'+file.id).find(state).addClass('error').text(LNG.upload_error);
			}).on('uploadFinished', function(file){
			   $(list).find('.item').delay(2000).each(function(index){
					$(this).delay(index*300).slideUp(600);
			   });
				select_name_arr = [];
			}).on('error',function(a,b){
				//console.log(a,b);
			});

			var timer;
			inState = false;
			dragOver = function(e){
				stopPP(e);
				if (inState == false){
					inState = true;
					MaskView.tips(LNG.upload_drag_tips);
				}
				if (timer) window.clearTimeout(timer)
			};
			dragLeave = function(e){
				stopPP(e);
				if (timer){
					window.clearTimeout(timer);
				}
				timer = window.setTimeout(function() {
					inState = false;
					MaskView.close();
				},100);
			}
			dragDrop = function(e){
				stopPP(e);
				if (inState) {
					inState = false;
					MaskView.close();
				}
				core.upload();//满足 拖拽到当前，则上传到当前。
			}
		}
	};
});