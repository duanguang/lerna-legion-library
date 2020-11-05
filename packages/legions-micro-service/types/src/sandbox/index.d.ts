export interface SandboxProps {
    multiMode?: boolean;
}
export interface SandboxContructor {
    new (): Sandbox;
}
export default class Sandbox {
    private sandbox;
    private multiMode;
    private eventListeners;
    private timeoutIds;
    private intervalIds;
    private propertyAdded;
    private originalValues;
    sandboxDisabled: boolean;
    constructor(props?: SandboxProps);
    createProxySandbox(): void;
    getSandbox(): Window;
    execScriptInSandbox(script: string): void;
    clear(): void;
}
