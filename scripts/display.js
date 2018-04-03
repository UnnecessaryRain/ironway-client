Display = {
	Initialise() {
		Display._frames = {};
		Display._frames["log"] = document.getElementById("log");
		Display._frames["chat"] = document.getElementById("chat");
		Display._frames["map-viewer"] = document.getElementById("map-viewer");
		Display._frames["map-title"] = document.getElementById("map-title");
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
	LogMessage(message) {
		Display.Write("log", message, "APPEND");
	},
	
	// LogError prints a flavoured error message
	LogError(message) {
		message = "\\red{Error}: " + message;
		Display.Write("log", message, "APPEND");
	},

	// ClearFrame removes all content of a given frame.
	ClearFrame(frame) {
		Display.Write(frame, "", "REPLACE");
	},

	// Write a message to a frame, either append or replace mode
	Write(frame, message, mode) {
		message = Display.Format(message);

		if (mode == "APPEND") {
			Display._Append(Display._frames[frame], message);
		} else if (mode == "REPLACE") {
			Display._Set(Display._frames[frame], message);
		} else {
			console.warn("'mode' must be either 'APPEND' or 'REPLACE'", mode);
		}
	},

	// MapZoom changes font size of the map to 'zoom'
	MapZoom(direction) {
		Display._map_zoom += direction * 0.2;
		Display._map_zoom = Math.max(0.6, Display._map_zoom);
		Display._map_zoom = Math.min(2, Display._map_zoom);
		Display._frames["map-viewer"].style.fontSize = Display._map_zoom + "em";
	},

	// Format formats given string message with colours and trimming
	Format(message) {
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
	_Append(element, message) {
		if (message.length < 0) {
			return;
		}

		// TODO(#11) : Add trimming of overful elements
		element.innerHTML += "<p>" + message + "</p>";
		element.scrollTop = element.scrollHeight;
	},

	// _Set replaces entire innerHTML of element with message
	_Set(element, message) {
		element.innerHTML = message;
	},
};
