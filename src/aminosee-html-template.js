// const Tabulator = require('tabulator-tables');
const beautify = require("json-beautify")
// const aminosee = require("./aminosee-cli")
const settings = require("./aminosee-settings")
const data = require("./aminosee-data")
// const { default: beautify } = require("json-beautify")
// const css = require("./public/aminosee.css")
const onesigbitTolocale = data.onesigbitTolocale
const hsvToRgb = data.hsvToRgb
const description = settings.description
const asciiart = data.asciiart




let args, debug
debug = false
// async function getSequenceNames(fastaFilePath) {
//   const t = new IndexedFasta({
//     path: fastaFilePath,
//     faiPath: 'test.fa.fai',
//   });
//   const seqNames = await t.getSequenceNames();
//   aminosee.log( seqNames )
//   return seqNames;
// }
function histogramToHTML( aminosee_histogram ) {
	return epicQuotes[Math.floor( Math.random() * epicQuotes.length )]
}
function imageStack(histogramJson) {
	let html = " "
	let pepTable = histogramJson.pepTable
	let name = histogramJson.summary.name
	let resolution = Math.sqrt( histogramJson.summary.pixhilbert )
	html += `<ul id="stackOimages" class="stack">
	`
	for ( let p = 0; p < pepTable.length; p++ ) { // standard peptide loop
		const item = pepTable[p]
		const src = pepTable[p].hilbert_preview

		let thePep = item.Codon
		let theHue = item.Hue
		let c =      hsvToRgb( theHue / 360, 0.5, 1.0 )
		let proportion = (p+1) / pepTable.length * -1
		let minimumSize = 64
		let styleLi =  `
		position: fixed;
		top:  calc( 50% - ${ resolution/3 }px );
		left: calc( 50% - ${ resolution/3 }px );
		transform: translate(
			calc( 50% + ( var(--mouse-x, 0)  * ${proportion*50}%  ) + ${p}px ),
			calc( 50% + ( var(--mouse-y, 0)  *  ${proportion*100}%  ) + ${p*2}px )
		);
		border-top:    1px solid rgba(255, 255, 255, 0.6);
		border-left:   2px solid rgba(${c}), 0.6);
		border-bottom: 1px solid rgba(0,0,0, 0.6);
		border-right:  2px solid rgba(${c}), 0.6);
		background: rgba(0,0,0,0.1);
		z-index: ${100 - p};
		` // + ${p}px // ${proportion*100}%

		styleLi = styleLi.replace(`
			`, " ")
			// console.log(styleLi)
			if (thePep == "Start Codons" || thePep == "Stop Codons" || thePep == "Non-coding NNN") {
				html += `<!-- ${thePep.Codon}  width="20%" height="20%" -->`
			} else {
				html += `
				<li data-depth="${p}" id="stack_${p}" onmouseover="mover(${p})" onmouseout="mout(${p})" onclick="mclick(${p})">
					<a href="images/${src}" title="${name} ${thePep}" style="${styleLi}">${p}. ${thePep} <br/>
				<img src="images/${src}" alt="${name} ${thePep}" onmouseover="mover(${p})" onmouseout="mout(${p})">
				</a>
				</li>
				`
			}
		}


		html += "</ul> <!-- END stackOimages MA man -->"
		// bugtxt(html)
		return html
	}

function htmlTemplate(histogramJson) {
        // console.log( histogramJson )
				let name = histogramJson.summary.name


				if (typeof histogramJson === "undefined") {
					error(`histogramJson === "undefined"`)
					try {
							histogramJson = cliInstance.getRenderObject()
					} catch(e) {}
				}
				const ishighresolution = histogramJson.summary.ishighres
				const highresnav = (ishighresolution ? `<a href="./">Standard-Res</a> | <a href="highres.html">High-Res</a>` : " " )
				var html = `
				<!DOCTYPE html>
				<html lang="en">
				<head>
				<meta charset="utf-8"/>
				<title>${ histogramJson.summary.original_source } :: AminoSee HTML Report :: DNA Viewer by Tom Atkinson ::</title>
				<meta name="description" content="transcription of ${histogramJson.summary.full_path} ${ histogramJson.summary.blurb  } ${description}">
				<link rel="stylesheet" type="text/css" href="../../public/aminosee.css">
				<link href='https://fonts.googleapis.com/css?family=Yanone+Kaffeesatz:700,400,200,100' rel='stylesheet' type='text/css'>
				<link href="https://www.funk.co.nz/css/menu.css" rel="stylesheet">
        <link href="../../public/dist/css/tabulator.css" rel="stylesheet">
        <script type="text/javascript" src="../../public/dist/js/tabulator.js"></script>
				<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        <script>
				(adsbygoogle = window.adsbygoogle || []).push({
					google_ad_client: "ca-pub-0729228399056705",
					enable_page_level_ads: true
				});
				</script>


				<!-- script src="../../../node_modules/@glue42/web/dist/web.umd.js" -->

				<script async src="../../public/three.min.js"></script>
				<script async src="../../public/jquery.min.js"></script>
				<script async src="../../public/hilbert3D.js"></script>
				<script async src="../../public/hilbert2D.js"></script>
				<script async src="../../public/WebGL.js"></script>
				<script async src="../../public/hammer.min.js"></script>
				<script src="../../public/aminosee-gui-web.js"></script>
				<style>

html, body, form, input, textarea, a, p, h1, h2, h3, h4, h5, h6, div {
  font-family: "Yanone Kaffeesatz";
  /* color: red; */
}

#monkeys h1, #monkeys h1.a {
  font-size: 23.4px;
  grid-area: footer;
}

#monkeys h2, #monkeys h2.a {
  font-size: 18px;
}

#webgl body {
  background-color: #000000;
  margin: 0;
  overflow: hidden;
}

.blackback {
  background-color: black;
  color: white;
  text-decoration-color: white;
}

/* body height 100vh width 100vw background transparent radial-gradient(at calc(var(--mouse-x, 0) * 100%) calc(var(--mouse-y, 0) * 100%), yellow, green) no-repeat 0 0 { */
body {
  height: 100vh;
  width: 100vw;
  /* background: transparent radial-gradient(at calc(var(--mouse-x, 0) * 100%) calc(var(--mouse-y, 0) * 100%), yellow, green) no-repeat 0 0; */
}

img.32piximg, img>.32piximg {
  height: 32px;
  width: 32px;
}

body.dark, html.dark, body.aminosee {
  /* background-color: #012345; */
  background-image: url("https://www.funk.co.nz/gif/bg-big-blue-gradient.gif");
  background-repeat: repeat-x;
  color: white;
  text-decoration-color: white;
}

#header a:hover, #handylinks a:hover, a:hover.button, .dark>a:hover, #omd a:hover, {
  text-decoration: underline;
  background: white;
  color: black;
  text-decoration-color: black;
}

#handylinks a, #buttonlink a, a.button, .aminosee a, .aminosee>a, .button>a {
  color: white;
  text-decoration-color: white;
  /* background-color: #012345; */
  /* background-color: rgba(200, 200, 255, 0.125); */
  border-top: 1px solid white;
  border-radius: 4px;
  margin: 2px 2px 2px 2px;
  padding: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 42px;
}

.small, button.small, form.small, input.small, textarea.small, a.small, p.small, div.small, span.small {
  margin: 0;
  padding: 0;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 2fr);
  grid-column-gap: 32px;
  grid-template-rows: 40% 60%;
}

.grid-item {
  display: inline-grid;
  grid-column: span 1;
}

#stack_wrapper {
  position: absolute;
  /* left: 50%; */
  top: 50%w;
  /* transform: translateX(-50%); */
  width: 99%;
  height: 32px;
  border: #666666 1px;
  /* background-color: yellow; */
}

#stack0images ul {
  position: relative;
  z-index: 10;
  background-color: #222222;
}

a.stack {
  text-decoration: none;
  /* visibility: hidden; */
  /* display: none; */
}

ul, li {
  /*visibility: hidden;*/
  /*display: none;*/
  list-style: none;
}

img.stack, .stack {
  /* width: calc(var("--mouse-scale", 1)px); */
  /* height: calc(var("--mouse-scale", 1)px); */
  width: auto;
  object-fit: scale-down;
  padding: 16px 16px;
  background-color: #666666;
  background-color: rgba(66, 66, 66, 0.1);
}

.behind {
  z-index: -1;
}

.frontmost, li.frontmost, a.frontmost, .frontmost li, img.frontmost {
  z-index: 6969;
  background-color: #888888;
  background-color: rgba(128, 128, 128, 0.95);
}

#stack_0, #stack_1, #stack_2, #stack_3, #stack_4, #stack_5, #stack_6, #stack_7, #stack_8, #stack_9, #stack_10, #stack_11, #stack_12, #stack_13, #stack_14, #stack_15, #stack_16, #stack_17, #stack_18, #stack_19, #stack_20, #stack_21, #stack_22, #stack_23, #stack_24 {
  visibility: visible;
  position: relative;
  /* width: calc(var("--mouse-scale", 1)/4)px; */
  /* height: calc(var("--mouse-scale", 1)/4)px; */
}

input[type=button], input[type=submit], input[type=reset] {
  min-width: 140px;
  padding: 8px 8px;
}

/* .tinyButton input[type=button], tinyButton input[type=submit], tinyButton input[type=reset] {
	min-width: 64px;
	padding: 4px 4px;
} */
#hide {
  position: relative;
  transform: translateY(-64px);
  font-size: 20px;
  pading: 8px;
  font-weight: bold;
  color: black;
  margin: 0 0 0 0;
}

input[type=number] {
  font-size: 26px;
}

#bgCanvFixed {
  position: fixed;
  z-index: -1;
  margin: 0 0 0 0;
  padding: 0;
}

/* ********** USE FOR DEFAULT POS ******** */
#status {
  font-size: 18px;
  position: fixed;
  bottom: 32px;
  z-index: 6969;
  left: 32px;
}

.sidebar {
  grid-area: sidebar;
}

.footer {
  grid-area: footer;
}

.site {
  display: grid;
  grid-template-columns: 1fr 10fr 1fr;
  grid-template-rows: auto 1fr 7fr 1fr;
  grid-template-areas:
    "title title title"
    "main header header"
    "main sidebar footer";
}

body {
  padding: 0;
  margin: 0 0 0 0;
}

/* DEBUG */
/*div, span {*/
/*border: 1px dotted white; */
/*}*/
#supercontainer {
  padding: 0;
  margin: 0 0 0 0;
  color: white;
}

form, input, textarea {
  height: 36px;
}

#stats h6 {
  padding: 1px;
  margin: 1px 1px 1px 1px;
}

.small, a.small {
  font-size: 16px;
}

#stats {
  visibility: hidden;
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  color: #eeeeee;
  font-size: 8px;
  font-family: "Old-School-Adventures", "04B", "Yanone Kaffeesatz", fixed;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  z-index: 5;
  padding: 16px;
  height: 256px;
  text-align: left;
}

@font-face {
  font-family: 'Old-School-Adventures';
  font-style: normal;
  font-weight: 200;
  src: local('Old-School-Adventures'), local('Old-School-Adventures'), url(/css/Old-School-Adventures.woff) format('woff');
  /* font-size: 12px; */
}

/* ********** USE TO GET ATTENTION ******** */
.modalCentered, #colorPicker, div.modalCentered {
  font-size: 26px;
  position: relative;
  /* text-align: center; */
  z-index: 11;
  top: 50%;
  bottom: 50%;
  left: 50%;
  right: 50%;
  width: 128px;
  height: 64px;
  background-color: rgb(255, 240, 50);
  background-color: rgba(255, 240, 50, 0.7);
  background-color: purple;
  color: #003;
  font-weight: bold;
  padding: 64px;
  border: dotted black 1px;
  transform: translate(-128px, -64px);
}

#colorPicker {
  /* z-index: 999; */
  width: 40%;
  height: 40%;
  /* transform: translate(-50%, -50%); */
  background-color: rgb(100, 240, 200);
  background-color: rgba(100, 240, 200, 0.5);
}

#info {
  /* white-space: nowrap; */
  position: relative;
  /* width: 70%; */
  margin-left: 5%;
  margin-right: 5%;
  color: #ffffff;
  padding: 32px;
  font-family: Monospace;
  /* text-align: right; */
  z-index: 10;
  /* height: 40%; */
}

#supercontainer {
  position: absolute;
  margin-top: 0;
  width: 100%;
  height: 90%;
}

#fileheader {
  display: block;
  visibility: hidden;
  display: none;
}

.hidable {
  /* display: block; */
  visibility: visible;
}

.hidden {
  visibility: hidden;
  display: none;
}

.gridcontainer {
  display: grid;
  /* width: 100%; */
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 120px 120px 120px 120px 120px 120px 120px 120px 120px 120px 120px 120px;
  /* height: 16px; */
}

.shorthand {
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-flex-direction: row;
  flex-direction: row;
}

.header, {
  grid-column: span 12;
}

.gadgets {
  grid-column: span 1;
}

.stats {
  grid-column: span 8;
}

#butbar, #butbar div {
  /*border: 1px dotted white;*/
  /* background-color: rgb(25, 25, 0); */
  /* background-color: rgba(255, 255, 0, 0.1); */
  /* text-align: center; */
  flex-direction: row;
  /* | row-reverse | column | column-reverse; */
  /* flex-flow: row wrap; */
  padding: 0;
  margin: 0;
  list-style: none;
  -ms-box-orient: horizontal;
  /* display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -moz-flex;
  display: -webkit-flex;
  display: flex; */
  /* display: grid; */
}

/* .tinyButton , , input.tinyButton {
	font-size: 0.8rem;
	max-width: 32px;
} */
#controls, input.controls {
  position: fixed;
  z-index: 10;
  grid-column: span 8;
  /* margin-left: 50%; */
  transform: translateX(-50%);
  height: 16px;
  top: 32px;
}

/* {
  height: 16px;
  top: 32px;
} */
#monkeys img {
  /* max-width: 220px; */
}

#monkeys h1, #monkeys b, #monkeys p, #monkeys h2, #monkeys input, #monkeys textarea, div.monkeys, pre.monkeys, #monkeys pre {
  color: black;
  background-color: white;
}

#monkeys.tiny h1, #monkeys.tiny b, #monkeys.tiny p, #monkeys.tiny h2 {
  font-size: 12px;
  /* display: inline; */
}

#monkeys.tiny img {
  max-width: 64px;
  padding: 2px;
  margin: 2px;
}

/* 70PX IS HALF OF BUTTON WIDTH min-width: 140px; */
@media screen and (min-width: 3000px) {
  #monkeys h1 {
    font-size: 26px;
  }

  #monkeys h2 {
    font-size: 16px;
  }

  #monkeys img {
    max-width: 400px;
  }
}

@media screen and (min-width: 1440px) {
  #monkeys img {
    max-width: 320px;
  }

  .gadgets {
    grid-column: span 1;
  }
}

@media screen and (max-width: 1440px) {
  #monkeys h1, #monkeys h2 {
    display: inline;
  }

  #monkeys {
    padding: 8px;
  }

  #monkeys h1 {
    font-size: 26px;
  }

  #monkeys img {
    /* max-width: 64px; */
    max-width: 220px;
  }

  .gadgets {
    grid-column: span 2;
  }
}

@media screen and (max-width: 990px) {
  .header {
    grid-column: span 3;
  }

  .stats, .controls {
    grid-column: span 3;
  }

  #controls {
    top: 64px;
  }

  #monkeys h1, #monkeys h2 {
    display: inline;
  }

  #monkeys {
    padding: 1px;
    /* background: teal; */
  }

  #monkeys img {
    width: 50px;
  }

  .gadgets {
    grid-column: span 3;
  }
}

@media screen and (max-width: 990px) {
  .gadgets {
    grid-column: span 4;
  }
}

@media screen and (max-width: 680px) {
  body, html, #id.div {
    background-color: rgb(64, 0, 0);
  }

  .grid-item {
    grid-column: span 4;
  }

  #description, #h2, #butbar {
    visibility: hidden;
    display: none;
  }
}

a {
  color: white;
  text-decoration-color: white;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
  color: orange;
  text-decoration-color: orange;
  background-color: black;
}

#progress_bar {
  /* margin: 10px 0; */
  padding: 3px;
  border: 1px solid #000;
  font-size: 14px;
  clear: both;
  opacity: 0;
  -moz-transition: opacity 1s linear;
  -o-transition: opacity 1s linear;
  -webkit-transition: opacity 1s linear;
}

#progress_bar.loading {
  opacity: 1.0;
}

#progress_bar .percent {
  background-color: #99ccff;
  height: auto;
  width: 0;
}

#monkeys {
  bottom: 0;
  right: 0;
  max-width: 295;
  background-color: white;
  padding: 16px;
  white-space: nowrap;
  /* text-align: center; */
}

#drag-file {
  background-color: blue;
  color: white;
  /* text-align: center; */
  width: 300px;
  height: 300px;
}

.showdropzone {
  border: 5px dashed white;
  padding: 64px;
}

.frontmost {
  z-index: 696969;
}

/*
Styles for HTML5 File Drag & Drop demonstration
Featured on SitePoint.com
Developed by Craig Buckler (@craigbuckler) of OptimalWorks.net
*/
body {
  font-family: "Segoe UI", Tahoma, Helvetica, freesans, sans-serif;
  font-size: 90%;
  margin: 10px;
  /* color: #333; */
  background-color: #fff;
}

h1, h2 {
  font-size: 1.5em;
  font-weight: normal;
}

h2 {
  font-size: 1.3em;
}

legend {
  font-weight: bold;
  color: #333;
}

#filedrag {
  display: none;
  font-weight: bold;
  /* text-align: center; */
  padding: 2em 0;
  margin: 1em 0;
  color: #012345;
  border: 2px dashed #555;
  border-radius: 7px;
  cursor: copy;
}

#filedrag.hover {
  color: #f00;
  border-color: #f00;
  border-style: dashed;
  box-shadow: inset 0 3px 4px #888;
}

img {
  max-width: 100%;
}

pre {
  font-family: monospace;
  font-size: 0.9em;
  padding: 1px 2px;
  margin: 0 0 1em auto;
  border: 1px inset #666;
  overflow: scroll;
}

#messages {
  padding: 0 10px;
  margin: 1em 0;
  border: 1px solid #999;
}

#progress p {
  display: block;
  width: 240px;
  padding: 2px 5px;
  margin: 2px 0;
  border: 1px inset #446;
  border-radius: 5px;
  background: #eee url("progress.png") 100% 0 repeat-y;
}

#progress p.success {
  background: #0c0 none 0 0 no-repeat;
}

#progress p.failed {
  background: #c00 none 0 0 no-repeat;
}



				border: 1px black;
				backround: black;
				padding: 4px;
				</style>
				</head>
				<body id="aminosee" class="aminosee">
				<!-- Google Tag Manager -->
				<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P8JX"
				height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
				<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
				new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
				j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
				'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','GTM-P8JX');</script>
				<!-- End Google Tag Manager -->




<nav id="nav">
	<ul id="menu">
		<li id="menuhomelink"><a href="/" title="Return to FUNK Homepage"><img src="//www.funk.co.nz/images/nav/funk-logo-140px.png" alt="Home" title="Home"/></a>
			<ul>
				<li>
					<a class="menuhomelink" href="//www.funk.co.nz/" title="Return to FUNK Homepage">Return to FUNK Homepage</a>
				</li>
			</ul>
		</li>
		<li id="menuabout" class="children"><a href="//www.funk.co.nz/menu/about-author.php" title="About the author" class="children">About</a></li>
		<li id="menugraphics"><a href="/blog/category/visuals" class="children">Graphics</a></li>
		<li id="menubands" class="children"><a href="/tomachi/" class="children">Tomachi</a></li>
	</ul>
</nav>



<script type="text/javascript">

// see whether device supports touch events (a bit simplistic, but...)
var hasTouch = ("ontouchstart" in window);
var iOS5 = /iPad|iPod|iPhone/.test(navigator.platform) && "matchMedia" in window;

// hook touch events for drop-down menus
// NB: if has touch events, then has standards event handling too
// but we don't want to run this code on iOS5+
if (hasTouch && document.querySelectorAll && !iOS5) {
	var i, len, element,
	dropdowns = document.querySelectorAll("a.children");
	// dropdowns = document.querySelectorAll("#menu");
	// dropdowns = document.querySelectorAll("#menu li.children > a");
	// alert("has touch!")
	// alert("dropdowns: " + dropdowns.length)


	function menuTouch(event) {
		// toggle flag for preventing click for this link
		var i, len, noclick = !(this.dataNoclick);

		// reset flag on all links
		for (i = 0, len = dropdowns.length; i < len; ++i) {
			dropdowns[i].dataNoclick = false;
		}

		// set new flag value and focus on dropdown menu
		this.dataNoclick = noclick;
		this.focus();
	}

	function menuClick(event) {

		// if click isn't wanted, prevent it
		if (this.dataNoclick) {
			event.preventDefault();
			console.log("click prevented!")

		}
	}




	for (i = 0, len = dropdowns.length; i < len; ++i) {
		element = dropdowns[i];
		element.dataNoclick = false;
		element.addEventListener("touchstart", menuTouch, false);
		element.addEventListener("click", menuClick, false);
	}
	document.body.addEventListener("load", setupTouch, false)

}
function setupTouch() {
	alert("dropdowns: " + dropdowns.length)
}
</script>



				<div id="scene" class="dark"  style="position: fixed; top: 8px; left: 8px; z-index:9999; background-color: #123456; padding: 16px; margin-bottom: 64px;"></div>

        <nav id="aminoseenav">
  				<a href="../../" class="button">AminoSee Home</a> | <a href="../">Parent</a> ${highresnav}
				</nav>
				<h1>${ histogramJson.summary.original_source}</h1>
				<h2>AminoSee DNA Render Summary</h2>
				<h3>Hilbert curvers of dimension ${histogramJson.summary.dimension} used, yielding images with ~${onesigbitTolocale(histogramJson.summary.codonsPerPixelHILBERT)} codons per pixel including non-coding regions. Linear reference file shows exactly ${onesigbitTolocale( histogramJson.summary.codonsPerPixel )} codons per pixel</h3>

				<div id="render_summary" class="grid-container">
				<div id="stack_wrapper">
				${( histogramJson.test ? " this.test " : imageStack( histogramJson ))}
				</div>

				<div class="grid-item 32piximg">
				<a href="#scrollLINEAR" class="button" title="Click To Scroll Down To See LINEAR"><br />
				<img id="oi" width="64" height="64" style="border: 4px black; background: black;" src="images/${ histogramJson.summary.linear_master }">
				1D Linear Map Image
				</a>
				</div>
				<div class="grid-item 32piximg">
				<a href="#scrollHILBERT" class="button" title="Click To Scroll Down To See 2D Hilbert Map"><br />
				<img width="64" height="64" style="border: 4px black background: black;" src="images/${ histogramJson.summary.hilbert_master }">
				2D Hilbert Map Image
				</a>
				</div>
				</div>

<pre>

${asciiart}

</pre>

				<table class="32piximg" style="background-color: white; color: black;">
				<thead>
				<tr class="light">
				<th class="light" >Amino Acid</th>
				<th>Hue&#xB0;</th>
				<th>RGB</th>
				<th>Count</th>
				<th>Description</th>
				<th>Hilbert PNG</th>
				<!--	<th>Linear PNG</th> -->
				</tr>
				</thead>
				<tbody>
				`
				// histogramJson.pepTable   = [Codon, Description, Hue, Alpha, Histocount]
				for ( let p = 0; p < histogramJson.pepTable.length; p++ ) { // standard peptide loop
					let thePep = histogramJson.pepTable[p].Codon
					let theHue = histogramJson.pepTable[p].Hue
					let c =      hsvToRgb( theHue / 360, 0.5, 1.0 )
					let richC = hsvToRgb( theHue / 360, 0.95, 0.75 )
					let imghil
					if ( !histogramJson.summary.ishighres ) {
						imghil = histogramJson.pepTable[p].hilbert_preview
						// imghil = this.aminoFilenameIndex(p)[2]
					} else {
						// imghil = this.aminoFilenameIndex(÷p)[0]
						imghil = histogramJson.pepTable[p].hilbert_master

					}

					histogramJson.pepTable[p].hilbert_master = imghil
					// let imglin = this.aminoFilenameIndex(p)[1] // second element is linear
					let imglin = histogramJson.pepTable[p].linear_master // second element is linear
					// bugtxt(`html table imghil [ ${imghil} ${p} ]`)
					let style =  `border: 1px dotted rgba(${c}, 0.5);`
					if ( thePep == "Reference" ) {  histogramJson.pepTable[p].Histocount = histogramJson.summary.genomeSize  }
					if ( thePep == "Start Codons" || thePep == "Stop Codons" || thePep == "Non-coding NNN") {
						html += `<!-- ${thePep} -->`
					} else {
						html += `
						<!--  onmouseover="mover(this)" onmouseout="mout(this)" -->
						<tr class="pepTable" id="row_${p}" style="tr { background-color: yellow; } tr:hover { background-color: rgb(${c}); }" onmouseover="mover(${p})" onmouseout="mout(${p})" onclick="mclick(${p})">
						<td>${p}. ${ histogramJson.pepTable[p].Codon} </td>
						<td style="background-color: rgb(${richC});"><p class="fineprint" style="background-color: black; background-color: rgba(0,0,0,0.5); color: white;">${theHue}&#xB0;</p></td>
						<td style="background-color: rgb(${c}); color: black; font-weight: bold; "> <p class="fineprint" style="background-color: white; background-color: rgba(255,255,255,0.5); color: black;">${c}</p></td>
						<td>${ histogramJson.pepTable[p].Histocount.toLocaleString()}</td>
						<td>${ histogramJson.pepTable[p].Description}</td>
						<td style="background-color: white; color: black; height: 16px;"><a href="images/${ imghil }" class="button" title="${name} ${ thePep }"  onmouseover="mover(${p})" onmouseout="mout(${p})" style="${style}"><img width="32" height="32" class="blackback" src="images/${ imghil }" alt="${ name } ${ thePep }"></a></td>
						<!-- <td style="background-color: white;"> <a href="images/${ imglin }" class="button" title="${name} ${ thePep }"><img width="32" height="32" class="blackback 32piximg" src="images/${ imghil }" alt="${name } ${ thePep }"></a> </td> -->
						</tr>
						`
					}
				}
				html += `
				</tbody>
				<tfoot>
				<tr>
				<td>19 Amino Acids, 4 Start/Stop codes, 1 NNN</td>
				<td>.</td>
				<td>.</td>
				<td>.</td>
				<td>.</td>
				</tr>
				</tfoot>
				</table>
				<div class="grid-container">
        <div class="grid-item 32piximg">
        <a name="summary"></a>
				<h2>Render Summary</h2>
				<div  id="example-table">class="fineprint"
				${ beautify( histogramJson ) }
				</div>
				</div>
				</div>
				<div id="monkeys">





				<div><a href="http://aminosee.funk.nz/" title="Permolink">
				<input type="button" value="VISIT WEBSITE" onclick="window.location = '#scrollHILBERT'"><br>\
				<img src="//www.funk.co.nz/aminosee/public/seenoevilmonkeys.jpg">

				<!-- <h1>AminoSeeNoEvil</h1> -->
				<h1>Amino<span style="color: #888888;">See</span><span style="color: #dddddd;">NoEvil</span></h1>
				<div class="hidable">
				<h2 id="h2">DNA/RNA Chromosome Viewer</h2>
				<p id="description" class="fineprint hidable">A new way to view DNA that attributes a colour hue to each Amino acid codon</p>



				</div>
				</a>
				</div>
				</div>

				<div>`



				html += `</div>

				<br /><br />

				<h2>Hilbert Projection</h2>
				<a name="scrollHILBERT" ></a>
				This is a curve that touches each pixel exactly once, without crossing over or breaking.
				<a href="images/${ histogramJson.summary.hilbert_master }" ><img src="images/${ histogramJson.summary.hilbert_master }" style="border: 4px black; background: black;" ></a>
				<br/>

				<h2>Linear Projection</h2>
				<a name="scrollLINEAR" ></a>
				The following image is in raster order, top left to bottom right:
				<a name="scrollLINEAR" ></a>
				<a href="images/${  histogramJson.summary.linear_master }" ><img src="images/${ histogramJson.summary.linear_master  }" style="border: 4px black; background: black;" ></a>
				<br/>

				<h2>About Start and Stop Codons</h2>
				<p>The codon AUG is called the START codon as it the first codon in the transcribed mRNA that undergoes translation. AUG is the most common START codon and it codes for the amino acid methionine (Met) in eukaryotes and formyl methionine (fMet) in prokaryotes. During protein synthesis, the tRNA recognizes the START codon AUG with the help of some initiation factors and starts translation of mRNA.

				Some alternative START codons are found in both eukaryotes and prokaryotes. Alternate codons usually code for amino acids other than methionine, but when they act as START codons they code for Met due to the use of a separate initiator tRNA.

				Non-AUG START codons are rarely found in eukaryotic genomes. Apart from the usual Met codon, mammalian cells can also START translation with the amino acid leucine with the help of a leucyl-tRNA decoding the CUG codon. Mitochondrial genomes use AUA and AUU in humans and GUG and UUG in prokaryotes as alternate START codons.

				In prokaryotes, E. coli is found to use AUG 83%, GUG 14%, and UUG 3% as START codons. The lacA and lacI coding this.regions in the E coli lac operon don’t have AUG START codon and instead use UUG and GUG as initiation codons respectively.</p>


				<div id="googleads">

				<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
				<!-- AminoSee Reports -->
				<ins class="adsbygoogle"
				style="display:block"
				data-ad-client="ca-pub-0729228399056705"
				data-ad-slot="2513777969"
				data-ad-format="auto"
				data-full-width-responsive="true"></ins>
				<script>
				(adsbygoogle = window.adsbygoogle || []).push({});
				</script>

				</div>
				</html>
				`
				return html
			}

module.exports.histogramToHTML = histogramToHTML
module.exports.htmlTemplate = htmlTemplate
