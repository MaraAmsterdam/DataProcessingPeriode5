window.onload = function() {

	$(document).ready(function(){
		console.log("test");
		$("h1").fadeIn("slow");
		$("#p").fadeIn("slow");
	});
	filepathStackedBar = "data/workout_2016.json"
	filepath = "data/workoutLine.json";
	stackedBar(filepathStackedBar);
	//connectedScatter(filepath)

};