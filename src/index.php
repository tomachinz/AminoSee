<!DOCTYPE html>
<html lang="en">
<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>AminoSee DNA Viewer :: WebGL 3D DNA Visualisation Pseudo-Hilbert Curve Projection :: Funk NZ</title>
	<meta name="description" content="A new way to view DNA that attributes a colour hue to each Amino acid codon triplet">
	<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
	<meta http-equiv="Content-Security-Policy" content="default-src http://127.0.0.1:8888 https://dev.funk.co.nz https://www.funk.co.nz  http://www.funk.co.nz * data: blob: 'unsafe-inline' 'unsafe-eval' ws: wss:;">
	<script src="public/three.min.js"></script>
	<script src="public/jquery.min.js"></script>
	<script src="public/hilbert3D.js"></script>
	<script src="public/hilbert2D.js"></script>
	<script src="public/WebGL.js"></script>
	<script src="public/sprites.js"></script>
	<script src="public/hammer.min.js"></script>
	<script src="aminosee-gui-web.js"></script>
	<!-- <script src="bundle.js"></script> -->
	<link rel="stylesheet" type="text/css" href="public/AminoSee.css">
	<link href='https://fonts.googleapis.com/css?family=Yanone+Kaffeesatz:700,400,200,100' rel='stylesheet' type='text/css'>
	<link href="/css/menu.css" rel="stylesheet">
	<link href="/css/funk2019.css" rel="stylesheet">
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


		<div id="viewPortSize" class="bottom_right" style="display: none; background-color: rgb(0, 0, 0); color: rgb(255, 255, 255); font-size: 12px;"></div>

		<!-- <a href="https://www.funk.co.nz/" style="width: 100px;" title="Return to FUNK Homepage"><img src="https://www.funk.co.nz/images/nav/funk-logo-140px.png" width="140" height="70" alt="www.funk.co.nz" style="position: fixed; top: -2px; left: 26px;"/></a> -->




		<div id="info">
			<div id="monkeys">
				<div>
					<input type="button" id="hide" name="hide" value="Hide Controls [H]" onclick="toggleControls()"><br>
					<a href="https://www.funk.co.nz/aminosee/" onclick="toggleControls(); return false;">
						<img src="https://www.funk.co.nz/aminosee/public/seenoevilmonkeys.jpg" id="dragitem">
					</a>
					<h1>Amino<span style="color: #888888;">See</span><span style="color: #dddddd;">NoEvil</span></h1>
					<div class="hidable">
						<h2 id="h2">DNA/RNA Chromosome Viewer</h2>
						<p id="description" class="small hidable">A new way to view DNA that attributes a colour hue to each Amino acid codon triplet</p>

						<form action="../">
						<select id="genomeMenu" name="selectedGenome" onchange="fileChanged(this.options[this.selectedIndex].value)">
							<option value="output/Brown_Kiwi_NW_013982187v1/images/Brown_Kiwi_NW_013982187v1.fa_linear_c111_Reference_fix_sci.png">Brown Kiwi</option>
							<option value="output/Caenorhabditisel.dna_sm.toplevel/images/">Caenorhabditis Elegans Worm</option>
							<option value="output/Chimp_Clint_chrY/images/">Clint the Chimps Y</option>
							<option value="output/Gorilla_gorGor4_chr2A/images/">Gorgor the Gorilla Chr 2A</option>
							<option value="output/Influenza-A-virus-H9N2-NC_004905/images/">Influenza A virus H9N2</option>
							<option value="output/Kyokai7_BABQ01000000/images/">Kyokai Yeast</option>
							<option value="output/Mycoplasmapneumoosome.Chromosome/images/">Mycoplasma Calibration Large</option>
							<option value="output/Streptococcus_virus_2972/images/">Streptococcus virus</option>
							<option value="output/27MB_TestPattern/images/">27 MB Test Pattern</option>
							<option value="output/3MB_TestPattern/images/">3 MB Test Pattern</option>
							<option value="output/50KB_TestPattern/images/">50 KB Test Pattern</option>

							<option value="output/megabase/images/megabase.fa_linear_c1_Reference_fix_sci.png" >Megabase</option>
							<option value="output/Brown_Kiwi_NW_013982187v1/images/Brown_Kiwi_NW_013982187v1.fa_linear_c111_Reference_fix_sci.png">Brown Kiwi</option>
							<option value="calibration/AminoSee_Calibration_reg_linear_8.png">AminoSee Calibration Large</option>
							<option value="calibration/AminoSee_Calibration_reg_linear_2.png">AminoSee Calibration Small</option>
							<option value="output/Caenorhabditisel.dna_sm.toplevel/images/Caenorhabditisel.dna_sm.toplevel.fa_linear_c7_Reference_fix_sci.png">C.elegans</option>
							<option value="public/seenoevilmonkeys.jpg">AminoSeeNoEvil Monkeys</option>
							<option value="/images/nav/funk-logo-140px.png" selected>Funk Logo 140px</option>
						</select>
						</form>

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

			<div id="status" class="headingStatus">
				...loading...
				<div id="oi">
					<img id="current_image" src="output/Brown_Kiwi_NW_013982187v1/images/Brown_Kiwi_NW_013982187v1.fa_linear_c111_Reference_fix_sci.png" width="64px" height="64px">
				</div>
			</div>
			<div id="stats" class="stats whitetext">
				<h6>loading</h6>
				<pre>
					...loading...
				</pre>
			</div>
		</div>
		<h1>Welcome, try the <a href="output/Brown_Kiwi_NW_013982187v1/" style="color: white;">Brown Kiwi</a> or <a href="output/Caenorhabditisel.dna_sm.toplevel/" style="color: white;">C.elegans</a></h1>
		* 3D mode is only showing test patterns at this time. Try using WASD keys to move about.
		<div id="controls" onclick="resume()" style="text-align: center;">
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
					<input type="button" name="lessdetail" value="Less Detail [-]" onclick="lessdetail()" title="Less detail" class="flex-item">
					<input type="button" name="moredetail" value="More Detail [+]" onclick="moredetail()" title="More detail" class="flex-item">
					<input type="button" id="pause" name="pause" value="Pause [P]" onclick="togglePause()" class="flex-item">
					<input type="button" id="spin" name="spin" value="Stop Rotate [R]" onclick="toggleSpin()" class="flex-item">
					<input type="button" id="amongst" name="amongst" value="Get Amoungst It [G]" onclick="getAmongstIt()" title="Put the camera wang in the middle o dat dere" class="flex-item">
					<input type="button" id="perspective" name="perspective" value="Perspective [V]iew" onclick="toggleView()" class="flex-item">
					<input type="button" id="reset" name="reset" value="Reset [U]" onclick="reset()" class="flex-item">
					<input type="button" id="testcolour" name="testcolour" value="Test Colours [T]" onclick="testColour()" class="flex-item">
					<input type="button" id="loadImage" name="loadImage" value="Load Image [L]" onclick="loadImage()" class="flex-item">
					<!-- <input disabled type="button" id="fileupload" name="fileupload" value="Upload DNA (soon)" onclick="//toggleFileUpload()" class="flex-item"> -->
					<br>
					<input type="button" class="tinyButton flex-item" name="A" value="Left [A]" onclick="cursorLeft()">
					<input type="button" class="tinyButton flex-item" name="W" value="Fwd  [W]" onclick="cursorUp()">
					<input type="button" class="tinyButton flex-item" name="S" value="Back [S]" onclick="cursorDown()">
					<input type="button" class="tinyButton flex-item" name="D" value="Right[D]" onclick="cursorRight()">
					<br>
					<label class="fineprint whitetext"><input type="checkbox" id="autostop" name="autostop" value="pause after running for 5 minutes" onchange="autostopChanged()" checked>pause after running for 5 minutes</label>
					<br>

				</div>


				<div id="progress_bar" class="">
					<div class="percent">0%</div>
				</div>
				<div id="modalBox" class="hidden">
					im normally hidden
					<input type="button" id="modalBoxButton" value="OK [ENTER]">
				</div>
				<div class="footer"></div>
			</div>
		</div>
	</body>
	</html>
