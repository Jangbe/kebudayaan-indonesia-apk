let soal = [];
$('#openingQuiz').fadeIn(1000)
$('#progressQuiz').hide()
$('#closingQuiz').hide()
let jawaban = [];
let current_q = 0;
if(sessionStorage.getItem('waktu')!=null){
    $('#openingQuiz').hide()
    $('#progressQuiz').show()
    $('#closingQuiz').hide()
    current_q = parseInt(sessionStorage.getItem('index'))
    soal = JSON.parse(sessionStorage.getItem('soal'));
    if(sessionStorage.getItem('jawaban')!=null){
        jawaban = JSON.parse(sessionStorage.getItem('jawaban'))
    }
    setQuiz()
    progressBar()
}

async function init(){
    if(sessionStorage.getItem('soal')==null){
        try{
            let {soal} = await getDataFrom('quiz/quiz.json',undefined,false)
            let soal10 = [];
            let total = 0;
            soal.shuffle().forEach(item=>{
                if(total<10){
                    soal10.push(item)
                    total++
                }
            })
            sessionStorage.setItem('soal',JSON.stringify(soal10));
        }catch(e){
            console.log(e);
        }
    }
    soal = JSON.parse(sessionStorage.getItem('soal'));
}
function progressBar(){
    $('.close-btn').hide()
    let waktu = sessionStorage.getItem('waktu')
    waktu = new Date(waktu)
    let diff;
    let batas = 60;
    if(waktu){
        let maju = setInterval(()=>{
            let now = new Date()
            diff = batas-((waktu.getTime()-now.getTime())/1000);
            let proggress = diff/batas*100;
            $('#myBar').width(proggress+'%')
            if(waktu.getTime()-now.getTime()<0){
                clearInterval(maju)
                stopQuiz()
            }
        },10)
    }
}
async function startQuiz(){
    if(sessionStorage.getItem('waktu')==null){
        let waktu = new Date()
        waktu.setMinutes(waktu.getMinutes()+1)
        sessionStorage.setItem('waktu',waktu);
        sessionStorage.setItem('index',0)
        current_q = 0;
    }else{
        current_q = parseInt(sessionStorage.getItem('index'))
    }
    await init()
    setQuiz()
    progressBar()
    $('#openingQuiz').hide()
    $('#progressQuiz').fadeIn()
}
function setQuiz(){
    $('#kotak-soal').empty()
    if(soal[current_q].gambar!=undefined){
        $('#kotak-soal').append(`<img src="img/${soal[current_q].gambar}" class="soal-gambar" alt="" srcset="">`)
    }
    $('#kotak-soal').append(`<p>${soal[current_q].soal}</p>`)
    $('#kotak-soal').append(`<span class="waktu">${current_q+1}/10</span>`)
    $('#1').val(soal[current_q].pilihan[0].index).next().text(soal[current_q].pilihan[0].teks)
    $('#2').val(soal[current_q].pilihan[1].index).next().text(soal[current_q].pilihan[1].teks)
    $('#3').val(soal[current_q].pilihan[2].index).next().text(soal[current_q].pilihan[2].teks)
    $('#4').val(soal[current_q].pilihan[3].index).next().text(soal[current_q].pilihan[3].teks)
}
function saveAnswer(){
    if(jawaban[current_q]!=undefined){
        jawaban[current_q] = parseInt($('input[name=jawaban]:checked').val())
    }else{
        jawaban.push(parseInt($('input[name=jawaban]:checked').val()))
    }
    sessionStorage.setItem('jawaban', JSON.stringify(jawaban));
    $('.navigation').blur()
}
function nextQuiz(){
    saveAnswer()
    if($('input[name=jawaban]:checked')[0])
        $('input[name=jawaban]:checked')[0].checked = false
    if(current_q==soal.length-1){
        stopQuiz()
    }else{
        sessionStorage.setItem('index',parseInt(current_q)+1)
        current_q=parseInt(sessionStorage.getItem('index'));
        setQuiz()
    }
}
function stopQuiz(){
    let total = 0;
    sessionStorage.removeItem('index')
    sessionStorage.removeItem('soal')
    sessionStorage.removeItem('waktu')
    sessionStorage.removeItem('jawaban')
    soal.forEach((item,index)=>{
        if(item.jawaban==jawaban[index]){
            total++
        }
    })
    $('#score').text(total*100)
    $('#benar').text(total)
    $('#progressQuiz').hide()
    $('#closingQuiz').fadeIn()
    return;
}
$('input[name=jawaban]').on('change',()=>{
    saveAnswer()
})