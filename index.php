<!DOCTYPE html>
<html lang="en">
<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>AminoSee DNA Viewer :: WebGL 3D DNA Visualisation Pseudo-Hilbert Curve Projection :: Funk NZ</title>
	<meta name="description" content="A new way to view DNA that attributes a colour hue to each Amino acid codon triplet">
	<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
	<meta http-equiv="Content-Security-Policy" content="default-src http://localhost:8888 http://127.0.0.1:8888  http://127.0.0.1:35729  http://10.0.0.5:8888   http://127.0.0.1:8888 http://*.funk.co.nz  https://*.funk.co.nz https://www.funk.co.nz  http://www.funk.co.nz http://dev.funk.co.nz  * data: blob: 'unsafe-inline' 'unsafe-eval' ws: wss:;">
	<!-- <script src="node_modules/three/build/three.min.js"></script> -->
	<script src="public/three.min.js"></script>
	<!-- <script src="node_modules/jquery/dist/jquery.min.js"></script> -->
	<script src="public/jquery.min.js"></script>
	<script src="public/hilbert3D.js"></script>
	<script src="public/hilbert2D.js"></script>
	<script src="public/WebGL.js"></script>
	<!-- <script src="public/sprites.js" type="module"></script> -->
	<script src="public/sprites.js"></script>
	<!-- <script src="node_modules/hammerjs/hammer.min.js"></script> -->
	<script src="public/hammer.min.js"></script>
	<script src="public/aminosee-gui-web.js"></script>
	<!-- <script src="bundle.js"></script> -->

	<link rel="stylesheet" type="text/css" href="public/AminoSee.css">
	<link href='https://fonts.googleapis.com/css?family=Yanone+Kaffeesatz:700,400,200,100' rel='stylesheet' type='text/css'>
	<!-- <link href="https://www.funk.co.nz/css/menu.css" rel="stylesheet"> -->
	<link href="/css/menu.css" rel="stylesheet">
	<!-- <link href="https://www.funk.co.nz/css/funk2014.css" rel="stylesheet"> -->
	<link href="/css/funk2014.css" rel="stylesheet">
	<!-- Funk.nz menubar include -->
	<!-- Google Tag Manager -->
	<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P8JX"
		height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
		<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
		j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
		'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
	})(window,document,'script','dataLayer','GTM-P8JX');</script>
	<!-- End Google Tag Manager -->
</head>

<body id="webgl" class="black nocse">
	<?php include '../includes/menu.php';?>
	<?php include 'public/home.html';?>
