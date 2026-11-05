(function ($) {
  "use strict";

  var DEFAULT_FADE_MS = 400;
  var IO_THRESHOLD = 0.15;

  function getFadeMs($videoWrap) {
    var raw = $videoWrap.attr("data-video-card-duration");
    if (raw === undefined || raw === null || raw === "") {
      return DEFAULT_FADE_MS;
    }
    var ms = parseInt(raw, 10);
    if (isNaN(ms) || ms < 0) {
      return DEFAULT_FADE_MS;
    }
    return ms;
  }

  function getMedia(card) {
    var wrap = card.querySelector('[data-video-card="video"]');
    if (!wrap) return null;
    return wrap.querySelector("video");
  }

  function isContentVisible($content, $videoWrap) {
    return $content.is(":visible") && !$videoWrap.is(":visible");
  }

  function initCard(card) {
    var $card = $(card);
    var $content = $card.find('[data-video-card="content"]');
    var $videoWrap = $card.find('[data-video-card="video"]');
    var $trigger = $card.find('[data-video-card="trigger"]');
    var media = getMedia(card);

    if (!$content.length || !$videoWrap.length || !$trigger.length || !media) {
      return;
    }

    $videoWrap.hide();

    var fadeMs = getFadeMs($videoWrap);
    var animating = false;

    function setVideoActive(active) {
      $card.toggleClass("is-video-active", active);
    }

    function revealContent() {
      if (animating) return;
      if (isContentVisible($content, $videoWrap)) {
        setVideoActive(false);
        return;
      }

      animating = true;
      setVideoActive(false);

      $videoWrap.stop(true, true).fadeOut(fadeMs, function () {
        $content.stop(true, true).fadeIn(fadeMs, function () {
          animating = false;
        });
      });
    }

    function revealVideo(thenPlay) {
      if (animating) return;

      if ($videoWrap.is(":visible")) {
        if (typeof thenPlay === "function") thenPlay();
        return;
      }

      animating = true;
      setVideoActive(true);

      $content.stop(true, true).fadeOut(fadeMs, function () {
        $videoWrap.stop(true, true).fadeIn(fadeMs, function () {
          animating = false;
          if (typeof thenPlay === "function") thenPlay();
        });
      });
    }

    media.addEventListener("ended", function () {
      media.currentTime = 0;
      revealContent();
    });

    media.addEventListener("pause", function () {
      if (media.ended) {
        return;
      }
      revealContent();
    });

    $trigger.on("click", function (e) {
      e.preventDefault();

      revealVideo(function () {
        var playPromise = media.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function (err) {
            console.warn("[video-card] Playback failed:", err);
          });
        }
      });
    });

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.target !== card) return;
            if (entry.isIntersecting) return;
            if (!media.paused && !media.ended) {
              media.pause();
            }
          });
        },
        { threshold: IO_THRESHOLD, root: null }
      );
      observer.observe(card);
    }
  }

  function init() {
    $('[data-video-card="card"]').each(function () {
      initCard(this);
    });
  }

  $(init);
})(window.jQuery);
