/* Copyright 2016 AndrewPa */
var chattestApp = angular.module('chattestApp', ['chattestServices',
  'chattestControllers', 'chattestDirectives', 'ngSanitize']);

var temp_chatCache = {
  total: [],
  new : []
};

window.cur_sound = 0;
window.init_col = 0;
window.scroll_init_count = 0;

var cur_date = new Date();
cur_date.setTime(cur_date.getTime() + (10 * 365 * 24 * 60 * 60 * 1000));
var cookie_exp = cur_date.toGMTString();

//Prevents error upon directive initialization when DOM is not fully loaded
var message_area = {};
message_area.scrollTop = 0;

//Initial main option tab positions
var tab_pos = {
  main: {
    color: "0px",
    layout: "60px",
    system: "158px"
  }
};

var all_sounds = [];

(function initializeSounds() {

  // Expected filename style: name.format

  // Sounds courtesy of soundbible.com
  // Authors: Mark DiAngelo, DeepFrozenApps, Mike Koenig, snottyboy
  var allSoundFilenames = [
    "tick.mp3",
    "bop.mp3",
    "pop.mp3",
    "ping.mp3"
  ];

  allSoundFilenames.forEach(function(filename) {
    var audioName = filename.split(".")[0];
    var audioObj = new Audio("sounds/" + filename);
    window.all_sounds.push({
      name: audioName,
      sound: audioObj
    });
  });

})();

//Disable sounds notifications on mobile devices
//due to lower compatibility than desktop browsers
if (!detectMobile()) {
  window.playMsgNotification = function () {
    window.all_sounds[window.cur_sound].sound.play();
    return true;
  };
} else {
  window.playMsgNotification = function () {
    return true;
  };
}

$(document).ready(function () {
  //Stylesheet queries
  window.color_scheme = document.getElementById("color-scheme");

  window.all_color_schemes = [
    {
      name: "Tangerine",
      style: document.getElementsByTagName("link")[2]
    },
    {
      name: "Peppermint",
      style: document.getElementsByTagName("link")[3]
    },
    {
      name: "Blueberry",
      style: document.getElementsByTagName("link")[4]
    },
    {
      name: "Mango",
      style: document.getElementsByTagName("link")[5]
    },
    {
      name: "Strawberry",
      style: document.getElementsByTagName("link")[6]
    }
  ];
  window.all_layouts = [
    {
      name: "Default",
      style: ""
    }
  ];

  //JavaScript DOM queries
  window.chat_msg = document.getElementById("chat-msg");
  window.set_name = document.getElementById("set-name");
  window.send_msg = document.getElementById("send-msg");
  window.message_box = document.getElementById("message-box");
  window.message_area = document.getElementById("message-area");
  window.volume_slider = document.getElementById("volume-slider");
  window.msg_area_lock = document.getElementById("msg-area-lock");
  window.side_panel = document.getElementById("side-panel");
  window.members_panel = document.getElementById("members-panel");
  window.members_panel_names_container = document.getElementById("members-panel-names-container");
  window.input_toolbar = document.getElementById("input-toolbar");
  window.google_ads = document.getElementById("google-ads");
  window.social_popup = document.getElementById("social-popup");

  //jQuery DOM queries
  window.user_list = $("#user-list");
  window.pref_dialog = $("#pref-dialog");
  window.logout_dialog = $("#logout-dialog");
  window.social_options = $("#social-options");
  window.outside_area = $("#outside-area");

  //Initial DOM element behavior
  message_area.onscroll = function () {
    if (window.message_area.scrollTop === message_area.scrollTopMax) {
      window.scroll_toggle = true;
    } else {
      window.scroll_toggle = false;
    }
  };

  //jQuery UI Modal Boxes
  window.pref_dialog.dialog({
    autoOpen: false,
    modal: true,
    resizable: false,
    draggable: false,
    width: 290,
    buttons: {
      Close: function () {
        $(this).dialog("close");
      }
    }
  });
  pref_dialog.dialog("widget").attr("id", "fixed-pref-dialog");

  window.logout_dialog.dialog({
    autoOpen: false,
    modal: true,
    resizable: false,
    draggable: false,
    buttons: {
      Confirm: function () {
        $(this).dialog("close");
        window.location = "php/logout.php";
      },
      Cancel: function () {
        $(this).dialog("close");
      }
    }
  });
  logout_dialog.dialog("widget").attr("id", "fixed-logout-dialog");

  //Init operations
  window.scroll_toggle = true;
  window.vol_match = document.cookie.match(/vol=[0-9]0?;?/);
  window.snd_match = document.cookie.match(/snd=[0-8];?/);
  window.col_match = document.cookie.match(/col=[0-4];?/);
  window.social_options.toggle();
  window.outside_area.toggle();

  for (var i = 0; i < all_color_schemes.length; i++) {
    window.all_color_schemes[i].style.disabled = true;
  }

  if (vol_match) {
    window.init_vol = Number(vol_match[0].split(/[=;]/)[1]);
    volume_slider.value = window.init_vol;
  }
  volume_slider.onchange = changeVolume;
  changeVolume();

  if (col_match) {
    window.init_col = Number(col_match[0].split(/[=;]/)[1]);
  }
  changeColors(window.init_col);

  if (snd_match) {
    window.cur_sound = Number(snd_match[0].split(/[=;]/)[1]);
  }
});