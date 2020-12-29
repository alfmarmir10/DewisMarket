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
var db = firebase.firestore();

var user = firebase.auth().currentUser;

if (user) {
    console.log(user.name);
} else {
    console.log("Ningún usuario");
}

setCookie("idNegocio-eCommerce", 2009061145, (86400000 * 365));

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

function loadImgMasVendidos(){
    var idNegocio = getCookie("idNegocio-eCommerce");

    db.collection("Negocios").doc(idNegocio).collection("Catalogo").doc("Catalogo")
    .get().then(function(doc) {
        var docs = Array();
        docs.push(doc.data());
        
        var keys = Object.keys(docs[0]);
        // console.log(keys);
        //keys.sort();
        // console.log("Ordenado:"+keys);
        var bandera;
        var i = 0;
        var contadorRow = 1;
        var contadorImagenImpresa = 0;

        var CardBodyMasVendidos = document.getElementById('card-body-mas-vendidos');
        CardBodyMasVendidos.innerHTML = '';

        for(x = keys.length; x > 0; x--){
            i = i + 1;
            bandera = false;
            try{
                if (docs[0][keys[x-1]]['eCommerce'] != undefined){
                    if (docs[0][keys[x-1]]['eCommerce'] == "Sí"){
                        bandera = true;
                    }
                }
            }
            catch{
                bandera = false;
            }

            if (bandera == true){
                contadorImagenImpresa = contadorImagenImpresa + 1;
                console.log(docs[0][keys[x-1]]["Descripcion"]);
                // FALTA AGREGAR UNA BANDERA QUE CUENTE CUANDO SE IMPRIME CADA CARD, no utilizar i para el IF % 5
    
                var btn = document.createElement("button");
                var classBtn = document.createAttribute("class");
                classBtn.value = "btn btn-block bg-warning font-weight-bold";
                btn.setAttributeNode(classBtn);
                btn.textContent = "COMPRAR";
    
                var cardBody2 = document.createElement("div");
                var classCardBody2 = document.createAttribute("class"); 
                classCardBody2.value = "card-body text-center";
                cardBody2.setAttributeNode(classCardBody2);
                cardBody2.appendChild(btn);

                var precio = document.createElement("h1");
                var classPrecio = document.createAttribute("class");
                classPrecio.value = "card-title font-weight-bold text-danger";
                precio.setAttributeNode(classPrecio);
                precio.textContent = "$"+docs[0][keys[x-1]]["PrecioECommerce"];

                var cardBody3 = document.createElement("div");
                var classCardBody3 = document.createAttribute("class"); 
                classCardBody3.value = "card-body text-center";
                cardBody3.setAttributeNode(classCardBody3);
                cardBody3.appendChild(precio);
    
                var descr = document.createElement("h2");
                var classDescr = document.createAttribute("class");
                classDescr.value = "card-title font-weight-bold";
                descr.setAttributeNode(classDescr);
                descr.textContent = docs[0][keys[x-1]]["Descripcion"];

                var cardBody = document.createElement("div");
                var classCardBody = document.createAttribute("class"); 
                classCardBody.value = "card-body text-center";
                cardBody.setAttributeNode(classCardBody);
                cardBody.appendChild(descr);

                var Img = document.createElement("img");
                var classImg = document.createAttribute("class");
                classImg.value = "imgCatalogo card-img-top";
                var IdImg = document.createAttribute("Id");
                var styleImg = document.createAttribute("style"); 
                styleImg.value = "width: 100%; min-width: 100%; min-height: 100%; border: 0px solid black!important;";
                Img.setAttributeNode(styleImg);
                IdImg.value = "img-mas-vendidos"+contadorImagenImpresa;
                Img.setAttributeNode(IdImg);
                var srcImg = document.createAttribute("src");
                srcImg.value = getImgMasVendidos(docs[0][keys[x-1]]["NombreImagenECommerce"], "img-mas-vendidos"+contadorImagenImpresa);
                Img.setAttributeNode(classImg);
                // Img.setAttributeNode(srcImg);

                var card = document.createElement("div");
                var classCard = document.createAttribute("class"); 
                classCard.value = "card shadow-lg bg-black";
                card.setAttributeNode(classCard);
                var styleCard = document.createAttribute("style"); 
                styleCard.value = "width: 100%; min-width: 100%; min-height: 100%; border: 0.5px solid black!important;";
                card.setAttributeNode(styleCard);
                card.appendChild(Img);
                card.appendChild(cardBody);
                card.appendChild(cardBody3);
                card.appendChild(cardBody2);
                
                var col = document.createElement("div");
                var classCol = document.createAttribute("class");
                classCol.value = "col-sm-6 col-md-6 col-lg-3";
                col.setAttributeNode(classCol);
                var styleCol = document.createAttribute("style"); 
                styleCol.value = "padding-bottom: 15px;";
                col.setAttributeNode(styleCol);
                col.appendChild(card);

                console.log("contador: "+contadorImagenImpresa);
                console.log("contadorRow: "+contadorRow);
                if (contadorImagenImpresa == 1){
                    var row = document.createElement("div");
                    var classRow = document.createAttribute("class");
                    classRow.value = "row";
                    row.setAttributeNode(classRow);
                    var idRow = document.createAttribute("id");
                    idRow.value = "1row";
                    row.setAttributeNode(idRow);
                    row.appendChild(col);
                    contadorRow = contadorRow + 1;
                    var parent = document.getElementById("card-body-mas-vendidos");
                    parent.appendChild(row);
                } else {
                    var row = document.getElementById("1row");
                    row.appendChild(col);
                }   
            }
        }
    })
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
            // setCookie("UsuarioLoggedIn", authResult., (86400000 * 365));
            // alert(authResult);
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

function getImgMasVendidos(NombreImagenECommerce, elemento){
    var storageRef = firebase.storage().ref(NombreImagenECommerce);
        storageRef.getDownloadURL().then(function(url) {
            // document.getElementById('mas-vendidos-'+idElement).src = url;
            document.getElementById(elemento).src = url;
        }).catch(function(error) {
            console.error("Error: "+error);
        });
}

// function getImgMasVendidos(idImg, formato, idElement){
//     console.log(idImg+formato);
//     var storageRef = firebase.storage().ref(idImg+formato);
//         storageRef.getDownloadURL().then(function(url) {
//             // var urlString = url;
//             // console.log(urlString);
//             // return urlString;
//             document.getElementById('mas-vendidos-'+idElement).src = url;
            
//         }).catch(function(error) {
//             console.error("Error: "+error);
//         });
// }