/* 
 * File: 	localcast.ui.js
 * Desc: 	contains core of localcast ui code
 * Rev:		1.0
 * Author:	Jacob Calvert
 */
var localcast = {};
localcast.ui = 
{
	page_title:
	{
		set_to_home: function()
		{
			document.title = localcast.ui.static_strings.title_home;
		},
		set_to_playing: function(media_name)
		{
			document.title = localcast.ui.static_strings.title_playing + media_name;
		},
		set_to_paused: function(media_name)
		{
			document.title = localcast.ui.static_strings.title_paused + media_name;
		}
		
	},
	control_pane:
	{
		chrome_sender_status:function(status)
		{
			$("#chrome_sender_status").html(status);
		},
		media_session_status:function(status)
		{
			$("#media_session_status").html(status);
		}
	},
	media_table:
	{
			add_row:function(uuid, icon_src, title, len)
			{
				tbl = $("#main_table");
				format = "<tr id ='"+uuid+"'><td><img src=\""+icon_src+"\" height='25' width='25'/></td><td>"+title+"</td><td>";
				format += "<div class='btn-group'><button type='button' class='btn btn-default queue_media_btn'><span class='glyphicon glyphicon-plus'></span>  Queue</button>";
				format += "<button type='button' class='btn btn-default play_media_btn'><span class='glyphicon glyphicon-play'></span>  Play Now</button></div>";
				format += "</td><td>"+len+"</td></tr>";
				tbl.append(format);
			},
			clear:function()
			{
				tbl = $("#main_table");
				tbl.empty();	
			}

	},
	section_header:
	{
		set_title:function(title)
		{
			$("#section-header").html(title);
		}
	},
	page_header:
	{
		set_title:function(title)
		{
			$("#page-header").html(title);
		}
	},
	volume:
	{
		set_level: function(lvl)
		{
			$("#volume_level_span").html(lvl + "%");
		}
	},
	sync:function(media_session, cast_core)
	{
		console.log(media_session);
		if(media_session.playerState === "PLAYING" || media_session.playerState === "BUFFERING")
		{
			span = $("#play_pause_span");
			span.removeClass("glyphicon-play");
			span.addClass("glyphicon-pause");
			localcast.ui.page_title.set_to_playing(media_session.media.metadata.title);
			localcast.ui.control_pane.media_session_status("Active");
		}
		else
		{
			span = $("#play_pause_span");
			span.removeClass("glyphicon-pause");
			span.addClass("glyphicon-play");
			localcast.ui.page_title.set_to_home();
			localcast.ui.control_pane.media_session_status("Idle");

		}
		btn = $("#volume_off_btn");
		if(cast_core.media.volume > 0.0)
		{
			btn.removeClass("alert-danger");
		}
		else
		{
			
			btn.addClass("alert-danger");
		}
		localcast.ui.volume.set_level(parseInt(cast_core.media.volume*100));
				

	},
	notifications:
	{
		notice:function(title, content)
		{
			new PNotify({title: title,text: content});
			localcast.globals.logging.log("notifications.notice called with params {"+title+","+content+"}", "localcast.ui.notifications.notice(title, content)");
			
		},
		info:function(title, content)
		{
			new PNotify({title: title,text: content, type:"info"});
			localcast.globals.logging.log("notifications.info called with params {"+title+","+content+"}", "localcast.ui.notifications.info(title, content)");
			
		},
		success:function(title, content)
		{
			new PNotify({title: title,text: content, type:"success"});
			localcast.globals.logging.log("notifications.success called with params {"+title+","+content+"}", "localcast.ui.notifications.success(title, content)");
		},
		error:function(title, content)
		{
			new PNotify({title: title,text: content, type:"error"});
			localcast.globals.logging.log("notifications.error called with params {"+title+","+content+"}", "localcast.ui.notifications.error(title, content)");
		}
	},
	handlers:
	{
		setup_handlers:function()
		{
			$("#nav_all_media").click(this.all_media_onclick.handler);
			$("#nav_music").click(this.all_music_onclick.handler);
			$("#nav_videos").click(this.all_videos_onclick.handler);
			$("#nav_images").click(this.all_images_onclick.handler);
			$("#play_pause_span").click(this.play_pause_span_onclick.handler);
			$("#volume_off_btn").click(this.volume_mute_onclick.handler);
			$("#volume_up_btn").click(this.volume_up_onclick.handler);
			$("#volume_down_btn").click(this.volume_down_onclick.handler);
			localcast.globals.logging.log("setup_handlers is processing", "localcast.ui.handlers.setup_handlers()");
			/* start bootstrap modifications */
			$('#media_control_dropdown').on({
				"shown.bs.dropdown": function() { this.closable = false; },
				"click":             function() { this.closable = true; },
				"hide.bs.dropdown":  function() { return this.closable; }
			});
			$(".controls").click(function(e){e.stopPropagation();});
			/* end bootstrap modifications */
			this.setup_rebindable_handlers();
		},
		setup_rebindable_handlers:function()
		{
			$(".play_media_btn").click(this.play_media_onclick.handler);
			$(".queue_media_btn").click(this.queue_media_onclick.handler);
			localcast.globals.logging.log("setup_rebindable_handlers is processing", "localcast.ui.handlers.setup_rebindable_handlers()");
		},
		volume_mute_onclick:
		{
			handler:function()
			{
				btn = $("#volume_off_btn");
				mute = true;
				if(btn.hasClass("alert-danger"))
				{
					btn.removeClass("alert-danger");
					mute = false;
				}
				else
				{
					btn.addClass("alert-danger");
				}
				localcast.globals.logging.log("volume_mute_onclick.handler executed with param mute ='"+mute+"'", "localcast.ui.handlers.volume_mute_onclick.handler()");
				for(i = 0; i < localcast.ui.handlers.volume_mute_onclick.callbacks.length; i++)
				{
					localcast.ui.handlers.volume_mute_onclick.callbacks[i](mute);
				}
			},
			add_callback:function(callback)
			{
				localcast.ui.handlers.volume_mute_onclick.callbacks.push(callback);
				localcast.globals.logging.log("volume_mute_onclick.add_callback request with param '"+localcast.utils.functions.get_name(callback)+"'", "localcast.ui.handlers.volume_mute_onclick.add_callback()");
			},
			callbacks:[]
		},
		volume_up_onclick:
		{
			handler:function()
			{
				localcast.globals.logging.log("volume_up_onclick.handler executed", "localcast.ui.handlers.volume_up_onclick.handler()");
				for(i = 0; i < localcast.ui.handlers.volume_up_onclick.callbacks.length; i++)
				{
					
					localcast.ui.handlers.volume_up_onclick.callbacks[i]();
					
				}
			},
			add_callback:function(callback)
			{
				localcast.ui.handlers.volume_up_onclick.callbacks.push(callback);
				localcast.globals.logging.log("volume_up_onclick.add_callback request with param '"+localcast.utils.functions.get_name(callback)+"'", "localcast.ui.handlers.volume_up_onclick.add_callback()");
			},
			callbacks:[]
		},
		volume_down_onclick:
		{
			handler:function()
			{
				localcast.globals.logging.log("volume_down_onclick.handler executed", "localcast.ui.handlers.volume_down_onclick.handler()");
				for(i = 0; i < localcast.ui.handlers.volume_down_onclick.callbacks.length; i++)
				{
					
					localcast.ui.handlers.volume_down_onclick.callbacks[i]();
					
				}
			},
			add_callback:function(callback)
			{
				localcast.ui.handlers.volume_down_onclick.callbacks.push(callback);
				localcast.globals.logging.log("volume_down_onclick.add_callback request with param '"+localcast.utils.functions.get_name(callback)+"'", "localcast.ui.handlers.volume_down_onclick.add_callback()");
			},
			callbacks:[]
		},
		play_media_onclick:
		{
			handler:function()
			{
				parent_id = $(this).parent().parent().parent().attr("id"); 
				localcast.globals.logging.log("play_media_onclick.handler executed with param '"+parent_id+"'", "localcast.ui.handlers.play_media_onclick.handler()");
				for(i = 0; i < localcast.ui.handlers.play_media_onclick.callbacks.length; i++)
				{
					
					localcast.ui.handlers.play_media_onclick.callbacks[i](parent_id);
					
				}
			},
			add_callback:function(callback)
			{
				localcast.ui.handlers.play_media_onclick.callbacks.push(callback);
				localcast.globals.logging.log("play_media_onclick.add_callback request with param '"+localcast.utils.functions.get_name(callback)+"'", "localcast.ui.handlers.play_media_onclick.add_callback()");
			},
			callbacks:[]
		},
		queue_media_onclick:
		{
			handler:function()
			{
				parent_id = $(this).parent().parent().parent().attr("id"); 
				localcast.globals.logging.log("queue_media_onclick.handler executed with param '"+parent_id+"'", "localcast.ui.handlers.queue_media_onclick.handler()");
				for(i = 0; i < localcast.ui.handlers.queue_media_onclick.callbacks.length; i++)
				{
					localcast.ui.handlers.queue_media_onclick.callbacks[i](parent_id);
				}
			},
			add_callback:function(callback)
			{
				localcast.ui.handlers.queue_media_onclick.callbacks.push(callback);
				localcast.globals.logging.log("queue_media_onclick.add_callback request with param '"+localcast.utils.functions.get_name(callback)+"'", "localcast.ui.handlers.qu_media_onclick.add_callback()");

			},
			callbacks:[]
		},
		all_media_onclick:
		{
			handler:function()
			{
				$("li.active").removeClass("active");
				li = $("#nav_all_media_li");
				li.addClass("active");
				localcast.globals.logging.log("all_media_onclick.handler executed ", "localcast.ui.handlers.all_media_onclick.handler()");
				for(i = 0; i < localcast.ui.handlers.all_media_onclick.callbacks.length; i++)
				{
					localcast.ui.handlers.all_media_onclick.callbacks[i]();
				}
			},
			add_callback:function(callback)
			{
				localcast.ui.handlers.all_media_onclick.callbacks.push(callback);
				localcast.globals.logging.log("all_media_onclick.add_callback request with param '"+localcast.utils.functions.get_name(callback)+"'", "localcast.ui.handlers.all_media_onclick.add_callback()");
			},
			callbacks:[]
		},
		all_music_onclick:
		{
			handler:function()
			{
				$("li.active").removeClass("active");
				li = $("#nav_music_li");
				li.addClass("active");
				localcast.globals.logging.log("all_music_onclick.handler executed ", "localcast.ui.handlers.all_music_onclick.handler()");
				for(i = 0; i < localcast.ui.handlers.all_music_onclick.callbacks.length; i++)
				{
					localcast.ui.handlers.all_music_onclick.callbacks[i]();
				}
			},
			add_callback:function(callback)
			{
				localcast.ui.handlers.all_music_onclick.callbacks.push(callback);
				localcast.globals.logging.log("all_music_onclick.add_callback request with param '"+localcast.utils.functions.get_name(callback)+"'", "localcast.ui.handlers.all_music_onclick.add_callback()");

			},
			callbacks:[]
		},
		all_videos_onclick:
		{
			handler:function()
			{
				$("li.active").removeClass("active");
				li = $("#nav_videos_li");
				li.addClass("active");
				localcast.globals.logging.log("all_videos_onclick.handler executed ", "localcast.ui.handlers.all_videos_onclick.handler()");
				for(i = 0; i < localcast.ui.handlers.all_videos_onclick.callbacks.length; i++)
				{
					localcast.ui.handlers.all_videos_onclick.callbacks[i]();
					
				}
			},
			add_callback:function(callback)
			{
				localcast.ui.handlers.all_videos_onclick.callbacks.push(callback);
				localcast.globals.logging.log("all_videos_onclick.add_callback request with param '"+localcast.utils.functions.get_name(callback)+"'", "localcast.ui.handlers.all_videos_onclick.add_callback()");

			},
			callbacks:[]
		},
		all_images_onclick:
		{
			handler:function()
			{
				$("li.active").removeClass("active");
				li = $("#nav_images_li");
				li.addClass("active");
				localcast.globals.logging.log("all_images_onclick.handler executed ", "localcast.ui.handlers.all_images_onclick.handler()");
				for(i = 0; i < localcast.ui.handlers.all_images_onclick.callbacks.length; i++)
				{
					localcast.ui.handlers.all_images_onclick.callbacks[i]();
					
				}
			},
			add_callback:function(callback)
			{
				localcast.ui.handlers.all_images_onclick.callbacks.push(callback);
				localcast.globals.logging.log("all_images_onclick.add_callback request with param '"+localcast.utils.functions.get_name(callback)+"'", "localcast.ui.handlers.all_images_onclick.add_callback()");

			},
			callbacks:[]
		},
		play_pause_span_onclick:
		{
			handler:function()
			{
				span = $("#play_pause_span");
				play = false;
				if(span.hasClass("glyphicon-play"))
				{
					span.removeClass("glyphicon-play");
					span.addClass("glyphicon-pause");
					play = true;
				}
				else
				{
					span.removeClass("glyphicon-pause");
					span.addClass("glyphicon-play");
				}
				localcast.globals.logging.log("play_pause_onclick.handler executed with param play =" + play, "localcast.ui.handlers.play_pause_onclick.handler()");
				for(i = 0; i < localcast.ui.handlers.play_pause_span_onclick.callbacks.length; i++)
				{
					localcast.ui.handlers.play_pause_span_onclick.callbacks[i](play);
					
				}
			},
			add_callback:function(callback)
			{
				localcast.ui.handlers.play_pause_span_onclick.callbacks.push(callback);
				localcast.globals.logging.log("play_pause_span_onclick.add_callback request with param '"+localcast.utils.functions.get_name(callback)+"'", "localcast.ui.handlers.play_pause_span_onclick.add_callback()");

			},
			callbacks:[]
		}
	},
	
	static_strings:
	{
		title_home:"localcast 3 | Home",
		title_playing: "Playing >> ", //TODO: come fix this to the > right triangle thing
		title_paused: "Paused || " // TODO: fix this too
	}
};
