var WROPE = {
  posts: null,

  /**
   * Handles all the boot-up for the application, including initial request of
   * posts, rendering templates, etc.
   * @return WROPE application object
   */
  start: function() {
    // Set up our router, start monitoring URLs, and get going
    this.router = new this.routerObj();
    Backbone.history.start();
    return this;
  },

  routerObj: Backbone.Router.extend({
    routes: {
      '': 'index',
      'posts/:post': 'post'
    },

    index: function() {
      // Get a collection of posts from WP and render them once returned
      WROPE.fetchPosts( function() {
        this.renderRiver();
      }.bind( this ) );
    },

    post: function( post ) {
      if ( null === WROPE.posts ) {
        WROPE.fetchPosts( function() {
          this.renderPost( post );
        }.bind( this ) );
      } else {
        this.renderPost( post );
      }
    },

    renderRiver: function() {
      WROPE.postsRiver = new WROPE.postsView( { collection: WROPE.posts } );

      // Load optimized inline images, and reload them when the page is resized
      WROPE.optimizeImageSize();
      $(window).on('resize', _.debounce( WROPE.optimizeImageSize, 500 ) );
    },

    renderPost: function( post ) {
      var thePost = WROPE.posts.get( post );
      var postView = new WROPE.postView( { model: thePost, tagName: 'div', full: true } );
      $( '#wrope' ).slideUp( function() {
        $(this).html( postView.$el ).slideDown();
        WROPE.optimizeImageSize();
      });
    }
  }),

  postsView: Backbone.View.extend({
    tagName: 'ol',

    className: 'post-river',

    initialize: function( options ) {
      this.collection = options.collection;
      this.render();
    },

    render: function() {
      this.collection.each( function( post ) {
        // Filter currently doesn't support ignore_sticky_posts
        // Let's skip them for this demo app
        if ( post.get( 'sticky' ) ) {
          return;
        }
        var postView = new WROPE.postView( { model: post } );
        this.$el.append( postView.$el );
      }.bind( this ) );

      $( '#wrope' ).html( this.$el );
    }
  }),

  postView: Backbone.View.extend({
    tagName: 'li',

    className: 'post',

    template: _.template( $('#tpl-post').text() ),

    events: {
      'click a': 'preventDefault',
      'click h1.post-title a': 'goToPage',
      'click .featured-image a': 'goToPage'
    },

    initialize: function( options ) {
      this.full = options.full || false;
      this.render();
    },

    preventDefault: function( e ) {
      e.preventDefault();
    },

    goToPage: function() {
      WROPE.router.navigate( '/posts/' + this.model.get( 'ID' ), { trigger: true } );
      return;
    },

    render: function() {
      this.$el.html(
        this.template(
          _.extend(
            {},
            this.model.attributes,
            {
              full: this.full
            }
          )
        )
      );
      return this;
    }
  }),

  fetchPosts: function( callback ) {
    var posts = new wp.api.collections.Posts();
    posts.fetch().done( function() {
      WROPE.posts = posts.clone();
      if ( posts.hasMore() ) {
        posts.more().done( function() { // Get a second batch
          WROPE.posts.add( posts.toJSON() );
          callback();
        });
      } else {
        callback();
      }
    });
  },

  /**
   * Do some Photon magic. https://developer.wordpress.com/docs/photon/
   * Technically against the Photon ToS, unless you're using Jetpack on your site!
   * Takes the Photon-encoded img src URL from 'data-src' attribute, then applies a dynamic crop
   * via Photon, which matches the screen size (x2 for HiDPI!)
   */
  optimizeImageSize: function() {
    var w = $(document).width();
    $('.feature').attr( 'src', function() {
      return $(this).data('src') + '?resize=' + w * 2 + ',400';
    });
  }
};
