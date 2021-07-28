$('#backsound')[0].volume = .1
$('#backsound')[0].loop = true
$('#mute-audio').hide() 
$('#backsound')[0].onplay = ((evt)=>{
    $('#backsound')[0].muted = false
})
window.addEventListener('DOMContentLoaded',function(){
    $('#backsound')[0].muted = false
})
function showMenu(){
    $('.menu').show()
    $('.info').hide()
    $('.provinsi').hide()
    $('.rumah-adat').hide()
    $('.pakaian-adat').hide()
}
showMenu()

function modalTogggle(attributes = {}){
    $('#nama-pulau').text(attributes.nama.toUpperCase())
    $('.text-header').text('Pulau '+attributes.nama)
    $('.text-body').html(attributes.body)
    $('.logo-body').empty()
    if(attributes.hasOwnProperty('logo')){
        $('.logo-body').append(`
            <div class="peta-wrapper">
                <img src="img/${attributes.logo.src}" class="peta" alt="${attributes.logo.alt}"/>
                <p class="peta-text">${attributes.logo.alt}</p>
            </div>
        `)
    }
    if(attributes.hasOwnProperty('audio')){
        $('#audio').attr('src', 'audio/'+attributes.audio)
    }else{
        $('#audio').attr('src', '')
    }
    $('#pilih-pulau').hide()
    $('#pulau').modal('show')
}

var autoScroll;
function showInfo(){
    $('.menu').hide()
    $('.info').fadeIn()
    $('#audio')[0].play()

    $('#pulau').animate({
        scrollTop: ($('.text-body').offset().top - 10)
    },1000)
    autoScroll=setInterval(()=>{
        $('#pulau')[0].scrollTop += 2
    },1000)
    $('#mute-audio').show()
}

var pengulangan;
function showProvinsi(){
    $('.menu').hide()
    $('.provinsi').empty()
    let pulau = $('.text-header').text().split(' ')
    pulau.shift()
    pulau = pulau.join('-').toLowerCase()
    getDataFrom('data/pulau-'+pulau+'.json',(result)=>{
        $('.text-header').text(result.nama)
        result.provinsi.forEach(pulau=>{
            $('.provinsi').append(`
            <div class="card mb-1 border-dark bg-transparent">
                <div class="card-block px-2">
                    <img src="img/${pulau.logo}" class="logo-provinsi" alt="">
                    <h4 class="card-title mt-2">${pulau.nama}</h4>
                    <p class="card-text text-justify" style="float: none;">${pulau.deskripsi}</p>
                    </div>
                </div>
            </div>
            `)
        })
        $('.provinsi').fadeIn()
        $('#mute-audio').show()
        $('#audio').attr('src', 'audio/'+(result.audio))[0].play()
        let waktu=0;
        let index=0;
        let scrollTop=[]
        setTimeout(()=>{
            $('.card').each((index, node)=>{
                scrollTop.push($(node).offset().top - 5);
            })
            $('#pulau').animate({scrollTop: scrollTop[0]},'fast')
            $($('.card')[0]).removeClass('bg-transparent').addClass('bg-cream')
            pengulangan = setInterval(() => {
                waktu+=100
                if(waktu==result.durasi[index]){
                    index++
                    $('#pulau').animate({scrollTop: scrollTop[index]},'fast')
                    $($('.card')[index]).removeClass('bg-transparent').addClass('bg-cream')
                    waktu=0
                }
                $($('.card')[index-1]).removeClass('bg-cream').addClass('bg-transparent')
                if(index==result.durasi.length-1){
                    $($('.card')[index]).removeClass('bg-transparent').addClass('bg-cream')
                    setTimeout(()=>{
                        $('#pulau').animate({scrollTop: 0},'slow')
                        $($('.card')[index]).removeClass('bg-cream').addClass('bg-transparent')
                        waktu=0
                        index=0
                    },result.durasi[index])
                    clearInterval(pengulangan)
                }
            }, 100);
        },result.mulai)
    })
}

var showRumahAdat = function(){
    $('.menu').hide()
    $('.rumah-adat').empty()
    let pulau = $('.text-header').text().split(' ')
    pulau.shift()
    pulau = pulau.join('-').toLowerCase()
    getDataFrom('data/rumah-adat-'+pulau+'.json',(result)=>{
        $('.text-header').text(result.nama).addClass('text-center')
        $('.rumah-adat').empty()
        result.rumah_adat.forEach(pulau=>{
            $('.rumah-adat').append(`
            <div class="card mb-1 border-dark bg-transparent  w-100">
                <div class="card-block px-2">
                    <h4 class="card-title mt-2 bg-white text-dark judul-rumah-adat">${pulau.nama}</h4>
                    <img src="img/rumah-adat/${pulau.gambar}" class="gambar-rumah-adat" alt="">
                    <p class="card-text text-justify" style="float: none;">${pulau.deskripsi}</p>
                    </div>
                </div>
            </div>
            `)
        })
        $('.rumah-adat').fadeIn()
    })
}

var showPakaianAdat = function(){
    $('.menu').hide()
    $('.card-columns').empty()
    let pulau = $('.text-header').text().split(' ')
    pulau.shift()
    pulau = pulau.join('-').toLowerCase()
    getDataFrom('data/pakaian-adat-'+pulau+'.json',(result)=>{
        $('.text-header').text(result.nama)
        result.data.forEach(pulau=>{
            pulau.pakaian.forEach(pakaian=>{
                $('.card-columns').append(`
                <div class="card">
                    <img class="card-img-top" src="img/pakaian-adat/${pakaian.gambar}" alt="Card image cap">
                    <div class="card-body bg-secondary" style="font-size: 12px;font-family: arial, sans-serif">
                        <p class="card-text">${pakaian.nama} (${pulau.provinsi})</p>
                    </div>
                </div>`)
            })
        })
        $('.pakaian-adat').fadeIn()
    })
}

$('#pulau').on('hidden.bs.modal',function(){
    $('.text-header').removeClass('text-center')
    showMenu()
    $('#audio')[0].pause()
    $('#audio')[0].currentTime=0
    $('#mute-audio').hide()
    clearInterval(pengulangan)
    clearInterval(autoScroll)
})

$('.mdi-volume-mute').hide()
let mute_backsound = false
let mute_audio = false
$('.btn-mute').on('click',function(){
    $(this).children('.mdi-volume-mute').toggle()
    $(this).children('.mdi-volume-high').toggle()
    if(this.id=='mute-backsound'){
        mute_backsound = !mute_backsound
        $('#backsound')[0].muted = mute_backsound
        if(!mute_backsound){
            $('#backsound')[0].play()
        }
    }else if(this.id=='mute-audio'){
        mute_audio = !mute_audio
        $('#audio')[0].muted = mute_audio
    }
})

$('.switch').on('click',function(){
    $(this).toggleClass('switchOn')
})

function showInfoModal(){
    $('#modal-info').modal('show');
}