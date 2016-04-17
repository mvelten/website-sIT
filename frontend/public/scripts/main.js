$(window).ready(function () {
  "use strict";

  checkTab();

  $(window).on("hashchange", checkTab);

  $(".nav-tabs a").click(function () {
    var $body = $("body");
    var scroll = $body.scrollTop();
    $(this).tab("show");
    window.location.hash = this.hash;
    $body.scrollTop(scroll);
  });

  function checkTab() {
    var hash = window.location.hash;
    if (hash) { $("ul.nav a[href=\"" + hash + "\"]").tab("show"); }
  }

});
