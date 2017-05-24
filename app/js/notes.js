$_ready(() => {

	$("[data-view='notes']").on("click", "[data-action]",function(){
		switch ($_(this).data("action")) {

			case "settings":
				show("settings");
				break;

			case "new-notebook":
				show("new-notebook");
				break;

			case "delete":
				deltempid = $_(this).data("id");
				$_("[data-modal='delete-note']").addClass("active");
				break;

			case "update":
				shell.openExternal("https://skrifa.xyz/#Download");
				break;

			case "edit-notebook":
				$_("[data-form='edit-notebook'] [data-input='name']").value($_('.logo h1').text()),
				$_("[data-form='edit-notebook'] [data-input='description']").value($_('.logo small').text())
				show("edit-notebook");
				break;

			case "delete-notebook":
				show("delete-notebook");
				break;

			case "new-note":
				var date = new Date().toLocaleString();

				var color = colors[Math.floor(Math.random()*colors.length)];
				db.note.add({
					Title: "New Note",
					Content: '<h1>New Note</h1>',
					CreationDate: date,
					ModificationDate: date,
					SyncDate: "",
					Color: color,
					Notebook: notebook
				}).then(function(lastID){
					addNote(lastID, "New Note", color);
					show('notes');
				});
				break;

			case "change-view":
				if($_(this).hasClass("fa-th")){
					$("[data-content='note-container']").removeClass("grid");
					$_("[data-content='note-container']").addClass("list");
					Storage.set('view', "list");
				}else{
					$_("[data-content='note-container']").removeClass("list");
					$_("[data-content='note-container']").addClass("grid");
					Storage.set('view', "grid");
				}
				$_(this).toggleClass("fa-th fa-th-list");
				//loadNotes();
				break;

			// Shows the edit screen of a note.
			case "edit":
				if(id == null){
					id = $_(this).data("id");
				}
				db.note.where(":id").equals(parseInt(id)).first().then(function (note) {
					$_("#editor").html(note.Content);
					currentContent = note.Content;
					show("editor");
				});
				break;

			case "preview":
				if(unsaved){
					$_("[data-form='unsaved'] input").value('preview');
					$_("[data-modal='unsaved']").addClass('active');
				}else{

					if(id == null){
						id = $_(this).data("id");
						currentContent = null;
					}

					db.note.where(":id").equals(parseInt(id)).first().then(function (note) {
						$_("#preview").html(note.Content);
						Prism.highlightAll(true, null);
						(function(){
							if (!self.Prism) {
								return;
							}
							Prism.hooks.add('wrap', function(env) {
								if (env.type !== "keyword") {
									return;
								}
								env.classes.push('keyword-' + env.content);
							});
						})();

						MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
						show("preview");
					});
				}
				break;

			case "import-note":
				wait("Importing New Note");
				dialog.showOpenDialog({
					title: "Import a Note",
					buttonLabel: "Import",
					filters: [
					    {name: 'Custom File Type', extensions: ['skrifa', 'md', 'txt', 'docx']},
					],
					properties: ['openFile']
				},
				function(file){
					if(file){
						fs.readFile(file[0], 'utf8', function (error, data) {
							if(error){
								dialog.showErrorBox("Error reading file", "There was an error reading the file, note was not imported.");
								show("notes");
							}else{
								var extension = file[0].split(".").pop();

								switch(extension){
									case "md":
										var md = new MarkdownIt();
										var html = md.render(data);
										var date = new Date().toLocaleString();
										var h1 = $(html).filter("h1").text().trim();
										h1 = h1 != "" ? h1: 'Imported Note';
										if(h1 && html && date){

											var color = colors[Math.floor(Math.random()*colors.length)];
											db.note.add({
												Title: h1,
												Content: html,
												CreationDate: date,
												ModificationDate: date,
												SyncDate: '',
												Color: color,
												Notebook: notebook
											}).then(function(lastID){
												addNote(lastID, h1, color);
												show('notes');
											});
										}else{
											show("notes");
										}
										break;

									case "docx":
										mammoth.convertToHtml({path: file[0]}).then(function(result){
											var html = result.value; // The generated HTML
											var messages = result.messages; // Any messages, such as warnings during conversion
											var date = new Date().toLocaleString();
											var h1 = $(html).filter("h1").text().trim();
											h1 = h1 != "" ? h1: 'Imported Note';
											if(h1 && html && date){

												var color = colors[Math.floor(Math.random()*colors.length)];
												db.note.add({
													Title: h1,
													Content: html,
													CreationDate: date,
													ModificationDate: date,
													SyncDate: '',
													Color: color,
													Notebook: notebook
												}).then(function(lastID){
													addNote(lastID, h1, color);
													show('notes');
												});
											}else{
												show("notes");
											}

										}).done();
										break;

									case "skrifa":
										var json = JSON.parse(data);
										if(json.Title && json.Content && json.CDate && json.MDate && json.Color){

											var date = new Date().toLocaleString();

											db.note.add({
												Title: json.Title,
												Content: json.Content,
												CreationDate: json.CDate,
												ModificationDate: date,
												SyncDate: '',
												Color: json.Color,
												Notebook: notebook
											}).then(function(lastID){
												addNote(lastID, json.Title, json.Color);
												show('notes');
											});
										}

										break;

									case "txt":
										var date = new Date().toLocaleString();

										var regex = /.*\n/g;
										var html = "";

										while ((m = regex.exec(data)) !== null) {
										    // This is necessary to avoid infinite loops with zero-width matches
										    if (m.index === regex.lastIndex) {
										        regex.lastIndex++;
										    }

										    // The result can be accessed through the `m`-variable.
										    m.forEach((match, groupIndex) => {
												html += `<p>${match}</p>`
										    });
										}

										var color = colors[Math.floor(Math.random()*colors.length)];
										db.note.add({
											Title: "Imported Note",
											Content: html,
											CreationDate: date,
											ModificationDate: date,
											SyncDate: '',
											Color: color,
											Notebook: notebook
										}).then(function(lastID){
											addNote(lastID, "Imported Note", color);
											show('notes');
										});
										break;

									case "html":
										var html = data;
										var date = new Date().toLocaleString();
										var h1 = $(html).filter("h1").text().trim();
										h1 = h1 != "" ? h1: 'Imported Note';
										if(h1 && html && date){
											var color = colors[Math.floor(Math.random()*colors.length)];
											db.note.add({
												Title: h1,
												Content: html,
												CreationDate: date,
												ModificationDate: date,
												SyncDate: '',
												Color: color,
												Notebook: notebook
											}).then(function(lastID){
												addNote(lastID, h1, color);
												show('notes');
											});
										}else{
											show("notes");
										}
										break;
								}

							}
						});
					} else {
						show("notes");
					}
				});
				break;
		}
	});

	// Click handler for the sidenav notebook buttons
	$_("[data-content='notebook-list']").on("click", "[data-notebook]", function(){
		if(notebook != $_(this).data("notebook") + ""){
			notebook = $_(this).data("notebook") + "";

			$_(".logo h1").text($_(this).text());

			if (notebook != "Inbox") {
				db.notebook.where("id").equals(parseInt(notebook)).first(function(item, cursor){
					$_(".logo small").text(item.Description);
					$_("[data-action='edit-notebook']").style({display: "inline-block"});
					$_("[data-action='delete-notebook']").style({display: "inline-block"});
				});
			} else {
				$_(".logo small").text("A place for any note");
				$_("[data-action='edit-notebook']").hide();
				$_("[data-action='delete-notebook']").hide();
			}
			$("[data-view='notes'] .side-nav").removeClass("active");
			loadNotes();
		}
	});

	$_("[data-content='notebook-list']").on("dragover", " li", function(event) {
		event.preventDefault();
		event.stopPropagation();
		$_(this).addClass("drag-hover");
	});

	$_("[data-content='notebook-list']").on("dragleave", " li", function(event) {
		event.preventDefault();
		event.stopPropagation();
		$_(this).removeClass("drag-hover");
	});

	$_("[data-content='note-container']").on("drag", "article", function(event) {
		event.preventDefault();
		event.stopPropagation();
		dragging = event.srcElement.dataset.nid;
	});

	$_("[data-content='notebook-list']").on("drop", " li" ,function(event) {
		event.preventDefault();
		event.stopPropagation();
		dragTarget = event.target.dataset.notebook;
		$_(this).removeClass("drag-hover");

		// Check if the note is not being moved to the same notebook
		if (dragTarget != notebook) {
			db.transaction('rw', db.note, function() {
				db.note.where("id").equals(parseInt(dragging)).modify({Notebook: dragTarget});
				$_("[data-nid='" + dragging + "']").remove();
				dragging = null;
				dragTarget = null;
			});
		}
	});

	$_("[data-form='delete-note']").submit(function(event){
		event.preventDefault();
		db.note.where("id").equals(parseInt(deltempid)).delete().then(function(){
			$_("[data-nid='" + deltempid + "']").remove();
			$_("[data-modal='delete-note']").removeClass("active");
			deltempid = null;
		});
	});

	$_("[data-form='delete-note'] [type='reset']").click(function(){
		deltempid = null;
		$_("[data-modal='delete-note']").removeClass("active");
	});

});