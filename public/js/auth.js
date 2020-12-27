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

setCookie("idNegocio-eCommerce", 20009061145, (86400000 * 365));

function loadImgMasVendidos(){
    var idNegocio = getCookie("idNegocio");

    db.collection("Negocios").doc(idNegocio).collection('Catalogo').where('eCom', '==', "Sí").get()
    .then((querySnapshot) => {
        querySnapshot.forEach(function(doc){
            var banderaCosto = true;
            var banderaPrecio = true;
            CB.innerHTML = doc.get("CodigoBarras");
            ID.innerHTML = doc.id;
            
            console.log("Costo:"+getNum(doc.data().UltimoCosto));
            console.log("Precio:"+getNum(doc.data().Precio));



            var CardBodyMasVendidos = document.getElementById('card-body-mas-vendidos');
            CardBodyMasVendidos.innerHTML = '';

            var btn = document.createElement("button");
            var classBtn = document.createAttribute("class");
            classBtn.value = "btn btn-sm bg-warning font-weight-bold";
            btn.setAttributeNode(classBtn);
            btn.textContent = "Añadir a carrito";

            var cardBody2 = document.createElement("div");
            var classCardBody2 = document.createAttribute("class"); 
            classCardBody2.value = "card-body text-center";
            cardBody2.setAttributeNode(classCardBody2);
            cardBody2.appendChild(btn);

            var descr = document.createElement("h5");
            var classDescr = document.createAttribute("class");
            classDescr.value = "card-title font-weight-bold";
            descr.setAttributeNode(classDescr);
            descr.textContent = doc.data().Descripcion;

            var row = document.createElement("div");
            var classRow = document.createAttribute("class");
            classRow.value = "row";
            row.setAttributeNode(classRow);

            var col = document.createElement("div");
            var classCol = document.createAttribute("class");
            classCol.value = "col-sm-6 col-md-6 col-lg-3";
            col.setAttributeNode(classCol);



            var att2 = document.createAttribute("placeholder");
            att2.value = "Selecciona...";
            node.setAttributeNode(att2);
            document.getElementById('tdDescripcion_agregar').appendChild(node);
            
        })
    })
    .catch(function(error){
        alert("Error: "+error);
    });
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    // d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    d.setTime(d.getTime() + exdays);
    var expires = "expires="+d.toUTCString();
    // console.log(d.toUTCString());
    console.log(cname + "=" + cvalue + ";" + expires + ";path=/");
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

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