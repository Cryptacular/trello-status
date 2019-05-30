const regex = {
  divider: new RegExp(/^-{3}.+-{3}$/),
  colour: new RegExp(
    /((rgb\((\d+,\s*){2}\d+\))|(rgba\((\d+,\s*){3}[\d.]+\))|(#\S{3,6}))\s*$/
  )
};

function decorateCards() {
  const cards = $('.js-card-name').toArray();
  cards.forEach(c => {
    if (c.innerHTML.indexOf('//') > -1) {
      decorateCard(c);
    } else if (regex.divider.exec(c.innerText)) {
      decorateDivider(c);
    } else if (
      c.innerHTML.length > 0 &&
      c.innerHTML.indexOf('fp-divider') === -1
    ) {
      resetCardStyles(c);
    }
  });
}

function addStyles() {
  $('head').append(`
	<style type="text/css">
		.fp-status {
			display: flex;
      margin-top: 10px;
    }
    
    .fp-statusContainer {
      display: block;
      margin-bottom: 8px;
    }

		.fp-status-slash,
		.fp-status-content {
      box-shadow: 0 4px #ccc;
			padding: 5px 10px;
		}

		.fp-status-slash {
      background: #ddd;
      color: #000;
      border-radius: 5px 0 0 5px;
    }

		.fp-status-content {
      background: #ececec;
      border-radius: 0 5px 5px 0;
      color: #333;
    }

    .fp-divider {
      color: rgba(0, 0, 0, 0.7);
      display: flex;
      font-style: italic;
    }

    .fp-divider-dashed {
      flex: 1;
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      top: -9px;
      position: relative;
    }

    .fp-divider-dashed--left {
      margin-right: 10px;
    }

    .fp-divider-dashed--right {
      margin-left: 10px;
    }

    .fp-dividerParent {
      background-color: transparent;
      box-shadow: none;
    }
	</style>
`);
}

function decorateLists() {
  const lists = $('.js-list-content').toArray();
  lists.forEach(list => {
    const $list = $(list);
    const $title = $list.find('.js-list-name-assist');
    const titleText = $title.text();

    const colour = parseColour(titleText);
    $list.css('background-color', colour || '');
  });
}

function decorateCard(c) {
  const text = c.innerText;

  if (c.innerHTML.indexOf('fp-status') > -1) {
    return;
  }
  var parts = c.innerHTML.split('//');
  for (let i = 1; i < parts.length; i++) {
    parts[i] = `<span class="fp-status">
                    <span class="fp-status-slash">//</span>
                    <span class="fp-status-content">
                        ${parts[i].trim()}
                    </span>
                  </span> `;

    if (i === 1) {
      parts[i] = `<span class="fp-statusContainer">${parts[i]}`;
    }
    if (i === parts.length - 1) {
      parts[i] += '</span>';
    }
  }

  c.innerHTML = `<span class="fp-statusContainer">${parts.join(' ')}</span>`;

  const colour = parseColour(text);
  if (c.parentElement && c.parentElement.parentElement) {
    const parent = c.parentElement.parentElement;
    if (colour !== null) {
      $(parent).css('background-color', colour);
      const statusContainers = $(c)
        .find('.fp-status')
        .toArray();

      statusContainers.forEach(sc => {
        if (sc.innerText.indexOf(colour) > -1) {
          $(sc).css('display', 'none');
        }
      });
    } else {
      $(parent).css('background-color', '');
    }
  }
}

function decorateDivider(element) {
  if (element.innerHTML.indexOf('fp-divider') > -1) {
    return;
  }

  const text = regex.divider.exec(element.innerText)[0];
  element.innerHTML = `<span class="fp-divider">
    <span class="fp-divider-dashed fp-divider-dashed--left"></span>
      ${text.substring(3, text.length - 3)}
    <span class="fp-divider-dashed fp-divider-dashed--right"></span>
  </span>`;

  if (element.parentElement && element.parentElement.parentElement) {
    const parent = element.parentElement.parentElement;
    $(parent).addClass('fp-dividerParent');
  }
}

function resetCardStyles(c) {
  if (c.parentElement && c.parentElement.parentElement) {
    const parent = c.parentElement.parentElement;
    if (parent.style.backgroundColor.length > 0) {
      $(parent).css('background-color', 'rgb(255, 255, 255)');
    }
  }
}

function parseColour(text) {
  const matches = regex.colour.exec(text);

  if (matches === null || matches.length === 0) {
    return null;
  }

  return matches[0];
}

addStyles();

const tryInitialiseCards = setInterval(() => {
  const cards = $('.js-list-content');
  if (cards && cards.length > 0) {
    decorateCards();
    cards.bind('DOMSubtreeModified', decorateCards);
    clearInterval(tryInitialiseCards);
  }
}, 100);

const tryInitialiseLists = setInterval(() => {
  const lists = $('.js-list-header');
  if (lists && lists.length > 0) {
    decorateLists();
    lists.bind('DOMSubtreeModified', decorateLists);
    clearInterval(tryInitialiseLists);
  }
}, 100);
