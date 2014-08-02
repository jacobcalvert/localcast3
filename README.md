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
 at your IP address and manage the ChromeCast session and media from there. 
 
 ![localcast3 Main Page](/screenshots/localcast3-main-screen.png?raw=true "localcast3 Main Page")
 
 