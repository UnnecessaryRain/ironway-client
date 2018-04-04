Display = {
	/**
	 * Initialise finds all html elements and maps them to their id.
	 * @public
	 */
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

	/**
	 * LogMessage alias to append to log frame
	 * 
	 * @public
	 * @param {string} message Message to log
	 */
	LogMessage(message) {
		Display.Write("log", message, "APPEND");
	},

	/**
	 * LogError alias to append to log frame with formatting
	 * 
	 * @public
	 * @param {string} message Message to log
	 */
	LogError(message) {
		message = "\\red{Error}: " + message;
		Display.Write("log", message, "APPEND");
	},

	/**
	 * ClearFrame alias to replace frame with empty string.
	 * Effectively clears a frame.
	 * 
	 * @public
	 * @param {string} frame ID of frame to clear
	 */
	ClearFrame(frame) {
		Display.Write(frame, "", "REPLACE");
	},

	/**
	 * Write a message to a given frame.
	 * 
	 * @public
	 * @param {string} frame ID of the frame to change
	 * @param {string} message Message to append/set to the frame
	 * @param {string} mode "REPLACE" to replace all contents. "APPEND" to add new element.
	 */
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

	/**
	 * MapZoom changes the 'zoom' of the map-view. Uses font size.
	 * 
	 * @public
	 * @param {number} direction Direction to zoom. -1 zooms in. +1 zooms out.
	 */
	MapZoom(direction) {
		Display._map_zoom += direction * 0.2;
		Display._map_zoom = Math.max(0.6, Display._map_zoom);
		Display._map_zoom = Math.min(2, Display._map_zoom);
		Display._frames["map-viewer"].style.fontSize = Display._map_zoom + "em";
	},

	/**
	 * Fromat parses given message to detect for \style{message} syntax.
	 * Does additional clean up or checking. Does NOT sanatise.
	 * 
	 * @public
	 * @param {string} message Message to format. eg: "cool \green{dog}"
	 * @returns {string} Formatted HTML. eg: "cool <span style='..'>dog</span>"
	 */
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

	/**
	 * _Append adds a new paragraph element to a given frame
	 * 
	 * @private
	 * @param {HTML Element} element Element in DOM, that has innerHTML
	 * @param {string} message Message to append to element
	 */
	_Append(element, message) {
		if (message.length < 0) {
			return;
		}

		// TODO(#11) : Add trimming of overful elements
		element.innerHTML += "<p>" + message + "</p>";
		element.scrollTop = element.scrollHeight;
	},

	/**
	 * _Set overwrite entire element content with new content
	 * 
	 * @private
	 * @param {HTML Element} element Element in DOM, that has innerHTML
	 * @param {string} message Message to set on element
	 */
	_Set(element, message) {
		element.innerHTML = message;
	},
};