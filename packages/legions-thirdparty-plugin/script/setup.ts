/**
 *
 * @format
 */

 import { JSDOM } from 'jsdom';
 const dom = new JSDOM(`<!doctype html><html><body><div id="root"></div></body></html>`, {
   url: 'http://localhost:8080/main.html',
   beforeParse(window) { },
   runScripts: "dangerously", resources: "usable"
 });
 // @ts-ignore
 global['document'] = dom.window.document;
 // @ts-ignore
global['window'] = dom.window;
  // @ts-ignore
global['navigator'] = dom.window.navigator;
 // refs only work with mount, yes.
 
 