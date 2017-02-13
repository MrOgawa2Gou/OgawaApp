// This is a JavaScript file

function changePage(){
    
    x = $("#selectMenu").val();
    
    location.href = "op/op" + x + ".html";
    
    localStorage.numX = x;
    localStorage.numY = 0;

}
    
function JumpPage(){
    
        y = $("#PullMenu").val();
        
        if(y != "#"){
        
            localStorage.numY = y;
            
            selectQuiz();
        }
    
}
 
//--------------------------------------------------------------------------------------------------------
//NCMBの設定
//--------------------------------------------------------------------------------------------------------

var ncmb = new NCMB("41855be0e99d5cc4607ea9f4e1bb64e1b9fb0c2009eca6b06762f658cd9324b1","08aca6dab1bb78778f262cf1b017b51d68235daa448f0ee29aef3bd81f8750e7");

function CreateQuestion(){
    //テキストから問題文、答え、選択肢を取得し変数に代入
        var qtext = $("#qtext").val();
        var ans = $("#ans").val();
        var option1 = $("#option1").val();
        var option2 = $("#option2").val();
        var option3 = $("#option3").val();
        var comment = $("#comment").val();
        var genre = $("#pdmenu").val();
        var qNum = $("#qNum").val();
        
        var QuestionClass = ncmb.DataStore("question"); //データストアのクラス定義
        var question = new QuestionClass(); //インスタンス作成
        
    //クラウドに問題文、答え、選択肢を送信
    if (qtext !== "" && ans !== "" &&
        option1 !== "" && option2 !== "" && option3 !== "" && qNum !== "" && comment !== ""){
            //空欄がなければ
            question.set("qtext",qtext)
                    .set("answer",ans)
                    .set("options",[option1,option2,option3])
                    .set("comment",comment)
                    .set("genre",genre)
                    .set("qNum",qNum)
                    .save()
                    .then(function(object){
                    //成功した場合
                        alert("保存しました");
                    })
                    .catch(function(error){
                    //失敗した場合
                        alert("error");
                    });
        }else{
            //空欄があれば
            alert("全て埋めてください");
        }
                
    }
    
function getData() {
    localStorage.numY = $("#qNum").val();
    localStorage.numX = $("#pdmenu").val();
    
    selectQuiz();
}
    
function displayQuiz(Quiz){
    
    //問題文を表示
    $("#question").html(Quiz.get("qtext"));
    
    //選択肢を表示する部分が見えるようにする
    $("#answer_options").show();
    
    //選択肢が入っている配列の末尾に正解を追加する
    var array = Quiz.get("options");
    array[3] = Quiz.get("answer");
    
    //正解とダミーの選択肢をランダムに入れ替える
    var index = Math.floor(Math.random() * 3);
    var tmp = array[index];
    array[index] = array[3];
    array[3] = tmp;
    
    //正解を含んだ選択肢の配列を表示する
    for (var i = 0; i < 4; i++){
        var btn = $("<button onclick=\"answerQuiz('" + array[i] + "')\">" + array[i] + "</button>");
        btn.appendTo($("#answer_options"));
    }
    
    //選択肢がタッチされたときに正誤判定を行うため、正解を保持する
    answerText = Quiz.get("answer");
    commentText = Quiz.get("comment");
}

/* var quizSize = 0;
//クイズを検索する
function selectQuiz(){
    //クイズを検索するncmb.Queryクラスのインスタンスを作成する
    var QuizClass = ncmb.DataStore("question");
    
    //指定された条件に合致するクイズの件数を調べる
    QuizClass.count().fetchAll()
                     .then(function(objects){
                            //登録されたクイズの数を保持する
                            quizSize = objects.count;                          
                     })
                     .catch(function(error) {
                            // エラー
                            console.log("error:" + error.message);                          
                     });
    
    //作成したクエリに条件を設定する
    QuizClass.skip(Math.floor(Math.random() * quizSize))
             .fetch()
             .then(function(result){
                displayQuiz(result);      
             })
             .catch(function(error) {
                console.log("error:" + error.message);
             });
}*/

function refreshQuiz(){
    var incre = localStorage.numY;
    $("#answer_options").html("");
    incre++;
    localStorage.numY = incre;
    selectQuiz();
}

function answerQuiz(selectedOptions){
    
    //選択肢を非表示にする
    $("#answer_options").hide();
    
    if (answerText === selectedOptions) {
        //正解時に○画像を出す
        $("#question").append("<br />正解");
        
        //次の問題を開くボタンを表示する
        var btn = $("<br /><button onclick='refreshQuiz()'>次の問題</button>");
        btn.appendTo($("#question"));
        
    } else {
        
        //間違い時に×画像を出す
        $("#question").append("<br />間違い<br />解説：<br />" + commentText);
    }
}

function adminLogin(){
    var userName = $("#userId").val();
    var password = $("#password").val();
    
    var callBackLogin = function(error,obj){
        if(error){
            $("#login_error_code").text("エラーコード：" + error.code);
            $("#login_error_msg").text("エラーメッセージ：" + error.message);
        }else{
            location.href="index2.html";
        }
    };
    
    ncmb.User.login(userName,password,callBackLogin);
    
}

function selectQuiz(){
    
    $("#qNumD").empty();
    $("#answer_options").empty();
    
    var numA = localStorage.numX;
    var numB = localStorage.numY;
    
    $("#qNumD").append("問" + numB);
    
    console.log(numA);
    console.log(numB);
    
    //クイズを検索するncmb.Queryクラスのインスタンスを作成する
    var QuizClass = ncmb.DataStore("question");
    
    //作成したクエリに条件を設定する
    QuizClass.equalTo("genre", numA )
             .equalTo("qNum", numB )
             .fetch()
             .then(function(result){
                displayQuiz(result);
             })
             .catch(function(error) {
                console.log("error:" + error.message);
             });
}

function nextQuestion(){
    
    var numB = localStorage.numY;
    
    numB++;
        
    if(numB > 40){
            
        alert("次の問題がありません");
            
    }else{

        localStorage.numY = numB;
        selectQuiz();
    }
    
}

function questionBack(){
    
    var numB = localStorage.numY;

    numB--;
        
    if(numB < 1){
            
        alert("前の問題がありません");
            
    }else{
        
        localStorage.numY = numB;
        selectQuiz();
            
    }
}