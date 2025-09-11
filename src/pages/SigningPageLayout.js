import React from 'react';
import { Document, Page } from 'react-pdf';
import SignatureCanvas from 'react-signature-canvas';
import { LuSignature, LuPaintbrush, LuCloudUpload, LuLoaderCircle } from 'react-icons/lu';
import { MdOutlineCleaningServices } from 'react-icons/md';

const SigningPageLayout = ({
                               title,
                               pdfUrl,
                               numPages,
                               pageNumber,
                               setPageNumber,
                               onDocumentLoadSuccess,
                               padRef,                 // ✅ changed from sigCanvas → padRef
                               submit,                 // ✅ handleCompleteSigning → submit
                               clearPad,               // ✅ onClearSignature → clearPad
                               busy,                   // ✅ isLoading → busy
                               message
                           }) => {
    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
            <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl p-6">
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8 flex items-center justify-center">
                    <LuSignature className="mr-4 text-indigo-600" />
                    {title}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* PDF Viewer Section */}
                    <div className="pdf-viewer bg-gray-50 p-4 rounded-lg shadow-inner">
                        <h3 className="text-xl font-bold text-gray-700 mb-4">Agreement Document</h3>
                        <div className="border border-gray-300 rounded-md overflow-hidden">
                            <Document
                                file={pdfUrl}
                                onLoadSuccess={onDocumentLoadSuccess}
                                className="pdf-document"
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                />
                            </Document>
                        </div>
                        {numPages && (
                            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                                <span>Page {pageNumber} of {numPages}</span>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                                        disabled={pageNumber <= 1}
                                        className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
                                        disabled={pageNumber >= numPages}
                                        className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Signature Pad Section */}
                    <div className="signature-pad-container bg-gray-50 p-4 rounded-lg shadow-inner">
                        <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                            <LuPaintbrush className="mr-2" />
                            Sign Here
                        </h3>
                        <div className="bg-white border-2 border-dashed border-gray-400 rounded-lg h-96 overflow-hidden">
                            <SignatureCanvas
                                ref={padRef}  // ✅ this matches useSigningLogic
                                penColor="black"
                                canvasProps={{ className: 'sigCanvas w-full h-full' }}
                            />
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                onClick={clearPad}
                                className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                            >
                                <MdOutlineCleaningServices className="mr-2" /> Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Action and Message Section */}
                <div className="mt-8 text-center">
                    <button
                        onClick={submit}
                        disabled={busy}
                        className="w-full sm:w-auto inline-flex items-center justify-center py-3 px-8 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 transition-all duration-300 transform hover:scale-105"
                    >
                        {busy ? (
                            <>
                                <LuLoaderCircle className="mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <LuCloudUpload className="mr-2" />
                                Complete Signing
                            </>
                        )}
                    </button>
                    {message && (
                        <p className={`mt-4 text-center text-sm font-medium ${message.startsWith('❌') ? 'text-red-600' : 'text-green-600'}`}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SigningPageLayout;
