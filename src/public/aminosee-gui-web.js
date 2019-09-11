// "use strict";

let hilbertPoints, herbs, zoom, progress, mouseX, mouseY, windowHalfX, windowHalfY, camera, scene, renderer, hammertime, paused, spinning, perspective, distance, testTones, spectrumLines, spectrumCurves, color, geometry1, geometry2, geometry3, geometry4, geometry5, geometry6, justNameOfFile, filename, verbose, spline, point, vertices, colorsReady, controlsShowing, devmode, fileUploadShowing, maxcolorpix, nextColors, cpu, subdivisions, userFeedback, contextBitmap, pauseIntent, linewidth, pepTable
let sprites = []
pauseIntent = false
maxcolorpix = 262144 // for large genomes
linewidth = 8;
( window.location.toString().indexOf("electron") ==-1 ? isElectron = false : isElectron = true )
log("Electron mode: " + isElectron + " window.location: " + window.location)
let autostopdelay = 300000 // ms
let devautostop = 5000
let downloaderDisabled
let levels = 2 // default 2
let cubes = 0 // 1 gives just the row of three at bottom. 2 gives two rows for 6 boxes.
// let cubes = 1; // 1 gives just the row of three at bottom. 2 gives two rows for 6 boxes.
// let cubes = 2; // 1 gives just the row of three at bottom. 2 gives two rows for 6 boxes.
verbose = false
filename = getParameterFromURL("selectedGenome")
fileUploadShowing = false
perspective = true
paused = false
spinning = true
colorsReady = false
zoom = 2 //  defalt 2
distance = 900 // default 900
let stateObj = { txt: "loading..." }
let histogramJson = { txt: "loading..." }
let stackOimages = document.getElementById("stackOimages")
// let urlprefix = `../`;
let urlprefix = "output/"
let docloc = document.location.href

const root = document.documentElement

document.addEventListener("mousemove", evt => {
	let x = evt.clientX / innerWidth
	let y = evt.clientY / innerHeight
	let z = (x+1) * (y+1)

	// x *= 2
	// y *= 2
	// x -= 1
	// y -= 1

	root.style.setProperty("--mouse-x", x)
	root.style.setProperty("--mouse-y", y)
	root.style.setProperty("--mouse-scale", z )
	// console.log(x, y, z)
	let stack = document.getElementById("stackOimages")
	// stack.style.translate = translateXY(x,y)
})

if ( docloc.indexOf("funk.co.nz") == -1 ) {
	// alert(`Not production, enabling devmode`)
	devmode = true
	urlprefix = "../"
	// if ( docloc.indexOf('devmode') == -1 ) {
	//   document.location.href = docloc + "?devmode"
	// }
} else {
	// devmode = false;
	console.log("Runnig on funk.co.nz domain")
	urlprefix = "funk.co.nz/aminosee/output/"
}
if(window.addEventListener) {
	window.addEventListener("load",pageLoaded,false) //W3C
} else {
	window.attachEvent("onload",pageLoaded) //IE
}

function mover(i) {
	let id
	if (i == undefined) {
		id = "stack_reference" // reference image
	} else {
		id = "stack_" + i // reference image
	}
	let el = document.getElementById(id)
	console.log(`mover ${i} id ${id} el ${el}`)
	el.classList.add("frontmost")
	el.classList.add("blackback")
	el.style.zIndex = 6969
}

function mout(i) {
	let id
	if (i == undefined) {
		id = "stack_reference" // reference image
	} else {
		id = "stack_" + i // reference image
	}
	let el = document.getElementById(id)
	console.log(`mover ${i} id ${id} el ${el}`)
	el.classList.remove("frontmost")
	el.classList.remove("blackback")
	el.style.zIndex = 10 + i
}

function fileChanged(f) { // http://127.0.0.1:8888/aminosee/output/Brown_Kiwi_NW_013982187v1/aminosee_histogram.json
	if (f == undefined) { f = "Brown_Kiwi_NW_013982187v1" }
	let histoURL = `${urlprefix}${f}aminosee_histogram.json`
	let path = window.location.pathname
	let newURL = `${path}#?selectedGenome=${f}`
	// let image = `${f}/images/${justNameOfPNG}`
	history.pushState(stateObj, justNameOfFile, newURL)
	document.getElementById("oi").innerHTML = `<img id="current_image" src="${f}" width="64px" height="64px">`
	// document.getElementById("oi").src = f

	setupFNames()
	loadImage()
	let genomeJson = loadHistogramJson(histoURL)
}
function loadHistogramJson(histoURL) {
	let histogramJson
	console.log("FETCH") // filename
	fetch( histoURL )
		.then(response => response.json())
		.then(json => {
			console.log(json)
			histogramJson = json
			buildPage(histogramJson)
			return histogramJson
		}).catch()
}
function removesprites() {
	for ( var i = group.children.length-1; i>=0 ; i-- ) {
		var sprite = group.children[ i ]
		console.log("removing")
		scene.remove(sprite)
	}
}

function buildPage(histogramJson) {
	pepTable = histogramJson.pepTable
	summary = histogramJson.summary
	justNameOfFile = summary.name
	removesprites()

	for (i=0; i < pepTable.length; i++) {
		let image = `output/${justNameOfFile}/images/${pepTable[i].src}`
		addSpriteToScene( image, i )
	}
	// document.getElementById('stackOimages').innerHTML = imageStack(histogramJson);
	// let stackOimages = document.getElementById('stackOimages');
	// stackOimages.innerHTML = imageStack();

}
function toggleDevmode() {
	devmode = !devmode
	if (devmode) {
		stat("devmode")
		togglePause()
		toggleSpin()
		togglePause() // done twice to re-trigger the autopause
	} else {
		togglePause()
		toggleSpin()
		togglePause() // done twice to re-trigger the autopause
	}
}
function attachHandlers() {
	for (let pepTableIndex = 0; pepTableIndex < pepTable.length;  pepTableIndex++) {
		let element = document.getElementById(`row_${pepTableIndex}`)
		element.addEventListener("mouseover", mover)
		element.addEventListener("mouseout", mout)
	}
}
function pageLoaded() {
	// fileChanged("Brown_Kiwi_NW_013982187v1")
	// fileChanged("output/Brown_Kiwi_NW_013982187v1/images/Brown_Kiwi_NW_013982187v1.fa_linear_c111_Reference_fix_sci.png") // http://localhost:8888/aminosee/output/Brown_Kiwi_NW_013982187v1/images/Brown_Kiwi_NW_013982187v1.fa_linear_c111_Reference_fix_sci.png
	// loadHistogramJson(urlprefix + 'Brown_Kiwi_NW_013982187v1/aminosee_histogram.json');
	attachHandlers()
	initVariables()
	sceneCameraSetup()
	setScene()
	init2D() // has to run after scene created
	setupFNames()
	animate()
	// setupColorPicker();
	stat("[pageLoaded] Welcome to the Amino See DNA viewer")
	toggleDevmode()

	// parseApache()
}
function jsonTest() {
	fetch("output/Brown_Kiwi_NW_013982187v1/aminosee_histogram.json")
		.then(function(response) {
			return response.json()
		})
		.then(function(myJson) {
			console.log(JSON.stringify(myJson))
		})
}
function initVariables() {
	filename = getParameterFromURL("selectedGenome")
	// create a simple instance
	// by default, it only adds horizontal recognizers
	hammerIt(document.getElementById("canvas"))
	testTones = []
	spectrumLines = []
	spectrumCurves = []
	nextColors = []
	colorArray = [] // an array of color maps
	windowHalfX = window.innerWidth / 2
	windowHalfY = window.innerHeight / 2
	mouseX = 0
	mouseY = 0
	progress = document.querySelector(".percent")
	color = new THREE.Color()
	userFeedback = ""

	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		console.log("File API support detected. Groovy.")
	} else {
		stat("The File APIs are not fully supported in this browser. They are needed for loading the super massive DNA text files.")
	}
	if ( WEBGL.isWebGLAvailable() === false ) {
		document.body.appendChild( WEBGL.getWebGLErrorMessage() )
		stat(WEBGL.getWebGLErrorMessage())
	}

	stat("initialisation: zoom levels distance subdivisions " +   zoom + ", " +  levels  + ", " + distance)
	// window.addEventListener('devicemotion', listener);
	// window.addEventListener('deviceorientation', listener);
	document.addEventListener( "mousemove", onDocumentMouseMove, true )
	document.addEventListener( "touchstart", onDocumentTouchStart, false )
	document.addEventListener( "touchmove", onDocumentTouchMove, false )
	document.addEventListener( "keypress", onKeyPress, false )
	document.addEventListener("keydown", onKeyDown, false)
	document.getElementById("choosefiles").addEventListener("change", handleFileSelect, false)
	window.addEventListener( "resize", onWindowResize, false )

	scene = new THREE.Scene()
	renderer = new THREE.WebGLRenderer( { antialias: true } )
	canvas = document.getElementById("canvas")
	renderer.setPixelRatio( window.devicePixelRatio )
	renderer.setSize( window.innerWidth, window.innerHeight )
	document.body.appendChild( renderer.domElement )
}

function addSpriteToScene(src, zindex) {
	// var spriteMap = new THREE.TextureLoader().load( "output/Brown_Kiwi_NW_013982187v1/images/Brown_Kiwi_NW_013982187v1.fa_HILBERT__Reference_m7_c397.2.png" );
	console.log(src)
	var spriteMap = new THREE.TextureLoader().load( src )
	var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } )
	var sprite = new THREE.Sprite( spriteMaterial )
	var degrees = 360 / 21
	sprite.scale.set(400,400, -200 * zindex )
	sprite.position.set( zindex/2, zindex/2, zindex * 10 )
	scene.add( sprite )
	sprites.push( sprite )
}
function addOffscreenImage() {
	var img = document.getElementById("current_image")
	var ocanvas = document.createElement("canvas")
	ocanvas.width = img.width
	ocanvas.height = img.height
	ocanvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height)
	var context = ocanvas.getContext("2d")
	var imgd = context.getImageData(0, 0, img.width, img.height)
	var pix = imgd.data

	// for (var i = 0, n = pix.length; i < n; i += 4) {
	for (var i = 0, n = 100; i < n; i += 4) {
		console.log(pix[i+0],pix[i+1],pix[i+2],pix[i+3]   )
	}
}
function init2D() {
	sceneCameraSetup()
	addOffscreenImage()
}


function getParameterFromURL( param ) { // extract filename to load from url
	let href = window.location.href
	let index = href.indexOf( param )
	if ( index !== -1 ) { // if its not not there
		param = href.substring(index) // its gonna grab everything past here thats a bug

		index = param.indexOf("=")
		if ( index !== -1 ) {
			param = param.substring(index + 1) //CHOP OFF THE =
		}

		index = param.indexOf("&") // fixed by stopping at &, should probably add # and ? and =
		if ( index !== -1) {
			param = param.substring(0, index)
		}

		index = param.indexOf("#") // fixed by stopping at &, should probably add # and ? and =
		if ( index !== -1) {
			param = param.substring(0, index)
		}

		index = param.indexOf("?") // fixed by stopping at &, should probably add # and ? and =
		if ( index !== -1) {
			param = param.substring(0, index)
		}


	} else {
		// param = `output/Brown_Kiwi_NW_01398187v1/images/Brown_Kiwi_NW_013982187v1.fa_HILBERT__Reference_m7_c397.2.png`;
		console.log("no param set in URL")
		param = "output/Brown_Kiwi_NW_013982187v1/images/Brown_Kiwi_NW_013982187v1.fa_linear_c111_Reference_fix_sci.png"
	}
	console.log(`loading ${param}`)
	return param
}

function setupColorPicker() {

	var cloudCanvas = document.getElementById("cloudCanvas")
	contextBitmap = cloudCanvas.getContext("2d")

	// draw cloud
	contextBitmap.beginPath()
	contextBitmap.moveTo(170, 80)
	contextBitmap.bezierCurveTo(130, 100, 130, 150, 230, 150)
	contextBitmap.bezierCurveTo(250, 180, 320, 180, 340, 150)
	contextBitmap.bezierCurveTo(420, 150, 420, 120, 390, 100)
	contextBitmap.bezierCurveTo(430, 40, 370, 30, 340, 50)
	contextBitmap.bezierCurveTo(320, 5, 250, 20, 250, 50)
	contextBitmap.bezierCurveTo(200, 5, 150, 20, 170, 80)
	contextBitmap.closePath()
	contextBitmap.lineWidth = 5
	contextBitmap.fillStyle = "#8ED6FF"
	contextBitmap.fill()
	contextBitmap.strokeStyle = "#0000ff"
	contextBitmap.stroke()

	// save cloudCanvas image as data url (png format by default)
	var dataURL = cloudCanvas.toDataURL()

	var img = new Image()
	var img = document.createElement("img")
	img.onload = function(e) {
		ctx.drawImage(img, 0, 0, cloudCanvas.width, cloudCanvas.height)
		var url = cloudCanvas.toDataURL() // Read succeeds, cloudCanvas won't be dirty.
	}
	img.crossOrigin = "" // no credentials flag. Same as img.crossOrigin='anonymous'
	img.src = "rhino.jpg"
	var rhinoCanv = document.getElementById("rhinoCanv")
	var ctx   = rhinoCanv.getContext("2d")
	img.onload = function() {
		ctx.drawImage(img, 0, 0)
		img.style.display = "none"
	}
	var color = document.getElementById("color")
	function pick(event) {
		var x = event.layerX
		var y = event.layerY
		var pixel = ctx.getImageData(x, y, 1, 1)
		var data = pixel.data
		var rgba = "rgba(" + data[0] + ", " + data[1] +
    ", " + data[2] + ", " + (data[3] / 255) + ")"
		color.style.background =  rgba
		color.textContent = rgba
	}
	rhinoCanv.addEventListener("mousemove", pick)

	img.src = dataURL
	var myImageData = contextBitmap.createImageData(64, 64)
	var myImageData = contextBitmap.getImageData(0, 0, 64, 64)

}

function reset() {
	pauseIntent = false
	// colorsReady = false;
	stat("reset")
	// if (perspective) {
	camera.position.z = distance // go about 1200 units away.
	// }
	// initVariables();
	destroyScene()
	setScene()
	// animate();

}
function camReset() {

}
function camAmongst() {
	camera.position.z = 0 // go to the center "get amongst it"
}

function devmodeURLParam() {
	let url = window.location.href
	if (url.indexOf("devmode") !== -1) {
		devmode = false
	} else {
		devmode = true
	}
}
devmodeURLParam()



function ab2str(buf) {
	// return "out of depth";
	return String.fromCharCode.apply(null, new Uint16Array(buf))
	// return String.fromCodePoint(buf);
}
function str2ab(str) {
	var buf = new ArrayBuffer(str.length*2) // 2 bytes for each char
	var bufView = new Uint16Array(buf)
	for (var i=0, strLen=str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i)
	}
	return buf
}

function setScene() {

	// BIG YELLOW CIRCLE
	// var geometry = new THREE.CircleGeometry( 150, 64 );
	// var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
	// var circle = new THREE.Mesh( geometry, material );
	// scene.add( circle );

	if ( cubes == 0 ) {
		// 1
		geometry2 = new THREE.BufferGeometry() // bottom row with curves
		// 3
		geometry5 = new THREE.BufferGeometry() // top row with straight lines
	} else if ( cubes == 1 ) {
		geometry1 = new THREE.BufferGeometry() // bottom row with curves
		geometry2 = new THREE.BufferGeometry() // bottom row with curves
		geometry3 = new THREE.BufferGeometry() // bottom row with curves
	} else if ( cubes == 2 ) {
		geometry1 = new THREE.BufferGeometry() // bottom row with curves
		geometry2 = new THREE.BufferGeometry() // bottom row with curves
		geometry3 = new THREE.BufferGeometry() // bottom row with curves

		geometry4 = new THREE.BufferGeometry() // top row with straight lines
		// geometry5 = new THREE.BufferGeometry(); // top row with straight lines
		geometry6 = new THREE.BufferGeometry() // top row with straight lines
	}


	buildColours()
	buildHilbert()
	// buildColours();
	// console.log("herbs: "+herbs);
	// Create lines and add to scene
	material = new THREE.LineBasicMaterial( { color: 0xffffff, vertexColors: THREE.VertexColors, linewidth: linewidth  } )

	// var line, p, scale = 0.3, d = 225;
	var line, p
	var scale = 0.45 //
	var d = 300 // distance is the inter object space

	if (cubes == 2) {
		var parameters =  [
			[ material, scale * 1.5, [ - d, - d / 2, 0 ], geometry1 ],
			[ material, scale * 1.5, [   0, - d / 2, 0 ], geometry2 ],
			[ material, scale * 1.5, [   d, - d / 2, 0 ], geometry3 ],

			[ material, scale * 1.5, [ - d, d / 2, 0 ], geometry4 ],
			[ material, scale * 1.5, [   0, d / 2, 0 ], geometry5 ],
			[ material, scale * 1.5, [   d, d / 2, 0 ], geometry6 ],
		]
	} else if (cubes == 1) {
		var parameters =  [
			[ material, scale * 1.5, [ - d, - d / 2, 0 ], geometry1 ],
			[ material, scale * 1.5, [   0, - d / 2, 0 ], geometry2 ],
			[ material, scale * 1.5, [   d, - d / 2, 0 ], geometry3 ],
		]

	} else if (cubes == 0) {
		var parameters =  [
			[ material, scale * 1.5, [ 0, - d / 2, 0 ], geometry2 ],
			[ material, scale * 1.5, [   0, d / 2, 0 ], geometry5 ],

		]
	}


	for ( var i = 0; i < parameters.length; i++ ) {
		p = parameters[ i ]
		line = new THREE.Line( p[ 3 ],  p[ 0 ] )
		line.scale.x = line.scale.y = line.scale.z =  p[ 1 ]
		line.position.x = p[ 2 ][ 0 ]
		line.position.y = p[ 2 ][ 1 ]
		line.position.z = p[ 2 ][ 2 ]
		scene.add( line )
	}
}

function destroyScene() {
	// THIS WILL WIPE THE GEOMS:
	if ( cubes == 0 ) {
		geometry2 = new THREE.BufferGeometry() // bottom row with curves
		geometry5 = new THREE.BufferGeometry() // top row with straight lines
	} else if ( cubes == 1 ) {
		geometry1 = new THREE.BufferGeometry() // bottom row with curves
		geometry2 = new THREE.BufferGeometry() // bottom row with curves
		geometry3 = new THREE.BufferGeometry() // bottom row with curves
	} else if ( cubes == 2 ) {
		geometry1 = new THREE.BufferGeometry() // bottom row with curves
		geometry2 = new THREE.BufferGeometry() // bottom row with curves
		geometry3 = new THREE.BufferGeometry() // bottom row with curves
		geometry4 = new THREE.BufferGeometry() // top row with straight lines
		geometry5 = new THREE.BufferGeometry() // top row with straight lines
		geometry6 = new THREE.BufferGeometry() // top row with straight lines
	}
	for (let i = scene.children.length - 1; i >= 0; i--) {
		const object = scene.children[i]
		if (object.type === "Mesh") {
			removeEntity(object)
			object.geometry.dispose()
			object.material.dispose()
			// scene.remove(object);
		}
	}
	render()

	scene = new THREE.Scene()

}

function sceneCameraSetup() {



	cameraPerspective = new THREE.PerspectiveCamera( 33, window.innerWidth / window.innerHeight, 1, 10000 )
	cameraOrthographic = new THREE.OrthographicCamera( window.innerWidth / - zoom, window.innerWidth / zoom, window.innerHeight / zoom, window.innerHeight / - zoom, 1, 10000 )

	if (perspective) {
		camera = cameraPerspective
	} else {
		camera = cameraOrthographic
	}
	camera.position.z = distance


	stat("Getting in touch with my man Hilbert")
	// var hilbertPoints = hilbert3D( new THREE.Vector3( 0,0,0 ), 200.0, 1, 0, 1, 2, 3, 4, 5, 6, 7 );
	hilbertPoints = hilbert3D( new THREE.Vector3( 0,0,0 ), 200.0, levels, 0, 1, 2, 3, 4, 5, 6, 7 )
	hilbertPoints2D = hilbert2D( new THREE.Vector3( 0,0,0 ), 200.0, levels, 0, 1, 2, 3 )

	herbs = hilbertPoints.length
	herbs2D = hilbertPoints2D.length
	subdivisions = maxcolorpix / herbs
	// stat(subdivisions);
	stat("[subdivisions, maxcolorpix] " , subdivisions, maxcolorpix)

	// 262144 polygons
	//  32768 polygons
	target = new THREE.Vector2(scene.position.x , scene.position.y)
	log( target )
}
function removeEntity(object) {
	var selectedObject = scene.getObjectByName(object.name)
	selectedObject.parent.remove( selectedObject )
}


function buildHilbert() {
	spline = new THREE.CatmullRomCurve3( hilbertPoints )
	vertices = []
	point = new THREE.Vector3()
	for ( var i = 0; i < herbs * subdivisions; i++ ) {
		var t = i / (herbs * subdivisions)
		spline.getPoint( t, point )
		vertices.push( point.x, point.y, point.z )
	}
	//  STRAIGHT LINE VERSION
	straightVertices = []
	for ( var i = 0; i < herbs; i++ ) {
		point = hilbertPoints[ i ]
		straightVertices.push( point.x, point.y, point.z )
	}
	// 2D VERSION FOR USE WITH GEO 6
	// let vertices2D = [];
	// for ( var i = 0; i < herbs2D; i++ ) {
	//   point = hilbertPoints2D[ i ];
	//   vertices2D.push( point.x, point.y, point.z );
	// }
	// geometry1.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices2D, 3 ) ); // 2D
	// geometry3.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices2D, 3 ) ); // 2D



	// colorsReady = false;
	// if (colorsReady !== true) { // USER THE USERS COLORS
	//   nextColors = testTones;
	// }
	// if (colorsReady == true) {// USER THE USERS COLORS
	//   stat('colorsReady ' + colorsReady);
	//   geometry1.addAttribute( 'color', new THREE.Float32BufferAttribute( nextColors, 3 ) );
	//   geometry2.addAttribute( 'color', new THREE.Float32BufferAttribute( nextColors, 3 ) );
	//   geometry3.addAttribute( 'color', new THREE.Float32BufferAttribute( nextColors, 3 ) );
	// } else { // USER A TEST TONE
	//   geometry1.addAttribute( 'color', new THREE.Float32BufferAttribute( spectrumCurves, 3 ) );
	//   geometry2.addAttribute( 'color', new THREE.Float32BufferAttribute( nextColors, 3 ) );
	//   geometry3.addAttribute( 'color', new THREE.Float32BufferAttribute( spectrumCurves, 3 ) );
	// }


	// 2D GUIDES:
	// geometry4.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices2D, 3 ) ); // 2D TEST
	// geometry6.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices2D, 3 ) ); // 2D TEST
	if (colorsReady !== true) { // USER THE USERS COLORS
		nextColors = spectrumLines
	} else {
		// nextColors = testTones;
	}

	if ( cubes == 0 ) {
		geometry2.addAttribute( "position", new THREE.Float32BufferAttribute( vertices, 3 ) )
		if (colorsReady !== true) { // USER THE USERS COLORS
			nextColors = spectrumLines
			geometry2.addAttribute( "color", new THREE.Float32BufferAttribute( spectrumCurves, 3 ) )
		} else {
			geometry2.addAttribute( "color", new THREE.Float32BufferAttribute( nextColors, 3 ) )
		}
	} else if ( cubes == 1 ) {
		geometry1.addAttribute( "position", new THREE.Float32BufferAttribute( vertices, 3 ) )
		geometry2.addAttribute( "position", new THREE.Float32BufferAttribute( vertices, 3 ) )
		geometry3.addAttribute( "position", new THREE.Float32BufferAttribute( vertices, 3 ) )

		geometry1.addAttribute( "color", new THREE.Float32BufferAttribute( nextColors, 3 ) )
		geometry2.addAttribute( "color", new THREE.Float32BufferAttribute( nextColors, 3 ) )
		geometry3.addAttribute( "color", new THREE.Float32BufferAttribute( nextColors, 3 ) )

		stat("Use cubes == 2 for 6 geometries")
	} else if ( cubes == 2 ) {
		geometry1.addAttribute( "position", new THREE.Float32BufferAttribute( vertices, 3 ) )
		geometry2.addAttribute( "position", new THREE.Float32BufferAttribute( vertices, 3 ) )
		geometry3.addAttribute( "position", new THREE.Float32BufferAttribute( vertices, 3 ) )
		geometry4.addAttribute( "position", new THREE.Float32BufferAttribute( straightVertices, 3 ) )
		geometry5.addAttribute( "position", new THREE.Float32BufferAttribute( straightVertices, 3 ) )
		geometry6.addAttribute( "position", new THREE.Float32BufferAttribute( straightVertices, 3 ) )

		geometry1.addAttribute( "color", new THREE.Float32BufferAttribute( spectrumCurves, 3 ) )
		geometry2.addAttribute( "color", new THREE.Float32BufferAttribute( testTones, 3 ) )
		geometry3.addAttribute( "color", new THREE.Float32BufferAttribute( spectrumCurves, 3 ) )
		geometry4.addAttribute( "color", new THREE.Float32BufferAttribute( spectrumLines, 3 ) )
		geometry5.addAttribute( "color", new THREE.Float32BufferAttribute( spectrumLines, 3 ) ) // geometry5.addAttribute( 'position', new THREE.Float32BufferAttribute( straightVertices, 3 ) );
		geometry6.addAttribute( "color", new THREE.Float32BufferAttribute( spectrumLines, 3 ) )
	}
}

function buildColours() {
	// stat("colour map pixels: "+ maxcolorpix + ' testTones.length: '+ testTones.length);
	testTones = [] // wipe it
	spectrumCurves = []
	spectrumLines = []
	// HIGH RES COLOUR BANDS
	for ( var i = 0; i < herbs*subdivisions ; i++ ) {
		// alternative black and white
		color.setHSL(i%8/8, i%4/4, i%2 )
		testTones.push( color.r, color.g, color.b )
		// slow high res colours
		color.setHSL( i / maxcolorpix, 0.5, 0.5 )
		spectrumCurves.push( color.r, color.g, color.b )
	}

	// LOWER RESOLUTION COLOURS FOR STRAIGHT LINES
	for ( var i = 0; i < herbs; i++ ) {
		color.setHSL( i / herbs, 1.0, 0.5 )
		spectrumLines.push( color.r, color.g, color.b )
	}
}

function errorHandler(evt) {
	switch(evt.target.error.code) {
	case evt.target.error.NOT_FOUND_ERR:
		alert("File Not Found!")
		break
	case evt.target.error.NOT_READABLE_ERR:
		alert("File is not readable")
		break
	case evt.target.error.ABORT_ERR:
		break // noop
	default:
		alert("An error occurred reading this file.")
	}
}

function updateProgress(evt) {
	// evt is an ProgressEvent.
	if (evt.lengthComputable) {
		var percentLoaded = Math.round((evt.loaded / evt.total) * 100)
		// Increase the progress bar length.
		if (percentLoaded < 100) {
			updatePercent(percentLoaded)
		}
	}
}
function updatePercent(p) {
	progress.style.width = p + "%"
	progress.textContent = p + "%"
}
function infoUpdate(x) {
	console.log("infoUpdate: " + x)
	// stat(x);
	infoRefesh = true
}
function replaceFilepathFileName(f) {
	return f.replace(/^.*[\\\/]/, "")
}
function setupFNames() {
	justNameOfFile = replaceFilepathFileName(filename)
}

function getStats() {
	var t = `
  <h6>${justNameOfFile}</h6>

  <div id="oi">
  <img id="current_image" src="${filename}" width="64px" height="64px">
  <img id="offscreen_image" src="${filename}" style="postion: fixed; transform: translateXY(+100%, -100%);">
  </div>

  <pre>
  Polygons: ${herbs * subdivisions} `
	if (perspective) {
		t+= " perspective view "
	} else {
		t+= " orthographic view "
	}
	// if (basepairs>3) {
	//   t += `
	//   DNA basepairs: ${Math.round(basepairs/100000)/10} Megabases, Codons per pixel: ${codonsPerPixel}`;
	// }
	if (cpu>3) {
		t += ` CPU: ${Math.round(cpu/1000)} K IOPs `
	}
	t+= `
  Pseudo Hilbert Curve fractal order: ${levels} points: ${herbs} spline segments per point: ${subdivisions}
  Palette size: ${maxcolorpix} Line width ${linewidth} (requires Safari) ${userFeedback}`
	// <div id="stats" class="stats whitetext">
	// </div>

	if (paused) {
		t+= " PAUSED - PRESS P TO RESUME "
	}
	t+= "  </pre>"
	return t
}

// let groovyTerminal = ['.', '..', '...', '....', '.....'];

function stat(txt) {
	// document.getElementById("status").innerHTML = "<div id='status'>" + txt + "</div>";
	console.log(" [stat] "+ txt)
	document.getElementById("status").innerHTML = txt
	document.getElementById("stats").innerHTML = getStats()

	// groovyTerminal.push(txt);
	// groovyTerminal.pop();
	// groovyTerminal.shift();
	// console.log("START OF GROOVY TERM " + groovyTerminal.toString());

}
// function employWebWorker()
function workReceived(e) {
	stat("[workReceived] " + e.data.result)
}
function returnVariableName(whatsmyname) {
	let nameObject = {whatsmyname}
	let getVarNameFromObject = (nameObject) => {
		for(let varName in nameObject) {
			return varName
		}
	}
	let varName = getVarNameFromObject(nameObject)
	console.log(`THE VARIABLES NAME IS ${varName}`)
	return varName
}


function statModal(txt) { // onclickFunction is string
	actionText = "Resume [ENTER]"
	document.getElementById("modalBox").classList.replace("hidden", "modalCentered")
	document.getElementById("modalBox").innerHTML = `
  ${txt} <br /> <br />
  <input type="button" id="modalBoxButton" value="${actionText}" onclick="togglePause()">
  `
}


function handleFileSelect(evt) {
	document.getElementById("cancel").classList.remove("hidden")

	let choosefiles = evt.target.files
	console.log("file loading is being sent to background web worker... " + choosefiles.length + " files.")
	// downloaderDisabled.postMessage(choosefiles);
	// Ensure that the progress bar displays 100% at the end.
	progress.style.width = "100%"
	progress.textContent = "100%"
	setTimeout("document.getElementById('progress_bar').className='';", 100)

	for (i=0; i<choosefiles.length; i++) {
		console.log(`choosefiles[i] ${choosefiles[i]}`)

		// alert(choosefiles[i].filename);
		// downloaderDisabled.postMessage({
		//   aTopic: 'do_LoadURL',
		//   filename: choosefiles[i],
		//   url: choosefiles[i],
		//   type: 'text/plain'
		// });
	}


}

function cancel() {
	// worker.terminate();
	downloaderDisabled.terminate()
}
function loadImage() {
	colorsReady = false
	nextColors = []
	size = herbs*subdivisions
	// var img = document.getElementById('offscreen_image');
	var img = document.createElement("img")
	img.src = filename
	// alert(filename)
	var ocanvas = document.createElement("canvas")
	ocanvas.width = img.width
	ocanvas.height = img.height
	imgarea = img.width * img.height
	ocanvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height)
	var context = ocanvas.getContext("2d")
	var imgd = context.getImageData(0, 0, img.width, img.height)
	var pix = imgd.data
	stat(`${img.width}x${img.height} mapping ${imgarea} image pixels to ${size} WebGL buffer geometeries` )

	// for (var i = 0, n = 50; i < n; i += 4) {
	//   console.log(pix[i+0],pix[i+1],pix[i+2],pix[i+3]   );
	// }
	for ( var i = 0; i < size; i++ ) {
		let p = i * 4 // RGBA
		if (pix[p+2] == null) {
			color.setRGB( 16,16,16 )
		} else {
			color.setRGB( pix[p+0],pix[p+1],pix[p+2] )
		}
		nextColors.push( color.r, color.g, color.b)
	}
	colorsReady = true
	reset()
}
function testColour() {
	pauseIntent = false
	colorsReady = false
	stat(`testColour to ${herbs*subdivisions}`)
	nextColors = []
	for ( var i = 0; i < herbs*subdivisions; i++ ) {
		// color.setHSL( i / herbs ,0.5, (i%4)/3 );
		color.setHSL( i / herbs ,0.5, 0.5 )
		nextColors.push( color.r, color.g, color.b )
	}
	colorsReady = true
	reset()
}
function applyColorsArray(buffer) {
	stat("[received colors] " + buffer.byteLength/4)
	cyclesPerUpdate = 0
	// const buffer = new ArrayBuffer(maxcolorpix*4);
	const clampyColors = new Uint8ClampedArray(buffer)

	// buildColours();
	let usersColors = []

	contextBitmap.beginPath()
	contextBitmap.moveTo(0, 0)
	// HIGH RES COLOUR BANDS
	for ( var i = 0; i < clampyColors.length; i++ ) {

		log(clampyColors[i], clampyColors[i+1], clampyColors[i+2])
		// alternative black and white
		// let temp = clampyColors[i]; // 4 bytes
		color.setRGB(clampyColors[i], clampyColors[i+1], clampyColors[i+2])
		usersColors.push( color.r, color.g, color.b , opacity)
		// drawPixel(i, color, opacity, clampyColors.length);
		contextBitmap.lineTo(getPixX(i), getPixY(i))
		// console.log("%c Hue: " + color.r + ', '+ color.g + ', '+ color.b + ' background: rgb(' + color.r + ', '+ color.g + ', '+ color.b +  ' ) ; color: #fff');
	}
	contextBitmap.closePath()
	contextBitmap.lineWidth = 5
	contextBitmap.fillStyle = "#8ED6FF"
	contextBitmap.fill()
	contextBitmap.strokeStyle = "#0000ff"
	contextBitmap.stroke()

	colorsReady = true // flag to switch palettes
	paused = false
	stat("Your file has been mapped!")
	reset()
}

// if less than resHD basepairs (about 2M), the number of pixels is the same as the codons
// if more than resHD basepairs, number of pixels is basepairs / codonsPerPixel
// in future i'd like to use "sub pixel interpolation" for now its 1:1, 2:1, 3:1 etc
// probably the 4k setting will be better.
// UPDATE actully its' just passed in as "len" now
function getPixX(i) {
	var x = maxcolorpix % 1920
}
function getPixY(i) {
	var y = Math.round(( maxcolorpix / 1920 ) -0.5)  // i use rounding to count the first "1" as 1920 / 1920, but not 1919/1920
	if (y<0) {
		// alert("nek minute");
		y=0
	}
}

// function drawPixel(i, color, opacity, len) {
//
//   // draw cloud
//
//   contextBitmap.lineTo(130, 100, 130, 150, 230, 150);
//   contextBitmap.bezierCurveTo(250, 180, 320, 180, 340, 150);
//   contextBitmap.bezierCurveTo(420, 150, 420, 120, 390, 100);
//   contextBitmap.bezierCurveTo(430, 40, 370, 30, 340, 50);
//   contextBitmap.bezierCurveTo(320, 5, 250, 20, 250, 50);
//   contextBitmap.bezierCurveTo(200, 5, 150, 20, 170, 80);
//   contextBitmap.closePath();
//   contextBitmap.lineWidth = 5;
//   contextBitmap.fillStyle = '#8ED6FF';
//   contextBitmap.fill();
//   contextBitmap.strokeStyle = '#0000ff';
//   contextBitmap.stroke();
// }
function toggleFileUpload() {
	stat(document.getElementById("fileupload").value )
	// alert('ho');
	if (!fileUploadShowing) {
		document.getElementById("fileheader").style.visibility = "visible"
		document.getElementById("fileheader").style.display = "block"
		document.getElementById("fileupload").value = "Hide Upload [F]"
		document.getElementById("choosefiles").focus()
		fileUploadShowing = true
	} else {
		document.getElementById("fileheader").style.visibility = "hidden"
		document.getElementById("fileheader").style.display = "none"
		document.getElementById("fileupload").value = "Upload DNA Text [F]ile"
		fileUploadShowing = false
	}
}
function toggleControls() {
	controlsShowing = !controlsShowing
	if (controlsShowing) {
		stat("Controls Hidden [H]")
		document.getElementById("hide").value = "Show Controls [H]"
		document.getElementById("stats").style.visibility = "hidden"
		document.getElementById("stats").style.display = "none"
		document.getElementById("controls").style.visibility = "hidden"
		document.getElementById("butbar").style.visibility = "hidden"
		document.getElementById("description").classList.add("hidden")
		document.getElementById("description").classList.add("hidden")
		document.getElementById("monkeys").classList.add("tiny")
		// document.getElementById('nav').style.visibility = 'hidden';
		// document.getElementById('description').style.visibility = 'hidden';
		// document.getElementById('description').style.display = 'none';
		// document.getElementById('description').classList.remove('hidable');    // document.getElementById('description').classList.remove('hidable');
	} else {
		stat("Controls Showing [H]")
		document.getElementById("hide").value = "Hide Controls [H]"
		document.getElementById("stats").style.visibility = "visible"
		document.getElementById("stats").style.display = "block"
		document.getElementById("controls").style.visibility = "visible"
		document.getElementById("butbar").style.visibility = "visible"
		document.getElementById("description").classList.remove("hidden")
		document.getElementById("description").classList.add("hidable")
		document.getElementById("h2").classList.remove("hidden")
		document.getElementById("monkeys").classList.remove("tiny")
		// document.getElementById('description').style.display = 'block';
		// document.getElementById('description').style.visibility = 'visible';
		// document.getElementById('nav').style.visibility = 'visible';
	}
	let value_for_Event_Label =
  dataLayer.push({
  	"event" : "AminoSee",
  	"eventCategory" : "AminoSee_hideControls",
  	"eventAction" : "toggleControls",
  	"eventLabel" : controlsShowing
  	// 'eventValue' : value_for_Event_Value
  })
  // console.log("tracked bool: " + controlsShowing);
}
// ONE DAY I FOUND OUT IT LOOKS COOL TO NOT RESET CAMERA AFTER SWITCH
// I FORGOT TO PUT A RESET IN THE
// up close is z = 0
// far away is z = 1200

function getAmongstIt() {
	pauseIntent = false
	perspective = !perspective
	if (perspective) {
		stat("Getting Amongst It")
		document.getElementById("perspective").value = "Orthographic [V]iew"
		// camera = cameraOrthographic;
		// reset();
		camera = cameraPerspective;
		( perspective ? camera.position.z = 0 : zoom = 2  )

		zoom = 2 //  defalt 2
		// distance = 900; // amongst
	} else {
		stat("Back to regular")
		document.getElementById("perspective").value = "Perspective [V]iew"
		camera = cameraOrthographic;
		( perspective ? camera.position.z = distance : zoom = 2  )

		// reset();
		// camera = cameraPerspective;
	}
}
function toggleView() {
	pauseIntent = false
	if (!perspective) {
		stat("Switched to perspective mode")
		document.getElementById("perspective").value = "Orthographic [V]iew"
		camera = cameraPerspective
		camera.position.z = distance
		reset()
		perspective = true
	} else {
		stat("Switched to Orthographic mode")
		document.getElementById("perspective").value = "Perspective [V]iew"
		camera = cameraOrthographic
		reset()
		perspective = false
	}

}
let timeout
function setTimeoutPause() {
	if (devmode) {
		timeout = setTimeout(togglePause, devautostop) // pause after 5 seconds
	} else {
		timeout = setTimeout(togglePause, autostopdelay) // pause after 5 minutes
	}
}
function togglePause() {
	if (paused !== true) {
		let txt = "[P]aused"
		statModal(txt)
		document.getElementById("pause").value = "Play [P]"
		// document.getElementById('status').classList.replace('headingStatus', 'hidden');
		if (timeout) {
			clearTimeout(timeout)
		}
		// paused is whack in the middle of the screen
		paused = true
		pauseIntent = true
	} else {
		let txt = "Resumed - Press [P] to pause"
		stat(txt)
		document.getElementById("pause").value = "Pause [P]"
		// document.getElementById('status').classList.replace('hidden', 'headingStatus');
		clearModal()
		if (timeout) {
			clearTimeout(timeout)
		}
		if (document.getElementById("autostop").checked) {
			setTimeoutPause()
		}
		paused = false
		pauseIntent = false
	}
	animate()
}
function clearModal() {
	document.getElementById("modalBox").classList.replace("modalCentered", "hidden")
}
function toggleSpin() {
	pauseIntent = false
	spinning = !spinning
	if (spinning) {
		stat("Model slowly rotates with time")
		document.getElementById("spin").value = "Stop Rotation [R]"
	} else {
		stat("Model not rotating")
		document.getElementById("spin").value = "Rotate [R]"
	}
}

function hammerIt(elm) {
	hammertime = new Hammer(elm, {})
	hammertime.get("pinch").set({
		enable: true
	})
	var posX = 0,
		posY = 0,
		scale = 1,
		last_scale = 1,
		last_posX = 0,
		last_posY = 0,
		max_pos_x = 0,
		max_pos_y = 0,
		transform = "",
		el = elm

	hammertime.on("doubletap pan pinch panend pinchend", function(ev) {
		stat(ev.type +" gesture detected.")

		if (ev.type == "doubletap") {
			zoom = 4 //  defalt 2
		}
		if (ev.type == "pinch") {
		}

		//pan
		if (scale !== 1) {
			posX = last_posX + ev.deltaX
			posY = last_posY + ev.deltaY
			max_pos_x = Math.ceil((scale - 1) * el.clientWidth / 2)
			max_pos_y = Math.ceil((scale - 1) * el.clientHeight / 2)
			if (posX > max_pos_x) {
				posX = max_pos_x
			}
			if (posX < -max_pos_x) {
				posX = -max_pos_x
			}
			if (posY > max_pos_y) {
				posY = max_pos_y
			}
			if (posY < -max_pos_y) {
				posY = -max_pos_y
			}
		}


		//pinch
		if (ev.type == "pinch") {
			scale = Math.max(.999, Math.min(last_scale * (ev.scale), 4))
		}
		if(ev.type == "pinchend"){last_scale = scale}

		//panend
		if(ev.type == "panend"){
			last_posX = posX < max_pos_x ? posX : max_pos_x
			last_posY = posY < max_pos_y ? posY : max_pos_y
		}

		if (scale !== 1) {
			transform =
      "translate3d(" + posX + "px," + posY + "px, 0) " +
      "scale3d(" + scale + ", " + scale + ", 1)"
		}

		camera.translateZ( -5  * scale )


		if (transform) {
			el.style.webkitTransform = transform
		}
	})
}


function onWindowResize() {

	windowHalfX = window.innerWidth / 2
	windowHalfY = window.innerHeight / 2

	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()

	renderer.setSize( window.innerWidth, window.innerHeight )

}
function triggerFileClick() {
	console.log("triggerFileClick")
	// document.getElementById('file').trigger('click');
	$("file").trigger("click")
}
// left = 37
// up = 38
// right = 39
// down = 40
function onKeyDown( event ) {
	let theKey = event.key.toUpperCase()
	let isValidKey = true
	let value_for_Event_Label = ""
	let value_for_Event_Value = ""
	// stat("key: " + event);
	if (event.keyCode === 37) {
		cursorLeft()
		value_for_Event_Label = "ArrowLeft"
	} else if (event.keyCode === 38) {
		cursorUp()
		value_for_Event_Label = "ArrowUp"
	} else if (event.keyCode === 39) {
		cursorRight()
		value_for_Event_Label = "ArrowLeft"
	} else if (event.keyCode === 40) {
		cursorDown()
		value_for_Event_Label = "ArrowDown"
	} else {
		isValidKey = false
	}
	if (isValidKey == true) {
		dataLayer.push({
			"event" : "AminoSee",
			"eventCategory" : "AminoSee_keypress",
			"eventAction" : event.key,
			"eventLabel" : value_for_Event_Label,
			"eventValue" : value_for_Event_Value
		})
		console.log("Valid key: " + value_for_Event_Label)
		resume()
	} else {
		console.log("Invalid key, not tracked.")
	}
}
function onKeyPress( event ) {
	let isValidKey = true
	let value_for_Event_Label = ""
	let value_for_Event_Value = ""
	let theKey = event.key.toUpperCase()
	if (theKey === "P") {
		togglePause()
		value_for_Event_Label = "Pause"
	} else {
		if (paused) {
			togglePause() // auto unpause
		}
	}
	if (event.key === "Enter" || event.key === "P") {
		if (paused) {
			togglePause() // auto unpause
		}
		value_for_Event_Label = "Enter Key"
	} else if (theKey === "T") {
		testColour()
		value_for_Event_Label = "Test Colours"
	} else if (theKey === "L") {
		loadImage()
		value_for_Event_Label = "Load Image"
	} else if (theKey === "F") {
		toggleFileUpload()
		document.getElementById("choosefiles")
		value_for_Event_Label = "File Chooser"
	} else if (theKey === "R") {
		toggleSpin()
		value_for_Event_Label = "Rotate"
	} else if (theKey === "G") {
		getAmongstIt()
		value_for_Event_Label = "GetAmongstIt"
	} else if (theKey === "V") {
		toggleView()
		value_for_Event_Label = "View"
	} else if (theKey === "U") {
		reset()
		value_for_Event_Label = "Reset"
	} else if (theKey === "H") {
		toggleControls()
		value_for_Event_Label = "Hide"
	} else if (theKey === "W") {
		value_for_Event_Label = "Up"
		cursorUp()
	} else if (theKey === "S") {
		value_for_Event_Label = "Down"
		cursorDown()
	} else if (theKey === "A") {
		value_for_Event_Label = "Left"
		cursorLeft()
	} else if (theKey === "D") {
		value_for_Event_Label = "Right"
		cursorRight()
	} else if (event.key === "+") {
		moredetail()
		value_for_Event_Label = "Increase Detail"
	} else if (theKey === "-" | event.key === "-") {
		lessdetail()
		value_for_Event_Label = "Decrease Detail"
	} else {
		isValidKey = false
	}

	if (isValidKey == true) {
		dataLayer.push({
			"event" : "AminoSee",
			"eventCategory" : "AminoSee_keypress",
			"eventAction" : event.key,
			"eventLabel" : value_for_Event_Label,
			"eventValue" : value_for_Event_Value
		})
		// console.log(theKey +  " tracked key: " + value_for_Event_Label + " paused: " + paused);
		if (paused == true && theKey !== "P") {
			togglePause()
		}

	} else {
		console.log("Invalid key")
	}

}
function resume() {
	// its an autoresume when you click anything
	// but it checks that the thing you clicked wasnt pause!
	if (pauseIntent !== true && paused === true ) {
		console.log(`pause. pauseIntent ${pauseIntent} paused ${paused}`)
		togglePause()
	} else {
		console.log(`remain paused. pauseIntent ${pauseIntent} paused ${paused}`)
	}
}

function cursorLeft() {
	pauseIntent = false
	// camera.rotation.y += 5;
	camera.position.x -= 20

}

function cursorRight() {
	pauseIntent = false
	// camera.rotation.y -= 5;
	camera.position.x += 20

}
function cursorUp() {
	pauseIntent = false
	// camera.rotation.x += 5;
	camera.position.z -= 10
}

function cursorDown() {
	pauseIntent = false
	// camera.rotation.x -= 5;
	camera.position.z += 10

}
function positionStack() {
	for (i=0; i<pepTable.length; i++) {
		let thePep = pepTable[i].Codon
		let theHue = pepTable[i].Hue
		let c =      hsvToRgb( theHue/360, 0.5, 1.0 )

		if (thePep !== "Non-coding_NNN"  && thePep !== "Start_Codons" && thePep !== "Stop_Codons") {
			hhh += `<a href="${aminoFilenameIndex(i)}" onmouseover="mover(${i})" onmouseout="mout(${i})"><img src="${aminoFilenameIndex(i)}" id="stack_${i}" width="256" height="256" style="z-index: ${1000+i}; position: absolute; top: ${i*2}px; left: ${i*12}px;" alt="${pepTable[i].Codon}" title="${pepTable[i].Codon}"></a>`
		} else {
			log("non-coding nnn image not output")
		}
	}
}
function onDocumentMouseMove( event ) {
	mouseX = event.clientX - windowHalfX
	mouseY = event.clientY - windowHalfY
	// console.log("Position", mouseX, mouseY);
	// alert("deleteme")
	// if (page == "report") {
	// buildPage();
	// }
}

function onDocumentTouchStart( event ) {
	if ( event.touches.length > 1 ) {
		event.preventDefault()
		mouseX = event.touches[ 0 ].pageX - windowHalfX
		mouseY = event.touches[ 0 ].pageY - windowHalfY
	}
}

function onDocumentTouchMove( event ) {
	if ( event.touches.length == 1 ) {
		event.preventDefault()
		mouseX = event.touches[ 0 ].pageX - windowHalfX
		mouseY = event.touches[ 0 ].pageY - windowHalfY
	}
}

function animate() {
	if (paused !== true) {
		requestAnimationFrame( animate )
	}
	render()
}

function render() {
	if (perspective) {

	}
	camera.position.x += ( mouseX - camera.position.x ) * 0.05
	camera.position.y += ( - mouseY + 200 - camera.position.y ) * 0.05
	camera.lookAt( scene.position )

	if (spinning) {
		var time = Date.now() * 0.0000065
	} else {
		var time = 0
	}
	for ( var i = 0; i < scene.children.length; i ++ ) {
		var object = scene.children[ i ]
		if ( object.isLine ) {
			object.rotation.y = time * ( i % 2 ? 1 : -1 )
		}
	}
	renderer.render( scene, camera )
}

function autostopChanged() {
	tickobox = document.getElementById("autostop").checked
	if (!tickobox) { // RUN FOR AGES
		autostopdelay = 36000 // 10 hours
		paused = true
		pauseIntent = false
		togglePause()

	} else { // STOP QUICK
		// togglePause();
		autostopdelay = 300
		paused = false
		pauseIntent = true
		togglePause()
	}
}
function changeLevels() {
	pauseIntent = false
	stat("New detail level: " + levels)
	destroyScene()
	sceneCameraSetup()
	setScene()

}
function moredetail() {
	levels++
	if (levels<6) {
		stat("Increasing detail level to " + levels)
	} else {
		if (confirm("This may freeze your browser are you sure?")) {
			stat("Increasing detail level to " + levels + " (crashes browser)")
		} else {
			levels = 5
			stat("Max levels")
		}
	}
	changeLevels()
}
function lessdetail() {
	levels--
	if (levels<1) {
		levels = 0
		stat("Decreasing detail level to " + levels + " (min)")
	} else {
		stat("Decreasing detail level to " + levels)
	}
	changeLevels()
}

/**
* Converts an RGB color value to HSL. Conversion formula
* adapted from http://en.wikipedia.org/wiki/HSL_color_space.
* Assumes r, g, and b are contained in the set [0, 255] and
* returns h, s, and l in the set [0, 1].
*
* @param   Number  r       The red color value
* @param   Number  g       The green color value
* @param   Number  b       The blue color value
* @return  Array           The HSL representation
*/
function rgbToHsl(r, g, b) {
	r /= 255, g /= 255, b /= 255

	var max = Math.max(r, g, b), min = Math.min(r, g, b)
	var h, s, l = (max + min) / 2

	if (max == min) {
		h = s = 0 // achromatic
	} else {
		var d = max - min
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

		switch (max) {
		case r: h = (g - b) / d + (g < b ? 6 : 0); break
		case g: h = (b - r) / d + 2; break
		case b: h = (r - g) / d + 4; break
		}

		h /= 6
	}

	return [ h, s, l ]
}

/**
* Converts an HSL color value to RGB. Conversion formula
* adapted from http://en.wikipedia.org/wiki/HSL_color_space.
* Assumes h, s, and l are contained in the set [0, 1] and
* returns r, g, and b in the set [0, 255].
*
* @param   Number  h       The hue
* @param   Number  s       The saturation
* @param   Number  l       The lightness
* @return  Array           The RGB representation
*/
function hslToRgb(h, s, l) {
	var r, g, b

	if (s == 0) {
		r = g = b = l // achromatic
	} else {
		function hue2rgb(p, q, t) {
			if (t < 0) t += 1
			if (t > 1) t -= 1
			if (t < 1/6) return p + (q - p) * 6 * t
			if (t < 1/2) return q
			if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
			return p
		}

		var q = l < 0.5 ? l * (1 + s) : l + s - l * s
		var p = 2 * l - q

		r = hue2rgb(p, q, h + 1/3)
		g = hue2rgb(p, q, h)
		b = hue2rgb(p, q, h - 1/3)
	}

	return [ r * 255, g * 255, b * 255 ]
}

/**
* Converts an RGB color value to HSV. Conversion formula
* adapted from http://en.wikipedia.org/wiki/HSV_color_space.
* Assumes r, g, and b are contained in the set [0, 255] and
* returns h, s, and v in the set [0, 1].
*
* @param   Number  r       The red color value
* @param   Number  g       The green color value
* @param   Number  b       The blue color value
* @return  Array           The HSV representation
*/
function rgbToHsv(r, g, b) {
	r /= 255, g /= 255, b /= 255

	var max = Math.max(r, g, b), min = Math.min(r, g, b)
	var h, s, v = max

	var d = max - min
	s = max == 0 ? 0 : d / max

	if (max == min) {
		h = 0 // achromatic
	} else {
		switch (max) {
		case r: h = (g - b) / d + (g < b ? 6 : 0); break
		case g: h = (b - r) / d + 2; break
		case b: h = (r - g) / d + 4; break
		}

		h /= 6
	}

	return [ h, s, v ]
}

/**
* Converts an HSV color value to RGB. Conversion formula
* adapted from http://en.wikipedia.org/wiki/HSV_color_space.
* Assumes h, s, and v are contained in the set [0, 1] and
* returns r, g, and b in the set [0, 255].
*
* @param   Number  h       The hue
* @param   Number  s       The saturation
* @param   Number  v       The value
* @return  Array           The RGB representation
*/
function hsvToRgb(h, s, v) {
	var r, g, b

	var i = Math.floor(h * 6)
	var f = h * 6 - i
	var p = v * (1 - s)
	var q = v * (1 - f * s)
	var t = v * (1 - (1 - f) * s)

	switch (i % 6) {
	case 0: r = v, g = t, b = p; break
	case 1: r = q, g = v, b = p; break
	case 2: r = p, g = v, b = t; break
	case 3: r = p, g = q, b = v; break
	case 4: r = t, g = p, b = v; break
	case 5: r = v, g = p, b = q; break
	}

	return [ r * 255, g * 255, b * 255 ]
}
function log(txt) {
	if (verbose) {
		out(txt)
	}
}
function out(txt) {
	console.log(txt)
}

function imageStack(histogramJson) {
	let hhh = " "
	let summary = histogramJson.summary
	let name = summary.name
	let refimage = summary.refimage
	let linearimage = summary.linearimage
	hhh += `<div id="stackOimages">
  <a href="images/${name}" onmouseover="mover()" onmouseout="mout()"><img  src="images/${name}" id="stack_reference" width="256" height="256" style="z-index: ${999}; position: absolute; top: 0px; left: 0px;" alt="${refimage}" title="${refimage}"></a>`




	for (i=0; i<pepTable.length; i++) {
		let thePep = pepTable[i].Codon
		let theHue = pepTable[i].Hue
		let c =      hsvToRgb( theHue/360, 0.5, 1.0 )

		if (thePep !== "Non-coding_NNN"  && thePep !== "Start_Codons" && thePep !== "Stop_Codons") {
			hhh += `<a href="${aminoFilenameIndex(i)}" onmouseover="mover(${i})" onmouseout="mout(${i})"><img src="${aminoFilenameIndex(i)}" id="stack_${i}" width="256" height="256" style="z-index: ${1000+i}; position: absolute; top: ${i*2}px; left: ${i*12}px;" alt="${pepTable[i].Codon}" title="${pepTable[i].Codon}"></a>`
		} else {
			log("non-coding nnn image not output")
		}
	}



	//
	// histogramJson.pepTable.forEach(function(item) {
	//   log(item);
	//   let thePep = item.Codon;
	//   let theHue = item.Hue;
	//   let c =      hsvToRgb( theHue/360, 0.5, 1.0 );
	//   let src =    item.src;
	//   let z =      item.z;
	//   let i =      item.index + 1;
	//   if (thePep == "Start Codons" || thePep == "Stop Codons" || thePep == "Non-coding NNN") {
	//     html += `<!-- ${thePep.Codon} -->`;
	//   } else {
	//     hhh += `<a href="images/${src}" onmouseover="mover(${i})" onmouseout="mout(${i})"><img src="images/${src}" id="stack_${i}" width="256" height="256" style="z-index: 99; position: absolute; top: 64px; left: 64px;" alt="${thePep}" title="${item.Description}"></a>`;
	//   }
	// });
	hhh += "</div> <!--  id=\"stackOimages -- >"
	return hhh
}
// pageLoaded();
