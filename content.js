function decorateCards() {
  const cards = $('.js-card-name').toArray();
  cards.forEach(c => {
    if (c.innerHTML.indexOf('//') > -1) {
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
    } else if (c.innerHTML.length > 0) {
      if (c.parentElement && c.parentElement.parentElement) {
        const parent = c.parentElement.parentElement;
        if (parent.style.backgroundColor.length > 0) {
          $(parent).css('background-color', 'rgb(255, 255, 255)');
        }
      }
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

function parseColour(text) {
  const regex = new RegExp(
    /((rgb\((\d+,\s*){2}\d+\))|(rgba\((\d+,\s*){3}[\d.]+\))|(#\S{3,6}))\s*$/
  );

  const matches = regex.exec(text);

  if (matches === null || matches.length === 0) {
    return null;
  }

  return matches[0];
}

addStyles();
decorateCards();
decorateLists();

$('.js-list-content').bind('DOMSubtreeModified', decorateCards);
$('.js-list-name-assist').bind('DOMSubtreeModified', decorateLists);
