const aminosee = require("./aminosee-cli")
const settings = require("./aminosee-settings")
const data =     require("./aminosee-data")
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

	html += `<ul id="stackOimages" class="stack">
	`
	for ( let p = 0; p < pepTable.length; p++ ) { // standard peptide loop
		const item = pepTable[p]
		const src = pepTable[p].hilbert_preview

		let thePep = item.Codon
		let theHue = item.Hue
		let c =      hsvToRgb( theHue / 360, 0.5, 1.0 )
		let name =   item.name
		let proportion = (-0.5 + ((p+1) / pepTable.length )) * 2
		let minimumSize = 64
		let styleLi =  `
		position: fixed;
		top:  50%;
		left: 50%;
		transform: translate(
			calc( -50% + var(--mouse-x, 0) * ${proportion*100}% + ${p}px ),
			calc( -50% + var(--mouse-y, 0) * ${proportion*100}% + ${p}px )
		);
		border-top:    1px solid rgba(255, 255, 255, 0.4);
		border-left:   2px solid rgba(${c}), 0.8);
		border-bottom: 1px solid rgba(0,0,0, 0.5);
		border-right:  2px solid rgba(${c}), 0.2);
		background: rgba(0,0,0,0.2);
		z-index: ${p+1};
		`

		styleLi = styleLi.replace(`
			`, " ")
			// console.log(styleLi)
			if (thePep == "Start Codons" || thePep == "Stop Codons" || thePep == "Non-coding NNN") {
				html += `<!-- ${thePep.Codon}  width="20%" height="20%" -->`
			} else {
				html += `
				<li data-depth="${p}" id="stack_${p}" onmouseover="mover(${p})" onmouseout="mout(${p})" onclick="mclick(${p})">
					<a href="images/${src}" title="${name} ${thePep}" style="${styleLi}">${p}. ${thePep} <br/>
				<img src="images/${src}" alt="${name} ${thePep}" title="${name}" onmouseover="mover(${p})" onmouseout="mout(${p})">
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
				// let histogramJson;
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
				<link rel="stylesheet" type="text/css" href="../../public/AminoSee.css">
				<link href='https://fonts.googleapis.com/css?family=Yanone+Kaffeesatz:700,400,200,100' rel='stylesheet' type='text/css'>
				<link href="https://www.funk.co.nz/css/menu.css" rel="stylesheet">

				<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
				<script>
				(adsbygoogle = window.adsbygoogle || []).push({
					google_ad_client: "ca-pub-0729228399056705",
					enable_page_level_ads: true
				});
				</script>



				<script async src="../../public/three.min.js"></script>
				<script async src="../../public/jquery.min.js"></script>
				<script async src="../../public/hilbert3D.js"></script>
				<script async src="../../public/hilbert2D.js"></script>
				<script async src="../../public/WebGL.js"></script>
				<script async src="../../public/hammer.min.js"></script>
				<script src="../../public/aminosee-gui-web.js"></script>
				<style>
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

				<nav style="position: relative; padding: 32px;">
				<div id="scene" class="dark"  style="position: fixed; top: 8px; left: 8px; z-index:9999; background-color: #123456; padding: 16px; margin-bottom: 64px;">
				<a href="../../" class="button">AminoSee Home</a> | <a href="../?C=M;O=D">Parent</a> ${highresnav}
				</div>
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
						// imghil = this.aminoFilenameIndex(p)[0]
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
						<td style="background-color: white; color: black; height: 16px;"><a href="images/${ imghil }" class="button" title="Amino filter: ${ thePep }"  onmouseover="mover(${p})" onmouseout="mout(${p})" style="${style}"><img width="32" height="32" class="blackback" src="images/${ imghil }" alt="${  histogramJson.summary.source } ${ thePep }"></a></td>
						<!-- <td style="background-color: white;"> <a href="images/${ imglin }" class="button" title="Amino filter: ${ thePep }"><img width="32" height="32" class="blackback 32piximg" src="images/${ imghil }" alt="${ histogramJson.summary.source } ${ thePep }"></a> </td> -->
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
				<h2>Render Summary</h2>
				<pre class="fineprint">
				${ histogramJson }
				</pre>
				</div>
				</div>
				<div id="monkeys">





				<div><a href="http://aminosee.funk.nz/">
				<input type="button" value="VISIT WEBSITE" onclick="window.location = '#scrollHILBERT'"><br>

				<img src="https://www.funk.co.nz/aminosee/public/seenoevilmonkeys.jpg">

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
