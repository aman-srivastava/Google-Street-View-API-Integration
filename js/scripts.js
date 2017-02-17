var map = null;
var panorama;
google.maps.event.addDomListener(window, 'load', initialize);

document.addEventListener("DOMContentLoaded", function(event) { 
		document.getElementById('newyork').addEventListener("click", function(){
		document.getElementById("latitude").value = "40.6887286";
		document.getElementById("longitude").value = "-74.043836";
	});

	document.getElementById("berlin").addEventListener("click", function(){
		document.getElementById("latitude").value = "52.5185053";
		document.getElementById("longitude").value = "13.3729684";
	});

	document.getElementById("agra").addEventListener("click", function(){
		document.getElementById("latitude").value = "27.1739324";
		document.getElementById("longitude").value = "78.0422423";
	});

	document.getElementById("wiltshire").addEventListener("click", function(){
		document.getElementById("latitude").value = "51.1788898";
		document.getElementById("longitude").value = "-1.8262146";
	});

	document.getElementById("queensland").addEventListener("click", function(){
		document.getElementById("latitude").value = "-23.4428956";
		document.getElementById("longitude").value = "151.9065836";
	});

	document.getElementById("finland").addEventListener("click", function(){
		document.getElementById("latitude").value = "68.5090814";
		document.getElementById("longitude").value = "27.4817772";
	});
});

function generateGSV() {
		var latitude=parseFloat(document.getElementById('latitude').value);
		var longitude=parseFloat(document.getElementById('longitude').value);
		panorama = new google.maps.StreetViewPanorama(document.getElementById('map_canvas'),{
			position: {lat: latitude, lng: longitude},
			pov: {heading: 226.1428525, pitch: 7.1959415},
			zoom: 0,
			mode : 'html4',
		});
		panorama.addListener('pano_changed', function() {
			var panoCell = document.getElementById('pano-cell');
			panoCell.innerHTML = panorama.getPano();
		});
		panorama.addListener('position_changed', function() {
			var positionCell = document.getElementById('position-cell');
			positionCell.firstChild.nodeValue = panorama.getPosition() + '';
		});
		panorama.addListener('zoom_changed', function() {
			var positionCell = document.getElementById('fov-cell');
			positionCell.firstChild.nodeValue = Math.round(panorama.getZoom()) + '';
		});  
		panorama.addListener('pov_changed', function() {
			var headingCell = document.getElementById('heading-cell');
			var pitchCell = document.getElementById('pitch-cell');
			headingCell.firstChild.nodeValue = panorama.getPov().heading + '';
			pitchCell.firstChild.nodeValue = panorama.getPov().pitch + '';
		});
	return false;
}
	  
function switchToBlackAndWhite() {
		document.getElementById("map_canvas").style.filter="grayscale(100%)";
}

function switchToColor() {
		document.getElementById("map_canvas").style.filter="";
}	  

function initialize() {
		var myWrapper = $("#wrapper");
		$("#menu-toggle").click(function(e) {
			e.preventDefault();
			$("#wrapper").toggleClass("toggled");
			myWrapper.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
				google.maps.event.trigger(map, 'resize');
			});
		});
		var myOptions = {
			zoom: 2,
			center: new google.maps.LatLng(0, 0),
			mapTypeControl: true,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
			},
			navigationControl: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		google.maps.event.addListener(map, 'click', function() {
			infowindow.close();
		});
	return true;
}

function drawImage(imageObj) {
        var canvas = document.getElementById('myCanvas');
        var context = canvas.getContext('2d');
        var imageWidth = imageObj.width;
        var imageHeight = imageObj.height;
		var tableData=[];
        context.drawImage(imageObj, 0, 0);
		tableData.push([0, '0 - 25.5'], [0, '25.5 - 51'], [0, '51 - 76.5'], [0, '76.5 - 102'], [0, '102 - 127.5'], [0, '127.5 - 153'], [0, '153 - 178.5'], [0, '178.5 - 204'], [0, '204 - 229.5'], [0, '229.5 - 255']);
		var imageData = context.getImageData(0, 0, imageWidth, imageHeight);
        var data = imageData.data;
		var items=[];
		items.push(['pixelcount','luminosity']);
        
		for(var i = 0, n = data.length; i < n; i += 4) {
			var red = data[i];
			var green = data[i + 1];
			var blue = data[i + 2];
			var alpha = data[i + 3];
			var lev = Math.round(red * 0.299 + green * 0.587 + blue * 0.114);
			items.push(["'"+i/4+"'",lev]);
				if(lev>=0 && lev<25.5)			++tableData[0][0];
				else if(lev>=25.5 && lev<51)		++tableData[1][0];
				else if(lev>=51 && lev<76.5)		++tableData[2][0];
				else if(lev>=76.5 && lev<102)		++tableData[3][0];
				else if(lev>=102 && lev<127.5)		++tableData[4][0];
				else if(lev>=127.5 && lev<153)		++tableData[5][0];
				else if(lev>=153 && lev<178.5)		++tableData[6][0];
				else if(lev>=178.5 && lev<204)		++tableData[7][0];
				else if(lev>=204 && lev<229.5)		++tableData[8][0];
				else if(lev>=229.5 && lev<=255)		++tableData[9][0];
		}
		
		google.charts.load("current", {packages:["corechart", "table"]});
		google.charts.setOnLoadCallback(function() {
			var data = google.visualization.arrayToDataTable(items);
			var tData = new google.visualization.DataTable();
			tData.addColumn('number', 'Pixel Count (Size 180x50)');
			tData.addColumn('string', 'Luminosity Range (Between 0-255)');
			tData.addRows(tableData);
			var options = {
				title: 'Frequency Distribution of Pixel Luminosity in the current frame (Y-Pixel Count) (X-Luminosity Range) (Bins:10) (Bin Size:25.5)',
				legend: { position: 'none' },
				histogram: {
					bucketSize:  25.50000000000001,
					minValue: 0,
					maxValue: 255
				},
				hAxis: {
					ticks: [0, 25.5, 51, 76.5, 102, 127.5, 153, 178.5, 204, 229.5, 255]
				},
			};
			var chart = new google.visualization.Histogram(document.getElementById('chart_div'));
				setTimeout(function(){chart.draw(data, options);},10);
			var table = new google.visualization.Table(document.getElementById('table_div'));
				table.draw(tData, {showRowNumber: true, width: '100%', height: '100%'});
		document.getElementById("BtnHist").innerHTML="Histogram";
		});
	return true;	
}

function generateHistogram()
	{
		document.getElementById("BtnHist").innerHTML="Generating...";
		document.getElementById("StatsBlocks").style="display:initial;";
		var positionCell = document.getElementById('position-cell').innerHTML;
		var latitude=positionCell.substring(1,positionCell.indexOf(","));
		var longitude=positionCell.substring(positionCell.indexOf(",")+2,positionCell.indexOf(")"));
		var headingCell = document.getElementById('heading-cell').innerHTML;
		var pitchCell = document.getElementById('pitch-cell').innerHTML;
		var panoCell = document.getElementById('pano-cell').innerHTML;
		var checkPanoCell = panoCell.substring(0,3);
		var fovCell = parseInt(document.getElementById('fov-cell').innerHTML);
		var fov;
			if(fovCell==0)
				fov=180;
			if(fovCell==1)
				fov=90;
			if(fovCell==2)
				fov=45;
			if(fovCell==3)
				fov=22.5;
			if(fovCell==4)
				fov=11.25;
		var imageUrl;
		if(checkPanoCell=="F:-")
			imageUrl = "https://maps.googleapis.com/maps/api/streetview?size=180x50&location="+latitude+","+longitude+"&fov="+fov+"&heading="+headingCell+"&pitch="+pitchCell+"&key=";
		else
			imageUrl = "https://maps.googleapis.com/maps/api/streetview?size=180x50&location="+latitude+","+longitude+"&fov="+fov+"&heading="+headingCell+"&pitch="+pitchCell+"&pano="+panoCell+"&key=";
		
		console.log(imageUrl);
		var imageObj = new Image();
			imageObj.crossOrigin = "Anonymous";
			imageObj.src = imageUrl;
			imageObj.onload = function() {
				drawImage(this);
			};
	return true;
}

function generatePieChart()
	{
		document.getElementById("BtnPie").innerHTML="Generating...";
		document.getElementById("StatsBlocks").style="display:initial;";
		var positionCell = document.getElementById('position-cell').innerHTML;
		var latitude=positionCell.substring(1,positionCell.indexOf(","));
		var longitude=positionCell.substring(positionCell.indexOf(",")+2,positionCell.indexOf(")"));
		var headingCell = document.getElementById('heading-cell').innerHTML;
		var pitchCell = document.getElementById('pitch-cell').innerHTML;
		var panoCell = document.getElementById('pano-cell').innerHTML;
		var checkPanoCell = panoCell.substring(0,3);
		var fovCell = parseInt(document.getElementById('fov-cell').innerHTML);
		var fov;
			if(fovCell==0)
				fov=180;
			if(fovCell==1)
				fov=90;
			if(fovCell==2)
				fov=45;
			if(fovCell==3)
				fov=22.5;
			if(fovCell==4)
				fov=11.25;
		var imageUrl;
		if(checkPanoCell=="F:-")
			imageUrl = "https://maps.googleapis.com/maps/api/streetview?size=180x50&location="+latitude+","+longitude+"&fov="+fov+"&heading="+headingCell+"&pitch="+pitchCell+"&key=";
		else
			imageUrl = "https://maps.googleapis.com/maps/api/streetview?size=180x50&location="+latitude+","+longitude+"&fov="+fov+"&heading="+headingCell+"&pitch="+pitchCell+"&pano="+panoCell+"&key=";
		console.log(imageUrl);
		var imageObj = new Image();
			imageObj.crossOrigin = "Anonymous";
			imageObj.src = imageUrl;
			imageObj.onload = function() {
				drawImagePie(this);
			};
	return true;
}

function drawImagePie(imageObj) {
        var canvas = document.getElementById('myCanvas');
        var context = canvas.getContext('2d');
        var imageWidth = imageObj.width;
        var imageHeight = imageObj.height;
		var tableData=[];
        context.drawImage(imageObj, 0, 0);
		tableData.push(['Red',0], ['Green',0], ['Blue',0]);
		var imageData = context.getImageData(0, 0, imageWidth, imageHeight);
        var data = imageData.data;
		var items=[];
		items.push(['Percentage Composition','Color']);
        
		for(var i = 0, n = data.length; i < n; i += 4) {
			var red = data[i];
			var green = data[i + 1];
			var blue = data[i + 2];
			var alpha = data[i + 3];
				tableData[0][1]+=red;
				tableData[1][1]+=green;
				tableData[2][1]+=blue;
		}
		tableData[0][1]/=data.length;
		tableData[1][1]/=data.length;
		tableData[2][1]/=data.length;

		items.push(['Red',tableData[0][1]], ['Green',tableData[1][1]], ['Blue',tableData[2][1]]);
		google.charts.load("current", {packages:["corechart", "table"]});
		google.charts.setOnLoadCallback(function() {
			var data = google.visualization.arrayToDataTable(items);
			var tData = new google.visualization.DataTable();
			tData.addColumn('string', 'Color');
			tData.addColumn('number', 'Average Color Component (Between 0 - 255)');
			tData.addRows(tableData);
			var options = {
				title: 'RGB Percentage Composition in the current Street View',
				legend: { position: 'none' },
				slices: {
				0: { color: 'red' },
				1: { color: 'green' },
				2: { color: 'blue' }
				},
			};
			var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
				chart.draw(data, options);
			var table = new google.visualization.Table(document.getElementById('table_div'));
				table.draw(tData, {showRowNumber: true, width: '100%', height: '100%'});
		document.getElementById("BtnPie").innerHTML="RGB Pie-Chart";
		});
	return true;	
}