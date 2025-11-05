import React, { useState } from 'react';

interface GoogleSheetSetupProps {
    currentUrl: string;
    onSave: (url: string) => void;
    onClose: () => void;
}

const GoogleSheetSetup: React.FC<GoogleSheetSetupProps> = ({ currentUrl, onSave, onClose }) => {
    const [url, setUrl] = useState(currentUrl);

    const handleSave = () => {
        onSave(url);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-brand-dark mb-4">Google Sheet Setup</h2>
                    <p className="text-gray-600 mb-6">
                        This application requires a one-time setup to connect to your Google Sheet. Please follow the steps below carefully.
                    </p>

                    <div className="mb-6">
                        <label htmlFor="scriptUrl" className="block text-sm font-bold text-gray-700 mb-2">
                           1. Enter your Google Apps Script Web App URL
                        </label>
                        <input
                            type="url"
                            id="scriptUrl"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://script.google.com/macros/s/..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
                        />
                    </div>

                    <div className="space-y-4 text-sm text-gray-800">
                        <h3 className="text-lg font-semibold">Setup Instructions</h3>
                        <details className="bg-gray-50 p-3 rounded-lg">
                            <summary className="font-semibold cursor-pointer">Step A: Create Google Sheet</summary>
                            <div className="mt-2 pl-4 border-l-2">
                                <p>1. Create a new sheet at <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">sheets.new</a>.</p>
                                <p>2. In the first row, create the following headers exactly (A1 to Q1):</p>
                                <code className="block bg-gray-200 p-2 rounded-md text-xs mt-1 overflow-x-auto">
                                    id customerName phoneNumber email productName serialNumber purchaseDate installDate productWarrantyPeriod productWarrantyUnit installationWarrantyPeriod installationWarrantyUnit state district postcode buildingType otherBuildingType
                                </code>
                            </div>
                        </details>
                         <details className="bg-gray-50 p-3 rounded-lg">
                            <summary className="font-semibold cursor-pointer">Step B: Create & Deploy Apps Script</summary>
                             <div className="mt-2 pl-4 border-l-2 space-y-2">
                                <p>1. In your sheet, go to <strong>Extensions &gt; Apps Script</strong>.</p>
                                <p>2. Delete any existing code and paste the entire script below:</p>
                                <textarea readOnly className="w-full h-32 text-xs bg-gray-200 p-2 rounded-md font-mono mt-1"
                                    defaultValue={`const SHEET_NAME = "Sheet1";

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const json = data.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  return ContentService.createTextOutput(JSON.stringify(json)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHE-ET_NAME);
  const body = JSON.parse(e.postData.contents);
  try {
    switch(body.action) {
      case 'add': return addRecord(sheet, body.payload);
      case 'update': return updateRecord(sheet, body.payload);
      case 'delete': return deleteRecord(sheet, body.payload);
      default: return createResponse({ status: "error", message: "Invalid action" });
    }
  } catch (err) {
    return createResponse({ status: "error", message: err.message });
  }
}

function addRecord(sheet, payload) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newRow = headers.map(header => payload[header] || "");
  sheet.appendRow(newRow);
  return createResponse({ status: "success", data: payload });
}

function updateRecord(sheet, payload) {
  const idToUpdate = payload.id;
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idColumnIndex = headers.indexOf('id');
  const rowIndexToUpdate = data.findIndex(row => row[idColumnIndex] == idToUpdate);
  if (rowIndexToUpdate > 0) {
    const newRow = headers.map(header => payload[header] || "");
    sheet.getRange(rowIndexToUpdate + 1, 1, 1, newRow.length).setValues([newRow]);
    return createResponse({ status: "success", data: payload });
  }
  return createResponse({ status: "error", message: "Record not found" });
}

function deleteRecord(sheet, payload) {
   const idToDelete = payload.id;
   const data = sheet.getDataRange().getValues();
   const headers = data[0];
   const idColumnIndex = headers.indexOf('id');
   const rowIndexToDelete = data.findIndex(row => row[idColumnIndex] == idToDelete);
   if (rowIndexToDelete > 0) {
     sheet.deleteRow(rowIndexToDelete + 1);
     return createResponse({ status: "success", message: "Record deleted" });
   }
   return createResponse({ status: "error", message: "Record not found" });
}

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}`} />
                                <p>3. Click <strong>Deploy &gt; New deployment</strong>.</p>
                                <p>4. For "Who has access", select <strong>"Anyone"</strong>.</p>
                                <p>5. Click <strong>Deploy</strong>, authorize the permissions, and <strong>copy the Web app URL</strong>.</p>
                                <p>6. Paste that URL into the input box at the top.</p>
                            </div>
                        </details>
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">Cancel</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-blue-600 transition">Save & Connect</button>
                </div>
            </div>
        </div>
    );
};

export default GoogleSheetSetup;