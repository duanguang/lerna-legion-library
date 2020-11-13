/**
 * @author Kuitos
 * @since 2019-10-21
 */
import { execScripts } from 'legions-import-html-entry';
import isFunction from 'lodash/isFunction';
import { checkActivityFunctions } from 'single-spa';
import { Freer } from '../interfaces';
import { getWrapperId } from '../utils';

const styledComponentSymbol = Symbol('styled-component');

declare global {
  interface HTMLStyleElement {
    // eslint-disable-next-line no-undef
    [styledComponentSymbol]?: CSSRuleList;
  }
}

const rawHeadAppendChild = HTMLHeadElement.prototype.appendChild;
const rawHeadRemoveChild = HTMLHeadElement.prototype.removeChild;
const rawAppendChild = HTMLElement.prototype.appendChild;
const rawRemoveChild = HTMLElement.prototype.removeChild;

const SCRIPT_TAG_NAME = 'SCRIPT';
const LINK_TAG_NAME = 'LINK';
const STYLE_TAG_NAME = 'STYLE';

/**
 * Check if a style element is a styled-component liked.
 * A styled-components liked element is which not have textContext but keep the rules in its styleSheet.cssRules.
 * Such as the style element generated by styled-components and emotion.
 * @param element
 */
function isStyledComponentsLike(element: HTMLStyleElement) {
  return (
    !element.textContent &&
    ((element.sheet as CSSStyleSheet)?.cssRules.length ||
      getCachedRules(element)?.length)
  );
}

function getCachedRules(element: HTMLStyleElement) {
  return element[styledComponentSymbol];
}

function setCachedRules(element: HTMLStyleElement, cssRules: CSSRuleList) {
  Object.defineProperty(element, styledComponentSymbol, {
    value: cssRules,
    configurable: true,
    enumerable: false,
  });
}

function assertElementExist(appName: string, element: Element | null) {
  if (!element)
    throw new Error(
      `[legions] ${appName} wrapper with id ${getWrapperId(appName)} not ready!`
    );
}

function getWrapperElement(appName: string) {
  return document.getElementById(getWrapperId(appName));
}

/**
 * Just hijack dynamic head append, that could avoid accidentally hijacking the insertion of elements except in head.
 * Such a case: ReactDOM.createPortal(<style>.test{color:blue}</style>, container),
 * this could made we append the style element into app wrapper but it will cause an error while the react portal unmounting, as ReactDOM could not find the style in body children list.
 * @param appName
 * @param proxy
 * @param mounting
 */
export default function hijack(
  appName: string,
  proxy: Window,
  mounting = true
): Freer {
  let dynamicStyleSheetElements: Array<HTMLLinkElement | HTMLStyleElement> = [];

  HTMLHeadElement.prototype.appendChild = function appendChild<T extends Node>(
    this: HTMLHeadElement,
    newChild: T
  ) {
    const element = newChild as any;
    if (element.tagName) {
      switch (element.tagName) {
        case LINK_TAG_NAME:
        case STYLE_TAG_NAME: {
          const stylesheetElement:
            | HTMLLinkElement
            | HTMLStyleElement = newChild as any;

          // check if the currently specified application is active
          // While we switch page from qiankun app to a normal react routing page, the normal one may load stylesheet dynamically while page rendering,
          // but the url change listener must to wait until the current call stack is flushed.
          // This scenario may cause we record the stylesheet from react routing page dynamic injection,
          // and remove them after the url change triggered and qiankun app is unmouting
          // see https://github.com/ReactTraining/history/blob/master/modules/createHashHistory.js#L222-L230
          const activated = checkActivityFunctions(window.location).some(
            name => name === appName
          );
          // only hijack dynamic style injection when app activated
          if (activated) {
            dynamicStyleSheetElements.push(stylesheetElement);

            const appWrapper = getWrapperElement(appName);
            assertElementExist(appName, appWrapper);
            return rawAppendChild.call(appWrapper, stylesheetElement) as T;
          }

          return rawHeadAppendChild.call(this, element) as T;
        }

        case SCRIPT_TAG_NAME: {
          const { src, text } = element as HTMLScriptElement;

          if (src) {
            execScripts(null, [src], proxy).then(
              () => {
                // we need to invoke the onload event manually to notify the event listener that the script was completed
                // here are the two typical ways of dynamic script loading
                // 1. element.onload callback way, which webpack and loadjs used, see https://github.com/muicss/loadjs/blob/master/src/loadjs.js#L138
                // 2. addEventListener way, which toast-loader used, see https://github.com/pyrsmk/toast/blob/master/src/Toast.ts#L64
                const loadEvent = new CustomEvent('load'); // 自定义事件名称
                if (isFunction(element.onload)) {
                  element.onload(loadEvent);
                } else {
                  element.dispatchEvent(loadEvent);
                }
              },
              () => {
                const errorEvent = new CustomEvent('error');
                if (isFunction(element.onerror)) {
                  element.onerror(errorEvent);
                } else {
                  element.dispatchEvent(errorEvent);
                }
              }
            );

            const dynamicScriptCommentElement = document.createComment(
              `dynamic script ${src} replaced by qiankun`
            );
            const appWrapper = getWrapperElement(appName);
            assertElementExist(appName, appWrapper);
            return rawAppendChild.call(
              appWrapper,
              dynamicScriptCommentElement
            ) as T;
          }

          execScripts(null, [`<script>${text}</script>`], proxy).then(
            element.onload,
            element.onerror
          );
          const dynamicInlineScriptCommentElement = document.createComment(
            'dynamic inline script replaced by qiankun'
          );
          const appWrapper = getWrapperElement(appName);
          assertElementExist(appName, appWrapper);
          return rawAppendChild.call(
            appWrapper,
            dynamicInlineScriptCommentElement
          ) as T;
        }

        default:
          break;
      }
    }

    return rawHeadAppendChild.call(this, element) as T;
  };

  HTMLHeadElement.prototype.removeChild = function removeChild<T extends Node>(
    this: HTMLHeadElement,
    child: T
  ) {
    const appWrapper = getWrapperElement(appName);
    if (appWrapper?.contains(child)) {
      return rawRemoveChild.call(appWrapper, child) as T;
    }

    return rawHeadRemoveChild.call(this, child) as T;
  };

  return function free() {
    HTMLHeadElement.prototype.appendChild = rawHeadAppendChild;
    HTMLHeadElement.prototype.removeChild = rawHeadRemoveChild;

    dynamicStyleSheetElements.forEach(stylesheetElement => {
      /*
         With a styled-components generated style element, we need to record its cssRules for restore next re-mounting time.
         We're doing this because the sheet of style element is going to be cleaned automatically by browser after the style element dom removed from document.
         see https://www.w3.org/TR/cssom-1/#associated-css-style-sheet
         */
      if (
        stylesheetElement instanceof HTMLStyleElement &&
        isStyledComponentsLike(stylesheetElement)
      ) {
        if (stylesheetElement.sheet) {
          // record the original css rules of the style element for restore
          setCachedRules(
            stylesheetElement,
            (stylesheetElement.sheet as CSSStyleSheet).cssRules
          );
        }
      }

      // As now the sub app content all wrapped with a special id container,
      // the dynamic style sheet would be removed automatically while unmoutting
    });

    return function rebuild() {
      dynamicStyleSheetElements.forEach(stylesheetElement => {
        // re-append the dynamic stylesheet to sub-app container
        const appWrapper = getWrapperElement(appName);
        assertElementExist(appName, appWrapper);
        // Using document.head.appendChild ensures that appendChild calls
        // can also directly use the HTMLHeadElement.prototype.appendChild method which is overwritten at mounting phase
        document.head.appendChild.call(appWrapper!, stylesheetElement);

        /*
        get the stored css rules from styled-components generated element, and the re-insert rules for them.
        note that we must do this after style element had been added to document, which stylesheet would be associated to the document automatically.
        check the spec https://www.w3.org/TR/cssom-1/#associated-css-style-sheet
         */
        if (
          stylesheetElement instanceof HTMLStyleElement &&
          isStyledComponentsLike(stylesheetElement)
        ) {
          const cssRules = getCachedRules(stylesheetElement);
          if (cssRules) {
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < cssRules.length; i++) {
              const cssRule = cssRules[i];
              (stylesheetElement.sheet as CSSStyleSheet).insertRule(
                cssRule.cssText
              );
            }
          }
        }
      });

      // As the hijacker will be invoked every mounting phase, we could release the cache for gc after rebuilding
      if (mounting) {
        dynamicStyleSheetElements = [];
      }
    };
  };
}
