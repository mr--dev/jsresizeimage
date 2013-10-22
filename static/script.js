var canvas = document.getElementById('my-canvas');

function handleUpload(evt) {
    var file = evt.target.files[0];
    if (file) {
        if (file.type.match("^image/.*")) {
            document.getElementById('file-name').value = file.name;
            document.getElementById('file-size-before-upload').innerHTML = (file.size/1024).toFixed(2);
            document.getElementById('file-size-after-upload').innerHTML = '';
            resizeImage(file);
        } else {
            alert("Insert image file.");
        }    
    }
}

/* Resize image before send, using Image and FileReader */
function resizeImage(file) {
    var reader = new FileReader();
    reader.onloadend = function() {
         
        var tempImg = new Image();
        tempImg.src = reader.result;
        tempImg.onload = function() {
 
            var MAX_WIDTH = 320;
            var MAX_HEIGHT = 240;
            var newWidth = tempImg.width;
            var newHeight = tempImg.height;
            var wRatio = MAX_WIDTH/newWidth;
            var hRatio = MAX_HEIGHT/newHeight;
            if (wRatio < hRatio) {
                if (newWidth > MAX_WIDTH) {
                    newHeight *= MAX_WIDTH / newWidth;
                    newWidth = MAX_WIDTH;
                }
            } else {
                if (newHeight > MAX_HEIGHT) {
                    newWidth *= MAX_HEIGHT / newHeight;
                    newHeight = MAX_HEIGHT;
                }
            }

            canvas.width = newWidth;
            canvas.height = newHeight;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0, newWidth, newHeight);
        }
 
    }
    reader.readAsDataURL(file);
    document.getElementById('btn-upload').removeAttribute('disabled');    
}

function uploadImage() {
    dataURL = canvas.toDataURL("image/jpeg");
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(evt){
        // Is response arrived? 
        if (evt.target.readyState == 4) {
            // Is response OK?
            if (evt.target.status == 200) {
                var response = JSON.parse(evt.target.response);
                document.getElementById('file-size-after-upload').innerHTML = response.file_size;
            } else {
                alert("There has been some problem during uploading image...");
            }
            document.getElementById('btn-upload').setAttribute('disabled', 'disabled');
        }
    };
    xhr.open('POST', '/', true);
    data = new FormData();
    data.append('filename', document.getElementById('file-name').value);
    data.append('img', dataURL);
    xhr.send(data);
}


document.getElementById('img-upload').addEventListener('change', handleUpload, false);
