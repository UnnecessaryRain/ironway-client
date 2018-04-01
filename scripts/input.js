Input = {
	Initialise() {
		Input._input = document.getElementById("input-command");
		Input._history = [];
		Input._history_index = -1;
		Input._binds = {};
		Input._override_binds = [];

		Input._Focus();
		Input._ResetBinds();
		document.addEventListener('keydown', Input._TryKey, false);
	},

	// AddBind adds a bind associated with a key. Action must be a function.
	AddBind(key, action) {
		if (Input._override_binds.includes(key)) {
			Display.LogError("Keycode '" + key + "' is a reserved system bind.");
			return;
		}

		// TODO(#6) : Push new bind config to server
		Input._binds[key] = action;
		Display.LogMessage("Key \\green{" + key + "} has been bound!");
	},

	// RemoveBind deletes the bind associated with a key
	RemoveBind(key) {
		if (Input._override_binds.includes(key)) {
			Display.LogError("Keycode '" + key + "' is a reserved system bind.");
			return;
		}
		// TODO(#6) : Push new bind config to server
		delete Input._binds[key];
		Display.LogMessage("Key \\green{" + key + "} has been unbound!");
	},

	// Prefill populates the input box with suggested command
	Prefill(command) {
		Input._input.value = command;
		Input._input.value = Input._input.value;
		Input._Focus();
	},

	// RecordsHistory saves last command (if not repeated)
	RecordHistory(command) {
		Input._history_index = -1;
		if (Input._history.length > 0) {
			if (command == Input._history[0]) {
				return;
			}
		}

		Input._history.unshift(command);
	},

	_HistoryCycle(direction) {
		Input._history_index += direction;
		Input._history_index = Math.max(-1, Input._history_index);
		Input._history_index = Math.min(Input._history.length - 1, Input._history_index);

		if (Input._history_index == -1) {
			Input.Prefill("");
		} else {
			Input.Prefill(Input._history[Input._history_index]);
		}
	},

	// _TryKey executes any bound found to the key 
	_TryKey(event) {
		// Can't interrupt input unless special bind
		if (Input._IsFocused() && !Input._override_binds.includes(event.key)) {
			return;
		}

		if (event.key in Input._binds) {
			Input._binds[event.key].call();
		}
	},

	// _ResetBinds removes old binds and readds defaults
	_ResetBinds() {
		Input._binds = {};
		Input._override_binds = [];

		// Select input or send
		Input.AddBind("Enter", function () {
			if (Input._IsFocused()) {
				Client.RunCommand(Input._input.value);
				Input._input.value = "";
			} else {
				Input._Focus();
			}
		});

		// Defocus input
		Input.AddBind("Escape", function () {
			Input._Defocus();
		});

		// Quick command input
		Input.AddBind("/", function () {
			if (!Input._IsFocused()) {
				Input._Focus();
			}
		});

		// Previous history
		Input.AddBind("ArrowUp", function () {
			if (Input._IsFocused()) {
				Input._HistoryCycle(1);
			}
		});

		// Previous history
		Input.AddBind("ArrowDown", function () {
			if (Input._IsFocused()) {
				Input._HistoryCycle(-1);
			}
		});

		Input._override_binds = ["Enter", "Escape", "/", "ArrowUp", "ArrowDown"];

		// Zoom map in
		Input.AddBind("=", function () {
			Client.RunCommand("//zoom in");
		});

		// Zoom map out
		Input.AddBind("-", function () {
			Client.RunCommand("//zoom out");
		});
	},

	// _Focus focuses on the input
	_Focus() {
		Input._input.focus();
	},

	// _Defocus on input box
	_Defocus() {
		Input._input.blur();
		document.activeElement.blur();
	},

	// _IsFocused checks if _input box is currently selected
	_IsFocused() {
		return (Input._input === document.activeElement);
	},
};
