var val=document.getElementById("result");//'嗚呼おおお∀あいうえおえい∀あいうあいうあいうあいうあ嗚呼'; // テキスト。改行は「∀」に変換しておく
val = (val.replace('、', '∀'));
console.log(val);

window.onload = function(){
    var cnt = 0;
    var fontname = 'myfont'; // CSSのfont-familyに対応したフォント名

    function tryDraw(){
        if(!loaded() && cnt < 100){
            setTimeout(tryDraw, 100);
            cnt++;
        } else {
            draw();
        }
   }

   //webフォントのロード状況を確認する
   var c1 = document.createElement("canvas");
   var c2 = c1.cloneNode(false);
   var ctx1 = c1.getContext("2d");
   var ctx2 = c2.getContext("2d");

   //webフォントと代替フォントとを指定．
   //NOTE:monoscopeだとwebkitでリロード時に失敗する
   ctx1.font = "normal 30px '" + fontname + "', serif";
   ctx2.font = "normal 30px serif";
   var text = "this is test text.";  
   function loaded(){
        //テキスト幅を比較する
        //webフォントが利用可能となると，フォント幅が一致する．
        var tm1 = ctx1.measureText(text);
        var tm2 = ctx2.measureText(text);
        return tm1.width != tm2.width;
   }
   //処理開始
   tryDraw();
}

function draw(DSP) {   
    var layer1 = document.getElementById("layer1");
    var layer1Ctx = layer1.getContext("2d");
    var hp = 0;
    var vp = 0;
    var hps_base =  150; // スタート地点のx座標
    var hps =  hps_base;
    var vps_base = 50; // スタート地点のy座標
    var vps = vps_base;
    var chr = '';
    var hp_flag;
    var rubyFlag;
    var rubyVps;
    var rubyHps;
    var rubyCount;
    var rubyLength = 0;
    var rubyWidth = 0;
    var dancount = 0; 
    var dan = 0; // 段組の有無（有 = 1）
    var t_height = 39 // １行文字数;
        t_height--;
    var fontname = 'myfont'; // CSSのfont-familyに対応したフォント名
    var fontsize = 30; // フォントサイズ
    var fontcolor = '#000000'; // 文字色
    var lineheight = 1.66; // 行間
    var gyo = 16; // 行数

    val = val.replace(/&#039;/g,"'");

    var c = 0;
    var v = 1;

    for(var i=0;i<val.length;i++){
        // 複数ページを取り扱う場合の処理
        if (i ==0 && sessionStorage.getItem("next") > 0) {
            if (DSP != 1) {
                i = sessionStorage.getItem("next");
            }
        }

        layer1Ctx.font = fontsize + "px '" + fontname + "'";
        layer1Ctx.fillStyle  = fontcolor;
        vp = fontsize;
        chr = val.charAt(i);
        next = val.charAt(i+1);
        if (chr == '｜') { // ルビ処理（「｜漢字《かんじ》」の書式に対応）
            rubyFlag = 1;
            rubyVps = vps_base + (fontsize * c) -fontsize * 0.4;
            rubyHps = hps + (fontsize * 1.03);
            rubyCount = c - 0.5;
            continue; // 次へ
        } else if (rubyFlag && chr == '＠') {
            rubyFlag = 3;
            continue; // 次へ
        } else if (rubyFlag == 3) {
            switch (chr) {
                case '１': rubyVps -= fontsize * 0.5;
                    rubyCount -= 0.5;
                    break;
                case '２': rubyVps -= fontsize;
                    rubyCount -= 1;
                    break;
                case '３': rubyVps -= fontsize * 1.5;
                    rubyCount -= 1.5;
                    break;
                case '４': rubyVps -= fontsize * 2;
                    rubyCount -= 2;
                    break;
                case '５': rubyVps -= fontsize * 2.5;
                    rubyCount -= 2.5;
                    break;
                case '６': rubyVps -= fontsize * 3;
                    rubyCount -= 3;
                    break;
                case '７': rubyVps -= fontsize * 3.5;
                    rubyCount -= 3.5;
                    break;
                case '８': rubyVps -= fontsize * 4;
                     rubyCount -= 4;
                   break;
                case '９': rubyVps -= fontsize * 4.5;
                    rubyCount -= 4.5;
                    break;
            }
            rubyFlag = 1;
            continue; // 次へ
        } else if (rubyFlag && (chr == '≪' || chr == '《')) {
            rubyFlag = 2;
            continue; // 次へ
        } else if (rubyFlag && (chr == '≫' || chr =='》')) {
            rubyFlag =0;
            rubyCount=0;
            rubyLength=0;
            rubyWidth = 0;
            continue; // 次へ
        }
        if (rubyFlag == 1) {
            rubyWidth++;
        }
        if (rubyFlag == 2) {
            if (chr == '圏') { // 圏点処理（「｜漢字《圏》」の書式に対応）
                layer1Ctx.font = fontsize * 0.3  + "px '" + fontname + "'";
                rubyVps = rubyVps + fontsize * 0.3;
                if (rubyCount > t_height) {
                    rubyVps = vps_base - fontsize * 0.1;
                    rubyHps -= fontsize * lineheight; // 改行
                }
                for (k = 0; k < rubyWidth; k++) {
                    layer1Ctx.fillText("\uFE45", rubyHps, rubyVps );
                    rubyVps = rubyVps + fontsize;
                    if (rubyVps > vps_base + t_height * fontsize) {
                        rubyVps = vps_base - fontsize * 0.3;
                        rubyHps -= fontsize * lineheight; // 改行
                    }
                }
                continue;
            }
            if (rubyCount > t_height) {
                rubyCount = -0.5;
                rubyVps = vps_base - fontsize * 0.4;
                rubyHps -= fontsize * lineheight; // 改行
            }
            next = val.charAt(i+1);
            prev = val.charAt(i-1);
            if ( prev.match(/[《≪]/) && next.match(/[》≫]/) && rubyLength == 1) {
                rubyVps = rubyVps + (fontsize * 0.2);
            }
            layer1Ctx.font = fontsize * 0.5  + "px '" + fontname + "'";
            layer1Ctx.fillText(chr, rubyHps, rubyVps );
            rubyVps = rubyVps + fontsize * 0.5;
            rubyCount = rubyCount + 0.5;
            continue;
        } else if (rubyFlag == 1) {
            rubyLength++;
        }
        if (c > t_height) { // 最大字数オーバー
            if ((chr.match(/、|。|」|）|』|】|゛/)) &&(c < (t_height + 3))){ // 禁則処理（最大３字までぶら下げ）
                   if (c > (t_height+1)) {
                    vps = vps_base + (fontsize *  (c-0.5)); // 位置
                   } else {
                    vps = vps_base + (fontsize * c); // 位置
                }
            } else if (chr != '゛') {
               hps -= fontsize* lineheight; // 改行
               vps = vps_base; // 行頭へ
               c = 0; // 縦位置カウント
               v++; // 行カウント
            }
        } else if (chr == '∀') { // 改行マーク
           hps -= fontsize* lineheight ; // 改行
           vps = vps_base; // 行頭へ
           c= 0;
           v++;
        } else {
            vps = vps_base + (fontsize * c); // 位置
        }
        if  (chr == '∀') {

        } else {
            if (v > gyo) {
                dancount++;
                if ((dancount == dan) || (! dan)) {
                    if(('sessionStorage' in window) && (window.sessionStorage !== null)) {
                        sessionStorage.setItem("next", i); // 何文字目かを記憶
                    }
                    break;
                } else {
                    c = 0;
                    v = 1;
                    hps = hps_base;
                    vps_base = vps_base + ((t_height + 4) * fontsize);
                    vps = vps_base;
                }
            }
            // CSSを使わない（横書き用グリフになる）場合の処理
            if (fontname == 'defaultTate') {
                layer1Ctx.save();
                Bhps = hps;
                Bvps = vps;
                switch (true) {
                    case /[、。]/.test(chr):
                        hps = hps + (fontsize * 0.7);
                        vps = vps - (fontsize * 0.7);
                        break;
                    case /[ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヵヶ]/.test(chr):
                        hps = hps + (fontsize * 0.1);
                        vps = vps - (fontsize * 0.1);
                        break;
                    case /[「」『』（）＜＞【】〔〕≪≫＜＞～―…：；]/.test(chr):
                        layer1Ctx.translate(hps, vps);
                        layer1Ctx.rotate(90 * Math.PI / 180);
                        vps = - (fontsize * 0.1);
                        hps = - (fontsize * 0.8);
                        break;
                    case /[ー]/.test(chr):
                        layer1Ctx.translate(hps, vps);
                        layer1Ctx.rotate(91.5 * Math.PI / 180);
                        vps = - (fontsize * 0.1);
                        hps = - (fontsize * 0.9);
                        break;
                    case /[〝]/.test(chr):
                        hps = hps - (fontsize * 0.5);
                        vps = vps + (fontsize * 0.5);
                        break;
                    case /[〟]/.test(chr):
                        hps = hps + (fontsize * 0.5);
                        vps = vps - (fontsize * 0.5);
                        break;
                }
                difH = hps - Bhps;
                difV = Bvps - vps;
            }
            if (chr =='！' || chr =='？') { // 「！！」「！？」の縦中横処理
                if (next =='！' || next =='？') {
                    layer1Ctx.fillText(chr, hps-fontsize*0.25, vps );
                    layer1Ctx.fillText(next, hps+fontsize*0.25, vps );
                    i++;
                } else {
                    layer1Ctx.fillText(chr, hps, vps );
                }
                c++;
            } else if (chr =='゛') { // 濁点をつける
                vps = vps - fontsize;
                layer1Ctx.fillText(chr, hps+fontsize*0.8, vps );
            } else {
                if (chr.match(/[A-Za-z0-9"'\.\, \[\]:;!\?]/)) { // 半角文字の回転処理
                    w = layer1Ctx.measureText(chr);
                    p = w.width / fontsize;
                    layer1Ctx.save();
                    layer1Ctx.setTransform(1, 0, 0, 1, 0, 0);
                    layer1Ctx.rotate(90 * Math.PI / 180);
                    layer1Ctx.fillText(chr, vps - fontsize * 0.75 , -hps- fontsize * 0.25);
                    layer1Ctx.restore();
                    c = c + p*1.1;
                } else {
                    layer1Ctx.fillText(chr, hps, vps );
                    if (chr.match(/、|。/) && next.match(/」|』/)){ // 禁則処理
                           c += 0.5;
                    } else {
                           c++;
                    }
                }
            }
            if (fontname == 'defaultTate') {
                hps = hps - difH;
                vps = vps + difV;
                layer1Ctx.restore();
            }
        }
    }
    if (v  <= gyo) {
        sessionStorage.setItem("next", "");
        sessionStorage.setItem("page", "");
    }
}
