'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const path_1 = require('path');
const typescript_1 = require('typescript');
const defaultOptions = {
  libraryName: '../schedule',
  mapLibraryName: 'legions-lunar/schedule',
};
const createTransformer = (_options = [defaultOptions]) => {
  const mergeDefault = options => Object.assign({}, defaultOptions, options);
  const bindingsMap = _options.reduce((acc, options) => {
    const result = mergeDefault(options);
    acc[result.libraryName] = result.mapLibraryName;
    return acc;
  }, {});

  const isTargetLib = lib => Object.keys(bindingsMap).indexOf(lib) !== -1;

  const transformer = context => {
    const bindings = [];
    let fileName;
    const newArguments = [];
    const visitor = node => {
      /*  if (typescript_1.isSourceFile(node)) {
        if (path_1.isAbsolute(node.fileName)) {
          fileName = node.fileName.replace(
            path_1.join(process.cwd(), '../'),
            ''
          );
        } else {
          fileName = node.fileName;
        }
        return typescript_1.visitEachChild(node, visitor, context);
      } */

      if (
        typescript_1.isImportDeclaration(node) &&
        isTargetLib(node.moduleSpecifier.text)
      ) {
        console.log(bindingsMap, node.moduleSpecifier.text, 'fileName1111');
        node.moduleSpecifier = typescript_1.createStringLiteral(
          bindingsMap[node.moduleSpecifier.text]
        );
        return node;
      }
      return typescript_1.visitEachChild(node, visitor, context);
    };
    return node => typescript_1.visitNode(node, visitor);
  };
  return transformer;
};
exports.default = createTransformer;
