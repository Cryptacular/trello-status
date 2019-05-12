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
            margin-top: 4px;
		}

		.fp-status-slash,
		.fp-status-content {
			padding: 2px 8px;
		}

		.fp-status-slash {
			background: #000;
			color: #fff;
    }

		.fp-status-content {
			background: #333;
			color: #eee;
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
    colour && $list.css('background-color', colour);
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
  }

  c.innerHTML = parts.join(' ');

  const colour = parseColour(text);
  if (c.parentElement && c.parentElement.parentElement) {
    const parent = c.parentElement.parentElement;
    if (colour !== null) {
      $(parent).css('background-color', colour);
      $(c)
        .find('.fp-status')
        .css('visibility', 'hidden')
        .css('position', 'absolute');
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
    $(parent).css('background-color', 'rgba(0, 0, 0, 0.1)');
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
  const lists = $('.js-list-name-assist');
  if (lists && lists.length > 0) {
    decorateLists();
    lists.bind('DOMSubtreeModified', decorateLists);
    clearInterval(tryInitialiseLists);
  }
}, 100);
