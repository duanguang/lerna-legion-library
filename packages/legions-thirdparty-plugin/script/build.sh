#!/usr/bin/env bash

echo 'copy to d.ts'
cp -R -f types/focus-outside/*.d.ts focus-outside/
rm -rf types/focus-outside
cp -r -f types/sdk.clipboard/*.d.ts sdk.clipboard/
rm -rf types/sdk.clipboard
cp -r -f types/sdk.dexie/*.d.ts sdk.dexie/
rm -rf types/sdk.dexie
cp -r -f types/sdk.excel/*.d.ts sdk.excel/
rm -rf types/sdk.excel
cp -r -f types/sdk.html2canvas/*.d.ts sdk.html2canvas/
rm -rf types/sdk.html2canvas
cp -r -f types/sdk.jsbarcode/*.d.ts sdk.jsbarcode/
rm -rf types/sdk.jsbarcode
cp -r -f types/sdk.xlsx/*.d.ts sdk.xlsx/
rm -rf types/sdk.xlsx