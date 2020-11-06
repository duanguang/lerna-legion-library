interface IImportResult {
  template: string;

  assetPublicPath: string;

  execScripts<T>(sandbox?: object): Promise<T>;

  getExternalScripts(): Promise<{ scripts: string; scriptsText: string }[]>;

  getExternalStyleSheets(): Promise<string[]>;
  getScripts: () => {
    scripts: IScripts;
    excludeFiles: IScripts;
  };
}
interface IScripts {
  [key: string]: string;
}
export type ImportEntryOpts = {
  /* fetch?: typeof window.fetch; */
  /* getPublicPath?: (rawPublicPath: string) => string;
  getTemplate?: (tpl: string) => string; */
  /** 需要排除或忽略在沙箱执行的JS文件 */
  excludeFiles?: string[];
  /** 是否合并所有JS资源后再在沙箱中执行,默认true
   *  当执行的JS文件是多个时，请合并后在执行
   * 如果是单个文件，则直接执行
   */
  isMerge?: boolean;
};
export type ExecScriptsOpts = {
  fetch?: Function;
};
export type Entry =
  | string
  | { styles?: string[]; scripts?: string[]; html?: string };

export function execScripts<T>(
  entry: string | null,
  scripts: string[],
  proxy: Window,
  opts?: ExecScriptsOpts
): Promise<T>;

export default function importHTML(
  url: string,
  opts?: ImportEntryOpts
): Promise<IImportResult>;
/** 暂不使用 */
export function importEntry(
  entry: Entry,
  opts?: ImportEntryOpts
): Promise<IImportResult>;
