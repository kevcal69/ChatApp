var provider = new firebase.auth.GoogleAuthProvider();

var $setUserAvatar = function(user) {
    var $userAvatar = $('#user-avatar');
    $userAvatar.find('img').attr('src', user.photoURL);
    $userAvatar.find('.title').html(user.displayName)
};

var $setWelcomeScreen = function(isSignedIn, user) {
    var $welcomeScreen = $('.m-nav');
    if (isSignedIn) {
        $welcomeScreen.find('.user-name').removeClass('hide');
        $welcomeScreen.find('.user-name').html(' as ' + user.displayName);
        $welcomeScreen.find('.another-user').removeClass('hide');
    } else {
        $welcomeScreen.find('.user-name').html('');
        $welcomeScreen.find('.user-name').addClass('hide');
        $welcomeScreen.find('.another-user').addClass('hide');
    }
}

// Fetch user from firebase auth
var $user = firebase.auth().currentUser;
// Check if user is present
if ($user) {
    // Helper function to set user avatar
    $setUserAvatar($user);
    // Helper function for settings up the welcome page
    $setWelcomeScreen($user);
} else {
    $setWelcomeScreen(false, null);
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in. Set user to global variable $user.
        $user = user;

        // Helper function to set user avatar
        $setUserAvatar(user);
        $setWelcomeScreen(true, user);
    } else {
        // No user is signed in.

        // Helper function for settings up the welcome page
        $setWelcomeScreen(false, user);
    }
});


// Event Listener for signin button in welcome screen
$('.signin').on('click', function() {
    var $nav = $('.m-nav');
    // $nav animation slide up. see more at JQuery
    $nav.slideUp(200, function() {
        // Check for pre-existing user.
        if ($user) {
            // Set time out to add effect.
            setTimeout(function() {
                $('.loader-container').fadeOut(100, function () {
                    $('.loader-container').addClass('hide');
                    // Helper function to set user avatar
                    $setUserAvatar($user);
                });
            }, 1000);
        } else {
            // Snippet from firebase documentations
            firebase.auth().signInWithPopup(provider).then(function(result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;

                $('.loader-container').fadeOut(100, function () {
                    // Helper function to set user avatar
                    $setUserAvatar(user);
                });
            }).catch(function(error) {
                // Handle Errors here.
                console.log(error);
                $nav.slideDown();
            });
        }
    })
})

// Event Listener for Signout Button
$('.logout').on('click', function() {
    // Snippet code from firebase for signout
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        var $nav = $('.m-nav');
        $user = null;
        $('.loader-container').fadeIn(100)
        $nav.slideDown();
    }, function(error) {
        // An error happened.
        console.log(error);
    });
});
