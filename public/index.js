//学習済みの推論モデル
var model;
//ロード済み画像
var imgs;
//類似度
var simmatrix=[];
//objectlistの取得。　
var objlist=JSON.parse(document.getElementById("picsdat").value);

//モデルのロード
mobilenet.load().then((m)=>{model=m;});

//imageのロード
// loadcですべての画像のロードをカウントし、全て溜まったら処理を開始する
var loadc = 0;
function preload ()
{
    imgs=[];
    for(let i=0;i<objlist.length;i++){
	imgs.push(new Image());
	imgs[i].src=objlist[i].link;
	imgs[i].onload=function(){
	    loadc++;
	    if(loadc==imgs.length){
		draw();
		updaterecently();
	    }
	}
    }
}

// 予測を実行
// classify で上位10要素だけ算出
function predict(idx){
    model.classify(imgs[idx],10).then(predictions => {
	imgs[idx].predict=predictions;
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
	var feature=document.getElementById("feature");
	feature.value=String(JSON.stringify(pindex));
	
	document.getElementById("imgform").submit();
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
		var img = document.createElement("img");
		img.src = e.target.result;
		img.width=224;img.height=224;
		img.onload=function(){
		    imgs.push(img);
		    predict(imgs.length-1);
		}
		img.setAttribute("class", "thumb");
		var span = document.createElement('span');
		span.appendChild(img);
		document.getElementById('list').insertBefore(span, null);
            };
	})(f);

	// Read in the image file as a data URL.
	reader.readAsDataURL(f);
    }
}

document.getElementById('imagefile').addEventListener('change', handleFileSelect, false);
