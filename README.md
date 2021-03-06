localcast3
=======================================
This is the third major revision of the localcast app I created a few months back.
The second revision was a flop.

## What's it do?

_localcast_ is a python powered web app for use with a ChromeCast that is built on the Tornado web framework and uses 
Bootstrap for the GUI design. I got a ChromeCast and was sorely disappointed that I could not find a readily available
app that I could simply drop onto the filesystem and run that would allow streaming to the ChromeCast from my laptop.
 I found one person who had built a very simple version on an nginx server and it inspired me to build this. The 
 _localcast_ app only requires Tornado framework and it does the rest. You can point it to the folder containing your 
 media and it will recursively scan the folder picking out music, videos, and images. You can then open the web interface
 at your IP address and manage the ChromeCast session and media from there. You can also preview your media before you send
 it to the ChromeCast. 
 
 ![localcast3 Main Page](/screenshots/localcast3-main-screen.png?raw=true "localcast3 Main Page")
 ![localcast3 Audio Preview](/screenshots/localcast3-audio-preview-screen.png?raw=true "localcast3 Audio Preview")
 ![localcast3 Video Preview](/screenshots/localcast3-video-preview-screen.png?raw=true "localcast3 Video Preview")
 ![localcast3 Seekbar](/screenshots/localcast3-seekbar.png?raw=true "localcast3 Seekbar")
 
### Design and Implementation
 The core of the web app is built in JavaScript and jQuery. There are two distinct parts to the GUI, the localcast.core.js
 file and localcast.ui.js file. The localcast.ui.js file contains all the objects, methods, and callbacks that control the
 DOM objects and interaction with the user. The localcast.core.js file contains all the objects, methods, and callbacks
 for interacting with the ChromeCast's API and the Python server. 
 
 The Python portion of the app is very simple. It scans the media folder recursively and generates file objects which are
 stored in memory. The data can be accessed through a REST like interface. For example:
 
 <pre>
 /api/media/                                    - gets all media items
 /api/media/?media_type=[audio|video|image]     - gets all of the specified type
 /api/media/{media_resource_id}                 - gets the media element specified by {media_resource_id}
 </pre>
 
### Current Features
 * Server implements a REST interface
 * Bootstrap powered front end
 * Play, pause, volume up, volume down, volume mute
 * Streaming audio support
 * Streaming video support 
 * Image support
 * Media session status info
 * ChromeCast session status info
 * Status notification popups
 * Client side media caching
 * Audio and video preview before sending it to the ChromeCast
 * Media seek

### Future Planned Features
* Media queueing
* Media duration displayed in the table
* Media search

I will probably add more feature as time allows, but these are the basic features for which I'm shooting.
 
 
### How to use / requirements
1. Python, Tornado (you can get tornado from http://www.tornadoweb.org/en/stable/), Chrome browser with TabCast installed
2. Get the latest commit here
3. In src/Enums.py change the <pre>MEDIA_BASE</pre> variable to whatever your media folder is
4. Run src/Server.py
5. Open your browser to <pre>http://[your_ip]:8080/index.html</pre>
6. Start a ChromeCast session in Chrome, and choose your media
7. Done! Enjoy!


### Bugs and such
* Apparently, tornado's default static file handler <a href = "https://github.com/tornadoweb/tornado/issues/1046">reads the ENTIRE file into memory before sending it over</a>, so I will need to write a custom static file handler. Too much lag on 1080P video. [Fixed 11/16/2014]

README.md Revision: 1.12.0