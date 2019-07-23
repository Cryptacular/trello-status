(function() {
  const regex = {
    divider: new RegExp(/^-{3}.+-{3}$/),
    colour: new RegExp(
      /((rgb\((\d+,\s*){2}\d+\))|(rgba\((\d+,\s*){3}[\d.]+\))|(#\S{3,6}))\s*$/
    ),
    tag: new RegExp(/\[.+\]/)
  };

  let isDarkModeEnabled = false;
  chrome.storage.local.get("isDarkModeEnabled", function(result) {
    isDarkModeEnabled = (result && result.isDarkModeEnabled) || false;
    toggleDarkMode(isDarkModeEnabled);
  });

  function decorateCards() {
    const cards = $(".js-card-name").toArray();
    cards.forEach(c => {
      if (c.innerHTML.indexOf("//") > -1) {
        decorateCard(c);
      } else if (regex.divider.exec(c.innerText)) {
        decorateDivider(c);
      } else if (
        c.innerHTML.length > 0 &&
        c.innerHTML.indexOf("fp-divider") === -1
      ) {
        resetCardStyles(c);
      }

      decorateTags(c);
    });
  }

  function addStyles() {
    $("head").append(`
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
        box-shadow: 0 4px #bdc1cb;
        padding: 5px 10px;
      }

      .fp-status-slash {
        background: #dfe1e6;
        color: #000;
        border-radius: 5px 0 0 5px;
      }

      .fp-status-content {
        background: #eeeff2;
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

      .fp-tag {
        background: #eeeff2;
        border-radius: 4px;
        padding: 0px 8px 1px;
        box-shadow: 0 3px #bdc1cb;
      }

      /* Dark Mode */
      .list, 
        .list-card,
        .fp-status-slash,
        .fp-status-content {
            transition: background-color 0.3s ease-out,
                        box-shadow 0.3s ease-out;
        }

        .fp-darkMode .list {
            background: #333;
        }

        .fp-darkMode .list-card {
            background: #444;
        }

        .fp-darkMode .list-card:hover {
            background: #444;
        }

        .fp-darkMode .list-card-details,
        .fp-darkMode .list-card-details:focus,
        .fp-darkMode .list-card-details:hover {
            color: #adacac;
        }


        .fp-darkMode .list-card-edit-title,
        .fp-darkMode .list-card-edit-title:focus,
        .fp-darkMode .list-card-edit-title:hover {
            background: #333;
            color: #adacac;
        }

        .fp-darkMode .list-card-title,
        .fp-darkMode .list-header-name,
        .fp-darkMode .badge,
        .fp-darkMode .badge-icon,
        .fp-darkMode .open-card-composer,
        .fp-darkMode .open-card-composer .icon-add,
        .fp-darkMode .open-card-composer:hover .icon-add {
            color: #adacac;
        }

        .fp-darkMode .badge, 
        .fp-darkMode .badge-icon {
            color: #717171;
        }

        .fp-darkMode .fp-divider {
            color: #adacac
        }

        .fp-darkMode .fp-divider-dashed {
            border-color: #717171
        }

        .fp-darkMode .fp-dividerParent, 
        .fp-darkMode .fp-dividerParent .list-card-details {
            background: transparent
        }

        .fp-darkMode .fp-status-slash,
        .fp-darkMode .fp-status-content {
            box-shadow: 0 4px #333;
        }

        .fp-darkMode .fp-status-slash {
            background: #555;
            color: #111;
        }

        .fp-darkMode .fp-status-content {
            background: #888;
            color: #333;
        }

        .fp-darkMode .open-card-composer:hover {
            background-color: #444;
            color: #adacac;
        }

        .fp-darkMode .list-card-operation {
          background: #333;
          color: #adacac;
        }
        
        .fp-darkMode .list-card-operation:hover {
            background: #111;
            color: #adacac;
        }
        
        .fp-darkMode .icon-sm.dark-hover:hover {
            color: #adacac;
        }

        .fp-darkMode .window {
            background-color: #444;
        }
        
        .fp-darkMode .window, 
        .fp-darkMode .window *, 
        .fp-darkMode .window .icon-sm {
            color: #adacac;
        }
        
        .fp-darkMode .window .button,
        .fp-darkMode .window .button-link {
            background: #333;
        }
        
        .fp-darkMode .checklist-item-checkbox {
            background: #333;
            border-color: #111;
            box-shadow: none;
        }
        
        .fp-darkMode .checklist-item-checkbox:hover,
        .fp-darkMode .checklist-item-state-complete .checklist-item-checkbox.enabled:hover .checklist-item-checkbox-check {
            background: #111;
            color: #adacac;
        }
        
        .fp-darkMode .window .button:hover,
        .fp-darkMode .window .button-link:hover {
            background: #111;
        }
        
        .fp-darkMode .window-module-title h3,
        .fp-darkMode .mod-card-back-title,
        .fp-darkMode .label-text {
            color: #fff;
        }
        
        .fp-darkMode .action-comment,
        .fp-darkMode .attachment-thumbnail-preview {
            background-color: #333;
        }

        .fp-darkMode .attachment-thumbnail:hover .attachment-thumbnail-details {
            background: #555;
        }

        .fp-darkMode .fp-tag {
            background: #888;
            box-shadow: 0 3px #333;
            color: #333;
        }
    </style>
    `);
  }

  function toggleDarkMode(on) {
    if (on) {
      $("body").addClass("fp-darkMode");
    } else {
      $("body").removeClass("fp-darkMode");
    }
  }

  function addDarkModeButton() {
    $(".board-menu-navigation")
      .first()
      .find(".board-menu-navigation-item")
      .last().before(`
        <li class="board-menu-navigation-item">
          <a class="board-menu-navigation-item-link" href="#" id="fp-darkModeBtn">
            <span class="board-menu-navigation-item-link-icon icon-lg icon-lightbulb-lit"></span>
            &nbsp;
            Dark Mode
          </a>
        </li>
  `);

    $("#fp-darkModeBtn").click(function() {
      isDarkModeEnabled = !isDarkModeEnabled;
      toggleDarkMode(isDarkModeEnabled);
      chrome.storage.local.set({ isDarkModeEnabled: isDarkModeEnabled });
    });
  }

  function showPluginButtons() {
    $(".board-header-plugin-btns.hide").removeClass("hide");
  }

  function decorateLists() {
    const lists = $(".js-list-content").toArray();
    lists.forEach(list => {
      const $list = $(list);
      const $title = $list.find(".js-list-name-assist");
      const titleText = $title.text();

      const colour = parseColour(titleText);
      $list.css("background-color", colour || "");
    });
  }

  function decorateCard(c) {
    const text = c.innerText;

    if (c.innerHTML.indexOf("fp-status") > -1) {
      return;
    }
    var parts = c.innerHTML.split("//");
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
        parts[i] += "</span>";
      }
    }

    c.innerHTML = `<span class="fp-statusContainer">${parts.join(" ")}</span>`;

    const colour = parseColour(text);
    if (c.parentElement && c.parentElement.parentElement) {
      const parent = c.parentElement.parentElement;
      if (colour !== null) {
        $(parent).css("background-color", colour);
        const statusContainers = $(c)
          .find(".fp-status")
          .toArray();

        statusContainers.forEach(sc => {
          if (sc.innerText.indexOf(colour) > -1) {
            $(sc).css("display", "none");
          }
        });
      } else {
        $(parent).css("background-color", "");
      }
    }
  }

  function decorateTags(card) {
    let contents = card.innerHTML;

    if (contents.indexOf("fp-tag") > -1 || contents.indexOf("[") === -1) {
      return;
    }

    const tags = regex.tag.exec(contents);
    tags.forEach(t => {
      contents = contents.replace(
        t,
        `<span class="fp-tag">${t.substr(1, t.length - 2)}</span>`
      );
    });

    card.innerHTML = contents;
  }

  function decorateDivider(element) {
    if (element.innerHTML.indexOf("fp-divider") > -1) {
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
      $(parent).addClass("fp-dividerParent");
    }
  }

  function resetCardStyles(c) {
    if (c.parentElement && c.parentElement.parentElement) {
      const parent = c.parentElement.parentElement;
      if (parent.style.backgroundColor.length > 0) {
        $(parent).css("background-color", "rgb(255, 255, 255)");
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
    const cards = $(".js-list-content");
    if (cards && cards.length > 0) {
      decorateCards();
      cards.bind("DOMSubtreeModified", decorateCards);
      clearInterval(tryInitialiseCards);
    }
  }, 100);

  const tryInitialiseLists = setInterval(() => {
    const lists = $(".js-list-header");
    if (lists && lists.length > 0) {
      decorateLists();
      lists.bind("DOMSubtreeModified", decorateLists);
      clearInterval(tryInitialiseLists);
    }
  }, 100);

  const tryInitialiseDarkModeButton = setInterval(() => {
    const buttonsContainer = $(".board-menu-navigation");
    if (buttonsContainer && buttonsContainer.length > 0) {
      addDarkModeButton();
      clearInterval(tryInitialiseDarkModeButton);
    }
  }, 100);
})();
