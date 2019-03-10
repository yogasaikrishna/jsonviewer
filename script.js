/* jshint esversion: 6 */

let btn = document.getElementById('format');
btn.addEventListener('click', formatJSON);
// formatJSON();

function formatJSON() {
    let elem = document.getElementById('input');
    let value = elem.value;
    let json = `
    {
        "a": 1,
        "b": "Hello",
        "c": true,
        "d": 1.314,
        "e": {
            "a": 2,
            "b": "World"
        },
        "f": [
            {
                "a": 3
            },
            "4",
            "5",
            "6"
        ]
    }
    `;

    let obj = JSON.parse(value);
		let template = `<div class="toggle open">
											<i class="fal fa-minus-square"></i>
										</div>
										<div class="property">${parse(obj)}</div>`;
    document.getElementById('formatted').innerHTML = template;
    document.getElementById('input').value = parse(obj, true);
		setUpHandlers();
}

function parse(obj, isFormat = false, isArray = false, depth = 0) {
    let keys = Object.keys(obj), formatted = '', type, length;
    if (!isArray) {
        if (isFormat) {
            formatted = depth > 1 ? `${getPadding(depth)}{\n` : '{\n';
            depth += 1;
        } else {
						type = Array.isArray(obj) ? 'Array': 'Object';
						length = Object.keys(obj).length;
            formatted = '<div class="object">';
						if (type && length) {
								formatted += `<span class="property-type">${type} {${length}}</span>`;
						}
						formatted += '<span class="open">{</span>';
        }
    }
    for (let i = 0; i < keys.length; i++) {
        if (isFormat) {
            if (!isArray) {
                formatted += `${getPadding(depth)}"${keys[i]}": `;
            }
        } else {
						if (typeof obj[keys[i]] === 'object' || Array.isArray(obj[keys[i]])) {
								type = Array.isArray(obj[keys[i]]) ? 'Array': 'Object';
								length = Object.keys(obj[keys[i]]).length;
								formatted += `<div class="toggle open" data-type="${type}" data-length="${length}">
																<i class="fal fa-minus-square"></i>
															</div>`;
						}
            formatted += `
                    <div class="property">
                        <span class="key">${keys[i]}<span class="separator">:</span></span>
                `;
        }
        if (typeof obj[keys[i]] === 'object' && !Array.isArray(obj[keys[i]]) && obj[keys[i]] !== null) {
            formatted += parse(obj[keys[i]], isFormat, false, depth);
        } else if (Array.isArray(obj[keys[i]])) {
            if (isFormat) {
                formatted += `[\n${parse(obj[keys[i]], isFormat, true, ++depth)}`;
                formatted += `${getPadding(--depth)}]`;
            } else {
                formatted += `
                        <div class="array">
														<span class="property-type">${type} [${length}]</span>
                            <span class="open">[</span>
                            ${parse(obj[keys[i]], false, true)}
                            <span class="close">]</span>
                        </div>
                    `;
            }
        } else if (typeof obj[keys[i]] === 'string') {
            if (isFormat) {
                formatted += isArray ? `${getPadding(depth)}"${obj[keys[i]]}"` : `"${obj[keys[i]]}"`;
            } else {
                formatted += `
                        <span class="string">"${obj[keys[i]]}"</span>
                    `;
            }
        } else {
            if (isFormat) {
                formatted += obj[keys[i]];
            } else {
                if (obj[keys[i]] !== null) {
                    if (typeof obj[keys[i]] === 'boolean') {
                        formatted += `
                            <span class="boolean">${obj[keys[i]]}</span>
                        `;
                    } else {
                        formatted += `
                            <span class="other">${obj[keys[i]]}</span>
                        `;
                    }
                } else {
                    formatted += `
                        <span class="null">${obj[keys[i]]}</span>
                    `;
                }
            }
        }

        if (i < keys.length - 1) {
            if (isFormat) {
                formatted += ',\n';
            } else {
                formatted += '<span class="comma">,</span></div>';
            }
        } else {
            formatted += isFormat ? '\n' : '</div>';
        }
    }

    if (!isArray) {
        depth -= 1;
        formatted += isFormat ? `${getPadding(depth)}}` : '<span class="close">}</span></div>';
    }

    return formatted;
}

function setUpHandlers() {
		let elems = document.getElementsByClassName('toggle');
		for (let i = 0; i < elems.length; i++) {
				elems[i].addEventListener('click', toggleProperty);
		}
}

function toggleProperty(e) {
		e.stopPropagation();
		let elem = e.target.parentElement;
		if (elem.classList.contains('open')) {
				elem.classList.remove('open');
				elem.classList.add('closed');
				elem.innerHTML = '<i class="fal fa-plus-square"></i>';
		} else {
				elem.classList.remove('closed');
				elem.classList.add('open');
				elem.innerHTML = '<i class="fal fa-minus-square"></i>';
		}
		console.log(elem);
}

function getPadding(depth) {
    let pad = '';
    for (let i = 0 ; i < depth; i++) {
        pad += '  ';
    }
    return pad;
}
