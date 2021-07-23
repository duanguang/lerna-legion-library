import  {copyText,Clipboard} from '../types/sdk.clipboard'
export interface ISdkClipboard{
    copyText: typeof copyText
    Clipboard:  Clipboard
}