$(document).ready(function(){
	
  	$('#login-trigger').click(function(){
		
		if ($('#register-trigger').hasClass('active')) $('#register-trigger').click()
		
	  
		$(this).next('#login-content').slideToggle();
		$(this).toggleClass('active');          
    
		if ($(this).hasClass('active')) $(this).find('span#logintriangle').html('&#x25BC;')
		else $(this).find('span#logintriangle').html('&#9654;')
    })
	
	$('#register-trigger').click(function(){
	  
	    if ($('#login-trigger').hasClass('active')) $('#login-trigger').click()
		
		$(this).next('#register-content').slideToggle();
		$(this).toggleClass('active');          
	
		if ($(this).hasClass('active')) $(this).find('span#registertriangle').html('&#x25BC;')
		else $(this).find('span#registertriangle').html('&#9654;')
    })
	
	
	
	
});