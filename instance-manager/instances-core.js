window.jQuery = window.$ = require('jquery');

		var zpath = 'C:/Users/' + process.env.username + '/AppData/Roaming/.zerra/Launcher/Instances/';

		var instances_holder = document.getElementById('instances');

		var Shuffle = require('shufflejs');
		
		const fse = require('fs-extra');

		var shuffle = new Shuffle(instances_holder, {
			itemSelector: '.instance',
			speed: 250,
			easing: 'ease',
			columnWidth: function (containerWidth) {
				return 128;
			},

			gutterWidth: function (containerWidth) {
				return 10;
			},
		});

		//!!Instance Loading!!
		function loadInstances(){
			fs.readdir(zpath, function(err, dirs){
				dirs.forEach(function(dir){
					fs.stat(zpath+"/"+dir, function(err, stats){ //Check for each instance
						if(stats.isDirectory()){ //Check if it's actually an instance/directory
							fs.readFile(zpath+"/"+dir+"/info.json", function(err, jdata){ //Load aaaaaalll data about the instance (json data)
								var data = JSON.parse(jdata); //UnJSONify

								//Instance Div
								var instance = document.createElement('div');
								instance.className = 'instance';
								instance.setAttribute("id", instances_holder.childElementCount);
								instance.addEventListener("onclick", openInstance(instance.getAttribute("id")));

								//Instance's Image
								var img = document.createElement('img');
								img.className = 'instance-img';
								img.src = zpath+"/"+dir+"/"+data.icon;

								instance.appendChild(img);

								//Instance's Name
								var name = document.createElement('h1');
								name.className = 'instance-name';
								name.innerText = data.name;

								instance.appendChild(name);

								instances_holder.appendChild(instance);

								shuffle.add([instance]);
							});
						}
					})
				});
			});
		}
		//!!End Of Instance Loading!!

		//!!Instance Creation!!
		//Hold data of instance before creating one.
		var newInstance_name;
		var newInstance_pathimg = "assets/res/icon.png"; //Image's path, set a Zerra image path as default
		var newInstance_ver;

		function createInstance() {
			newInstance_name = $("#nameInput").val();
			if (newInstance_name && newInstance_name != "") { //Check if user filled out the name
				if (newInstance_name.length <= 32) {
					//No need to check the image, because it'll be a default one if not picked.
					if (newInstance_ver != null) { //Check if user picked a version
						if (!fs.existsSync(zpath + newInstance_name + "/")) { //Basically check if there is an instance with the same name
							//Instance Div
							var instance = document.createElement('div');
							instance.className = 'instance';
							instance.setAttribute("id", instances_holder.childElementCount);
							instance.addEventListener("onclick", openInstance(instance.getAttribute("id")));

							//Instance's Image
							var img = document.createElement('img');
							img.className = 'instance-img';
							img.src = newInstance_pathimg;

							instance.appendChild(img);

							//Instance's Name
							var name = document.createElement('h1');
							name.className = 'instance-name';
							name.innerText = newInstance_name;

							instance.appendChild(name);

							instances_holder.appendChild(instance);

							shuffle.add([instance]);

							fs.mkdir(zpath + newInstance_name + "/", { recursive: true }, function (err) {
								if (!err) {
									fs.copyFile(newInstance_pathimg, zpath + newInstance_name + "/icon" + path.extname(newInstance_pathimg), function (err) { //Save a logo
										if (!err) { //Only continue when there wasn't any error
											//Create folders for each instance
											fs.mkdir(zpath + newInstance_name + "/Saves", { recursive: true }, function(){ if(err){console.log(err)} });
											fs.mkdir(zpath + newInstance_name + "/Mods", { recursive: true }, function(){ if(err){console.log(err)} });
											fs.mkdir(zpath + newInstance_name + "/Servers", { recursive: true }, function(){ if(err){console.log(err)} });

											var tempPath = 'C:/Users/' + process.env.username + '/AppData/Roaming/.zerra/Launcher/Shared/Zerra-' + newInstance_ver + '.jar';

											if(!fs.existsSync(tempPath)) {
												if (newInstance_ver != 'latest') {
													var req = request('http://216.53.217.165:8080/Game/Zerra-' + newInstance_ver + '.jar');
												} else {
													var req = request('http://216.53.217.165:8080/Game/latest');
												}

												req.pipe(fs.createWriteStream(tempPath));

												var contentSize;
												req.on('response', function(response) {
													console.log(response.statusCode);
													console.log('CONTENT SIZE - ' + response.headers['content-length']);
													contentSize = response.headers['content-length'];
												});

												var progress = 0;
												var progressBar = document.getElementById("DownloadProgress");
												req.on('data', function (chunk) {
													var segment = chunk.length;
													progress += segment;
													progressBar.style.width = Math.ceil((progress / contentSize * 100)) + '%';
													
													console.log('PROGRESS - ' + (progress / contentSize * 100) + '%');

													if((progress / contentSize) == 1) {
														//Hide this modal. We are done downloading.
														setTimeout(function(){
															$('#newInstanceModal').modal('hide');
														}, 1000);
														
														//Reset the progress bar.
														setTimeout(function(){
															progressBar.style.width = 0 + '%';
														}, 1250);
														
													}
												});

												fs.writeFile(zpath + newInstance_name + "/info.json", infoToJSON(), 'utf8', function(err){ //Save the JSON file holding information about this instance
													if(err){
														console.log(err);
													}
												});
											}else {

												var fileName = path.basename(tempPath);
												
												if(fileName.includes('latest')) {
													fileName = fileName.replace('Zerra-', '');
													fileName = fileName.replace('.jar', '');
												}

												var req = request('http://216.53.217.165:8080/Game/' + fileName);

												req.on('response', function(response) {
													var serverLength = response.headers['content-length'];

													const stats = fs.statSync(tempPath);
													const localLength = stats.size;

													if(localLength == serverLength) {
														console.log('FILE PASSED LENGTH VERIFICATION. DETEAILS BELOW: ');
														console.log('SERVER LENGTH: ' + serverLength);
														console.log('LOCAL FILE LENGTH: ' + localLength);
													}else {
														console.log('FILE DID (((NOT))) PASS LENGTH VERIFICATION. DETAILS BELOW: ');
														console.log('SERVER LENGTH: ' + serverLength);
														console.log('LOCAL FILE LENGTH: ' + localLength);
														console.log('REDOWNLOADING...');

														if (newInstance_ver != 'latest') {
															var req = request('http://216.53.217.165:8080/Game/Zerra-' + newInstance_ver + '.jar');
														} else {
															var req = request('http://216.53.217.165:8080/Game/latest');
														}

														req.pipe(fs.createWriteStream(tempPath));

														var contentSize;
														req.on('response', function(response) {
															console.log(response.statusCode);
															console.log('CONTENT SIZE - ' + response.headers['content-length']);
															contentSize = response.headers['content-length'];
														});

														var progress = 0;
														var progressBar = document.getElementById("DownloadProgress");
														req.on('data', function (chunk) {
															var segment = chunk.length;
															progress += segment;
															progressBar.style.width = Math.ceil((progress / contentSize * 100)) + '%';
															
															console.log('PROGRESS - ' + (progress / contentSize * 100) + '%');

															if((progress / contentSize) == 1) {
																//Hide this modal. We are done downloading.
																setTimeout(function(){
																	$('#newInstanceModal').modal('hide');
																}, 1000);
																
																//Reset the progress bar.
																setTimeout(function(){
																	progressBar.style.width = 0 + '%';
																}, 1250);
																
															}
														});

														fs.writeFile(zpath + newInstance_name + "/info.json", infoToJSON(), 'utf8', function(err){ //Save the JSON file holding information about this instance
															if(err){
																console.log(err);
															}
														});
													}
													$('#newInstanceModal').modal('hide');
												});
											}
										} else {
											console.log(err);
											$("#newAlertText").text("Couldn't save an instance image!");
										}
									});
								} else {
									$("#newAlertText").text("Couldn't create an instance directory!");
								}
							});
						} else {
							$("#newAlertText").text("An instance with that name already exists!");
						}
					} else {
						$("#newAlertText").text("No version selected!");
					}
				} else {
					$("#newAlertText").text("The instance name can be no greater than 32 characters!");
				}
			} else {
				$("#newAlertText").text("The name of the instance is not valid!");
			}
		}

		function newInstanceImg() {
			const { dialog } = require('electron').remote;
			const path = require('path');

			dialog.showOpenDialog({
				properties: ['openFile'],
				filters: [
					{
						"name": "Images",
						"extensions": ["png", "jpg", "jpeg", "bmp"]
					}
				],
				defaultPath: 'C:/Users/' + process.env.username + '/AppData/Roaming/.zerra/Instances/'
			}, function (files) {
				icon: path.join(__dirname, 'assets/res/icon.png')
				if (files !== undefined) {
					frame: false

					var img = new Image();
					img.src = files[0] + '?' + new Date().getTime();
					img.addEventListener("load", function() { //Only continue if the image has fully loaded
						if (img.width && img.height) { //Check if the image... well is something.
								if (img.width == img.height) {
									$("#previewImg").attr("src", files[0] + '?' + new Date().getTime());
									newInstance_pathimg = files[0];
								} else {
									$("#newAlertText").text("The selected icon's width does not equal its height!");
								}
						} else {
							$("#newAlertText").text("Selected image couldn't be loaded.");
						}
					});
				}
			});
		}

		function newInstanceVersion(element) {
			const { dialog } = require('electron').remote;
			const path = require('path');

			$("#dropdownVersionButton").text(element.id);

			newInstance_ver = element.id;
		}

		function infoToJSON() {
			var pinfo = { //Pure non JSON info
				name: newInstance_name,
				version: newInstance_ver,
				icon: "icon"+path.extname(newInstance_pathimg) //Make it relative to the launcher to make it "portable"
			};
			var info = JSON.stringify(pinfo); //JSONifny
			return info;
		}

		//!!End Of Instance Creation!!

		//!!Instance Importing!!

		var impInstance_path;
		var impInstance_method;

		function importInstance(){
			if(impInstance_method == "Move"){
				fs.readdir(impInstance_path, function(err){ //Check if instance still exists
					if(!err){

						fs.readFile(impInstance_path + "/info.json", function(err, jdata){
							if(!err){
								var data = JSON.parse(jdata) //again unJSONify
								if(data.name && data.version && data.icon){ //Check if everything is in place, again
									if (!fs.existsSync(zpath + data.name + "/")) { //Basically check if there is an instance with the same name, aaaagain...
										fse.move(impInstance_path, zpath+"/"+data.name, function(){
											if(!err){
												//Instance Div
												var instance = document.createElement('div');
												instance.className = 'instance';
												instance.setAttribute("id", instances_holder.childElementCount);
												instance.addEventListener("onclick", openInstance(instance.getAttribute("id")));

												//Instance's Image
												var img = document.createElement('img');
												img.className = 'instance-img';
												img.src = impInstance_path+"/"+data.icon;

												instance.appendChild(img);

												//Instance's Name
												var name = document.createElement('h1');
												name.className = 'instance-name';
												name.innerText = data.name;

												instance.appendChild(name);

												instances_holder.appendChild(instance);

												shuffle.add([instance]);

												$('#impInstanceModal').modal('hide');
											} else {
												$("#impAlertText").text("Couldn't create an instance directory!");
											}
										});
									} else {
										$("#impAlertText").text("An instance with that name already exists!");
									}
								} else {
									$("#impAlertText").text("Selected instance is possibly corrupted.");
								}
							} else {
								$("#impAlertText").text("Selected instance is possibly corrupted.");
							}
						});

					} else {
						$("#impAlertText").text("Selected instance couldn't be loaded. It was either deleted or moved.");
					}
				});
			}else if(impInstance_method == "Copy"){
				fs.readdir(impInstance_path, function(err){ //Check if instance still exists
					if(!err){

						fs.readFile(impInstance_path + "/info.json", function(err, jdata){
							if(!err){
								var data = JSON.parse(jdata) //again unJSONify
								if(data.name && data.version && data.icon){ //Check if everything is in place, again
									if (!fs.existsSync(zpath + data.name + "/")) { //Basically check if there is an instance with the same name, aaaagain...
										fse.copy(impInstance_path, zpath+"/"+data.name, function(){
											if(!err){
												//Instance Div
												var instance = document.createElement('div');
												instance.className = 'instance';
												instance.setAttribute("id", instances_holder.childElementCount);
												instance.addEventListener("onclick", openInstance(instance.getAttribute("id")));

												//Instance's Image
												var img = document.createElement('img');
												img.className = 'instance-img';
												img.src = impInstance_path+"/"+data.icon;

												instance.appendChild(img);

												//Instance's Name
												var name = document.createElement('h1');
												name.className = 'instance-name';
												name.innerText = data.name;

												instance.appendChild(name);

												instances_holder.appendChild(instance);

												shuffle.add([instance]);

												$('#impInstanceModal').modal('hide');
											} else {
												$("#impAlertText").text("Couldn't create an instance directory!");
											}
										});
									} else {
										$("#impAlertText").text("An instance with that name already exists!");
									}
								} else {
									$("#impAlertText").text("Selected instance is possibly corrupted.");
								}
							} else {
								$("#impAlertText").text("Selected instance is possibly corrupted.");
							}
						});

					} else {
						$("#impAlertText").text("Selected instance couldn't be loaded. It was either deleted or moved.");
					}
				});
			}
		}

		function impInstanceSelect(){
			const { dialog } = require('electron').remote;
			const path = require('path');

			dialog.showOpenDialog({
				properties: ['openDirectory'],
				defaultPath: 'C:/Users/' + process.env.username + '/AppData/Roaming/.zerra/Instances/'
			}, function (files) {
				icon: path.join(__dirname, 'assets/res/icon.png')
				if (files !== undefined) {
					frame: false

					fs.readdir(files[0], function(err){
						if(!err){
							fs.readFile(files[0]+"/info.json", function(err, jdata){
								if(!err){
									var data = JSON.parse(jdata); //again unJSONify
									if(data.name && data.version && data.icon){ //Check if everything is in place
										if (!fs.existsSync(zpath + "/" + data.name + "/")) { //Basically check if there is an instance with the same name
											$("#impInstance_name").text("Instance Name: "+data.name);
											$("#impInstance_ver").text("Instance Version: "+data.version);
											$("#impInstance_img").text("Instance Icon:");

											$("#impInstance_previmg").attr("width", 64);
											$("#impInstance_previmg").attr("height", 64);
											$("#impInstance_previmg").attr("src", files[0]+"/"+data.icon);
											impInstance_path = files[0];
										} else {
											$("#impAlertText").text("An instance with that name already exists!");
										}
									} else {
										$("#impAlertText").text("Selected instance is possibly corrupted.");
									}
								} else {
									$("#impAlertText").text("Selected instance is possibly corrupted.");
								}
							});
						}else{
							$("#impAlertText").text("Selected instance couldn't be loaded.");
						}
					});
				}
			});
		}

		function impInstanceMethod(element){
			$("#dropdownImpMethodButton").text(element.text);
			impInstance_method = element.text;
		}

		//!!End Of Instance Importing!!

		function openInstance(id) {
		}

		//Just close...
		function closeWindow() {
			const remote = require('electron').remote;
			var window = remote.getCurrentWindow();
			window.close();
		}