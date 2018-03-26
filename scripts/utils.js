Utils = {
	EscapeHtml: function(text) {
		debugger;
		var div = document.createElement('div');
		div.appendChild(document.createTextNode(text));
		return div.innerHTML;
	}
}
