var pdfjsLib = window['pdfjs-dist/build/pdf'];

pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.worker.min.js';

document.getElementById('convertButton').addEventListener('click', function() {
    var file = document.getElementById('fileInput').files[0];
    if (file) {
        convertPdfToImages(file);
    }
});

function convertPdfToImages(file) {
    var fileReader = new FileReader();
    fileReader.onload = function() {
        var typedArray = new Uint8Array(this.result);
        pdfjsLib.getDocument({data: typedArray}).promise.then(function(pdf) {
            var zip = new JSZip();
            for (var i = 1; i <= pdf.numPages; i++) {
                pdf.getPage(i).then(function(page) {
                    var scale = 1;
                    var viewport = page.getViewport({ scale: scale, });
                    var canvas = document.createElement('canvas');
                    var context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    page.render(renderContext).promise.then(function() {
                        zip.file('image' + page.pageNumber + '.png', canvas.toDataURL('image/png').split(',')[1], {base64: true});
                        if (page.pageNumber === pdf.numPages) {
                            zip.generateAsync({type:"blob"}).then(function(content) {
                                saveAs(content, "images.zip");
                            });
                        }
                    });
                });
            }
        });
    };
    fileReader.readAsArrayBuffer(file);
}