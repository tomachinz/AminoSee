<!DOCTYPE html>
<html lang="en">
<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>AminoSee DNA Viewer :: WebGL 3D DNA Visualisation Pseudo-Hilbert Curve Projection :: Funk NZ</title>
	<meta name="description" content="A new way to view DNA that attributes a colour hue to each Amino acid codon triplet">
	<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
	<meta http-equiv="Content-Security-Policy" content="default-src http://127.0.0.1:8888 https://dev.funk.co.nz https://www.funk.co.nz  http://www.funk.co.nz * data: blob: 'unsafe-inline' 'unsafe-eval' ws: wss:;">
	<base href="http://www.funk.co.nz/aminosee/" target="_blank">
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
	<script src="aminosee-gui-web.js"></script>
	<!-- <script src="bundle.js"></script> -->

	<link rel="stylesheet" type="text/css" href="public/AminoSee.css">
	<link href='https://fonts.googleapis.com/css?family=Yanone+Kaffeesatz:700,400,200,100' rel='stylesheet' type='text/css'>
	<link href="https://www.funk.co.nz/css/menu.css" rel="stylesheet">
	<!-- <link href="/css/menu.css" rel="stylesheet"> -->
	<link href="https://www.funk.co.nz/css/funk2014.css" rel="stylesheet">
	<!-- <link href="/css/funk2014.css" rel="stylesheet"> -->
	<!-- Funk.nz menubar include -->
	<!-- Google Tag Manager -->
	<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-P8JX"
		height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
		<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
		j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
		'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
	})(window,document,'script','dataLayer','GTM-P8JX');</script>
	<!-- End Google Tag Manager -->
</head>

<body id="webgl" class="black nocse">
	<?php include '../includes/menu-only.php';?>

	<div id="bgCanvFixed">
		<canvas id="canvas" width="512" height="512" style="width: 512px; height: 512px;"></canvas>
	</div>

	<div id="supercontainer">
		<div id="modalBox" class="hidden">
			im normally hidden
			<input type="button" id="modalBoxButton" value="OK [ENTER]">
		</div>

		<div id="viewPortSize" class="bottom_right" style="display: none; background-color: rgb(0, 0, 0); color: rgb(255, 255, 255); font-size: 12px;"></div>

		<a href="https://www.funk.co.nz/" style="width: 100px;" title="Return to FUNK Homepage"><img src="https://www.funk.co.nz/images/nav/funk-logo-140px.png" width="140" height="70" alt="www.funk.co.nz" style="position: fixed; top: -2px; left: 26px;"/></a>




		<div id="info">
			<div id="monkeys">
				<div>
					<input type="button" id="hide" name="hide" value="Hide Controls [H]" onclick="toggleControls()"><br>
					<a href="https://www.funk.co.nz/aminosee/" onclick="toggleControls(); return false;">
						<img src="https://www.funk.co.nz/aminosee/public/seenoevilmonkeys.jpg" id="dragitem">
					</a>
					<!-- <h1>AminoSeeNoEvil</h1> -->
					<h1>Amino<span style="color: #888888;">See</span><span style="color: #dddddd;">NoEvil</span></h1>
					<div class="hidable">
						<h2 id="h2">DNA/RNA Chromosome Viewer</h2>
						<p id="description" class="small hidable">A new way to view DNA that attributes a colour hue to each Amino acid codon triplet</p>
						<p class="white small hidable">
							<a href="/pdf/AminoSee_WhitePaper_09Jan2019.pdf" class="small hidable">WHITE PAPER PDF</a> |
							<a href="/blog/news/aminosee-dna-visualisation" class="small hidable">2018 Press Release</a> |
							<a href="output" class="small hidable">2D IMAGE RENDERS</a> |
							<a href="calibration/AminoSee_Calibration_reg_HILBERT_8.png" class="small hidable">Calibration</a> |
							<a href="dist" class="small hidable" title="Download executable for win, linux, and macos">DOWNLOAD</a> |
							<a href="https://github.com/tomachinz/AminoSee" class="small hidable" title="Github Source Code Repo">SOURCE</a>
							<br />
						</p>

					</div>
				</div>
			</div>

			<!-- <div class=" header" style="color: white;"> -->

			<div id="status" class="headingStatus">
				...loading...
			</div>
			<div id="stats" class="stats whitetext">
				<h6>loading</h6>
				<pre>
					...loading...
				</pre>
			</div>
		</div>

		<div id="controls"  onclick="formClick()">
			<div id="fileheader">
				<label class="custom-file-upload">
					Custom Upload
					<input type="file" id="choosefiles" name="file" value="example-sequence.fa" multiple /></label>
					<input disabled type="button" id="cancel" class="fineprint small hidden" name="cancel" value="Cancel" onclick="cancel()">
					<span class="fineprint whitetext">Any ASCII text file containing DNA or RNA sequences in first 1k</span>
					<br />
					Hire Me: <a href="https://tomachi.co/about/hire-me">for recruiters</a>
					<output id="list"></output>
				</div>

				<br>
				<div id="#butbar">
					<!-- <input type="button" name="lessdetail" value="Less Detail [-]" onclick="lessdetail()" title="Less detail" class="flex-item">
					<input type="button" name="moredetail" value="More Detail [+]" onclick="moredetail()" title="More detail" class="flex-item"> -->
					<input type="button" id="pause" name="pause" value="Pause [P]" onclick="togglePause()" class="flex-item">
					<input type="button" id="spin" name="spin" value="Stop Rotate [R]" onclick="toggleSpin()" class="flex-item">
					<input type="button" id="amongst" name="amongst" value="Get Amoungst It [G]" onclick="getAmongstIt()" title="Put the camera wang in the middle o dat dere" class="flex-item">
					<input type="button" id="perspective" name="perspective" value="Perspective [V]iew" onclick="toggleView()" class="flex-item">
					<input type="button" id="reset" name="reset" value="Reset [U]" onclick="reset()" class="flex-item">
					<input type="button" id="testcolour" name="testcolour" value="Test Colours [T]" onclick="testColour()" class="flex-item">
					<!-- <input disabled type="button" id="fileupload" name="fileupload" value="Upload DNA (soon)" onclick="//toggleFileUpload()" class="flex-item"> -->
					<br>
					<label class="fineprint whitetext"><input type="checkbox" id="autostop" name="autostop" value="pause after running for 5 minutes" onchange="autostopChanged()" checked>pause after running for 5 minutes</label>
					<br>
					<input type="button" class="tinyButton flex-item" name="A" value="Left [A]" onclick="cursorLeft()">
					<input type="button" class="tinyButton flex-item" name="W" value="Fwd  [W]" onclick="cursorUp()">
					<input type="button" class="tinyButton flex-item" name="S" value="Back [S]" onclick="cursorDown()">
					<input type="button" class="tinyButton flex-item" name="D" value="Right[D]" onclick="cursorRight()">

					<br>
					<h1>Welcome, try the <a href="output/Brown_Kiwi_013982187v1.fa_AMINOSEE-REPORT_c123.6_sci.html" style="color: white;">Brown Kiwi</a> or <a href="output/Caenorhabdihromosome-V.fa_AMINOSEE-REPORT_reg_c1.7_fix_sci.html" style="color: white;">C.elegans</a></h1>
					* 3D mode is only showing test patterns at this time. Try using WASD keys to move about.
				</div>


				<div id="progress_bar" class="">
					<div class="percent">0%</div>
				</div>

				<div class="footer"></div>
			</div>
		</div>
	</body>
	</html>
