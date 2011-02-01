
/**
 * OverlayPanelHost is a div that sits over the top of everything else. It's a
 * container for Panels
 * overlay.html belongs with this code
 */
(function(exports) {
  /**
   * The return value of OverlayPanelHost.createPanel()
   */
  function Panel(host, options) {
    this.host = host;
    Object.keys(options).forEach(function(key) {
      this[key] = options[key];
    }, this);
  }
  Panel.prototype.show = function() {
    this.host.show();
  };

  /**
   * DOM utility to do something like innerHTML without destroying the contents
   * of what's already in parent.
   */
  function appendHtmlToBody(parent, data) {
    var temp = document.createElement('div');
    temp.innerHTML = data;
    while (temp.hasChildNodes()) {
      parent.appendChild(temp.firstChild);
    }
  }

  /**
   * Static private resources for OverlayPanelHost
   */
  var dialog;
  var titleEle;
  var container;
  var background;

  var showing = false;
  function setShowing(value) {
    if (value != null) {
      showing = value;
    }
    if (background) {
      background.style.display = showing ? 'block' : 'none';
    }
    if (dialog) {
      dialog.style.display = showing ? 'block' : 'none';
    }
  }

  /**
   * A PanelHost hosts Panel objects. This uses an HTML overlay to do that
   */
  function OverlayPanelHost(bal) {
    this.bal = bal;
  }
  OverlayPanelHost.prototype.createPanel = function(options) {
    var panel = new Panel(this, options);
    if (!dialog) {
      this.bal.requireResource('lite/overlay.html', function(data) {
        appendHtmlToBody(document.body, data);
        background = document.getElementById('panelHostBackground');
        dialog = document.getElementById('panelHostTop');
        titleEle = document.getElementById('panelHostTitle');
        container = document.getElementById('panelHostContainer');

        background.addEventListener('click', function(ev) {
          setShowing(false);
        }, false);

        setShowing();
        this.createPanel(panel);
      }.bind(this));
    }
    else {
      titleEle.innerHTML = panel.title;
      this.bal.requireResource(panel.contents, function(data) {
        container.innerHTML = '';
        appendHtmlToBody(container, data);
      }.bind(this));

      this.bal.addStyleTag(panel.css);
      this.bal.addScriptTag(panel.script, function() {
      });
    }
    return panel;
  };

  OverlayPanelHost.prototype.show = function() {
    setShowing(true);
  };

  exports.OverlayPanelHost = OverlayPanelHost;
})(this);