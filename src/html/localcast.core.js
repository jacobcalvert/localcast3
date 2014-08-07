/* 
 * File: 	localcast.core.js
 * Desc: 	contains core of localcast application code
 * Rev:		1.0
 * Author:	Jacob Calvert
 */
localcast.globals = 
{
	logging:
	{
		log_levels:
		{
			INFO :1,
			WARNING: 2,
			ERROR:3,
			FATAL:4,
			DEBUG:0
		},
		current_log_level: 0, // DEBUG level
		log: function(event, caller, lvl)
		{
			if(lvl == undefined)
			{
				lvl = localcast.globals.logging.log_levels.INFO;
			}
			if(caller == undefined)
			{
				caller = "Unknown";
			}
			log_str = caller + ": " + JSON.stringify(event);
			if(lvl >= localcast.globals.logging.current_log_level)
			{
				console.log(log_str);
			}
		}
	},
	testing:
	{
		ui:false,
		core:false,
		in_test:(this.ui || this.core)
	},
	media_types:
	{
		AUDIO:"audio",
		VIDEO:"video",
		IMAGE:"image"
	}
}
localcast.utils = 
{
	time:
	{
		sec_to_hr_min: function(sec)
		{
			hr = parseInt(sec/3600);
			min = parseInt((sec - (hr*3600))/60);
			s = parseInt(sec - ((hr*3600) + (min*60)));
			if(hr < 10)
			{
				hr = "0"+hr;
			}
			if(min < 10)
			{
				min = "0"+min;
			}
			if(s < 10)
			{
				s = "0"+s;
			}
			return hr+"h:"+min+"m:" +s+"s";
		}
	},
	functions:
	{	
		get_name:function(fcn)
		{
			return fcn; //TODO: fix me!!
		}
	
	},
	urls:
	{
		get_server_url:function()
		{
			full_url = document.URL;
			i = full_url.indexOf("/") + 2;
			j = full_url.indexOf("index.html") - 8;
			return "http://"+ full_url.substr(i,j);
		},	
		make_media_request_url: function(media_id)
		{
			return localcast.core.static_strings.server_url + localcast.core.static_strings.media_base + "/" + media_id;
		},
		make_media_root_request_url:function()
		{
			return this.make_media_request_url("");
		}

	}
}
localcast.db = 
{
	media_db:
	{
		next_refresh: 0,
		refresh_threshold:5*60*1000, //milliseconds (5*60*1000 is 5 minutes)
		needs_refresh:function()
		{
			date = new Date();
			if(date.getTime() >= localcast.db.media_db.next_refresh)
			{
				localcast.db.media_db.next_refresh = date.getTime() + localcast.db.media_db.refresh_threshold;
				return true;
			}
			return false;
		},
		entry_exists:function(uuid)
		{
			if(localcast.db.media_db.storage[uuid])
			{
				return true;
			}
			return false;
		},
		add_entry:function(uuid, icon_src, title, duration, url, media_type, content_type)
		{
			if(!localcast.db.media_db.entry_exists(uuid))
			{
				localcast.db.media_db.storage[uuid] = 
													{
														icon_src:icon_src,
														title:title,
														duration:duration,
														url:url,
														media_type:media_type,
														uuid:uuid,
														content_type:content_type
													}
			}
			else
			{
				localcast.ui.notifications.error("media_db error", "tried to insert a preexisting record.");
			}
		},
		empty:function()
		{
			localcast.db.media_db.storage = {};
			localcast.ui.media_table.clear();
		},
		get_all: function()
		{
			return localcast.db.media_db.storage;
		},
		get:function(id)
		{
			return localcast.db.media_db.storage[id];
		},
		get_sorted_array:function()
		{	
			arr = Array();
			for(var key in localcast.db.media_db.storage)
			{
				if(localcast.db.media_db.storage.hasOwnProperty(key))
				{
					arr.push(localcast.db.media_db.storage[key]);
				}
			}
			sorted = arr.sort(
								function(a,b)
								{
									
									if(a.url < b.url)
									{
										return -1;
									}
									else if(a.url > b.url)
									{
										return 1;
									}
									else
									{
										return 0; //equal
									}
								}
							);
			return sorted;
		},
		get_all_audio: function()
		{
			arr = Array();
			for (var key in localcast.db.media_db.storage)
			{
				if(localcast.db.media_db.storage.hasOwnProperty(key))
				{
					if(localcast.db.media_db.storage[key].media_type == localcast.globals.media_types.AUDIO)
					{
						arr.push(localcast.db.media_db.storage[key]);
					}
				}
			}
			sorted = arr.sort(
								function(a,b)
								{
									
									if(a.url < b.url)
									{
										return -1;
									}
									else if(a.url > b.url)
									{
										return 1;
									}
									else
									{
										return 0; //equal
									}
								}
							);
			return sorted;
		},
		get_all_video: function()
		{
			arr = Array();
			for (var key in localcast.db.media_db.storage)
			{
				if(localcast.db.media_db.storage.hasOwnProperty(key))
				{
					if(localcast.db.media_db.storage[key].media_type == localcast.globals.media_types.VIDEO)
					{
						arr.push(localcast.db.media_db.storage[key]);
					}
				}
			}
			sorted = arr.sort(
								function(a,b)
								{
									
									if(a.url < b.url)
									{
										return -1;
									}
									else if(a.url > b.url)
									{
										return 1;
									}
									else
									{
										return 0; //equal
									}
								}
							);
			return sorted;
		},
		get_all_images: function()
		{
			arr = Array();
			for (var key in localcast.db.media_db.storage)
			{
				if(localcast.db.media_db.storage.hasOwnProperty(key))
				{
					if(localcast.db.media_db.storage[key].media_type == localcast.globals.media_types.IMAGE)
					{
						arr.push(localcast.db.media_db.storage[key]);
					}
				}
			}
			sorted = arr.sort(
								function(a,b)
								{
									
									if(a.url < b.url)
									{
										return -1;
									}
									else if(a.url > b.url)
									{
										return 1;
									}
									else
									{
										return 0; //equal
									}
								}
							);
			return sorted;
		},
		storage:{},
		storage_change_callbacks:[],
		add_storage_onchange_callback:function(callback)
		{
			localcast.db.media_db.storage_change_callbacks.push(callback);
			localcast.globals.logging.log("added storage_change_callback with param '"+callback+"'", "localcast.db.media_db.add_storage_onchange_callbacks()");
		},
		_run_storage_onchange_callbacks:function()
		{
			localcast.globals.logging.log("running storage_change_callbacks", "localcast.db.media_db._run_storage_onchange_callbacks()");
			for(i = 0; i < localcast.db.media_db.storage_change_callbacks.length; i++)
			{
				localcast.db.media_db.storage_change_callbacks[i]();
				
			}
		}
	},
	queue_db:
	{
		push:function(media_object)
		{
			localcast.db.queue_db.storage.push(media_object);
			localcast.db.queue_db._run_storage_onchange_callbacks();
		},
		pop:function()
		{
			item = localcast.db.queue_db.storage[localcast.db.queue_db.storage.length -1];
			localcast.db.queue_db.storage = localcast.db.queue_db.storage.slice(0, localcast.db.queue_db.storage.length - 2);
			localcast.db.queue_db._run_storage_onchange_callbacks();
			return item;
		},
		storage:[],
		storage_change_callbacks:[],
		add_storage_onchange_callback:function(callback)
		{
			localcast.db.media_db.storage_change_callbacks.push(callback);
			localcast.globals.logging.log("added storage_change_callback with param '"+callback+"'", "localcast.db.queue_db._run_storage_onchange_callbacks()");
		},
		_run_storage_onchange_callbacks:function()
		{
			localcast.globals.logging.log("running storage_change_callbacks", "localcast.db.queue_db._run_storage_onchange_callbacks()");
			for(i = 0; i < localcast.db.queue_db.storage_change_callbacks.length; i++)
			{
				localcast.db.queue_db.storage_change_callbacks[i]();
				
			}
		}
	}
	
}
localcast.core = 
{
	init:function()
	{
		localcast.ui.notifications.info("Starting up...", "please wait while localcast initializes");
		localcast.ui.page_title.set_to_home();
		localcast.ui.page_header.set_title("localcast");
		localcast.ui.section_header.set_title("All media");
		localcast.ui.handlers.setup_handlers();
		localcast.ui.handlers.all_media_onclick.add_callback(localcast.core.load_all_media.handler);
		localcast.ui.handlers.all_music_onclick.add_callback(localcast.core.load_all_music.handler);
		localcast.ui.handlers.all_images_onclick.add_callback(localcast.core.load_all_images.handler);
		localcast.ui.handlers.all_videos_onclick.add_callback(localcast.core.load_all_videos.handler);
		localcast.ui.handlers.play_pause_span_onclick.add_callback(localcast.core.play_pause);
		localcast.ui.handlers.play_media_onclick.add_callback(localcast.core.play_now);
		localcast.ui.handlers.queue_media_onclick.add_callback(localcast.core.queue_next);
		localcast.ui.handlers.volume_up_onclick.add_callback(localcast.core.volume_up);
		localcast.ui.handlers.volume_down_onclick.add_callback(localcast.core.volume_down);
		localcast.ui.handlers.volume_mute_onclick.add_callback(localcast.core.volume_mute);
		localcast.ui.handlers.preview_media_onclick.add_callback(localcast.core.media_preview);
		localcast.ui.handlers.seek_onslide.add_callback(localcast.core.media_seek);
		localcast.core.cast.init();

		
		localcast.core.load_all_media.handler(); //force update
		


		
	},
	load_all_media:
	{
		handler:function()
		{
			if (localcast.db.media_db.needs_refresh())
			{
				localcast.core.ajax.request(localcast.utils.urls.make_media_root_request_url(), localcast.core.load_all_media.ajax_callback);
			}
			else
			{
				localcast.core.load_all_media.load_from_cache();
			}
			
		},
		ajax_callback:function(data)
		{
			localcast.globals.logging.log("requesting load all media via ajax","localcast.core.load_all_media.ajax_callback(data)");
			obj = JSON.parse(data);
			localcast.db.media_db.empty();
			for (var key in obj) 
			{
			  	if (obj.hasOwnProperty(key)) 
				{
					//uuid, icon_src, title, duration, url, media_type
					//console.log(obj.key);
					localcast.db.media_db.add_entry(key,obj[key].icon_src, obj[key].title, obj[key].duration, obj[key].url, obj[key].media_type, obj[key].content_type);
			  	}
			}
			sorted = localcast.db.media_db.get_sorted_array();
			for(i = 0; i < sorted.length; i++)
			{
				localcast.ui.media_table.add_row(sorted[i].uuid,sorted[i].icon_src,sorted[i].title, localcast.utils.time.sec_to_hr_min(sorted[i].duration));
			}
			localcast.ui.handlers.setup_rebindable_handlers();
			
		},
		silent_ajax_callback:function()
		{
			obj = JSON.parse(data);
			localcast.db.media_db.empty();
			for (var key in obj) 
			{
			  	if (obj.hasOwnProperty(key)) 
				{
					//uuid, icon_src, title, duration, url, media_type
					//console.log(obj.key);
					localcast.db.media_db.add_entry(key,obj[key].icon_src, obj[key].title, obj[key].duration, obj[key].url, obj[key].media_type, obj[key].content_type);
			  	}
			}
		},
		load_from_cache:function()
		{
			localcast.globals.logging.log("requesting load all media via cache","localcast.core.load_all_media.load_from_cache()");
			sorted = localcast.db.media_db.get_sorted_array();
			localcast.ui.media_table.clear();
			for(i = 0; i < sorted.length; i++)
			{
				localcast.ui.media_table.add_row(sorted[i].uuid,sorted[i].icon_src,sorted[i].title, localcast.utils.time.sec_to_hr_min(sorted[i].duration));
			}
			localcast.ui.handlers.setup_rebindable_handlers();
		}
	},
	load_all_music:
	{
		handler:function()
		{
			if (localcast.db.media_db.needs_refresh())
			{
				localcast.core.ajax.request(localcast.utils.urls.make_media_root_request_url(), localcast.core.load_all_media.silent_ajax_callback);
			}
			else
			{
				localcast.core.load_all_music.load_from_cache();
			}
		},
		load_from_cache:function()
		{
			localcast.globals.logging.log("requesting load all music via cache","localcast.core.load_all_music.load_from_cache()");
			sorted = localcast.db.media_db.get_all_audio();
			localcast.ui.media_table.clear();
			for(i = 0; i < sorted.length; i++)
			{
				localcast.ui.media_table.add_row(sorted[i].uuid,sorted[i].icon_src,sorted[i].title, localcast.utils.time.sec_to_hr_min(sorted[i].duration));
			}
			localcast.ui.handlers.setup_rebindable_handlers();
		}
	},
	load_all_images:
	{
		handler:function()
		{
			if (localcast.db.media_db.needs_refresh())
			{
				localcast.core.ajax.request(localcast.utils.urls.make_media_root_request_url(), localcast.core.load_all_media.silent_ajax_callback);
			}
			else
			{
				localcast.core.load_all_images.load_from_cache();
			}
		},
		load_from_cache:function()
		{
			localcast.globals.logging.log("requesting load all images via cache","localcast.core.load_all_images.load_from_cache()");
			sorted = localcast.db.media_db.get_all_images();
			localcast.ui.media_table.clear();
			for(i = 0; i < sorted.length; i++)
			{
				localcast.ui.media_table.add_row(sorted[i].uuid,sorted[i].icon_src,sorted[i].title, localcast.utils.time.sec_to_hr_min(sorted[i].duration));
			}
			localcast.ui.handlers.setup_rebindable_handlers();
		}
	},
	load_all_videos:
	{
		handler:function()
		{
			if (localcast.db.media_db.needs_refresh())
			{
				localcast.core.ajax.request(localcast.utils.urls.make_media_root_request_url(), localcast.core.load_all_media.silent_ajax_callback);
			}
			else
			{
				localcast.core.load_all_videos.load_from_cache();
			}
		},
		load_from_cache:function()
		{
			localcast.globals.logging.log("requesting load all videos via cache","localcast.core.load_all_videos.load_from_cache()");
			sorted = localcast.db.media_db.get_all_video();
			localcast.ui.media_table.clear();
			for(i = 0; i < sorted.length; i++)
			{
				localcast.ui.media_table.add_row(sorted[i].uuid,sorted[i].icon_src,sorted[i].title, localcast.utils.time.sec_to_hr_min(sorted[i].duration));
			}
			localcast.ui.handlers.setup_rebindable_handlers();
		}
	},
	play_pause:function(play)
	{
		if(play)
		{
			localcast.core.cast.handlers.play();
		}
		else
		{
			localcast.core.cast.handlers.pause();
		}
	},
	volume_mute:function(mute)
	{
		localcast.core.cast.handlers.mute(mute);
	},
	volume_up:function()
	{
		localcast.core.cast.handlers.volup();
	},
	volume_down:function()
	{
		localcast.core.cast.handlers.voldown();
	},
	play_now:function(media_id)
	{
		media_object = localcast.db.media_db.get(media_id);
		localcast.core.cast.handlers.load_media(media_object);
	},
	queue_next:function()
	{
	},
	media_seek:function(seek_to)
	{
		localcast.core.cast.handlers.seek(seek_to);
	},
	media_preview:function(media_id)
	{
		media_object = localcast.db.media_db.get(media_id);
		if(media_object.media_type == localcast.globals.media_types.AUDIO)
		{
			localcast.ui.handlers.create_audio_preview(media_object.url, media_object.content_type);
		}
		else if(media_object.media_type == localcast.globals.media_types.VIDEO)
		{
			localcast.ui.handlers.create_video_preview(media_object.url, media_object.content_type);
		}
		//else if(media_object.media_type == localcast.globals.media_types.IMAGE)
		//{
		//	localcast.ui.handlers.create_image_preview(media_object.url);
		//}
	},
	static_strings:
	{
		media_base:"/media",		
		server_url:localcast.utils.urls.get_server_url() + "/api",
	},
	ajax:
	{
		request:function(url, callback)
		{
			$.get(
				url,
				callback
				).fail
				(
					function()
					{
						localcast.globals.logging.log("localcast.core.ajax.request failed for uri = '" + url + "'","localcast.core.ajax.request(url, callback)");
						localcast.ui.notifications.error("REST Error", "There was an error communicating with the server.");
					}
				);
			localcast.globals.logging.log("localcast.core.ajax.request called for uri = '" + url + "'","localcast.core.ajax.request(url, callback)");
			
		}
	},
	cast:
	{
		
		statics:
		{	
			startup_attempts:
			{
				made:0,
				allowed:15
			}
		},
		media:
		{
			session:null,
			is_loaded:false,
			volume:1.0,
			last_volume:0.5,
			position: 0
			
		},
		session:null,
		listeners:
		{
			session:function(session)
			{
				localcast.globals.logging.log("Active session with sessionId = '"+session.sessionId+"'", "localcast.core.cast.listeners.session(session)");
				localcast.ui.notifications.success("chromecast session activity","Active session now available");
				if (session.media.length)
				{
					localcast.globals.logging.log("Number of active media sessions = "+session.media.length+" with sessionId = '"+session.sessionId+"'", "localcast.core.cast.listeners.session(session)");
					localcast.core.cast.media.session = session.media[0];				
				}
				localcast.core.cast.session = session;
				localcast.core.cast.session.addUpdateListener(localcast.core.cast.listeners.session_update);
				localcast.core.cast.session.addMediaListener(localcast.core.cast.listeners.media_discovered);
			},
			receiver:function(event)
			{
				if(event === chrome.cast.ReceiverAvailability.AVAILABLE)
				{
					localcast.ui.notifications.info("chromecast session activity", "Found receiver(s)");
				}
				else
				{
					localcast.ui.notifications.info("chromecast session activity", "No receivers found");
				}
			},
			media_discovered:function(media_session)
			{
				localcast.core.cast.media.session = media_session;
				localcast.core.cast.media.session.addUpdateListener(localcast.core.cast.listeners.media_session_update);
			},
			session_update:function(event)
			{
				log_line = "Session '" + localcast.core.cast.session.sessionId + "' ";
				log_line += (event)?"updated":"ended";
				localcast.globals.logging.log(log_line, "localcast.core.cast.listeners.session_update(event)");
				if(!event)
				{
					localcast.ui.notifications.notice("chromcast session activity", "The active session has ended.");
					localcast.core.cast.session = null;
					localcast.ui.control_pane.chrome_sender_status("Offline");
				}
				else
				{
					localcast.ui.control_pane.chrome_sender_status("Active");
					localcast.ui.sync(localcast.core.cast.media.session, localcast.core.cast);
				}	
				
			},
			media_session_update:function(event)
			{
				localcast.core.cast.media.is_loaded = event;
				localcast.core.cast.media.position = localcast.core.cast.media.session.currentTime;
				localcast.ui.sync(localcast.core.cast.media.session, localcast.core.cast);
			},
			request_session_success:function(event)
			{

			},

		},
		handlers:
		{
			init_success:function(event)
			{
				localcast.ui.notifications.success("chromecast api success", "ChromeCast API successfully initialized. Ready for sessions!");
			},
			init_error:function(event)
			{
				localcast.ui.notifications.error("chromecast api failure", "ChromeCast API not successfully initialized. Check the error logs.");
				localcast.globals.logging.log(event, "localcast.core.cast.handlers.init_error(event))");
			},
			media_command_success:function()
			{
				
			},
			media_failure:function()
			{

			},
			load_media:function(media_object)
			{
				mediaInfo = new chrome.cast.media.MediaInfo(media_object.url);
				mediaInfo.contentType = media_object.content_type;
				request = new chrome.cast.media.LoadRequest(mediaInfo);
				mdt = chrome.cast.media.MetadataType.GENERIC;
				if(media_object.content_type.substr("audio") != -1)
				{
					mdt = chrome.cast.media.MetadataType.MUSIC_TRACK;
				}
				else if(media_object.content_type.substr("video") != -1)
				{
					mdt = chrome.cast.media.MetadataType.MOVIE;
				}
				else if(media_object.content_type.substr("image") != -1)
				{
					mdt = chrome.cast.media.MetadataType.PHOTO;
				}
				mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
				mediaInfo.metadata.metadataType = mdt;
				mediaInfo.metadata.title = media_object.title;
				mediaInfo.metadata.images = [{"url":media_object.icon_src}];
				request.autoplay = true;
				if(localcast.core.cast.session)
				{
					localcast.ui.notifications.info("chromecast session activity", "Loading "+media_object.title+ ". Please be patient...");
					localcast.core.cast.session.loadMedia(request,localcast.core.cast.listeners.media_discovered, localcast.core.cast.handlers.media_failure);
				}
				else
				{
					localcast.ui.notifications.error("chromecast session activity", "Please start a chromecast session first.");
				}

			},
			play:function()
			{
				localcast.core.cast.media.session.play(null, localcast.core.cast.handlers.media_command_success, localcast.core.cast.handlers.media_failure);
			},
			pause:function()
			{
				localcast.core.cast.media.session.pause(null, localcast.core.cast.handlers.media_command_success, localcast.core.cast.handlers.media_failure);
			},
			mute:function(mute)
			{
				if(mute)
				{
					localcast.core.cast.media.last_volume = localcast.core.cast.media.volume;
					localcast.core.cast.media.volume = 0.0;
					
				}
				else
				{
					localcast.core.cast.media.volume = localcast.core.cast.media.last_volume;
				}
				localcast.core.cast.handlers.set_volume();
			},
			volup:function()
			{
				if(localcast.core.cast.media.volume >= 0.95)
				{
					localcast.core.cast.media.volume  = 1.0;
				}
				else
				{
					localcast.core.cast.media.volume += 0.05;
				}
				localcast.core.cast.handlers.set_volume();
			},
			voldown:function()
			{
				if(localcast.core.cast.media.volume <=0.05)
				{
					localcast.core.cast.media.volume  = 0.0;
				}
				else
				{
					localcast.core.cast.media.volume -= 0.05;
				}
				localcast.core.cast.handlers.set_volume();
			},
			set_volume:function()
			{
				localcast.core.cast.session.setReceiverVolumeLevel((localcast.core.cast.media.volume), localcast.core.cast.handlers.media_command_success, localcast.core.cast.handlers.media_failure);
				localcast.ui.sync(localcast.core.cast.media.session, localcast.core.cast);
			},
			seek:function(pos)
			{
				request = new chrome.cast.media.SeekRequest();
				request.currentTime = pos;
				localcast.core.cast.media.session.seek(request, localcast.core.cast.handlers.media_command_success, localcast.core.cast.handlers.media_failure);
			}
		},
		init:function()
		{
			if(!(chrome.cast && chrome.cast.isAvailable))
			{
				localcast.core.cast.statics.startup_attempts.made++;
				if(localcast.core.cast.statics.startup_attempts.made >= localcast.core.cast.statics.startup_attempts.allowed)
				{
					localcast.ui.notifications.error("chrome cast error", "Could not initialize the ChromeCast API.");
				}
				else
				{
					setTimeout(localcast.core.cast.init, 2000);
				}
			}
			else
			{
				application_id = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
				session_request = new chrome.cast.SessionRequest(application_id);
				api_config = new chrome.cast.ApiConfig(session_request,localcast.core.cast.listeners.session,localcast.core.cast.listeners.receiver);
				chrome.cast.initialize(api_config, localcast.core.cast.handlers.init_success, localcast.core.cast.handlers.init_error);
			}
		},
	}

};



























$(document).ready(function()
{
	function test_callback()
	{
		alert("CALLBACK!");
	}
	function param_callback(p)
	{
		if(p){alert(p);}
	}
	if(localcast.globals.testing.core)
	{
		localcast.ui.handlers.play_media_onclick.add_callback(param_callback);
		localcast.ui.handlers.setup_handlers();
		//uuid, icon_src, title, duration, url, media_type
		i = 0;
		while( i < 25)
		{
			localcast.db.media_db.add_entry("aaaa" + i*3,"http://placekitten.com/g/"+i+"/"+i+"","A PlaceKitten Video", 3874 + (i*720),"http://placekitten.com/g/"+i+"/"+i+"", localcast.globals.media_types.IMAGE);
			i++;
		}
		localcast.ui.handlers.setup_rebindable_handlers();
		
	}
	if(localcast.globals.testing.ui)
	{
		localcast.ui.page_title.set_to_home();
		localcast.ui.page_title.set_to_playing("The Secret Life of Walter Mitty");
		localcast.ui.media_table.add_row("asd98h","http://placekitten.com/g/25/25","The Secret Life of Walter Mitty", "01h:57m");
		localcast.ui.media_table.add_row("asd98h","http://placekitten.com/g/25/25","The Secret Life of Walter Mitty", "01h:57m");
		localcast.ui.media_table.add_row("asd98h","http://placekitten.com/g/25/25","The Secret Life of Walter Mitty", "01h:57m");
		localcast.ui.media_table.add_row("asd98h","http://placekitten.com/g/25/25","The Secret Life of Walter Mitty", "01h:57m");
		localcast.ui.media_table.add_row("asd98h","http://placekitten.com/g/25/25","The Secret Life of Walter Mitty", "01h:57m");
		localcast.ui.media_table.add_row("asd98h","http://placekitten.com/g/25/25","The Secret Life of Walter Mitty", "01h:57m");
		localcast.ui.media_table.add_row("asd98h","http://placekitten.com/g/25/25","The Secret Life of Walter Mitty", "01h:57m");
		localcast.ui.media_table.add_row("asd98h","http://placekitten.com/g/25/25","The Secret Life of Walter Mitty", "01h:57m");
		localcast.ui.media_table.add_row("asd98h","http://placekitten.com/g/25/25","The Secret Life of Walter Mitty", "01h:57m");
		localcast.ui.media_table.add_row("asd98h","http://placekitten.com/g/25/25","The Secret Life of Walter Mitty", "01h:57m");
		localcast.ui.media_table.add_row("asd98h","http://placekitten.com/g/25/25","The Secret Life of Walter Mitty", "01h:57m");
		localcast.ui.media_table.add_row("asd98h","http://placekitten.com/g/25/25","The Secret Life of Walter Mitty", "01h:57m");
		localcast.ui.media_table.add_row("asd98h","http://placekitten.com/g/25/25","The Secret Life of Walter Mitty", "01h:57m");
		localcast.ui.media_table.add_row("asd98h","http://placekitten.com/g/25/25","The Secret Life of Walter Mitty", "01h:57m");
		localcast.ui.media_table.add_row("asd98h","http://placekitten.com/g/25/25","The Secret Life of Walter Mitty", "01h:57m");

		localcast.ui.handlers.setup_handlers();
		localcast.ui.handlers.all_music_onclick.add_callback(test_callback);
		localcast.ui.volume.set_level(56);
		localcast.ui.handlers.play_media_onclick.add_callback(param_callback);
		localcast.ui.notifications.notice("Starting up...", "please wait while localcast initializes");
		localcast.ui.section_header.set_title("All movies");

	}

	if(!localcast.globals.testing.in_test)
	{
		//this is production setup
		localcast.core.init();
		
	}

});
