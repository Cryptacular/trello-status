function decorateCards() {
  const cards = $('.js-card-name').toArray();
  cards
    .filter(c => c.innerText.indexOf('//') > -1)
    .forEach(c => {
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
  const regex = new RegExp(
    /((rgb\((\d+,\s*){2}\d+\))|(rgba\((\d+,\s*){3}\d+\))|(#\S{3,6}))$/
  );

  const lists = $('.js-list-content').toArray();
  lists.forEach(list => {
    const $list = $(list);
    const $title = $list.find('.js-list-name-assist');
    const titleText = $title.text();
    const matches = regex.exec(titleText);

    if (matches !== null && matches.length > 0) {
      $list.css('background-color', matches[0]);
      const startOfColour = titleText.indexOf(matches[0]);
      $title.text(titleText.substring(0, startOfColour));
    }
  });
}

addStyles();
decorateCards();
decorateLists();

$('.js-list-content').bind('DOMSubtreeModified', decorateCards);
$('.js-list-name-assist').bind('DOMSubtreeModified', decorateLists);
