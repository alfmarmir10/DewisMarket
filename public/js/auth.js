var firebaseConfig = {
    authDomain: "dewis-market.firebaseapp.com",
    apiKey: "AIzaSyBq8D2eR-0shTPiOMvhMc0K12l5ct6bvP0",
    databaseURL: "https://dewis-market.firebaseio.com",
    projectId: "dewis-market",
    storageBucket: "dewis-market.appspot.com",
    messagingSenderId: "548416836870",
    appId: "1:548416836870:web:bf6ee86ede5e2508e8ba87",
    measurementId: "G-K5P6DDFVQ0"
};

firebase.initializeApp(firebaseConfig);

function startOAuth(){

    var ui = new firebaseui.auth.AuthUI(firebase.auth());

    ui.start('#firebaseui-auth-container', {
        callbacks: {
            signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
            },
            uiShown: function() {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
            }
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        signInSuccessUrl: './menuPrincipal.html',
        signInOptions: [
        {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            scopes: [
            'profile',
            'email'
            ],
            customParameters: {
            // Forces account selection even when one account
            // is available.
            prompt: 'select_account'
            }
        },
        {
            provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            scopes: [
            'public_profile',
            'email',
            'user_likes',
            'user_friends'
            ],
            customParameters: {
            // Forces password re-entry.
            auth_type: 'reauthenticate'
            }
        },
        firebase.auth.TwitterAuthProvider.PROVIDER_ID, // Twitter does not support scopes.
        firebase.auth.EmailAuthProvider.PROVIDER_ID // Other providers don't need to be given as object.
        ],
        // Terms of service url.
        tosUrl: '<your-tos-url>',
        // Privacy policy url.
        privacyPolicyUrl: '<your-privacy-policy-url>'
    });
}

function getUserInfo(){
    console.log("Entró");
    var user = firebase.auth().currentUser;

    if (user != null) {
    user.providerData.forEach(function (profile) {
        console.log("Sign-in provider: " + profile.providerId);
        console.log("  Provider-specific UID: " + profile.uid);
        console.log("  Name: " + profile.displayName);
        console.log("  Email: " + profile.email);
        console.log("  Photo URL: " + profile.photoURL);
    });

    }
}

function loadImgCarousel(){
    console.log("Entró Load Img");
    for (i=1; i<= 4; i++){
        var formato = ".png";
        if (i == 1 || i == 3){
            formato = ".webp";
        }
        var storageRef = firebase.storage().ref(i+formato);
        storageRef.getDownloadURL().then(function(url) {
            // var urlString = url;
            // console.log(urlString);
            // return urlString;
            console.log(i);
            document.getElementById('carousel'+i+'').src = url;
            
        }).catch(function(error) {
            console.error("Error: "+error);
        });
    }
    // var url = "img/bg3.jpg"; 
}

function getImgMasVendidos(idImg, formato, idElement){
    console.log(idImg+formato);
    var storageRef = firebase.storage().ref(idImg+formato);
        storageRef.getDownloadURL().then(function(url) {
            // var urlString = url;
            // console.log(urlString);
            // return urlString;
            document.getElementById('mas-vendidos-'+idElement).src = url;
            
        }).catch(function(error) {
            console.error("Error: "+error);
        });
}