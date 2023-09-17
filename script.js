// var pdfjsLib = window['pdfjs-dist/build/pdf'];

// pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.worker.min.js';

// document.getElementById('convertButton').addEventListener('click', function() {
//     var file = document.getElementById('fileInput').files[0];
//     if (file) {
//         convertPdfToImages(file);
//     }
// });

// function convertPdfToImages(file) {
//     var fileReader = new FileReader();
//     fileReader.onload = function() {
//         var typedArray = new Uint8Array(this.result);
//         pdfjsLib.getDocument({data: typedArray}).promise.then(function(pdf) {
//             var zip = new JSZip();
//             for (var i = 1; i <= pdf.numPages; i++) {
//                 pdf.getPage(i).then(function(page) {
//                     var scale = 1;
//                     var viewport = page.getViewport({ scale: scale, });
//                     var canvas = document.createElement('canvas');
//                     var context = canvas.getContext('2d');
//                     canvas.height = viewport.height;
//                     canvas.width = viewport.width;
//                     var renderContext = {
//                         canvasContext: context,
//                         viewport: viewport
//                     };
//                     page.render(renderContext).promise.then(function() {
//                         zip.file('image' + page.pageNumber + '.png', canvas.toDataURL('image/png').split(',')[1], {base64: true});
//                         if (page.pageNumber === pdf.numPages) {
//                             zip.generateAsync({type:"blob"}).then(function(content) {
//                                 saveAs(content, "images.zip");
//                             });
//                         }
//                     });
//                 });
//             }
//         });
//     };
//     fileReader.readAsArrayBuffer(file);
// }


var pdfjsLib = window['pdfjs-dist/build/pdf'];

pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.worker.min.js';

// Replace the file path or data with your own PDF
var pdfFilePathOrData = './file-sample_150kB.pdf';

document.getElementById('convertButton').addEventListener('click', function() {
    convertPdfToImages(pdfFilePathOrData);
});

function convertPdfToImages(pdfFilePathOrData) {
    var loadingTask = pdfjsLib.getDocument(pdfFilePathOrData);
    loadingTask.promise.then(function(pdf) {
        var zip = new JSZip();
        var promises = [];

        for (var i = 1; i <= pdf.numPages; i++) {
            promises.push(convertPageToImage(pdf, i, zip));
        }

        Promise.all(promises).then(function() {
            zip.generateAsync({ type: 'blob' }).then(function(content) {
                saveAs(content, 'images.zip');
            });
        });
    });
}

function convertPageToImage(pdf, pageNumber, zip) {
    return new Promise(function(resolve, reject) {
        pdf.getPage(pageNumber).then(function(page) {
            var viewport = page.getViewport({ scale: 1 });
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            var renderTask = page.render({ canvasContext: context, viewport: viewport });
            renderTask.promise.then(function() {
                canvas.toBlob(function(blob) {
                    zip.file('image' + pageNumber + '.png', blob);
                    resolve();
                }, 'image/png');
            });
        });
    });
}


