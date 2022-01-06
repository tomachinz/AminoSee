// import images from 'images'

/**
* @author tomatkinson / https://www.funk.co.nz/
*/
// export
var SPRITES = {

	initSprites: function () {

		var spriteMap = new THREE.TextureLoader().load( "favicon.ico" );
		var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
		var sprite = new THREE.Sprite( spriteMaterial );
		scene.add( sprite );

	},



};
// http://localhost:4321/aminosee/output/50KB_TestPattern/50KB_TestPattern.txt_linear__Reference_c1_sci.png


// fetch("output/megabase/megabase_histogram.json")
// 	.then(response => response.json())
// 	.then(json => console.log(json));
//
//
// json.pepTable(src).forEach(function(childItemName) {
// 	log(childItemName);
// 	console.log(childItemName),
// });

// fetch("images.json")
// 	.then(response => response.json())
// 	.then(json => console.log(json));
