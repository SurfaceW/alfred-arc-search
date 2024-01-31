#!/usr/bin/env osascript -l JavaScript

function run(args) {
  ObjC.import("stdlib");
  let Arc = Application("Arc");
  let query =
    args[0] || '0,0,2,https://www.notion.so/arno93/Workbench-b6a5e9a4568f49bfb32f2f34c6f5704b';
  let [arg1, arg2, arg3] = query.split(",");
  let windowIndex = parseInt(arg1);
  let spaceIndex = arg2 == "undefined" ? undefined : parseInt(arg2);
  let tabIndex = parseInt(arg3);
  console.log("windowIndex: ", windowIndex);
  console.log("spaceIndex: ", spaceIndex);
  console.log("tabIndex:", tabIndex);
  if (spaceIndex == undefined) {
    Arc.windows[windowIndex].tabs[tabIndex].select();
    Arc.activate();
  }
  Arc.windows[windowIndex].spaces[spaceIndex].tabs[tabIndex].select();
  Arc.activate();
}


function runTabs(args) {
  let browser = 'Arc';
  console.log('browser: ', browser);
  if (!Application(browser).running()) {
    return JSON.stringify({
      items: [
        {
          title: `${browser} is not running`,
          subtitle: `Press enter to launch ${browser}`,
        },
      ],
    });
  }
  var excludeLocation = args[0] || '';

  let chrome = Application(browser);
  chrome.includeStandardAdditions = true;
  let tabsMap = {};
  let windowCount = chrome.windows.length;
  // console.log("windownCount: ", windowCount);
  if (excludeLocation == 'topApp') {
    ListTopApps(chrome, tabsMap, false);
  } else if (excludeLocation == '') {
    ListSpaceTabs(chrome, tabsMap, browser, windowCount, excludeLocation, true);
    ListTopApps(chrome, tabsMap, true);
  } else {
    ListSpaceTabs(chrome, tabsMap, browser, windowCount, excludeLocation, false);
  }

  let items = Object.keys(tabsMap).reduce((acc, url) => {
    acc.push(tabsMap[url]);
    return acc;
  }, []);

  return JSON.stringify({ items });
}

function ListTopApps(chrome, tabsMap, ifshowlocation) {
  let tabsTitle = chrome.windows[0].tabs.title();
  let tabsUrl = chrome.windows[0].tabs.url();
  let tabsLocation = chrome.windows[0].tabs.location();
  for (let t = 0; t < tabsTitle.length; t++) {
    let url = tabsUrl[t] || '';
    let matchUrl = url.replace(/(^\w+:|^)\/\//, '');
    let title = tabsTitle[t] || matchUrl;
    let location = tabsLocation[t] || '';
    if (location != 'topApp') {
      continue;
    }
    args = `${0},undefined,${t},${url}`;
    // console.log("args: ", args);
    if (ifshowlocation) {
      match = `${title} ${decodeURIComponent(matchUrl).replace(
        /[^\w]/g,
        ' '
      )} Favorites ${location}`;
      subtitle = `Favorites: ${url}`;
    } else {
      match = `${title} ${decodeURIComponent(matchUrl).replace(/[^\w]/g, ' ')}`;
      subtitle = `${url}`;
    }
    tabsMap[url] = {
      title,
      url,
      subtitle: subtitle,
      windowIndex: 0,
      tabIndex: t,
      quicklookurl: url,
      arg: args,
      match: match,
    };
  }
}

function ListSpaceTabs(chrome, tabsMap, browser, windowCount, excludeLocation, ifshowlocation) {
  let spaceCount = chrome.windows.spaces.length;
  // console.log("spaceCount: ", spaceCount);

  let tabsTitle =
    browser === 'Safari' ? chrome.windows.spaces.tabs.name() : chrome.windows.spaces.tabs.title();
  // console.log("tabsTitle: ", tabsTitle);
  let tabsUrl = chrome.windows.spaces.tabs.url();
  // console.log("tabsUrl: ", tabsUrl);
  let tabsLocation = chrome.windows.spaces.tabs.location();
  for (let w = 0; w < windowCount; w++) {
    for (let s = 0; s < spaceCount; s++) {
      let spacesTitle = chrome.windows.spaces.name()[w][s];
      if (tabsTitle[w][s]) {
        for (let t = 0; t < tabsTitle[w][s].length; t++) {
          let url = tabsUrl[w][s][t] || '';
          let matchUrl = url.replace(/(^\w+:|^)\/\//, '');
          let title = tabsTitle[w][s][t] || matchUrl;
          let location = tabsLocation[w][s][t] || '';
          // exclude tabs from the current location
          if (location == excludeLocation) {
            continue;
          }
          args = `${0},${s},${t},${url}`;
          // console.log("args: ", args);
          if (ifshowlocation) {
            match = `${title} ${decodeURIComponent(matchUrl).replace(
              /[^\w]/g,
              ' '
            )} ${spacesTitle} ${location}`;
            subtitle = `${spacesTitle}-${location}: ${url}`;
          } else {
            match = `${title} ${decodeURIComponent(matchUrl).replace(
              /[^\w]/g,
              ' '
            )} ${spacesTitle}`;
            subtitle = `${spacesTitle}: ${url}`;
          }
          tabsMap[url] = {
            title,
            url,
            subtitle: subtitle,
            windowIndex: w,
            spaceIndex: s,
            tabIndex: t,
            quicklookurl: url,
            arg: args,
            match: match,
          };
        }
      }
    }
  }
}
