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

function validarSesion(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        // User is signed in.
        var displayName = user.displayName;
        

        if (displayName == null){
            window.location.href='./indexLogin.html';
            alert("Por favor inicia sesión.");
            return;
        }
        alert("¡Bienvenido "+displayName+"!");

        document.getElementById('nameUser').innerText = displayName;

        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;

        
        document.getElementById('imgUsuario').src = photoURL;

        var uid = user.uid;
        var phoneNumber = user.phoneNumber;
        var providerData = user.providerData;
        user.getIdToken().then(function(accessToken) {
            // document.getElementById('sign-in-status').textContent = 'Signed in';
            // document.getElementById('sign-in').textContent = 'Sign out';
            // document.getElementById('account-details').textContent = 
            
            JSON.stringify({
            displayName: displayName,
            email: email,
            emailVerified: emailVerified,
            phoneNumber: phoneNumber,
            photoURL: photoURL,
            uid: uid,
            accessToken: accessToken,
            providerData: providerData
            }, null, '  ');
        });
        } else {
        // User is signed out.
        //   document.getElementById('sign-in-status').textContent = 'Signed out';
        //   document.getElementById('sign-in').textContent = 'Sign in';
        window.location.href='./indexLogin.html';
        document.getElementById('account-details').textContent = 'null';
        }
    }, function(error) {
        console.log(error);
    });
}

function salir(){
    firebase.auth().signOut().then(function() {
        alert("Sesión Finalizada correctamente");
        window.location.href="./indexLogin.html";
      }).catch(function(error) {
        alert(error);
      });
}

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
    
                var btn = document.createElement("button");
                var classBtn = document.createAttribute("class");
                var targetBtn = document.createAttribute("btn-target");
                targetBtn.value = keys[x-1];
                btn.setAttributeNode(targetBtn);
                classBtn.value = "btn btn-block btn-lg bg-warning font-weight-bold";
                var nameBtn = document.createAttribute("btn-name");
                nameBtn.value = "btnComprar";
                btn.setAttributeNode(nameBtn);
                btn.setAttributeNode(classBtn);
                btn.textContent = "COMPRAR";
    
                var cardBody4 = document.createElement("div");
                var classCardBody4 = document.createAttribute("class"); 
                classCardBody4.value = "card-body text-center";
                cardBody4.setAttributeNode(classCardBody4);
                cardBody4.appendChild(btn);


                var iPlusSign = document.createElement("i");
                var classIPlusSign = document.createAttribute("class");
                classIPlusSign.value = "fa fa-plus";
                iPlusSign.setAttributeNode(classIPlusSign);

                var btnPlusSign = document.createElement("button");
                var classBtnPlusSign = document.createAttribute("class");
                classBtnPlusSign.value = "button hollow circle bg-white border-0";
                var typeBtnPlusSign = document.createAttribute("type");
                typeBtnPlusSign.value = "button";
                var dataQuantityBtnPlusSign = document.createAttribute("data-quantity");
                dataQuantityBtnPlusSign.value = "plus";
                var styleBtnPlusSign = document.createAttribute("style"); 
                styleBtnPlusSign.value = "min-height: 55px; max-height: 55px; min-width: 55px; max-width: 55px; margin: 5px 5px;";
                var dataFielBtnPlusSign = document.createAttribute("data-field");
                dataFielBtnPlusSign.value = keys[x-1]+"_Field";
                btnPlusSign.setAttributeNode(styleBtnPlusSign);
                btnPlusSign.setAttributeNode(dataFielBtnPlusSign);  
                btnPlusSign.setAttributeNode(dataQuantityBtnPlusSign);  
                btnPlusSign.setAttributeNode(typeBtnPlusSign);  
                btnPlusSign.setAttributeNode(classBtnPlusSign); 
                btnPlusSign.appendChild(iPlusSign); 

                var inputGroupButtonPlus = document.createElement("div");
                var classInputGroupButtonPlus = document.createAttribute("class");
                classInputGroupButtonPlus.value = "input-group-button";
                inputGroupButtonPlus.setAttributeNode(classInputGroupButtonPlus);
                inputGroupButtonPlus.appendChild(btnPlusSign);

                var inputMinusPlusSign = document.createElement("input");
                var classInputMinusPlusSign = document.createAttribute("class");
                classInputMinusPlusSign.value = "input-group-field";
                var typeInputMinusPlusSign = document.createAttribute("type");
                typeInputMinusPlusSign.value = "text";
                var nameInputMinusPlusSign = document.createAttribute("name");
                nameInputMinusPlusSign.value = keys[x-1]+"_Field";
                var idInputMinusPlusSign = document.createAttribute("id");
                idInputMinusPlusSign.value = keys[x-1];
                var styleInputMinusPlusSign = document.createAttribute("style"); 
                styleInputMinusPlusSign.value = "min-height: 40px; max-height: 40px; min-width: 80px; max-width: 80px; margin: 5px 20px; font-size: 30px; text-align: center; vertical-align: sub;";
                var valueInputMinusPlusSign = document.createAttribute("value");
                valueInputMinusPlusSign.value = "0";
                var idInputMinusPlusSign = document.createAttribute("id");
                idInputMinusPlusSign.value = keys[x-1]+"_Cantidad";
                inputMinusPlusSign.setAttributeNode(idInputMinusPlusSign); 
                inputMinusPlusSign.setAttributeNode(styleInputMinusPlusSign);  
                inputMinusPlusSign.setAttributeNode(idInputMinusPlusSign);  
                inputMinusPlusSign.setAttributeNode(valueInputMinusPlusSign);  
                inputMinusPlusSign.setAttributeNode(nameInputMinusPlusSign);  
                inputMinusPlusSign.setAttributeNode(typeInputMinusPlusSign);  
                inputMinusPlusSign.setAttributeNode(classInputMinusPlusSign); 

                var iMinusSign = document.createElement("i");
                var classIMinusSign = document.createAttribute("class");
                classIMinusSign.value = "fa fa-minus";
                iMinusSign.setAttributeNode(classIMinusSign);

                var btnMinusSign = document.createElement("button");
                var classBtnMinusSign = document.createAttribute("class");
                classBtnMinusSign.value = "button hollow circle bg-white border-0";
                var typeBtnMinusSign = document.createAttribute("type");
                typeBtnMinusSign.value = "button";
                var styleBtnMinusSign = document.createAttribute("style"); 
                styleBtnMinusSign.value = "min-height: 55px; max-height: 55px; min-width: 55px; max-width: 55px; margin: 5px 5px;";
                var dataQuantityBtnMinusSign = document.createAttribute("data-quantity");
                dataQuantityBtnMinusSign.value = "minus";
                var dataFielBtnMinusSign = document.createAttribute("data-field");
                dataFielBtnMinusSign.value = keys[x-1]+"_Field";
                btnMinusSign.setAttributeNode(dataFielBtnMinusSign);  
                btnMinusSign.setAttributeNode(styleBtnMinusSign);  
                btnMinusSign.setAttributeNode(dataQuantityBtnMinusSign);  
                btnMinusSign.setAttributeNode(typeBtnMinusSign);  
                btnMinusSign.setAttributeNode(classBtnMinusSign); 
                btnMinusSign.appendChild(iMinusSign); 

                var inputGroupButtonMinus = document.createElement("div");
                var classInputGroupButtonMinus = document.createAttribute("class");
                classInputGroupButtonMinus.value = "input-group-button";
                inputGroupButtonMinus.setAttributeNode(classInputGroupButtonMinus);
                inputGroupButtonMinus.appendChild(btnMinusSign);

                var contenedorInputMinusPlusSign = document.createElement("div");
                var classContenedorInputMinusPlusSign = document.createAttribute("class");
                classContenedorInputMinusPlusSign.value = "input-group plus-minus-input";
                var styleContenedor = document.createAttribute("style"); 
                styleContenedor.value = "display: block!important;";
                contenedorInputMinusPlusSign.setAttributeNode(styleContenedor);
                contenedorInputMinusPlusSign.setAttributeNode(classContenedorInputMinusPlusSign);
                contenedorInputMinusPlusSign.appendChild(btnMinusSign);
                contenedorInputMinusPlusSign.appendChild(inputMinusPlusSign);
                contenedorInputMinusPlusSign.appendChild(btnPlusSign);

                var cardBody3 = document.createElement("div");
                var classCardBody3 = document.createAttribute("class"); 
                classCardBody3.value = "card-body text-center";
                cardBody3.setAttributeNode(classCardBody3);
                cardBody3.appendChild(contenedorInputMinusPlusSign);

                var precio = document.createElement("h1");
                var classPrecio = document.createAttribute("class");
                classPrecio.value = "card-title font-weight-bold text-danger";
                precio.setAttributeNode(classPrecio);
                var idPrecio = document.createAttribute("id");
                idPrecio.value = keys[x-1]+"_Precio";
                precio.setAttributeNode(idPrecio);
                precio.textContent = "$"+docs[0][keys[x-1]]["PrecioECommerce"];

                var cardBody2 = document.createElement("div");
                var classCardBody2 = document.createAttribute("class"); 
                classCardBody2.value = "card-body text-center";
                cardBody2.setAttributeNode(classCardBody2);
                cardBody2.appendChild(precio);

                var codBar = document.createElement("h2");
                var classCodBar = document.createAttribute("hidden");
                codBar.setAttributeNode(classCodBar);
                var idCodBar = document.createAttribute("id");
                idCodBar.value = keys[x-1]+"_CodigoBarras";
                codBar.setAttributeNode(idCodBar);
                codBar.textContent = docs[0][keys[x-1]]["CodigoBarras"];

                var costo = document.createElement("h2");
                var classCosto = document.createAttribute("hidden");
                costo.setAttributeNode(classCosto);
                var idCosto = document.createAttribute("id");
                idCosto.value = keys[x-1]+"_Costo";
                costo.setAttributeNode(idCosto);
                costo.textContent = docs[0][keys[x-1]]["UltimoCosto"];
    
                var descr = document.createElement("h2");
                var classDescr = document.createAttribute("class");
                classDescr.value = "card-title font-weight-bold";
                descr.setAttributeNode(classDescr);
                var idDescripcion = document.createAttribute("id");
                idDescripcion.value = keys[x-1]+"_Descripcion";
                descr.setAttributeNode(idDescripcion);
                descr.textContent = docs[0][keys[x-1]]["Descripcion"];

                var cardBody = document.createElement("div");
                var classCardBody = document.createAttribute("class"); 
                classCardBody.value = "card-body text-center align-items-center d-flex justify-content-center";
                cardBody.setAttributeNode(classCardBody);
                cardBody.appendChild(descr);
                cardBody.appendChild(costo);
                cardBody.appendChild(codBar);

                var Img = document.createElement("img");
                var classImg = document.createAttribute("class");
                classImg.value = "imgCatalogo card-img-top";
                var IdImg = document.createAttribute("Id");
                // var styleImg = document.createAttribute("style"); 
                // // styleImg.value = "width: 100%; min-width: 100%; min-height: 100%; border: 0px solid black!important;";
                // Img.setAttributeNode(styleImg);
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
                styleCard.value = "width: 100%; min-width: 100%; min-height: 100%; max-height: 100%; border: 0.5px solid black!important;";
                card.setAttributeNode(styleCard);
                card.appendChild(Img);
                card.appendChild(cardBody);
                card.appendChild(cardBody2);
                card.appendChild(cardBody3);
                card.appendChild(cardBody4);
                
                var col = document.createElement("div");
                var classCol = document.createAttribute("class");
                classCol.value = "col-sm-6 col-md-6 col-lg-3 col-xl-3";
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