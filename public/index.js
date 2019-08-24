//学習済みの推論モデル
var model;
//ロード済み画像
var img;

//モデルのロード
mobilenet.load().then((m)=>{model=m;});

// 予測を実行
// classify で上位10要素だけ算出
function predict(){
    model.classify(img,10).then(predictions => {
	img.predict=predictions;
	const pindex=predictions.map(function(i){
	    //所望の名前のindex を探す。
	    var ind;
	    for (ind = 0; ind < IMAGENET_CLASSES.length; ind++) {
		if (IMAGENET_CLASSES[ind] === i.className) {
		    break;
		}  
	    }if(ind==IMAGENET_CLASSES.length){
		alert("failed");//見つからない場合
		return;
	    }
	    return {index:ind,probability:i.probability};
	});

	document.getElementById('feature').value = String(JSON.stringify(pindex));
	console.log(document.getElementById('imagefile').value);
    });
}

//file セレクタ
function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

	// Only process image files.
	if (!f.type.match('image.*')) {
            continue;
	}

	var reader = new FileReader();

	// Closure to capture the file information.
	reader.onload = (function(theFile) {
	    return function(e) {
		img = document.createElement("img");
		img.src = e.target.result;
		img.width=224;img.height=224;
		img.onload=function(){
		    predict();
		}
            };
	})(f);

	// Read in the image file as a data URL.
	reader.readAsDataURL(f);
    }
}

document.getElementById('imagefile').addEventListener('change', handleFileSelect, false);
