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
    document.getElementById('formatted').innerHTML = parse(obj);
    document.getElementById('input').value = parse(obj, true);
}

function parse(obj, isFormat = false, isArray = false, depth = 0) {
    let keys = Object.keys(obj), formatted = '';
    if (!isArray) {
        if (isFormat) {
            formatted = depth > 1 ? `${getPadding(depth)}{\n` : '{\n';
            depth += 1;
        } else {
            formatted = '<div class="object"><span>{</span>';
        }
    }
    for (let i = 0; i < keys.length; i++) {
        if (isFormat) {
            if (!isArray) {
                formatted += `${getPadding(depth)}"${keys[i]}": `;
            }
        } else {
            formatted += `
                    <div class="property">
                        <span class="key">"${keys[i]}"<span class="separator">:</span></span>
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
                            <span>[</span>
                            ${parse(obj[keys[i]], false, true)}
                            <span>]</span>
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
        formatted += isFormat ? `${getPadding(depth)}}` : '<span>}</span></div>';
    }

    return formatted;
}

function getPadding(depth) {
    let pad = '';
    for (let i = 0 ; i < depth; i++) {
        pad += '  ';
    }
    return pad;
}
