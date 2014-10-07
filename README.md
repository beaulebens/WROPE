WROPE
=====

A demo Backbone application which loads posts from a WordPress site running the JSON REST API plugin, and renders them in a single stream.

__W__ordPress  
__R__iver  
__O__f  
__P__osts  
__E__xperiment  

Clearly, not a contrived acronym/name.

Running
=======
Currently it's hacked together to work on my laptop, so the root of this repo needs to be web-accessible via `/dev/WROPE/` (I know, weird).

Once you clone the repo, you'll need to make sure you get the submodule (`wp-api`), so execute:

`git submodule update --init --recursive`

and you should be good to go. To point it to your own WP install, change the value for `root` in `index.html` (search for `WP_API_Settings` to find it. Now access this directory via your web server and you should see it load up your posts and render them as a series of short cards. Featured images are treated nicely if you have them. Sticky posts are ignored.

You can click through to a post (click the title or the featured image, if there is one), and you'll get a single-post view. From there you can only click your browser's back button to get back to the list.
