
// symbol replacements

var replacements = [
[/_([^\{])/g, "<sub class=\"exp\">$1</sub>"],
[/\^([^\{])/g, "<sup class=\"exp\">$1</sup>"],

[/\\alpha/g, "α"],
[/\\beta/g, "β"],
[/\\gamma/g, "γ"],
[/\\delta/g, "δ"],
[/\\Delta/g, "Δ"],
[/\\epsilon/g, "ε"],
[/\\rho/g, "ρ"],
[/\\mu/g, "μ"],
[/\\lambda/g, "λ"],
[/\\cdot/g, "·"],
[/\\times/g, "×"],
[/\\infty/g, "∞"],
[/\\theta/g, "θ"],
[/\\pi/g, "π"],
[/\\Sigma/g, "Σ"],
[/\\sum/g, "<span style=\"font-size: xx-large; vertical-align: middle\">Σ</span>"],
[/\\Phi/g, "Φ"],
[/\\tau/g, "τ"],
[/\\sigma/g, "σ"],
[/\\Omega/g, "Ω"],
[/\\omega/g, "ω"],
[/\\nu/g, "<i>v</i>"],
[/\\circ/g, "○"],
[/\\text\{([^\}]+)\}/g, "<span style=\"font-family: sans;font-style: normal\">$1</span>"],
[/\\mathcal\{([^\}]+)\}/g, "<b><i>$1</i></b>"],
[/\\overrightarrow\{([^\}]+)\}/g, "<b>$1</b>"],
[/\\(sin|cos|tan|cot|sec|csc|ln|log|det|lim)/g, "$1"],
[/\\int/g, "<span style=\"font-size: xx-large; vertical-align: middle\">∫</span>"],
[/\\oint/g, "<span style=\"font-size: xx-large; vertical-align: middle\">∮</span>"],
[/\\(overline|bar)\{([^\}]+)\}/g, "<span style=\"text-decoration: overline;\">$2</span>"],
[/\\hat\{([^\}])([^\{]*)\}/g, "$1&#770;$2"],
[/\\dot\{([^\}])([^\{]*)\}/g, "$1&#775;$2"],
[/\\angle/g, "	&#8736;"],
[/\\(oplus|cap|cup|lceil|rceil|lfloor|rfloor)/g, "&$1;"],
[/\\tilde\{([^\}])([^\{]*)\}/g, "$1&#771;$2"],
[/\\in/g, "∈"],
[/\\notin/g, "∉"],
[/\\varnothing/g, "∅"],
[/\\subseteq/g, "⊆"],
[/\\leq/g, "≤"],
[/\\geq/g, "≥"],
[/\\partial/g, "∂"],
[/\\pm/g, "&plusmn;"],
[/\\mp/g, "&mnplus;"],
[/\\neq/g, "≠"],
[/\\(to|rightarrow)/g, "→"],
[/\\approx/g, "≈"],
[/\\sqrt\[(.+?)\]/g, "<sup>$1</sup>\\sqrt"],
[/\\begin\{array\}\{.+?\}/g, "<table class=\"tmath array\" type=\"\"><tr><td class=\"cell\">"],
[/\\begin{bmatrix}/g, "<table class=\"tmath array array-LR\"><tr><td  class=\"cell\">"],
[/\\begin{cases}/g, "<table class=\"tmath array array-L\"><tr><td  class=\"cell\">"],
[/\\end\{(array|cases|bmatrix)\}/g, "</td></tr></table>"],

[/\\(left)[ ]?(\(|\)|\[|\]|\\\}|\\\{|\.|\})/g, "<span class=\"bracket\">$2</span><span class=\"autofit\">"],
[/\\(right)[ ]?(\(|\)|\[|\]|\\\}|\\\{|\.|\|)/g, "</span><span class=\"bracket\">$2</span>"],

[/\\\\/g, "</td></tr><tr><td>"],
[/([^\\])&amp;/g, "$1</td><td>"],
[/\\&amp;/g, "&amp;"],
[/[ ]+/g, " "]
];

// nestable LaTex functions
var funcs = [
["\\frac", 2, "<table class=\"tmath frac\"><tr><td class=\"div numerator\">", "</td></tr>", "<tr><td class=\"div\">", "</td></tr></table>"],
["^", 1, "<sup class=\"exp\">", "</sup>"],
["_", 1, "<sub class=\"exp\">", "</sub>"],
["\\mathbf", 1, "<b>", "</b>"],
["\\sqrt", 1, "<span class=\"bracket\">√</span><span class=\"sqrt autofit\">", "</span><span class=\"bracket\"></span>"]
];


var eqs = document.getElementsByClassName("math");



function parseMath(m) {

	for (var i = 0; i < replacements.length; i++) {
		m = m.replace(replacements[i][0], replacements[i][1]);
	}

	var retm = "";
	var header = [];

	for (var j = 0; j < m.length; j++) {
 
		var f = -1;

   for (var k = 0; k < funcs.length; k++) {
			if (m.slice(j, funcs[k][0].length + j) === funcs[k][0]) {
				f = k;
				break;
			}
		}
		if (f > -1) {
			header.push([f, 0, 1]); // new instance (function, bracket argument, count)
			retm += funcs[f][2];
			j += funcs[f][0].length;
    	}
		else if (m[j] === '{' && m[j-1] != '\\' && header.length > 0) { // not escaped opening brace
			header[header.length - 1][2] ++;
			header[header.length - 1][1] ++;
			retm += funcs[header[header.length - 1][0]][header[header.length - 1][1] + 2]; 
    	}
		else if (m[j] === '}' && m[j-1] != '\\' && header.length > 0) { // not escaped closing brace
			header[header.length - 1][2] --;
			if (header[header.length - 1][2] === 0) {
				header[header.length - 1][1] ++; // close
				retm += funcs[header[header.length - 1][0]][header[header.length - 1][1] + 2]
				if(header[header.length - 1][1] === funcs[header[header.length - 1][0]][1] * 2 - 1) {
					header.pop();
				}
			}
		}
		else {
			if (m[j] === '\\' && (m[j+1] === '{' || m[j+1] === '}')) {
				j++; // escape braces
			}
			retm += m[j];
		}
	}
	return retm;
}


for (var i = 0; i < eqs.length; i++) {
	eqs[i].innerHTML = parseMath(eqs[i].innerHTML);
	parseStyle(eqs[i]);
}

// equation color set by CSS sheet
var eqColor = "";
if (eqs.length != 0) {
	eqColor = window.getComputedStyle(eqs[0]).getPropertyValue("color");
}

function parseStyle(el) {

	var fits = el.getElementsByClassName("autofit");
	var exps = el.getElementsByClassName("exp");

	// Do dynamic delimiters

	for (var i = 0; i < fits.length; i++)
	{
		var tabs = fits[i].getElementsByClassName("tmath");
		var maxh = 0;
		for (var j = 0; j < tabs.length; j++) {
			if (tabs[j].offsetHeight > maxh) {
				maxh = tabs[j].offsetHeight;
			}
		}
		fits[i].style.height = maxh + "px";
		var Lbracket = fits[i].previousElementSibling;
		var Rbracket = fits[i].nextElementSibling;
	
		var factor = 1.1 * maxh / 12;
		if (factor == 0)
		{
			factor = 2;
		}

		if(Lbracket != null) {
			if(Lbracket.innerHTML == ".") Lbracket.innerHTML = "";
			Lbracket.style.transform = "scaleY(" + factor + ")";
		}

		if(Rbracket != null) {
			if(Lbracket.innerHTML == ".") Lbracket.innerHTML = "";
			Rbracket.style.transform = "scaleY(" + factor + ")";
		}
	}

	// Check for stacked exponents / subscripts

	for (var i = 0; i < exps.length; i++) {
		var prev = previousValid(exps[i]);
		if (prev.nodeType == 1) { // element
			var dx = 0;
			var dy = 0;
			if (prev.tagName !== "B" && prev.tagName !== "I") {
				dy = prev.offsetHeight * -0.5;
			}
			if(prev.tagName === "SUP" || prev.tagName === "SUB") { // stacked
				dx = prev.offsetWidth * -1;
				prev = previousValid(prev);
				dy = prev.offsetHeight * -0.5
			}	
			if (exps[i].tagName == "SUB") {
				dy = dy * -1;
			}
			exps[i].style.transform = "translate(" + dx + "px, " + dy + "px)";
		}
	}
}

function previousValid(el) {
	var p = el;
	while(true)  {
		p = p.previousSibling;
		if(p == null) return null;
		else if(p.textContent != " " || p.type == 1) return p;
	}
}
