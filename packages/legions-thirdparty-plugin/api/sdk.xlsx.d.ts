import  {exportCsv,read,exportArrayToExcel,exportJsonToExcel,export_table_to_excel,export_array_to_excel,export_json_to_excel} from '../types/sdk.xlsx'
export interface ISdkXlsx{
    export_table_to_excel: typeof export_table_to_excel
    export_array_to_excel: typeof export_array_to_excel
    export_json_to_excel: typeof export_json_to_excel
    exportJsonToExcel: typeof exportJsonToExcel
    exportArrayToExcel: typeof exportArrayToExcel
    read: typeof read
    exportCsv:typeof exportCsv
}