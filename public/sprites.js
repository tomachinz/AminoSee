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

fetch("output/megabase/megabase_histogram.json")
	.then(response => response.json())
	.then(json => console.log(json));



// fetch("images.json")
// 	.then(response => response.json())
// 	.then(json => console.log(json));
