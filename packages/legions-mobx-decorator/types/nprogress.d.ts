export default NProgress;
declare namespace NProgress {
  const version: string;
  namespace settings {
    const minimum: number;
    const easing: string;
    const positionUsing: string;
    const speed: number;
    const trickle: boolean;
    const trickleSpeed: number;
    const showSpinner: boolean;
    const barSelector: string;
    const spinnerSelector: string;
    const parent: string;
    const template: string;
  }
  function configure(options: any): typeof NProgress;
  const status: any;
  function set(n: any): typeof NProgress;
  function isStarted(): boolean;
  function start(): typeof NProgress;
  function done(force: any): typeof NProgress;
  function inc(amount: any): typeof NProgress | undefined;
  function trickle(): typeof NProgress | undefined;
  function render(fromStart: any): HTMLElement | null;
  function remove(): void;
  function isRendered(): boolean;
  function getPositioningCSS(): 'translate3d' | 'translate' | 'margin';
}
