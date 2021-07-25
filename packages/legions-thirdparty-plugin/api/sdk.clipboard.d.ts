import  {copyText,Clipboard} from '../sdk.clipboard'
export interface ISdkClipboard{
    copyText: typeof copyText
    Clipboard:  Clipboard
}