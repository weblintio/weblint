# Weblint Version History

## v.NEXT

## v0.2.0

- inject css as style element
- browser action toggles (add/remove) injected style element

## v0.1.2

- only run css injection once, when `chrome.tabs.onUpdated` `changeInfo.status == 'loading'`

## v0.1.1

- trim `www.` from hostnames to simplify rules repos

## v0.1.0

- initial MVP
- inject css from [core-rules repo](core-rules-repo-link)

[core-rules-repo-link]: https://github.com/weblintio/core-rules
