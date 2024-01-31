#!/usr/bin/env osascript -l JavaScript

function run(args) {
  ObjC.import('stdlib');
  let Arc = Application('Arc');
  let query =
    args[0] || '0,0,1,https://www.notion.so/arno93/INBOX-inbox-eb3a9094a14145809d048f928f8d3918';
  let [arg1, arg2, arg3] = query.split(',');
  let windowIndex = parseInt(arg1);
  let spaceIndex = arg2 == 'undefined' ? undefined : parseInt(arg2);
  let tabIndex = parseInt(arg3);
  console.log('windowIndex: ', windowIndex);
  console.log('spaceIndex: ', spaceIndex);
  console.log('tabIndex:', tabIndex);
  if (spaceIndex == undefined) {
    Arc.windows[windowIndex].tabs[tabIndex].select();
    Arc.activate();
  }
  Arc.windows[windowIndex].spaces[spaceIndex].tabs[tabIndex].select();
  Arc.activate();
}
