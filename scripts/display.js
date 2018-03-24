Display = {
	// _log: null,
	// _map_view: null;
	// _map_title: null;
	// _map_zoom: null;
	// _styles: null;

	// Initialise finds all elements and does ini
	Initialise: function () {
		Display._log = document.getElementById("log");
		Display._map_viewer = document.getElementById("map-viewer");
		Display._map_title = document.getElementById("map-title");
		Display._map_zoom = 1;

		Display._styles = {
			"green": "color:lightgreen;",
			"red": "color:red;",
			"underline": "text-decoration:underline",
			"u": "text-decoration:underline",
			"emphasis": "font-style:italic",
			"italic": "font-style:italic",
			"i": "font-style:italic",
		}
	},

	// LogMessage logs message to log box
	LogMessage: function (message) {
		message = Display.Format(message);
		Display._Append(Display._log, message);
	},

	// LogError prints a flavoured error message
	LogError: function (message) {
		Display.LogMessage("\\red{Error}: " + message);
	},

	// ClearFrame removes all content of a given frame.
	ClearFrame: function (frame) {
		if (frame == "log") {
			Display._Set(Display._log, "");
		}
	},

	// MapZoom changes font size of the map to 'zoom'
	MapZoom: function (direction) {
		Display._map_zoom += direction * 0.2;
		Display._map_zoom = Math.max(0.6, Display._map_zoom);
		Display._map_zoom = Math.min(2, Display._map_zoom);
		Display._map_viewer.style.fontSize = Display._map_zoom + "em";
		Display.MapRecenter();
	},

	MapRecenter: function () {
		// Display._map_viewer.scrollTo(0, Display._map_viewer.height/2);
	},

	// Format formats given string message with colours and trimming
	Format: function (message) {
		message = message.trim();

		// Find formats
		var format_start = message.search(/\\[a-z]+{.*?}/);
		while (format_start != -1) {
			var format_end = message.substring(format_start).indexOf("}") + 1;
			var snippet = message.slice(format_start, format_start + format_end);
			var format = snippet.slice(1, snippet.indexOf("{"));
			var contents = snippet.slice(format.length + 2, -1);

			var replacement = "";
			if (format == "command") {
				replacement = "<a onclick=\"Input.Prefill('" + contents + "');\" href=\"javascript:void(0);\">" + contents + "</a>";
			} else {
				replacement = "<span style=\"" + Display._styles[format] + "\">" + contents + "</span>";
			}

			message = message.replace(snippet, replacement);
			format_start = message.search(/\\[a-z]+{.*?}/);
		}

		return message;
	},

	// _Append appends to end of element, and scrolls to new content
	_Append: function (element, message) {
		if (message.length < 0) {
			return;
		}

		// TODO(sam) : Add trimming of overful elements
		element.innerHTML += "<p>" + message + "</p>";
		element.scrollTop = element.scrollHeight;
	},

	// _Set replaces entire innerHTML of element with message
	_Set: function (element, message) {
		element.innerHTML = message;
	},
};