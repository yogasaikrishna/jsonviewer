/* jshint esversion: 6 */

function formatJSON() {
  const elem = document.getElementById('input');
  const value = elem.value;
  const json = `[
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
    }]
    `;

  const obj = JSON.parse(value);
  const template = `<div class="toggle open">
    <i class="fal fa-minus-square"></i></div>
    <div class="property">${parse(obj)}</div>`;
  document.getElementById('formatted').innerHTML = template;
  document.getElementById('input').value = parse(obj, true);
  setUpHandlers();
}

function parse(obj, isFormat = false, isArray = false, depth = 0) {
  const keys = Object.keys(obj);
  let length = keys.length;
  let formatted = '';
  let type = Array.isArray(obj) ? 'Array' : 'Object';
  if (!isArray) {
    if (isFormat) {
      formatted = depth > 1 ? `${getPadding(depth)}` : '';
      formatted += type === 'Array' ? '[\n' : '{\n';
      depth += 1;
    } else {
      formatted =
        type === 'Array' ? '<div class="array">' : '<div class="object">';
      if (type && length) {
        formatted += `<span class="property-type">${type} `;
        formatted += type === 'Array' ? `[${length}]` : `{${length}}`;
        formatted += '</span>';
      }
      formatted += '<span class="open">';
      formatted += type === 'Array' ? '<i class="fas fa-brackets"></i></span>' : '<i class="fas fa-brackets-curly"></i></span>';
    }
  }
  for (let i = 0; i < keys.length; i++) {
    if (isFormat) {
      if (!isArray && type !== 'Array') {
        formatted += `${getPadding(depth)}"${keys[i]}": `;
      } else if (!isArray) {
        formatted += `${getPadding(depth)}`;
      }
    } else {
      if (typeof obj[keys[i]] === 'object' || Array.isArray(obj[keys[i]])) {
        type = Array.isArray(obj[keys[i]]) ? 'Array' : 'Object';
        length = Object.keys(obj[keys[i]]).length;
        formatted += `<div class="toggle open" data-type="${type}"
          data-length="${length}"><i class="fal fa-minus-square"></i></div>`;
      }
      formatted += `
                    <div class="property">
                        <span class="key">${keys[i]}
                        <span class="separator">:</span></span>
                `;
    }
    if (typeof obj[keys[i]] === 'object' && !Array.isArray(obj[keys[i]]) &&
      obj[keys[i]] !== null) {
      formatted += parse(obj[keys[i]], isFormat, false, depth);
    } else if (Array.isArray(obj[keys[i]])) {
      if (isFormat) {
        formatted += `[\n${parse(obj[keys[i]], isFormat, true, ++depth)}`;
        formatted += `${getPadding(--depth)}]`;
      } else {
        formatted += `<div class="array">
            <span class="property-type">${type} [${length}]</span>
            <span class="open"><i class="fas fa-brackets"></i></span>
            ${parse(obj[keys[i]], false, true)}
          </div>`;
      }
    } else if (typeof obj[keys[i]] === 'string') {
      if (isFormat) {
        if (isArray) {
          formatted += `${getPadding(depth)}"${obj[keys[i]]}`;
        } else {
          formatted += `"${obj[keys[i]]}"`;
        }
      } else {
        formatted += `<span class="string">`;
        if (obj[keys[i]].startsWith('http://') || obj[keys[i]].startsWith('https://')) {
          formatted += `<a href="${obj[keys[i]]}" target="_blank">${obj[keys[i]]}</a>`;
        } else {
          formatted += `"${obj[keys[i]]}"`;
        }
        formatted += `</span>`;
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
        formatted += '<span class="comma"></span></div>';
      }
    } else {
      formatted += isFormat ? '\n' : '</div>';
    }
  }

  if (!isArray) {
    depth -= 1;
    if (isFormat) {
      formatted += `${getPadding(depth)}`;
      formatted += type === 'Array' ? ']' : '}';
    } else {
      formatted += '<span class="close">';
      formatted += type === 'Array' ? '</span></div>' : '</span></div>';
    }
  }

  return formatted;
}

function setUpHandlers() {
  const elems = document.getElementsByClassName('toggle');
  for (let i = 0; i < elems.length; i++) {
    elems[i].addEventListener('click', toggleProperty);
  }

  // const properties = document.getElementsByClassName('property');
  // for (let i = 0; i < properties.length; i++) {
  //   properties[i].addEventListener('click', highlightProperty);
  // }
}

function highlightProperty(e) {
  e.stopPropagation();
  const properties = document.getElementsByClassName('property');
  for (let i = 0; i < properties.length; i++) {
    properties[i].classList.remove('highlight');
    properties[i].style.background = 'none';
  }
  const elem = e.target.parentElement;
  if (!elem.classList.contains('highlight')) {
    elem.classList.add('highlight');
    elem.style.background = '#eee';
  }
}

function toggleProperty(e) {
  const elem = e.target.parentElement;
  if (elem.classList.contains('open')) {
    elem.classList.remove('open');
    elem.classList.add('closed');
    elem.innerHTML = '<i class="fal fa-plus-square"></i>';
  } else {
    elem.classList.remove('closed');
    elem.classList.add('open');
    elem.innerHTML = '<i class="fal fa-minus-square"></i>';
  }
}

function getPadding(depth) {
  let pad = '';
  for (let i = 0; i < depth; i++) {
    pad += '  ';
  }
  return pad;
}

function showTab(tabId) {
  const input = document.getElementById('input');
  const value = input.value;
  if (!value) {
    window.alert('Please enter valid JSON');
    return;
  }
  if (tabId == 'viewer') {
    formatJSON();
  }

  const tabs = document.getElementsByClassName('tab');
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('active');
  }

  const tabBodies = document.getElementsByClassName('tab-body');
  for (let i = 0; i < tabBodies.length; i++) {
    tabBodies[i].classList.remove('active');
  }
  const elem = document.getElementsByClassName('tab-' + tabId)[0];
  elem.classList.add('active');

  document.getElementById(tabId).classList.add('active');
}
