// This script is Automatic generation by tapper

var Tapper = Tapper || {}

var Tapper_Debug = false;
var Tapper_Debug_Host = "pepper.local";

Tapper.session = null;
Tapper.proxy = {}

/**
 * Core
 */
Tapper.core = function ($) {

    // T.B.D
    var PROXY_LEN = 1;
    // connect alproxy.
    var _connect = function (callback) {
        var proxy_num = PROXY_LEN;

        var get_service = function (name) {
            Tapper.session.service(name).then(
                // onSuccess.
                function (proxy) {
                    Tapper.proxy[name] = proxy;
                    proxy_num--;
                    if (proxy_num <= 0) callback();
                },
                // onFailed.
                function (error) {
                    console.error(error);
                    result_func();
                }
            );
        };

        QiSession(function (session) {
            Tapper.session = session;

            get_service('ALMemory');
            // get_service('ALTabletService');
        }, null, Tapper_Debug ? Tapper_Debug_Host : null);
    };

    var _bind = function () {
        // bind events.
        Tapper.utl.subscribeEvent("TwitterApp/UpdateTweetsListView", function (id) {
            alert('Test');
        });

        Tapper.utl.subscribeEvent("TwitterApp/Control/Recognition", function (id) {
            // Tapper.utl.raiseEvent("YoutubePlayer/View/Search", id);
            $("#modalContent").text(id);
            $("#input-search").val(id);
            localStorage.setItem("keyword", $("#input-search").val());
            var modal = document.getElementById('myModal');
            setTimeout(function() {
                modal.style.display = "none";
                $("#modalContent").text('お話しください');
            }, 3000);
        });

        Tapper.utl.subscribeEvent("TwitterApp/Control/NoRecognition", function (id) {
            $("#modalContent").text(id);
            // Tapper.utl.raiseEvent("YoutubePlayer/View/Search", id);
            var modal = document.getElementById('myModal');
            setTimeout(function() {
                modal.style.display = "none";
                $("#modalContent").text('お話しください');
            }, 3000);
        });

        Tapper.utl.subscribeEvent("TwitterApp/Control/Processing", function (id) {
            $("#modalContent").text(id);
        });
    };

    var _self = {
        init: function () {
            // Tapper.view.changeScene('{"id":"pageSearch"}');
            Tapper.view.init();
            // Tapper.contents.onLoad();
            _connect(function () {
                _bind();
                // alert('bind')
                // window.alert(wifiStatus);
                // Tapper.utl.getData("Tapper/InitData", function (data) {
                //     Tapper.init_data = JSON.parse(data);
                //     Tapper.contents.onStart();
                // }, Tapper.contents.onStart);
                // _preload_img();
                // Tapper.audio.init();
            });
        }
    };
    return _self;
}(jQuery);


/**
 * Common utility
 */
Tapper.utl = {
    raiseEvent: function (name, val) {
        Tapper.proxy.ALMemory.raiseEvent(name, val);
    },
    subscribeEvent: function (name, func) {
        var evt = new EventSubscription(name);
        Tapper.proxy.ALMemory.subscriber(name).then(function (sub) {
            evt.setSubscriber(sub);
            sub.signal.connect(func).then(function (id) {
                evt.setId(id);
            });
        });
        return evt;
    },
    getData: function (name, succeeded, failed) {
        Tapper.proxy.ALMemory.getData(name).then(succeeded, failed);
    }
};


/**
 * View utility
 */
Tapper.view = {
    init: function () {
      console.log('before ready')
      $(document).ready(function(){
        console.log(' ready')
        $("#loading-div").hide();
        $("#tweets-liv").hide();
        Tapper.utl.raiseEvent("TwitterApp/Start", "Start App");
      });

      $("#index-search").submit(function() {
        Tapper.utl.raiseEvent("TwitterApp/View/Search", "index-search");
        return false;
      });

      $("#btn-search").on('click touchstart', function () {
        // var str = $("#input-search").val();
        // if(processing == false && str.length > 0) {
          $("#loading-div").show();
          Tapper.utl.raiseEvent("TwitterApp/View/Search", "btn-search");
        // }
      });

      var btn_voice = document.getElementById("btn-voice");
      btn_voice.onclick = function() {
        Tapper.utl.raiseEvent("TwitterApp/View/Voice", "Voice");
      }


    }
};


/**
 * SubscribeEvent info class
 */
function EventSubscription(event) {
    this._event = event;
    this._internalId = null;
    this._sub = null;
    this._unsubscribe = false;
}
EventSubscription.prototype.setId = function (id) {
    this._internalId = id;
}
EventSubscription.prototype.setSubscriber = function (sub) {
    this._sub = sub;
}
EventSubscription.prototype.unsubscribe = function () {
    if (this._internalId != null && this._sub != null) {
        this._sub.signal.disconnect(this._internalId);
    } else {
        this._unsubscribe = true;
    }
}

$(Tapper.core.init);
