let socket = io();
let userId = '';
let me;
const emojisArr = ["😄", "😊", "😃", "😀", "😁", "😆", "😅", "😂", "🤣", "😉", "😍", "😘", "😚", "😋", "😜", "😝", "😛", "🤗", "🤔", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😪", "😫", "😴", "😌", "😔", "😕", "🙃", "🤑", "😲", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "🥵", "🥶", "😳", "🤪", "😵", "😡", "🤬", "🍔", "🍟", "🍕", "🌭", "🍿", "🍩", "🍪", "🍫", "🍰", "🍦", "🍧", "🍨", "🍮", "🍯", "🍳", "🍔", "🍕", "🍖", "🍗", "🥓", "🚗", "🚕", "🚆", "🚇", "🚈", "🚂", "🚝", "🚄", "🚅", "🚈", "🚞", "🚋", "🚃", "🚌", "🚍", "🚎", "🏎️", "🚓", "🚔", "🚒", "🚑", "🚐", "🚚"];
let messageSound;
let showSendedTime;

$(document).ready(function() { 
    me = JSON.parse(localStorage.getItem("me"));
    if (me) {
        $('#loginUserName').val(me.loginVal);
        $('.changeForm').on('click', function(){
            $('.changeFormIndicator').toggle();
            if($('.changeFormIndicator').css('display') == 'none'){
                $('.loginForm').css('display', 'none');
                $('.registrationForm').css('display', 'flex');
            }else{
                $('.loginForm').css('display', 'flex');
                $('.registrationForm').css('display', 'none');
            }
        })
        $('.registrationForm').hide();
        $('.loginForm').css('display', 'flex');
    }else console.log("New user. Please register.");
});
$('#regBtn').on('click', function() {
    let loginVal = $('#login').val();
    let passwordVal = $('#password').val();
    let userId = getUserId();
    let iconBg = randomColor();
    const body = `login=${encodeURIComponent(loginVal)}&password=${encodeURIComponent(passwordVal)}&userId=${encodeURIComponent(userId)}&iconBg=${encodeURIComponent(iconBg)}`;  
    me = { loginVal: loginVal, passwordVal: passwordVal, iconBg: iconBg, userId: userId };
    localStorage.setItem("me", JSON.stringify(me));
    if (passwordVal.length > 6 && loginVal != '') {     
        axios
        .post('/user-registered', body, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        .then((response) => { console.log(response) })
        .catch((error) => { console.error(error) });
        $('#login, #password').val('');
        $('.registrationForm').hide();
        $('.myChat').show();
    }else if (passwordVal.length < 6) alert('Password must be at least 6 characters long');
    else alert('Fill in the fields');
});
$('#logBtn').on('click', function(){
    fetch('./js/data.json')
    .then((response) => { return response.json() })
    .then((data) => {
        for(let el of data){
            if($('#loginUserName').val() == el.userLogin && $('#loginPassword').val() == el.userPassword){
                $('.loginForm').hide();
                $('.myChat').show();
                me.loginVal = el.userLogin;
                me.passwordVal = el.userPassword; 
                me.userId = el.userId;
            }else {
                setTimeout(function(){ $('.loginInput, .passwordWrapper').css('border', '5px solid  tomato') }, 500);
                setTimeout(function(){ $('.loginInput, .passwordWrapper').css('border', '0px solid #333') }, 1000);
            };
        }
    });
});
$('#notifySound').on('click', function(){
    $('#notifySoundIndicator').toggle();
    if($('#notifySoundIndicator').css('display') == 'none') messageSound = true;
    else messageSound = false;
})
$('#showSendedTime').on('click', function(){
    $('#showSendedTimeIndicator').toggle();
    if($('#showSendedTimeIndicator').css('display') == 'none') showSendedTime = true;
    else showSendedTime = false;
    if(showSendedTime) $('.message li p span').css('display', 'flex');
    else $('.message li p span').css('display', 'none');
})
function getUserId() {
    userId = "";
    let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']; 
    let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for(let i = 1; i <= 6; i++){
        let randomVal = Math.floor(Math.random() * 2) + 1;
        if (randomVal == 1) userId += letters[Math.floor(Math.random() * letters.length)];
        else userId += numbers[Math.floor(Math.random() * numbers.length)];
    } return userId;
}
function randomColor() {
    let red = Math.floor(Math.random() * 256);
    let green = Math.floor(Math.random() * 256);
    let blue = Math.floor(Math.random() * 256);
    return `rgb(${red}, ${green}, ${blue})`;
}
for(let el of emojisArr){ $('.emojiContainer').append(`<div class='emoji'>${el}</div>`) }
$('.showPassword').on('click', function(){
    $('.showPasswordIndicator').toggle();
    if($('.showPasswordIndicator').css('display') == 'none') $('.passwordWrapper input').attr('type', 'text');
    else $('.passwordWrapper input').attr('type', 'password');
})
$('#form').on('submit', function(){
    let currentDate = new Date();
    if($('#message_info').val() != ''){
        let timeString = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        socket.emit( 'chat message', { message: $('#message_info').val(), userId: me.userId, iconBg: me.iconBg, sendTime: timeString, userName: me.loginVal } );
        $('#message_info').val('');
        return false;
    }else { };
});
$('.emoji').on('click', function(){ $('#message_info').val($('#message_info').val() + $(this).text()) });
$('.openEmoji').on('click', function(){
    $('.openEmojiIndicator').toggle();
    if($('.openEmojiIndicator').css('display') == 'block'){
        $('.emojiContainer').css('transform', 'scale(0)');
        $('.emojiContainer').css('marginLeft', '-200px');
        $('.emojiContainer').css('marginTop', '-25px');
        $('.emojiContainer').css('pointerEvents', 'none');
        $('.emojiContainer').css('opacity', '0');
    }else if($('.openEmojiIndicator').css('display') == 'none'){
        $('.emojiContainer').css('transform', 'scale(1)');
        $('.emojiContainer').css('marginLeft', '-175px');
        $('.emojiContainer').css('marginTop', '-100px');
        $('.emojiContainer').css('pointerEvents', 'auto');
        $('.emojiContainer').css('opacity', '1');
        document.querySelector('.emojiContainer').scrollTo(0, 0);
    }
});
$('.settings').on('click', function(){
    $('.settingsIndicator').toggle();
    if($('.settingsIndicator').css('display') == 'none'){
        $('.settingsContainer').css('transform', 'scaleY(1)');
        setTimeout(function(){ $('.settingsContainer h2, .settingsContainer div').css('opacity', '1')}, 500);
    }else{
        $('.settingsContainer').css('transform', 'scaleY(0)');
        $('.settingsContainer h2, .settingsContainer div').css('opacity', '0');
    }
});
$('#setImage').on('change', function() {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function() { $('.messageContainer').css('backgroundImage', `url(${reader.result})`) };
    reader.readAsDataURL(file);
});
$(`.chatTheme`).on('click', function(){
    let chooseImage = $(this).attr('src');
    $('.messageContainer').css('backgroundImage', `url('${chooseImage}')`);
    $('.settingsIndicator').css('display', 'block');
    $('.settingsContainer').css('transform', 'scaleY(0)');
    $('.settingsContainer h2, .settingsContainer div').css('opacity', '0');
});
socket.on('chat message', function(data){
    if(data != ''){
        $('#message').append(data);
        document.querySelector(".message").scrollTop = document.querySelector(".message").scrollHeight;
        fetch('./js/data.json')
        .then((response) => { return response.json() })
        .then((data) => {
            for(let el of data){
                $(`.${el.userId}`).css("alignSelf", "flex-start");
                $(`.${el.userId} p span`).css("alignSelf", "flex-start");
                if(showSendedTime) $(`.${el.userId} p span`).css('display', 'flex');
                else $(`.${el.userId} p span`).css('display', 'none');
                if(el.userId != me.userId) {
                    $(`.${el.userId} img`).css("order", "1");
                    $(`.${el.userId} p`).css("order", "2");
                }
            }
            $(`.${me.userId} p span`).css("alignSelf", "flex-end");
            $(`.${me.userId}`).css("alignSelf", "flex-end");
            if(messageSound) document.getElementById('audioElement').play();
        });
    }else ;
});
socket.on('getStatus', function(data){ $('#userCount').text(data) });