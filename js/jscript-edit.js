function onload(){
	var myFirebaseLib = new Firebase("https://ad-hoc.firebaseio.com/");
	var edit_or_not = myFirebaseLib.child("edit");
	var info = myFirebaseLib.child("info");
	var rating = myFirebaseLib.child("rating");
	var comment = myFirebaseLib.child("comment");
	var tag = myFirebaseLib.child("tags");
	
	display_left_nav();
	
	edit_or_not.once("value", function(snapshot){
		if(snapshot.val() != "no"){
			var image_src = snapshot.val();
			var edit_image = image_src.substring(0, image_src.indexOf("-"));
			var file = image_src.substring(image_src.indexOf("-") + 1, image_src.length);
			
			document.getElementById("image_container").innerHTML =  '<img src="memes/' + edit_image + '" alt="random" id="edit_image">';
		
		
			info.child(image_src.substring(0, image_src.indexOf("."))).once("value", function(infosnap){
				var infos = infosnap.val();
				var url = infos[0];
				var date = infos[1];
			
				document.getElementById("edit_url").innerHTML = url;
				document.getElementById("edit_time").innerHTML = date;

			});
			
			rating.child(image_src.substring(0, image_src.indexOf("."))).once("value", function(ratingsnap){
				var rateArray = ratingsnap.val();
				var numOfStars = rateArray[0];
				var remaingStars = 5 - numOfStars;
			
				document.getElementById("edit_rating").innerHTML = '';
		
				for(var i = 0; i < numOfStars; i++){
					document.getElementById("edit_rating").innerHTML += '<img src = "images/star_on.jpg" alt = "staron">';
				}
			
				for(var i = 0; i < remaingStars; i++){
					document.getElementById("edit_rating").innerHTML += '<img src = "images/star_off.jpg" alt = "staroff">';
				}
			});
			
			comment.once("value", function(commentSnap){
				if(commentSnap.hasChild(file) == false){
					var fileChild = comment.child(file);
					image_src = image_src.substring(0, image_src.indexOf("-"));
					var picture = image_src.substring(0, image_src.indexOf("."));
					var image = fileChild.child(picture);
					var commentArray = new Array();
					commentArray[0] = "default";
					image.set(commentArray);
					
					document.getElementById("edit_commentbox").innerHTML = '';
					document.getElementById("edit_commentbox").innerHTML += '<p id="no_comment" style ="display:initial;">&nbsp; No Comments </p><hr>';
					document.getElementById("comment").setAttribute("onkeypress", "javascript: show_and_save_comment('new', event, '" + file + "', '" + picture + "');");
				}
				
				else{
					var fileChild = comment.child(file);
					image_src = image_src.substring(0, image_src.indexOf("-"));
					var picture = image_src.substring(0, image_src.indexOf("."));
					fileChild.once("value", function(snap){
						if(snap.hasChild(picture) == false){
							var image = fileChild.child(picture);
							var commentArray = new Array();
							commentArray[0] = "default";
							image.set(commentArray);
					
							document.getElementById("edit_commentbox").innerHTML = '';
							document.getElementById("edit_commentbox").innerHTML += '<p id="no_comment" style ="display:initial;">&nbsp; No Comments </p><hr>';
							document.getElementById("comment").setAttribute("onkeypress", "javascript: show_and_save_comment('new', event, '" + file + "', '" + picture + "');");
						}
						
						else{
							var image = fileChild.child(picture);
							document.getElementById("edit_commentbox").innerHTML = '';
							image.once("value", function(snapshot){
								var commentArray = snapshot.val();
								
								if(commentArray.length == 1){
									document.getElementById("edit_commentbox").innerHTML = '';
									document.getElementById("edit_commentbox").innerHTML += '<p id="no_comment" style ="display:initial;">&nbsp; No Comments</p><hr>';
									document.getElementById("comment").setAttribute("onkeypress", "javascript: show_and_save_comment('new', event, '" + file + "', '" + picture + "');");
								}
								
								else{
									for(var i =1; i < commentArray.length; i++){
										document.getElementById("edit_commentbox").innerHTML += '<p>&nbsp;' + commentArray[i] + '<button type="button" style = "float:right;opacity:.4;cursor:pointer;margin-top:-5%;"><b style="font-size: 10px;" onclick = "delete_comment(\'' + commentArray[i] + '\', \'' + picture + '\', \'' + file + '\')">x</b></button></p><hr>';
									}
									document.getElementById("comment").setAttribute("onkeypress", "javascript: show_and_save_comment('existing', event, '" + file + "', '" + picture + "');");
								}
							});
						}
					});
				}
			});
			
			
			tag.once("value", function(snap){
				//alert(file);
				if(snap.hasChild(file) == false){
					var fileChild = tag.child(file);
					var picture = image_src.substring(0, image_src.indexOf("."));
					var imageChild = fileChild.child(picture);
					var tagArray = new Array();
					tagArray[0];
					imageChild.set(tagArray);
					document.getElementById("form").setAttribute("onkeyup", "javascript: save_tags(event, '" + file + "', '" + picture + "');");
				}
				
				else{
					var fileChild = tag.child(file);
					var picture = image_src.substring(0, image_src.indexOf("."));
					
					fileChild.once("value", function(snaptag){
						if(snaptag.hasChild(picture) == false){
							var imageChild = fileChild.child(picture);
							var tagArray = new Array();
							tagArray[0];
							imageChild.set(tagArray);
							document.getElementById("form").setAttribute("onkeyup", "javascript: save_tags(event, '" + file + "', '" + picture + "');");
						}
						else{
							var imageChild = fileChild.child(picture);
					
							//alert(picture);
							imageChild.once("value", function(tagsnap){
								var taglist = tagsnap.val();
								$('#tags_1').importTags(taglist);
								document.getElementById("form").setAttribute("onkeyup", "javascript: save_tags(event, '" + file + "', '" + picture + "');");
								var el = document.getElementsByClassName("tag");
								for(var i = 0; i <el.length; i++){
									el[i].children[1].setAttribute("onclick", "javascript:remove_tag('" + file + "', '" + picture + "');");
								}
							});
						}
					});
				}
			});
			
		}
	});
}


function remove_tag(file, pic){
	var myFirebaseLib = new Firebase("https://ad-hoc.firebaseio.com/");
	var tag = myFirebaseLib.child("tags");
	var fileChild = tag.child(file);
	var imageChild = fileChild.child(pic);
	
	imageChild.set(document.getElementById("tags_1").value);
}

function save_tags(e, file, picname){
	if(e.keyCode == 13){
		//alert(document.getElementById("tags_1").value);
		var myFirebaseLib = new Firebase("https://ad-hoc.firebaseio.com/");
		var tag = myFirebaseLib.child("tags");
		var file_containing_tags = tag.child(file);
		var image_containing_tags = file_containing_tags.child(picname);
		
		var tag = document.getElementById("tags_1").value;
		image_containing_tags.set(tag);
	}
}

function show_and_save_comment(existing, evt, file, image_name){
	var myFirebaseLib = new Firebase("https://ad-hoc.firebaseio.com/");
	var comment = myFirebaseLib.child("comment");
	
	if(evt.keyCode == 13){
		if(existing == "new"){
			var comment_input = document.getElementById("comment").value;
			document.getElementById("comment").value = '';
			document.getElementById("no_comment").style.display == 'none'
			document.getElementById("edit_commentbox").innerHTML = '';
			
			document.getElementById("comment").setAttribute("onkeypress", "javascript: show_and_save_comment('existing', event, '" + file + "', '" + image_name + "');");

			document.getElementById("edit_commentbox").innerHTML += '<p>&nbsp;' + comment_input + ' <button type="button" style = "float:right;opacity:.4;cursor:pointer;margin-top:-5%;" onclick = "delete_comment(\'' + comment_input + '\', \'' + image_name + '\', \'' + file + '\')"><b style="font-size: 10px;">x</b></button></p><hr>';
			
			var files = comment.child(file);
			var image = files.child(image_name);
			image.once("value", function(snap){
				var commentArray = snap.val();
				commentArray[commentArray.length] = comment_input;
				image.set(commentArray);
			});
		}
		else{
			var comment_input = document.getElementById("comment").value;
			document.getElementById("comment").value = '';
			document.getElementById("edit_commentbox").innerHTML += '<p>&nbsp;' + comment_input + ' <button type="button" style = "float:right;opacity:.4;cursor:pointer;margin-top:-5%;" onclick = "delete_comment(\'' + comment_input + '\' , \'' + image_name + '\', \'' + file + '\')"><b style="font-size: 10px;">x</b></button></p><hr>';
			
			var files = comment.child(file);
			var image = files.child(image_name);
			image.once("value", function(snap){
				var commentArray = snap.val();
				commentArray[commentArray.length] = comment_input;
				image.set(commentArray);
			});
		}
	}
}
			
function delete_comment(comments, image_name, file){
	var myFirebaseLib = new Firebase("https://ad-hoc.firebaseio.com/");
	var comment = myFirebaseLib.child("comment");
	//alert(image_container + file);
	var file_containing_comment = comment.child(file);
	var image_containing_comment = file_containing_comment.child(image_name);
	
	image_containing_comment.once("value", function(snap){
		var commentArray = snap.val();
		var j = 0;
		for(var i = 1; i < commentArray.length; i++){
			if(commentArray[i] == comments){
			//	alert("asd");
				j = i;
				break;
			}
		} 
		
		var newCommentArray = new Array();
		var index = 1;
		for(var i = 1; i < commentArray.length; i++){
			if( i != j){
				newCommentArray[index] = commentArray[i];
				//alert(newCommentArray[index]);
				index += 1;
			}
		}
		
		document.getElementById("edit_commentbox").innerHTML = '';
		
		if(newCommentArray.length == 0){
			document.getElementById("edit_commentbox").innerHTML += '<p id="no_comment" style ="display:initial;">&nbsp; No Comments </p><hr>';
			document.getElementById("comment").setAttribute("onkeypress", "javascript: show_and_save_comment('new', event, '" + file + "', '" + image_name + "');");
		}
		
		for(var i = 1; i < newCommentArray.length; i++){
			document.getElementById("edit_commentbox").innerHTML += '<p>&nbsp;' + newCommentArray[i] + ' <button type="button" style = "float:right;opacity:.4;cursor:pointer;margin-top:-5%;" onclick = "delete_comment(\'' + newCommentArray[i] + '\' , \'' + image_name + '\', \'' + file + '\')"><b style="font-size: 10px;">x</b></button></p><hr>'
		}
		
		image_containing_comment.set(newCommentArray);
	});
}


function display_left_nav(){
	var myFirebaseLib = new Firebase("https://ad-hoc.firebaseio.com/");
				/*
				 * Goes to our Firebase storage and finds the child node directories of users which contains all the users saved files
				 * and things within those files. Next, it loops through each file and using html's DOM methods to display each
				 * one of the user's files in the left navbar
				 */
				 
				myFirebaseLib.child("directories of user").once("value", function(snapshot) {
					document.getElementById("tree_menu").innerHTML = '';
					snapshot.forEach(function(childSnapshot){
						var fileName = childSnapshot.name();
						if(fileName != "Default File"){
							document.getElementById("tree_menu"). innerHTML +=' <li> <img src="images/expand.jpg" alt="expand" class="toggle" onclick="toggle_expand_files(\''+fileName + '\')"> <img src="images/blue-folder-horizontal.jpg" alt="folder" onclick="toggle_expand_files(\''+fileName + '\')" class="toggle"> <b>' + fileName + '</b> </li>';
						}
					});
				
				});

}

function toggle_expand_files(file_name){
	
	var myFirebaseLib = new Firebase("https://ad-hoc.firebaseio.com/");
	var directories = myFirebaseLib.child("directories of user");
	var image_in_file = new Array();
	var ratingArray = new Array();
	var dateArray = new Array();
	var urlArray = new Array();
				
	directories.once("value", function(snapshot){
			document.getElementById("tree_menu").innerHTML = '';
			snapshot.forEach(function(childSnapshot){
				
				var otherFileName = childSnapshot.name();
						
				/*
				 * Here, otherfilename are other files that you have created but not expanded. So, they should be kept closed.
				 * This part displays them as just non expanded files.
				 */
						
				 if(otherFileName != "Default File" && otherFileName != file_name){
						
					document.getElementById("tree_menu"). innerHTML +=' <li> <img src="images/expand.jpg" alt="expand" class="toggle" onclick="toggle_expand_files(\''+otherFileName + '\')"> <img src="images/blue-folder-horizontal.jpg" alt="folder" onclick="toggle_expand_files(\''+otherFileName + '\')" class="toggle"> <b>' + otherFileName + '</b> </li>';
				}
				
				else{
						
					/*
					 * Here, if the otherfilename is the same as the file name you are trying to expand, then go into the database
					 * and fetch all memes within that file and then display them in order line by line fashion.
					 */
							 
					if(otherFileName == file_name){
								
						var file_name_id = file_name.replace(/ /g, "-");
						file_name_id += "-id";
						document.getElementById("tree_menu").innerHTML += '<li><img src="images/toggle_small.jpg"' +
																		  'alt ="toggle_small" class="toggle" onclick =  "display_left_nav()"><img    src="images/blue-folder-horizontal.jpg" alt="folder"  class="toggle" onclick = "display_left_nav()"><b> ' + file_name + '<b><ol id =' + file_name_id + '></ol>';
								
						directories.child(file_name).once("value", function(snap){
									
								image_in_file = snap.val();
								var imageArray = new Array();
									
								for(var i = 0; i < image_in_file.length; i++){
										var image_name_in_database ='';
										var user_given_name ='';
										var dash = image_in_file[i].indexOf("-");
										
										for(var j = 0; j < dash; j++){
											image_name_in_database += image_in_file[i].charAt(j);
										}
										
										for(var j = dash + 1; j< image_in_file[i].length; j++){
											user_given_name += image_in_file[i].charAt(j);
										}
										
										var image = image_name_in_database.split(".");
										imageArray[i+1] = image[0];
										document.getElementById(file_name_id).innerHTML +='<li class="image_file"'+
																							'onclick = "display_confirmation(\'' + image_name_in_database + '\', \'' + file_name + '\')"><img src="memes/' + image_name_in_database + '" alt= "saveimage"> ' +user_given_name + '</li>';

	
								}
									
							});
						}
					}
				});
			});
		}
		
			function edit_button(image_src, file_name){
				var myFirebaseLib = new Firebase("https://ad-hoc.firebaseio.com/");
				var edit_option = myFirebaseLib.child("edit");
				edit_option.once("value", function(snapshot){	
					var image_to_edit = image_src;
					image_to_edit += "-" + file_name;
					
					edit_option.set(image_to_edit);
					window.location = "canvas.html";
				});	
				
		}