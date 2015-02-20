			var array = new Array();
			var count = 0;
			var k = 0;
			var date = new Date();
				var day = date.getDate();
				var month = date.getMonth() + 1;
				var year = date.getFullYear();
				var dayOfWeek = date.getDay();
				var hour = date.getHours();
				var minute = date.getMinutes();
				var second = date.getSeconds();
				
				
				switch(dayOfWeek){
					case 0: dayOfWeek = "Sun";
							break;
					case 1: dayOfWeek = "Mon";
							break;
					case 2: dayOfWeek = "Tue";
							break;
					case 3: dayOfWeek = "Wed";
							break;
					case 4: dayOfWeek ="Thu";
							break;
					case 5: dayOfWeek ="Fri";
							break;
					case 6: dayOfWeek ="Sat";
							break;
					default: break;
				}
				
				switch(month){
					case 1: month = "Jan";
							break;
					case 2: month = "Feb"
							break;
					case 3: month = "Mar";
							break;
					case 4: month= "April";
							break;
					case 5: month = "May";
							break;
					case 6: month = "Jun";
							break;
					case 7: month = "Jul";
							break;
					case 8: month = "Aug";
							break;
					case 9: month = "Sept";
							break;
					case 10: month = "Oct";
							break;
					case 11: month = "Nov";
							break;
					case 12: month = "Dec";
							break;
					default:break;
				
				}
				
				var today_date = dayOfWeek + " " +  month + " " + day + ", "  + year + " " + hour + ":" + minute + ":" + second;
			/* It goes into our database and grabs all trending memes and displays them for users. Then it checks
			 * whether or not the user has created files and if he has, display his files on the left navbar.
			 */
			 
			function setUp(){
				var myFirebaseLib = new Firebase("https://ad-hoc.firebaseio.com/");
				var ratingArray = new Array();
				var dateArray = new Array();
				var urlArray = new Array();
				
				document.getElementById("memes_container_grid").innerHTML = '';
				document.getElementById("meme_list").innerHTML = '';
				
				/*
				 * Goes to out Firebase storage and looks for the child trending memes which contains the src/ path to our memes.
				 * Then, it gets all image srcs that is located within trending memes and stores it in an array.
				 * Finally, it will loop through the array, get the rating for each picture and display the memes plus its ratings.
				 */
				 
				myFirebaseLib.child("trending memes").once("value", function(snap) {
					trendingArray = snap.val();
					document.getElementById("dropdown_container").innerHTML = '<select id= "dropdown" onchange ="getImageNameToSortArray(\'trending memes\', \'popular\')"><option>Select</option><option>Low to High Rating</option><option>High to Low Rating </option></select><b style="font-size:14pt;float:right;"> Sort By: &emsp; </b>';
					for(var i = 1; i < trendingArray.length; i++){
						var image_name = trendingArray[i].split(".");
						trendingArray[i] = image_name[0].trim();
						dateArray[i] = window.today_date;
					}
					getArrayForRating(trendingArray,1,ratingArray, dateArray, urlArray, "none", 1, 1, 2);
				});
					
				display_all_saved_files();
			}
			
			function display_all_saved_files(){
			
				var myFirebaseLib = new Firebase("https://ad-hoc.firebaseio.com/");
				
				var save_from_internet = myFirebaseLib.child("saved from internet");
				//var internet = myFirebaseLib.child("internet");
				document.getElementById("tree_menu").innerHTML = '';
				document.getElementById("save_folder_container").innerHTML = '';
				
				save_from_internet.once("value", function(snapshot){
						snapshot.forEach(function(childSnap){
							var file = childSnap.name();
							document.getElementById("tree_menu").innerHTML +=' <li> <img src="images/expand.jpg" alt="expand" class="toggle" onclick="toggle_expand_files(\''+file + '\')"> <img src="images/blue-folder-horizontal.jpg" alt="folder" onclick="toggle_expand_files(\''+file + '\')" class="toggle"> <b>' + file + '</b> </li>';
							
							document.getElementById("save_folder_container").innerHTML += '<div id = "internet" onclick= "show_all_images(\'' + file + '\')"><img src = "images/folder.jpg" alt="folder"><b style="opacity:.6;">' + file+'</b></div>'; 
						});
				});
				
				/*
				 * Goes to our Firebase storage and finds the child node directories of users which contains all the users saved files
				 * and things within those files. Next, it loops through each file and using html's DOM methods to display each
				 * one of the user's files in the left navbar
				 */
				 
				 
				myFirebaseLib.child("directories of user").once("value", function(snapshot) {
					document.getElementById("back").style.display = "none";
					document.getElementById("foldername").style.display = "none";
					document.getElementById("modalDialog1").children[0].id= "back_container"; 
					document.getElementById("new_file_container").style.visibility="visible";
					
					snapshot.forEach(function(childSnapshot){
						var fileName = childSnapshot.name();
						if(fileName != "Default File"){
							var file_name = fileName.replace(/ /g, "-");
							document.getElementById("tree_menu"). innerHTML +=' <li> <img src="images/expand.jpg" alt="expand" class="toggle" onclick="toggle_expand_files(\''+fileName + '\')"> <img src="images/blue-folder-horizontal.jpg" alt="folder" onclick="toggle_expand_files(\''+fileName + '\')" class="toggle"> <b>' + fileName + '</b> </li>';
							
							document.getElementById("save_folder_container").innerHTML += '<div id ="' + file_name + 
																						  '" onclick= "show_all_images(\'' + fileName + '\')"><img src = "images/folder.jpg" alt="folder"><b style="opacity:.6;">' + fileName +'</b></div>'; 
						}
					});
				});
			}
			
			/* Searches the memes according to the categories */
			
			function search(e){
				
				/*
				 * e.keycode == 13 make sures that it will only search if the enter button is pressed and not
				 * search on any keypress
				 */
				 
				if(e.keyCode == 13){
					var myFirebaseLib = new Firebase("https://ad-hoc.firebaseio.com/");
					
					/* Gets the value of the search text box */
					
					var usersSearch = document.getElementById("search").value.toLowerCase();
					var ratingArray = new Array();
					var dateArray = new Array();
					var urlArray = new Array();
					
					usersSearch = usersSearch.trim();
					document.getElementById("search").value = "";
					
					/*
					 * Goes into our databse to find the childnode memes for browsing which contains all categories and meme'save
					 * src/path that correspond to that category. Its gets all image srcs relating to the user's search and stores it 
					 * in an array. Then, it gets the ratings for the memes and display the images using html/ dom methods.
					 */
					 
					myFirebaseLib.child("memes for browsing").once("value", function(snapshot) {
					
						/* Because users sometimes can type multiple keywords in one search (eg, computer dogs), we have to split up 
						 * the users search and save each keyword into an array and then check each word against categories in our database
						 * and display everything related to that search.
						 */ 
						 
						var userSearchParseArray = usersSearch.split(" ");
						var gotResults = false;
						var hasCleared = false;
						var beginI = 1;
						var endI = 0;
						var image_name_array = new Array();
						var tempArray = new Array();
						var keywordIndex = 0;
						var keywordWord = new Array();
						
						document.getElementById("title").innerHTML = "Search results for " + usersSearch;
						document.getElementById("dropdown_container").innerHTML = '<select id= "dropdown" onchange ="getImageNameToSortArray(\'memes for browsing\', \'' + usersSearch +'\')"><option>Select</option><option>Low to High Rating</option><option>High to Low Rating </option></select><b style="font-size:14pt;float:right;"> Sort By: &emsp; </b>';
									   
						for(var j = 0; j< userSearchParseArray.length; j++){
							if(snapshot.hasChild(userSearchParseArray[j]) || gotResults == true){
								if(hasCleared == false){
									document.getElementById("memes_container_grid").innerHTML = '';
									document.getElementById("meme_list").innerHTML = '';	
									hasCleared == true;
								}
							    tempArray = new Array();
								gotResults = true;
								
								if(snapshot.hasChild(userSearchParseArray[j]) == false && gotResults == true){
									//alert(userSearchParseArray[j]);
									userSearchParseArray[j] = userSearchParseArray[keywordIndex];
								}

								myFirebaseLib.child("memes for browsing").child(userSearchParseArray[j].trim()).once("value", function(snap){
							
									tempArray = snap.val();
									/*
									 * Since in displayContent, each id i assign to each pic must be unique, this beginI is basically a 
									 * number 1.... w.e so i can concatenate at the end of some id and make it unique
									 */
									if(tempArray[1] != keywordWord[1]){
										//alert(keywordIndex + " and " + j );
										var a = 1;
										beginI = beginI + endI;
										endI = tempArray.length - 1;
										//alert(beginI);
										for(var j = 1; j < tempArray.length; j++){
											var image_name = tempArray[j].split(".");
											tempArray[j] = image_name[0];
											//alert(tempArray[j]);
										}
												
										for(var x = beginI; x < beginI + endI; x++){
											image_name_array[x] = tempArray[a];
											dateArray[x] = window.today_date;
											a += 1;
										}
										keywordWord[1] = tempArray[1]+ ".jpg";
										keywordIndex = j;
									  }	
									//alert(image_name_array.length);
									getArrayForRating(image_name_array,1,ratingArray,dateArray, urlArray, "search", beginI, window.k, userSearchParseArray.length);
								});
							}
							
							else{
								if( (j == userSearchParseArray.length - 1) && (gotResults == false)){
									alert("So sorry, but we can not find what you are searching for");
								}
							}
						}
					});	
				} 
			}
			
			
			/*
			 * Modifies the html of our containers displaying the images and their ratings.
			 */
			 
			function displayContent(image_array, rating_array, dateArray, urlArray, beginI){
				var tempArray = new Array();
				tempArray = image_array;
				
				for(var i = 1; i < tempArray.length; i++){
		
					document.getElementById("memes_container_grid").innerHTML += '<div class="img"><img src="memes/' + tempArray[i] + 															  '"class="hover" alt="' + tempArray[i] + 
																				 '" onmouseleave = "handle_speech(\'bubble' + beginI 
																				  + '\', \'no\')"><div class="slide_up"><button type="button" class= "edit" onclick="edit_button(\''+ tempArray[i] + '\')" style = "display:none;"> <b>Edit</b></button> <button type="button" style="display:initial;" class="save" onclick = "show_save(\'show\',\''+ tempArray[i] + '\', \'' + dateArray[i] + '\', \'' + urlArray[i] + '\')"><b>Save</b></button> <img src="images/info_icon.png" alt="info" class="info_icon" onmousedown="handle_speech(\'bubble' + beginI + '\', \'display\')"></div><div class="slide_down" id="slide_down' + beginI + '"></div><div class="speech_bubble" id="bubble' + beginI +
																				  '" style="display:none;"><b> Url: ' + urlArray[i] + '<br>Date: ' +  dateArray[i] + '</b></div></div>';
																				  
					document.getElementById("meme_list").innerHTML += '<li><img src="memes/' + tempArray[i] + '" class="list_image" alt=' + tempArray[i] + '" ><img src="images/edit_icon.jpg" style = "display:none; alt="edit" title="Edit" class="edit" onclick="edit_button(\''+ tempArray[i] + '\')"><img src="images/save_icon.jpg" style = "display:initial;margin-right:5%;cursor:pointer;" alt="save" title="save" class="save"  onclick = "show_save(\'show\',\''+ tempArray[i] + '\', \'' + dateArray[i] + '\', \'' + urlArray[i] + '\')"><span id="list_rating' + beginI + '"></span><b>' +  dateArray[i] + '<b></li>';
				
					var coloredStars = Math.round(rating_array[i]);
					var num = coloredStars.toString();
					var grid_id = "slide_down" + beginI;
					var list_id = "list_rating" + beginI;
					
					/*
					 * Display the total avg rating in stars. So the coloredStars are the avg out of 5 rating for a meme and we will 
					 * color in the equivalent number of stars. 
					 */
					
					for(var j = 0; j < coloredStars; j++){
						document.getElementById(grid_id).innerHTML += '<img src="images/star_on.jpg" id="gridpic' + beginI + 
																 '_star1" alt="rating" onmouseover ="colorStars(this.id, \'' + num + '\')">';
						
						document.getElementById(list_id).innerHTML += '<img src="images/star_on.jpg" alt="rating" class="rating_list_img" id = "listpic' + beginI + '_star1" onmouseover = "colorStars(this.id, \'' + num + '\')">';
					}
					
					var noColorStars = 5 - coloredStars;
					for(var j= 0; j < noColorStars; j++){
						document.getElementById(grid_id).innerHTML += '<img src="images/star_off.jpg" id="gridpic' + beginI + 
																 '_star1" alt="rating" onmouseover ="colorStars(this.id, \'' + num + '\')">';
																 
						document.getElementById(list_id).innerHTML += '<img src="images/star_off.jpg" alt="rating" class="rating_list_img" 	id = "listpic' + beginI  + '_star1" onmouseover = "colorStars(this.id, \'' + num + '\')">';
					
					}
					
					
					document.getElementById(grid_id).innerHTML += '<b style= "margin-left:3%;margin-top:-4%;margin-bottom: -4%;"> Avg: ' + coloredStars + '/5 </b>';
					
					if(document.getElementById("title").innerHTML.charAt(0) =="M"){
						var save = document.getElementsByClassName("save");
						var edit = document.getElementsByClassName("edit");
						for(var k =0; k<save.length; k++){
							save[k].style.display="none";
							edit[k].style.display = "initial";
						}
					}
					
					beginI += 1;
				}
			}
			
			/*
			 * This method handles the info button. If clicked on, it will show the info, if clicked on again, it will disappear.
			 * If we mouse out the picture, it will disappear as well.
			 */
			 
			function handle_speech(image_id, display){
				if(display == "display" && count == 0){
					document.getElementById(image_id).style.display = "initial";
					count = 1;
				}else{
					count = 0;
					document.getElementById(image_id).style.display = "none";
				}
			}
			
			function edit_button(image_src){
				var myFirebaseLib = new Firebase("https://ad-hoc.firebaseio.com/");
				var edit_option = myFirebaseLib.child("edit");
				
				edit_option.once("value", function(snapshot){	
					var image_to_edit = image_src;
					var title = document.getElementById("title").innerHTML;
					image_to_edit += "-" + title.substring(title.indexOf(":") + 2, title.length);
					
					edit_option.set(image_to_edit);
					window.location = "canvas.html";
				});	
				
			}
			
			/* Fills in the stars when the mouse hovers over it */
			
			function colorStars(image_id, num){
				var starNum = parseInt(image_id.charAt(image_id.length - 1));
				var element = document.getElementById(image_id);
				var parent = element.parentNode;
				var parentid = parent.id;
	
				var picNum = 0;
				var temp = '';
				for(var i = image_id.indexOf("c") + 1; i < image_id.indexOf("_"); i++){
					temp += image_id.charAt(i);
				}
				picNum = parseInt(temp);
				
				var j = 1;
				var remaining = 5 - starNum;
				document.getElementById(parentid).innerHTML ='';
				
				/*
				 * For grid view. When we hover over a star, we will color in that star and every star in front of it. the starNum in this 
				 * case is equal to the number of stars up to that star you are hovering over. Then the remaining are the stars behind 
				 * the star you are hovering over.
				 */
				 
				if(image_id.charAt(0) == "g"){
					
					//stars to color in
					for(var i = 0; i < starNum; i++){
						document.getElementById(parentid).innerHTML += '<img src="images/star_on.jpg" id="gridpic' + picNum + '_star'+ j +'" alt="rating"  onmousedown="rate(event, this.id)" onmouseover ="colorStars(this.id, \'' + num + '\')" onmouseout = "initialStars(this.id, \'' + num + '\')">';
						j+=1;
					}
					
					//stars to leave out
					for(var i = 0; i < remaining; i++){
						document.getElementById(parentid).innerHTML += '<img src="images/star_off.jpg" id="gridpic' + picNum + '_star'+ j +'" alt="rating" onmouseover 	="colorStars(this.id, \'' + num + '\')" onmouseout = "initialStars(this.id, \'' + num + '\')" >';
						j += 1;
					}
					
					document.getElementById(parentid).innerHTML += '<b style= "margin-left:0;margin-top:-4%;margin-bottom: -4%;"> Click to Rate</b>';
				}
				
				//This is the list view. Explanations and detail are same as grid view above.
				else{
					if(image_id.charAt(0) == "l"){
						for(var i = 0; i < starNum; i++){
							document.getElementById(parentid).innerHTML += '<img src="images/star_on.jpg" alt="rating" class="rating_list_img" id = "listpic' + picNum + '_star' + j + '" onmouseover = "colorStars(this.id , \'' + num + '\')" onmouseout = "initialStars(this.id, \'' + num + '\')" onmousedown="rate(event, this.id)">';
							j+=1;
						}
						
						for(var i = 0; i < remaining; i++){
							document.getElementById(parentid).innerHTML += '<img src="images/star_off.jpg" alt="rating" class="rating_list_img" id = "listpic' + picNum + '_star' + j + '" onmouseover = "colorStars(this.id, \'' + num + '\')" onmouseout = "initialStars(this.id, \'' + num + '\')">';
							j += 1;
						}
					}
				}
			}
			
			
			/* Clears the star when mouse is not hovering over it */
			
			function initialStars(image_id, num){
				var starNum = parseInt(num);
				var element = document.getElementById(image_id);
				var picNum = 0;
				var temp = '';
				for(var i = image_id.indexOf("c") + 1; i < image_id.indexOf("_"); i++){
					temp += image_id.charAt(i);
				}
				picNum = parseInt(temp);
				
				var parent = element.parentNode;
				var parentid = parent.id;
				var remaining = 5 - starNum;
				document.getElementById(parentid).innerHTML = '';
				
				var j = 1;
				
				/*
				 * For grid look. If we move our mouse out of the stars, i want it to show back the original total rating. StarNum os 
				 * basically the total rating so how many stars should be colored in and remaining is how many stars that should not be 
				 * colored in. After figuring those out, its just a matter of changing the inner html to display what we want.
				 */
				 
				if(image_id.charAt(0) == "g"){
					var appendStr= '';
					for(var i = parentid.indexOf("n") + 1; i < parentid.length; i ++){
						appendStr += parentid.charAt(i);
					}
					
					var otherParentid = "list_rating" + appendStr;
					
					document.getElementById(otherParentid).innerHTML = '';
					
					//So here, we display the number of stars the should be colored in according to the total avg rating of a meme.
					for(var i = 0; i < starNum; i++){
						document.getElementById(parentid).innerHTML += '<img src="images/star_on.jpg" id="gridpic' + picNum + '_star'+ j +'" alt="rating"  onmouseover ="colorStars(this.id, \'' + num + '\')" onmouseout = "initialStars(this.id, \'' + num + '\')" onmousedown="rate(event, this.id)">'
						
						document.getElementById(otherParentid).innerHTML += '<img src="images/star_on.jpg" alt="rating" class="rating_list_img" id = "listpic' + picNum + '_star' + j + '" onmouseover = "colorStars(this.id, \'' + num + '\')" onmouseout = "initialStars(this.id, \'' + num + '\')" onmousedown="rate(event, this.id)">';
						
						j += 1;
					}
					
					//Here we display the remaining that should not be colored in.
					for(var i = 0; i < remaining; i++){
						document.getElementById(parentid).innerHTML += '<img src="images/star_off.jpg" id="gridpic' + picNum + '_star'+ j +'" alt="rating"  onmouseover ="colorStars(this.id, \'' + num + '\')" onmouseout = "initialStars(this.id, \'' + num + '\')" onmousedown="rate(event, this.id)">'
						
						document.getElementById(otherParentid).innerHTML += '<img src="images/star_off.jpg" alt="rating" class="rating_list_img" id = "listpic' + picNum + '_star' + j + '" onmouseover = "colorStars(this.id, \'' + num + '\')" onmouseout = "initialStars(this.id, \'' + num + '\')" onmousedown="rate(event, this.id)">';
						
						j += 1;
					}
					
					document.getElementById(parentid).innerHTML += '<b style= "margin-left:3%;margin-top:-4%;margin-bottom: -4%;"> Avg: ' + num + '/5 </b>';
				}
				
				//This is for the list view. The idea behind this is the same as the grid above.
				
				else{
					var appendStr= '';
					for(var i = parentid.indexOf("g") + 1; i < parentid.length; i ++){
						appendStr += parentid.charAt(i);
					}
					
					var otherParentid = "slide_down" + appendStr;
					document.getElementById(otherParentid).innerHTML = '';
					
					//stars to be colored in
					for(var i = 0; i < starNum; i++){
						document.getElementById(parentid).innerHTML += '<img src="images/star_on.jpg" alt="rating" class="rating_list_img" id = "listpic' + picNum + '_star' + j + '" onmouseover = "colorStars(this.id, \'' + num + '\')" onmouseout = "initialStars(this.id, \'' + num + '\')" onmousedown="rate(event, this.id)">';
						
						document.getElementById(otherParentid).innerHTML += '<img src="images/star_on.jpg" id="gridpic' + picNum + '_star'+ j +'" alt="rating"  onmouseover ="colorStars(this.id, \'' + num + '\')" onmouseout = "initialStars(this.id, \'' + num + '\')" onmousedown="rate(event, this.id)">'
						
						j += 1;
					}
						
					//stars not to be colored in
					for(var i = 0; i < remaining; i++){
						document.getElementById(parentid).innerHTML += '<img src="images/star_off.jpg" alt="rating" class="rating_list_img" id = "listpic' + picNum + '_star' + j + '" onmouseover = "colorStars(this.id, \'' + num + '\')" onmouseout = "initialStars(this.id, \'' + num + '\')" onmousedown="rate(event, this.id)">';
						
						document.getElementById(otherParentid).innerHTML += '<img src="images/star_off.jpg" id="gridpic' + picNum + '_star'+ j +'" alt="rating"  onmouseover ="colorStars(this.id, \'' + num + '\')" onmouseout = "initialStars(this.id, \'' + num + '\')" onmousedown="rate(event, this.id)">'
						
						j += 1;
					}
				}
			}
			
			/* rates the pictures. Sends the rating to the database for that number*/
			
			function rate(e, image_id){
				if(e.which == 1){
					var myFirebaseLib = new Firebase("https://ad-hoc.firebaseio.com/");
					var starNum = parseInt(image_id.charAt(image_id.length - 1));
					
					/*
					 * Finds the rating node in our database that holds every meme we have and their rating. In the database, index 0
					 * is the avg rating for that specific meme. Index 2 is the number of ratings. After finding the node, we call
					 * modify existing rating which will do the calculations and store the final result back in the database for the 
					 * corresponding meme
					 */
					 
					myFirebaseLib.once("value", function(snapshot){
						var ratingChild = myFirebaseLib.child("rating");
						var parent = document.getElementById(image_id).parentNode;
						var grandparent = parent.parentNode;
						var image_src = grandparent.childNodes[0].alt.trim();
						var image_srcArr = image_src.split(".");
	
						if(image_id.charAt(0) == "g"){
							ratingChild.once("value", function(snapshot){
								if(snapshot.hasChild(image_srcArr[0])){
									modify_existing_rating(ratingChild, image_srcArr, starNum, image_id)
								}
							});
						}
						else{
							ratingChild.once("value", function(snapshot){
								if(snapshot.hasChild(image_srcArr[0])){
									modify_existing_rating(ratingChild, image_srcArr, starNum, image_id)
								}
							});
						}
					});
				}
			}
			
			/*
			 * Does the calculations for avg rating and then store it back to the database.
			 */
			function modify_existing_rating(ratingChild, image_srcArr, starNum, image_id){
			
				/*
				 * Point to the image under "rating" in our database. Get the val which 
				 * includes its avg rating - index 0, comments- index 1, and total num of rating -index 3.
				 * Calculation and round to nearest whole of the avg (Math.round) and then store it in an array
				 * to be pushed back and stored again in the database.
				 */
				 
				var image_that_got_rated = ratingChild.child(image_srcArr[0]);
				image_that_got_rated.once("value", function(snap) {
					var ratingArray = new Array();
					ratingArray = snap.val();
				
					if(ratingArray[2] == 0){
						var round = starNum;
					}
					else{
						var avg = (ratingArray[0] + starNum)/2;
						var round = Math.round(avg);
					}
					
					ratingArray[0] = round;
					ratingArray[2] += 1;
					image_that_got_rated.set(ratingArray);
					initialStars(image_id, round);
				});
			}
			
			/*
			 * For sorting, depending on what we need to sort first, whether it is trending memes or memes for browsing.
			 * Then we getthe meme category that we need to sort(eg. sport, pets..etc) and we get all pictures in that 
			 * category and store it in an array and then call get rating array method.
			 */
			 
			function getImageNameToSortArray(sortCategory, memesCategory){
				var myFirebaseLib = new Firebase("https://ad-hoc.firebaseio.com/");
				var browsing = myFirebaseLib.child("memes for browsing");
				var trending = myFirebaseLib.child("trending memes");
				var directories = myFirebaseLib.child("directories of user");
				var ratingArray = new Array();
				var dateArray = new Array();
				var urlArray = new Array();
				
				var dropdown_menu = document.getElementById("dropdown");
				var selectIndex = dropdown_menu.options[dropdown_menu.selectedIndex].text;
				
				
				switch(sortCategory){
					case "memes for browsing":	
								browsing.once("value", function(snap){
									var memesCategorySplit = memesCategory.split(" ");
									var beginI = 1;
									var endI = 0;
									var image_name_array = new Array();
									var tempArray = new Array();
									var gotResults = false;
									var keywordIndex = 0;
									var keywordArray = new Array();
									
									/*
									 * Gets all the pictures in the category that we need to sort and store it in an array 
									 * and then we call getArrayForRating.
									 */
									 
									for(var i = 0; i < memesCategorySplit.length; i++){
										
										if(snap.hasChild(memesCategorySplit[i]) || gotResults == true){
											gotResults = true;
											
											if(snap.hasChild(memesCategorySplit[i]) == false && gotResults == true){
												memesCategorySplit[i] = memesCategorySplit[keywordIndex];
											}
											
											var browsingCat = browsing.child(memesCategorySplit[i]);
											browsingCat.once("value", function(snapshot){
												tempArray = snapshot.val();
												if(tempArray[1] != keywordArray[1]){
													var a = 1;
													beginI = endI + beginI;
													endI = tempArray.length - 1;
												
													for(var j = 1; j < tempArray.length; j++){
														var image_name = tempArray[j].split(".");
														tempArray[j] = image_name[0];
													}
												
													for(var x = beginI; x < beginI + endI; x++){
														image_name_array[x] = tempArray[a];
														dateArray[x] = window.today_date;
														a += 1;
													}
												
													keywordIndex = i;
													keywordArray[1] = tempArray[1]+ ".jpg";
												 }
												 
												 getArrayForRating(image_name_array, 1, ratingArray, dateArray, urlArray, selectIndex, beginI, window.k, memesCategorySplit.length);
											 });
											
										}
									  }
								  });
								break;
					
					case "trending memes":
								var image_name_array = new Array();
								trending.once("value", function(snap) {
									image_name_array = snap.val();
									for(var j = 1; j < image_name_array.length; j ++){
										var image_name = image_name_array[j].split(".");
										image_name_array[j] = image_name[0];
										dateArray[j] = window.today_date;
										//alert(image_name_array[j]);
									}
									
									getArrayForRating(image_name_array, 1, ratingArray, dateArray, urlArray, selectIndex, 1, 1, 2);
								});
								break;
					
					case "directories of user":
								var image_name_array = new Array();
								var file_name = directories.child(memesCategory);
								file_name.once("value", function(snap){
									image_name_array = snap.val();
									var imageArray = new Array();
									
									for(var i = 0; i < image_name_array.length; i++){
											var image_name_in_database ='';
											var dash = image_name_array[i].indexOf("-");
										
											for(var j = 0; j < dash; j++){
												image_name_in_database += image_name_array[i].charAt(j);
											}

											var image = image_name_in_database.split(".");
											imageArray[i+1] = image[0];
											//dateArray[i+1] = window.today_date;
									}
									
									getArrayForRating(imageArray, 1, ratingArray, dateArray, urlArray, selectIndex, 1, 1, 2);
								});
								
								break;
					default:break;
				}
			}
			
			/*
			 * With the array of all the images we need to sort, we find the ratings for each image and store 
			 * their rating in an array. Then we call sort method to acutally finally sort them.
			 */
			 
			function getArrayForRating(image_name_array, index, ratingArray, dateArray, urlArray, selectIndex, beginI, i, array_length){
				var myFirebaseLib = new Firebase("https://ad-hoc.firebaseio.com/");
				var ratingChild = myFirebaseLib.child("rating");
				if( i != array_length - 1){
					window.k += 1;
				}
				
				/*
				 * recursively call itself to fill up ratingArray with ratings of each image. When it is done
				 * call sortRating to actually sort the pictures.
				 */
				 
				else{
					if(index != image_name_array.length){
						//urlArray = getUrlArray(image_name_array, index, urlArray);
						var imageChild = ratingChild.child(image_name_array[index]);
						imageChild.once("value", function(snap) {
							if(window.k != 0){
								beginI = 1;
							}
							var tempArray = snap.val();
							ratingArray[index] = tempArray[0];
							index += 1;
							getArrayForRating(image_name_array, index, ratingArray, dateArray, urlArray, selectIndex, beginI, i, array_length);
						});
					}
					else{
						sortRating(image_name_array, ratingArray, dateArray, urlArray, selectIndex, beginI);
						window.k = 0;
					}
				}
			}
			
			function getDate(image_name_array, index, dateArray){
				var myFirebaseLib = new Firebase("https://ad-hoc.firebaseio.com/");
				var infoChild = myFirebaseLib.child("info");
				if(index != image_name_array.length){
						var image = infoChild.child(image_name_array[index]);
						image.once("value", function(snap) {
							var tempArray = snap.val();
							dateArray[index] = tempArray[1];
							return;
						});
					}
					
				return dateArray;
			
			}
			
			function getUrlArray(image_name, image_name_array, rating_or_popularity_array, dateArray,  beginI, index, urlArray, do_get_date){
				var myFirebaseLib = new Firebase("https://ad-hoc.firebaseio.com/");
				var infoChild = myFirebaseLib.child("info");
				
				if(index != image_name.length){
						if(do_get_date == true){
							dateArray = getDate(image_name, index, dateArray);
						}
						
						var image = infoChild.child(image_name[index]);
						image.once("value", function(snap) {
							var tempArray = snap.val();
							urlArray[index] = tempArray[0];
							index += 1;
							if(do_get_date == true){
								getUrlArray(image_name, image_name_array, rating_or_popularity_array, dateArray,  beginI, index, urlArray, true);
							}
							else{
								getUrlArray(image_name, image_name_array, rating_or_popularity_array, dateArray,  beginI, index, urlArray, false);
							}
						});
					}
				
				else{
					displayContent(image_name_array, rating_or_popularity_array, dateArray, urlArray, beginI);
				}
			}
			
			
			
			/*
			 * sorts the memes according to rating/ popularity and then call display content to display the final result
			 */
			 
			function sortRating(image_name_array, rating_or_popularity_array, dateArray, urlArray, selectIndex, beginI){
				
				var j = 0;
				var newArray = new Array();
				var new_rating_or_popularity_array = new Array();
				var new_url_name_array = new Array();
				var new_url_array = new Array();
				var image_name = new Array();
				
				for(var i = 1; i < rating_or_popularity_array.length; i++){
					newArray[j] = rating_or_popularity_array[i] + '-' + image_name_array[i] + ".jpg";
					new_rating_or_popularity_array[j] = rating_or_popularity_array[i];
					j += 1;
				}

				
				switch(selectIndex){
					case "Low to High Rating":
										newArray.sort();
										new_rating_or_popularity_array.sort(function(a,b){return a-b});
										var memesFromLowestToHighest = new Array();
										for(var i = 0; i < newArray.length; i++){
											var one_image_name = newArray[i].split("-");
											memesFromLowestToHighest[i + 1] = one_image_name[1].trim();
											new_url_name_array[i+1] = one_image_name[1].substring(0, one_image_name[1].indexOf("."));
											rating_or_popularity_array[i + 1] = new_rating_or_popularity_array[i];
										}
										
										if(beginI == 1){
											document.getElementById("memes_container_grid").innerHTML = '';
											document.getElementById("meme_list").innerHTML = '';	
										}
										
										if(dateArray.length == 0){
											getUrlArray(new_url_name_array, memesFromLowestToHighest, rating_or_popularity_array, dateArray,beginI, 1, urlArray, true);
										}
										
										else{
											getUrlArray(new_url_name_array, memesFromLowestToHighest, rating_or_popularity_array, dateArray,beginI, 1, urlArray, false);
										}
										//displayContent(memesFromLowestToHighest, rating_or_popularity_array, dateArray, urlArray, beginI);
										break;
					
					case "High to Low Rating": 
										newArray.sort();
										newArray.reverse();
										new_rating_or_popularity_array.sort(function(a,b){return b-a});
										var memesFromHighestToLowest = new Array();
										for(var i = 0; i < newArray.length; i++){
											var one_image_name = newArray[i].split("-");
											memesFromHighestToLowest[i + 1] = one_image_name[1].trim();
											new_url_name_array[i+1] = one_image_name[1].substring(0, one_image_name[1].indexOf("."));
											rating_or_popularity_array[i + 1] = new_rating_or_popularity_array[i];
										}
										
										if(beginI == 1){
											document.getElementById("memes_container_grid").innerHTML = '';
											document.getElementById("meme_list").innerHTML = '';	
										}
										
										if(dateArray.length == 0){
											getUrlArray(new_url_name_array, memesFromHighestToLowest, rating_or_popularity_array, dateArray,beginI, 1, urlArray, true);
										}
										
										else{
											getUrlArray(new_url_name_array, memesFromHighestToLowest, rating_or_popularity_array, dateArray,beginI, 1, urlArray, false);
										}
				
										//displayContent(memesFromHighestToLowest, rating_or_popularity_array, dateArray, urlArray, beginI);
										break;
										
					case "Select":		break;
										
					default: 					
										//for(var i = 1; i <image_name_array.length; i++){
											//getUrlArray(image_name_array, rating_or_popularity_array, dateArray,  beginI, 1, urlArray);
											//alert(urlArray[i]);
										//}
										
										for(var i = 1; i < image_name_array.length; i++){
											image_name[i] = image_name_array[i];
											image_name_array[i] += ".jpg";
										//	alert(image_name[i]);
										}
										
										if(dateArray.length == 0){
											getUrlArray(image_name, image_name_array, rating_or_popularity_array, dateArray,  beginI, 1, urlArray, true);
										}
										
										else{
											getUrlArray(image_name, image_name_array, rating_or_popularity_array, dateArray,  beginI, 1, urlArray, false);
										}
										//displayContent(image_name_array, rating_or_popularity_array, dateArray, urlArray, beginI);
										break;
				}
			}
			
			/* Display the modaldialog box for users to input their file name */
			
			function getUsersFileName(){
				document.getElementById('hidden_file').id = "visible_file";
			}
			
			/* Hides the modaldialogbox if users decides to cancel*/
			
			function cancel(){
				document.getElementById('visible_file').id = "hidden_file";
			}
		
			/* adds the folder with the user inputed file name and display it on the left navbar */
			
			function addFolder(e){
				if(e.keyCode == 13){
					var myFirebaseLib = new Firebase("https://ad-hoc.firebaseio.com/");
					var fileName = document.getElementById("fileName").value;
					var directoriesOfUser = myFirebaseLib.child("directories of user");
					var fileUserCreated = directoriesOfUser.child(fileName);
					var memesInThisFileArray = new Array();
					memesInThisFileArray[0] = "Slot must be taken to create folder in database, but skip this slot when fetching memes";
					fileUserCreated.set(memesInThisFileArray);
					display_all_saved_files();
					document.getElementById("visible_file").id = "hidden_file";
					
				}
			}
			
			function show_save(show_or_cancel, image_src, image_date, image_url){
				if(show_or_cancel == "show"){
					document.getElementById("modalDialog1").style.display = "initial";
					var myFirebaseLib = new Firebase("https://ad-hoc.firebaseio.com/");
					var directories = myFirebaseLib.child("directories of user");
					document.getElementById( "save_file" ).setAttribute( "onkeypress", "javascript: save_meme('" + image_src + "', '" + image_date + "', '" + image_url + "', event);" );
					display_all_saved_files();
				}
				
				else{
					document.getElementById("modalDialog1").style.display = "none";
					document.getElementById("create_save_file").value = '';
				}
			}
			
			function save_meme(image_src, image_date, image_url, e){
				var el = document.getElementById("modalDialog1");
				var el_first_child = el.children[0];
				var myFirebaseLib = new Firebase("https://ad-hoc.firebaseio.com/");
				var directories = myFirebaseLib.child("directories of user");
				var info = myFirebaseLib.child("info");
				
				if(e.keyCode == 13){
					if(el_first_child.id != "back_container"){
						var fileName = el_first_child.id.replace(/-/g, " ");
						directories.once("value", function(snapshot){
						
							if(snapshot.hasChild(fileName) == false){
								var file = directories.child(fileName);
								var storeImageArray = new Array();
								var user_inputted_name = document.getElementById("save_file").value;
								document.getElementById("save_file").value = '';
								storeImageArray[0] = image_src + "-" + user_inputted_name;
								file.set(storeImageArray);
							}
							
							else{
								var file = directories.child(fileName);
								file.once("value", function(snap){
									var user_inputted_name = document.getElementById("save_file").value;
									document.getElementById("save_file").value = '';
									var storeImageArray = snap.val();
									
									if(storeImageArray[0] == "Slot must be taken to create folder in database, but skip this slot when fetching memes"){
										storeImageArray[0] = image_src + "-" + user_inputted_name;
										file.set(storeImageArray);
									}
									
									else{
										storeImageArray[storeImageArray.length] = image_src + "-" + user_inputted_name;
										file.set(storeImageArray);
									}
								});
							}
						});
						
						image_src_temp = image_src.substring(0, image_src.indexOf("."));
						
						info.child(image_src_temp).once("value", function(snapshot){
							 var infoArray = snapshot.val();
							 infoArray[1] = image_date;
							 info.child(image_src_temp).set(infoArray);
							 display_all_saved_files();
						});
						
						show_save("cancel", "none", "none", "none");
					}
				}
			}
			
			function create_folder(object_event){
				var user_inputted_filename = document.getElementById("create_save_file").value;
				if(object_event == "mouse" || object_event.keyCode == 13){
					document.getElementById("create_save_file").value = '';
					document.getElementById("foldername").innerHTML = '';
					document.getElementById("foldername").innerHTML += user_inputted_filename;
					document.getElementById("foldername").style.display = "initial";
					document.getElementById("back_container").id = user_inputted_filename.replace(/ /g, "-");
					document.getElementById("back").style.display = "initial";
					document.getElementById("save_folder_container").innerHTML = '';
					document.getElementById("new_file_container").style.visibility="hidden";
				}
			}
			
			function show_all_images(fileName){
				var myFirebaseLib = new Firebase("https://ad-hoc.firebaseio.com/");
				var directories = myFirebaseLib.child("directories of user");
				
				var file = directories.child(fileName);
				
				document.getElementById("save_folder_container").innerHTML = '';
				document.getElementById("back").style.display = "initial";
				var temp_file = fileName.replace(/ /g, "-");
				document.getElementById("back_container").id = temp_file;
				document.getElementById("foldername").innerHTML ='';
				document.getElementById("foldername").innerHTML += fileName;
				document.getElementById("foldername").style.display ="initial";
				document.getElementById("new_file_container").style.visibility="hidden";
				
				file.once("value", function(snapshot) {
					var imageArray = snapshot.val();
					
					if(imageArray[0] != "Slot must be taken to create folder in database, but skip this slot when fetching memes"){
				
						for(var i = 0; i < imageArray.length; i++){
							var dash = imageArray[i].indexOf("-");
							var image_name_in_database = imageArray[i].substring(0, dash);
							var user_given_name = imageArray[i].substring(dash + 1, imageArray[i].length);
						
							document.getElementById("save_folder_container").innerHTML += '<div id ="' + image_name_in_database + 
																					  '" onclick= "show_all_images(\'' + fileName + '\')"><img src = "memes/' + image_name_in_database + '" alt="folder"><b style="opacity:.6;">' + user_given_name +'</b></div>'
						}
					}
					});
			
			}
			
			/*
			 *	When the toggle expand ( the plus sign) is clicked on, get all the memes located within that file
			 *  and pass it to sort method to 1) get its rating and 2) display it along with its ratings.
			 */
			
			function toggle_expand_files(file_name){
				var myFirebaseLib = new Firebase("https://ad-hoc.firebaseio.com/");
				var directories = myFirebaseLib.child("directories of user");
				var saved_from_internet = myFirebaseLib.child("saved from internet");
				var image_in_file = new Array();
				var ratingArray = new Array();
				var dateArray = new Array();
				var urlArray = new Array();
				document.getElementById("tree_menu").innerHTML = '';
				
				if(file_name == "internet"){
					document.getElementById("memes_container_grid").innerHTML ='';
					document.getElementById("meme_list").innerHTML ='';
					document.getElementById("title").innerHTML = "Memes in directory: internet";
					saved_from_internet.once("value", function(s){
						s.forEach(function(c){
							var internet = c.name();
							document.getElementById("tree_menu").innerHTML += '<li><img src="images/toggle_small.jpg"' +
																				  'alt ="toggle_small" class="toggle" onclick = "display_all_saved_files()"><img   src="images/blue-folder-horizontal.jpg" alt="folder" class="toggle" onclick = "display_all_saved_files()"><b> ' + internet + '<b><ol id ="internet"></ol>';
							var image_from_net = saved_from_internet.child("internet");
							image_from_net.once("value", function(snap){
								var image_url_array = snap.val();
								for(var i = 1; i < image_url_array.length; i++){
									document.getElementById("internet").innerHTML +='<li class="image_file"><img src="' +image_url_array[i] + '" alt ="inter"></li>';
									document.getElementById("memes_container_grid").innerHTML += '<div class="img"><img src="' + 															 image_url_array[i] + 															 '"class="hover"></div>';
									
									document.getElementById("meme_list").innerHTML += '<li><img src="' + image_url_array[i] + '" class="list_image" ></li>';
								}
								
							});
						});
					});
					
					directories.once("value", function(snapshot){
									snapshot.forEach(function(childSnapshot){
									var otherFileName = childSnapshot.name();
									if(otherFileName != "Default File"){
										document.getElementById("tree_menu"). innerHTML +=' <li> <img src="images/expand.jpg" alt="expand" class="toggle" onclick="toggle_expand_files(\''+otherFileName + '\')"> <img src="images/blue-folder-horizontal.jpg" alt="folder" onclick="toggle_expand_files(\''+otherFileName + '\')" class="toggle"> <b>' + otherFileName + '</b> </li>';
									}
								});
					});
				}
				
				else{
				
				directories.once("value", function(snapshot){
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
																				  'alt ="toggle_small" class="toggle" onclick = "display_all_saved_files()"><img   src="images/blue-folder-horizontal.jpg" alt="folder" class="toggle" onclick = "display_all_saved_files()"><b> ' + file_name + '<b><ol id =' + file_name_id + '></ol>';
								
								
								directories.child(file_name).once("value", function(snap){
									image_in_file = snap.val();
									var imageArray = new Array();
									if(image_in_file[0] != "Slot must be taken to create folder in database, but skip this slot when fetching memes"){
									
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
											document.getElementById(file_name_id).innerHTML +='<li class="image_file"><img src="memes/' + 
																						   image_name_in_database + '" alt= "saveimage"> ' +user_given_name + '</li>';
									}
										document.getElementById("title").innerHTML = "Memes in directory: " + file_name;
									
									document.getElementById("dropdown_container").innerHTML = '<select id= "dropdown" onchange ="getImageNameToSortArray(\'directories of user\', \'' + file_name +'\')"><option>Select</option><option>Low to High Rating</option><option>High to Low Rating </option></select><b style="font-size:14pt;float:right;"> Sort By: &emsp; </b>';
									
									document.getElementById("memes_container_grid").innerHTML ='';
									document.getElementById("meme_list").innerHTML ='';
									getArrayForRating(imageArray,1,ratingArray,dateArray, urlArray, "none", 1, 1, 2);
									}
									else{
										document.getElementById("title").innerHTML = "Memes in directory: " + file_name;
										document.getElementById("memes_container_grid").innerHTML ='';
										document.getElementById("meme_list").innerHTML ='';
									}
									
									
								});

							}
						}
					});
				});
			}
			}
			
			