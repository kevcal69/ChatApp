var database = firebase.database();

// A function that saves user info to our database
var saveUser = function(user) {
    // Retrieve the reference for our user
    var $userRef = database.ref('/users/' + user.uid);
    // Take a static snapshot of the value
    // to check if its present or not
    $userRef.once('value')
    .then(function(data) {
        if (data.val() == null) {
            $userRef.set({
                'name': user.displayName,
                'photoURL': user.photoURL,
                'email': user.email
            })
        }
    });
}
$('.m-nav').addClass('hide');
$('.loader-container').addClass('hide');
var $roomsContainer =  $('.rooms');
var populateSidebar = function() {
    var $roomsRef = database.ref('/rooms/');
    $roomsRef.on('child_added', function(snapshot) {
        (function(obj) {
            var template = $('#roomTemplate').clone();
            template.find('.title').html(obj.key);
            template.removeClass('hide')
            $roomsContainer.append(template)
        })(snapshot);
    })
}

setTimeout(populateSidebar, 1000)
var createRoom = $('.create-room');
createRoom.on('keypress', function(e) {
    var keycode = e.which || e.keycode;
    if (keycode === 13) {
        var val = $(e.target).val().trim();
        var $roomRef= database.ref('/rooms/' + val +'/created');
        $roomRef.set(true).then(function() {
            // createRoom
            createRoom.addClass('valid');
            setTimeout(function() {
                createRoom.removeClass('valid');
            }, 1500);
        }).catch(function(e) {
            createRoom.addClass('invalid');
            setTimeout(function() {
                createRoom.removeClass('invalid');
            }, 1500);
        });
    }
});
var $currentRoomRef = null;
$roomsContainer.on('click', '.join', function(e) {
    var $convo = $('#conversation');
    $roomsContainer.find('.collection-item').removeClass('active');
    $(e.target).closest('.collection-item').addClass('active');
    $convo.find('.collection-item:not(.hide)').remove()
    var $roomName = $(e.target).parent().prev().html();
    if ($currentRoomRef) {
        $currentRoomRef.off();
    }
    $currentRoomRef = database.ref('/rooms/' + $roomName + '/messages');
    $currentRoomRef.on('child_added', function(snapshot) {
        var snp = snapshot.val();
        var $template = null;
        if (snp.sender.owneruid === $user.uid) {
            $template = $('#you').clone()
        } else {
            $template = $('#other').clone()
        }
        $template.find('p').html(snp.message);
        $template.find('img').attr('src', snp.sender.photoURL);
        $template.removeClass('hide');
        $convo.append($template);
    });
});

$('.messagebody').on('click', function(e) {
    var val = $('.message-textarea').val();
    $currentRoomRef.push({
        'message': val,
        'sender': {
            'owneruid': $user.uid,
            'name': $user.displayName,
            'photoURL': $user.photoURL,
        },
    })
});
// .
// .
// .
// .
// .
// .
// .
// .
// .
// .
// .
