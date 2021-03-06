var firebaseConfig = {
    apiKey: "AIzaSyBq8D2eR-0shTPiOMvhMc0K12l5ct6bvP0",
    authDomain: "dewis-market.firebaseapp.com",
    databaseURL: "https://dewis-market.firebaseio.com",
    projectId: "dewis-market",
    storageBucket: "dewis-market.appspot.com",
    messagingSenderId: "548416836870",
    appId: "1:548416836870:web:bf6ee86ede5e2508e8ba87",
    measurementId: "G-K5P6DDFVQ0"
};

firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
var Usuario = "";
var idNE;


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    // d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    d.setTime(d.getTime() + exdays);
    var expires = "expires="+d.toUTCString();
    // console.log(d.toUTCString());
    console.log(cname + "=" + cvalue + ";" + expires + ";path=/");
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function ValidarFormularioRegistro(){
    var IdNegocio = document.getElementById('idNegocioRegistro').value;
    var Nombre = document.getElementById('nombreRegistro').value;
    var Apellidos = document.getElementById('apellidosRegistro').value;
    var Correo = document.getElementById('correoRegistro').value;
    var Contrasena = document.getElementById('contrasenaRegistro').value;
    var ValidacionContrasena = document.getElementById('validacionContrasenaRegistro').value;

    if ((IdNegocio != "") && (Nombre != "") && (Apellidos != "") && (Correo != "") && (Contrasena != "") && (Contrasena === ValidacionContrasena)){
        if (document.getElementById('btnContinuarRegistro').classList.contains('btn-dark')){
            document.getElementById('btnContinuarRegistro').classList.remove('btn-dark');
            document.getElementById('btnContinuarRegistro').classList.remove('text-white');
            document.getElementById('btnContinuarRegistro').classList.add('btn-warning');
            document.getElementById('btnContinuarRegistro').classList.add('text-dark');
            document.getElementById('btnContinuarRegistro').disabled = false;
        }

    } else {
        if (document.getElementById('btnContinuarRegistro').classList.contains('btn-warning')){
            document.getElementById('btnContinuarRegistro').classList.remove('btn-warning');
            document.getElementById('btnContinuarRegistro').classList.remove('text-dark');
            document.getElementById('btnContinuarRegistro').classList.add('btn-dark');
            document.getElementById('btnContinuarRegistro').classList.add('text-white');
            document.getElementById('btnContinuarRegistro').disabled = true;
        }
        return;
    }
}

function Registrar(){
    console.log("Entró");
    var idNegocio = document.getElementById('idNegocioRegistro').value;
    var nombre = document.getElementById('nombreRegistro').value;
    var apellidos = document.getElementById('apellidosRegistro').value;
    var correo = document.getElementById('correoRegistro').value;
    var contrasena = document.getElementById('validacionContrasenaRegistro').value;
    var bandera = false;
    db.collection("Negocios").doc(idNegocio)
        .get()
        .then(function(doc) {
            if (doc.exists) {
                bandera = true;
                //console.log(doc.id, " => ", doc.data());
                if (bandera) {
                    firebase.auth().createUserWithEmailAndPassword(correo, contrasena)
                    .then(function(User){
                        var docRef = db.collection("Negocios").doc(idNegocio).collection("Usuarios");
                        docRef.add({
                            Nombre: nombre,
                            Apellidos: apellidos,
                            Correo: correo
                        })
                        .then(function(docRef) {
                            console.log("Usuario agregado a BD", docRef.id);
                            $("#idNegocioRegistro").text("");
                            $("#nombreRegistro").text("");
                            $("#apellidosRegistro").text("");
                            $("#correoRegistro").text("");
                            $("#contrasenaRegistro").text("");
                            $("#validacionContrasenaRegistro").text("");
                            alert('¡Usuario creado satisfactoriamente!');
                            $('#inicioSesion-tab').trigger('click');
                        })
                        .catch(function(error) {
                            console.error("Error adding usuario: ", error);
                            alert("Ocurrió algún error, reintenta por favor." + error);
                        });
                    })
                    .catch(function(error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        //window.location.href='Registro.html';
                        if (errorCode === 'auth/email-already-in-use') {
                            alert('El usuario ya está registrado.');
                        } else if (errorCode === 'auth/invalid-email') {
                            alert('Correo no válido, verifica.');
                        } else if (errorCode === 'auth/operation-not-allowed') {
                            alert('Operación no permitida.');
                        } else if (errorCode === 'auth/weak-password') {
                            alert('Contraseña débil. Debe tener al menos 6 caracteres.');
                        } else {
                            alert(errorCode);
                            alert(errorMessage);
                        }
                        console.log(errorCode);
                        console.log(errorMessage);
                    });
                }
            } else {
                alert("El Id de Negocio no existe, verifica, por favor.");
                $("#idNegocioRegistro").focus();
            }
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
            alert("Ocurrió algún error, reintenta por favor." + error);
            $("#IdNegocioRegistro").focus();
        });
}

function IniciarSesion2(){
    var user = firebase.auth().currentUser;
    var email = document.getElementById('correoInicioSesion').value;
    var password = document.getElementById('contrasenaInicioSesion').value;

    if (user) {
        alert(User.name);
    } else {
        alert("Ningún usuario ha accedido.");
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(){
            var idNegocio = document.getElementById('idNegocioInicioSesion').value;
            var banderaNegocio = false;
            var banderaUsuario = false;
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorCode+" "+errorMessage);
            // ...
          });
    }
}

function IniciarSesion(){
    // alert('Entró');
    // localStorage.clear();
    console.log(sessionStorage.length);
    var idNegocio = document.getElementById('idNegocioInicioSesion').value;
    var correo = document.getElementById('correoInicioSesion').value;
    var contrasena = document.getElementById('contrasenaInicioSesion').value;
    var banderaNegocio = false;
    var banderaUsuario = false;
    var usuario = Array();

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log(user);
        } else {
          console.log("Ningún usuario ha iniciado sesión");
        }
      });

    firebase.auth().signInWithEmailAndPassword(correo, contrasena)
    .then(function(User) {
        db.collection("Negocios").doc(idNegocio)
        .get()
        .then(function(doc) {
            console.log("Get Doc Negocio");
            if (doc.exists) {
                console.log("Doc Negocio Existe");
                setCookie("nombreNegocio", doc.data().Nombre, (86400000 * 365));
                
                banderaNegocio = true;

                db.collection("Negocios").doc(idNegocio).collection("Usuarios").where("Correo", "==", correo)
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        banderaUsuario = true;
                        usuario.push(doc.data().Nombre);
                        usuario.push(doc.data().Correo);
                    });

                    if (banderaNegocio && banderaUsuario) {
                        setCookie("username", usuario[0], (86400000 * 365));
                        setCookie("idNegocio", idNegocio, (86400000 * 365));
                        // alert("¡Bienvenido, " + usuario[0] + "!");
                        window.location.href=idNegocio+"/index.html";
                    } else if(!banderaUsuario){
                        alert("¡El usuario no existe en el negocio especificado! \n\nValida por favor.");
                        $("#correoInicioSesion").focus();
                    }
                })
                .catch(function(error) {
                       console.log("Error getting documents: ", error);
                       alert("Ocurrió algún error, reintenta por favor. -->" + error);
                });
            } else {
                if(banderaNegocio == false){
                    alert("¡El Id de Negocio no existe! \n\nValida por favor.");
                    $("#idNegocioInicioSesion").focus();
                }
            }                
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
            alert("Ocurrió algún error, reintenta por favor. -->" + error);
        });
    })
    .catch(function(error) {
        // Handle Errors here.
        console.log(error);
        console.log(errorCode);
        console.log(errorMessage);
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            alert('Contraseña Incorrecta.');
            document.getElementById('contrasenaInicioSesion').focus();
        } else if (errorCode === 'auth/invalid-email') {
            alert('Correo no válido, verifica.');
            document.getElementById('correoInicioSesion').focus();
        } else if (errorCode === 'auth/user-not-found') {
            alert('Usuario no encontrado');
            document.getElementById('correoInicioSesion').focus();
        } else {
            alert(errorCode);
            alert(errorMessage);
        }
        
    });
}

function CerrarSesion(){
    firebase.auth().signOut().then(function() {
        window.location.href='index.html';
        alert('Sesión cerrada exitosamente');
      }).catch(function(error) {
        alert('Imposible cerrar sesión. Contacta al administrador.');
      });
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    FUNCIONES NO UTILIZADAS    /////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




    // const auth = firebase.auth();
    // auth.onAuthStateChanged((user) => {
    // let sessionTimeout = null;
    // if (user === null) {
    //     // User is logged out.
    //     // Clear the session timeout.
    //     alert("No hay usuario");
    //     sessionTimeout && clearTimeout(sessionTimeout);
    //     sessionTimeout = null;
    // } else {
    //     // User is logged in.
    //     // Fetch the decoded ID token and create a session timeout which signs the user out.
    //     user.getIdTokenResult().then((idTokenResult) => {
    //     // Make sure all the times are in milliseconds!
    //     const authTime = idTokenResult.claims.auth_time * 1000;
    //     //const sessionDuration = 1000 * 60 * 60 * 24 * 30;
    //     //alert("Session: " + sessionDuration2);
    //     try{
    //         alert(">0");
    //         sessionDuration2 += 1000 * 60 * 5;
    //         alert(sessionDuration2);
    //     }
    //     catch (error) {
    //         console.log(error);
    //         alert("0");
    //         var sessionDuration2 = 1000 * 60 * 5;
    //     }
    //     const millisecondsUntilExpiration = sessionDuration2 - (Date.now() - authTime);
    //     alert("Milliseconds: " + millisecondsUntilExpiration);
    //     sessionTimeout = setTimeout(() => auth.signOut().then(function() {
    //         window.location.href='index.html';
    //         alert('Sesión cerrada exitosamente');
    //       }), millisecondsUntilExpiration);
    //     });
    // }
    // })






    // var user = firebase.auth().currentUser;

    // if (user) {
    // // User is signed in.
    // } else {
    //       alert("¡Inicia Sesión!");
    //       window.location.href='index.html';
    // }

function AgregarPresentacion(){
    document.getElementById('btnAceptar').disabled = true;
    var Descripcion = document.getElementById('txtDescripcion').value;
    if (Descripcion == "") {
        alert("Escribe algo");
        document.getElementById('txtDescripcion').focus();
        document.getElementById('btnAceptar').disabled = false;
        return;
    }
    var bandera = 0;

    db.collection("Presentacion").where("Descripcion", "==", Descripcion)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            bandera = 1;
        });

        if (bandera == 0){
            db.collection("Presentacion").add({
                Descripcion: Descripcion
            })
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
                alert("Agregado correctamente");
                document.getElementById('txtDescripcion').focus();
                var x = document.getElementById("txtDescripcion");
		        x.value = "";
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
                alert("Ocurrió algún error, reintenta por favor.")
                document.getElementById('txtDescripcion').focus();
            });
        } else {
            alert("¡Esa presentación ya existe!");
            document.getElementById('txtDescripcion').focus();
        }
        document.getElementById('btnAceptar').disabled = false;
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
        alert("Ocurrió algún error, reintenta por favor.")
        document.getElementById('txtDescripcion').focus();
        document.getElementById('btnAceptar').disabled = false;
    });
}



function AgregarFabricante(){
    document.getElementById('btnAceptar').disabled = true;
    var Descripcion = document.getElementById('txtDescripcion').value;
    if (Descripcion == "") {
        alert("Escribe algo");
        document.getElementById('txtDescripcion').focus();
        document.getElementById('btnAceptar').disabled = false;
        return;
    }
    var bandera = 0;

    db.collection("Fabricante").where("Descripcion", "==", Descripcion)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            bandera = 1;
        });

        if (bandera == 0){
            db.collection("Fabricante").add({
                Descripcion: Descripcion
            })
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
                alert("Agregado correctamente");
                document.getElementById('txtDescripcion').focus();
                var x = document.getElementById("txtDescripcion");
		        x.value = "";
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
                alert("Ocurrió algún error, reintenta por favor.")
                document.getElementById('txtDescripcion').focus();
            });
        } else {
            alert("¡Esa fabricante ya existe!");
            document.getElementById('txtDescripcion').focus();
        }
        document.getElementById('btnAceptar').disabled = false;
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
        alert("Ocurrió algún error, reintenta por favor.")
        document.getElementById('txtDescripcion').focus();
        document.getElementById('btnAceptar').disabled = false;
    });
}

function AgregarArticulo(){
    document.getElementById('btnAceptar').disabled = true;
    var Cod = document.getElementById('txtCodBarras').value;
    var Des = document.getElementById('txtDescripcion').value;
    var cmbPres = document.getElementById('cmbPresentacion');
    var Pres = cmbPres.value;
    var cmbCat1 = document.getElementById('cmbCategoria1');
    var Cat1 = cmbCat1.value;
    var cmbCat2 = document.getElementById('cmbCategoria2');
    var Cat2 = cmbCat2.value;
    var cmbFab = document.getElementById('cmbFabricante');
    var Fab = cmbFab.value;

    if (Cod == "" || Des == "") {
        alert("Todos los campos son requeridos");
        document.getElementById('txtCodBarras').focus();
        document.getElementById('btnAceptar').disabled = false;
        return;
    }
    var bandera = 0;

    db.collection("Catalogo").where("CodigoBarras", "==", Cod)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            bandera = 1;
        });

        if (bandera == 0){
            db.collection("Catalogo").add({
                CodigoBarras: Cod,
                Descripcion: Des,
                Presentacion: Pres,
                Categoria1: Cat1,
                Categoria2: Cat2,
                Fabricante: Fab,
                Existencia: 0
            })
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
                alert("Agregado correctamente");
                document.getElementById('txtCodBarras').focus();
                var x = document.getElementById("txtCodBarras");
		        x.value = "";
                var y = document.getElementById("txtDescripcion");
                y.value = "";
                document.getElementById("cmbPresentacion").selectedIndex = 0;
                document.getElementById("cmbCategoria1").selectedIndex = 0;
                document.getElementById("cmbCategoria2").selectedIndex = 0;
                document.getElementById("cmbFabricante").selectedIndex = 0;
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
                alert("Ocurrió algún error, reintenta por favor.")
                document.getElementById('txtCodBarras').focus();
            });
        } else {
            alert("¡Ese código de barras ya existe!");
            document.getElementById('txtCodBarras').focus();
        }
        document.getElementById('btnAceptar').disabled = false;
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
        alert("Ocurrió algún error, reintenta por favor.")
        document.getElementById('txtCodBarras').focus();
        document.getElementById('btnAceptar').disabled = false;
    });
}

function AgregarProveedor(){
    document.getElementById('btnAceptar').disabled = true;
    var Raz = document.getElementById('txtRazonSocial').value;
    var RFC = document.getElementById('txtRFC').value;
    var Calle = document.getElementById('txtCalle').value;
    var NoExt = document.getElementById('txtNoExt').value;
    var NoInt = document.getElementById('txtNoInt').value;
    var Col = document.getElementById('txtColonia').value;
    var Ciu = document.getElementById('txtCiudad').value;
    var Est = document.getElementById('txtEstado').value;
    var CP = document.getElementById('txtCodigoPostal').value;
    var Tel = document.getElementById('txtTelefono').value;

    if (Raz == "") {
        alert("La razón social es indispensable.");
        document.getElementById('txtRazonSocial').focus();
        document.getElementById('btnAceptar').disabled = false;
        return;
    }
    var bandera = 0;

    db.collection("Proveedores").where("RazonSocial", "==", Raz)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            bandera = 1;
        });

        if (bandera == 0){
            db.collection("Proveedores").add({
                RazonSocial: Raz,
                RFC: RFC,
                Calle: Calle,
                NoExt: NoExt,
                NoInt: NoInt,
                Colonia: Col,
                Ciudad: Ciu,
                Estado: Est,
                CodigoPostal: CP,
                Telefono: Tel
            })
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
                alert("Agregado correctamente");
                document.getElementById('txtRazonSocial').focus();
                var a = document.getElementById("txtRazonSocial");
		        a.value = "";
                var b = document.getElementById("txtRFC");
                b.value = "";
                var c = document.getElementById("txtCalle");
		        c.value = "";
                var d = document.getElementById("txtNoExt");
                d.value = "";
                var e = document.getElementById("txtNoInt");
		        e.value = "";
                var f = document.getElementById("txtColonia");
                f.value = "";
                var g = document.getElementById("txtCiudad");
		        g.value = "";
                var h = document.getElementById("txtEstado");
                h.value = "";
                var i = document.getElementById("txtCodigoPostal");
                i.value = "";
                var j = document.getElementById("txtTelefono");
                j.value = "";
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
                alert("Ocurrió algún error, reintenta por favor.")
                document.getElementById('txtRazonSocial').focus();
            });
        } else {
            alert("¡Ese proveedor ya existe!");
            document.getElementById('txtRazonSocial').focus();
        }
        document.getElementById('btnAceptar').disabled = false;
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
        alert("Ocurrió algún error, reintenta por favor.")
        document.getElementById('txtRazonSocial').focus();
        document.getElementById('btnAceptar').disabled = false;
    });
}

function llenarComboBox(Coleccion, IdSelect, Class){

    var documentos;
    //var documentos = Array();

    var getOptions = {source: 'default'};

        db.collection(Coleccion).doc(Coleccion)
        //db.collection(Coleccion).orderBy("Descripcion")
        .get(getOptions)
        .then(function(doc) {
        //.then(function(querySnapshot) {
            //querySnapshot.forEach(function(doc) {
                console.log(doc.id, " => ", doc.data());
                //documentos.push(doc.data().Descripcion);
                documentos = doc.get("Descripcion");
            //});

            var sel = document.createElement('select');
            sel.name = IdSelect;
            sel.id = IdSelect;
            sel.className = Class;

            var i = 0;
            for (const val of documentos){
                // if (i = 0){
                //     var docData = {
                //         Descripcion: [val]
                //     };

                //     db.collection("Cat2").doc("Cat2").set(docData);
                // } else {
                //     db.collection("Cat2").doc("Cat2").update({
                //         Descripcion: firebase.firestore.FieldValue.arrayUnion(val)
                //     }).then(function() {
                //         console.log("Document successfully written!");
                //     });
                // }
                // i = i +1;

                var option = document.createElement("option");
                option.value = val;
                option.text = val.charAt(0).toUpperCase() + val.slice(1);
                sel.appendChild(option);
            };

            document.getElementById(Coleccion).appendChild(sel);

        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
}

function llenarComboBox_Catalogo(Coleccion, IdSelect, Class){

    var documentos;
    //var documentos = Array();

    var getOptions = {source: 'default'};

        db.collection(Coleccion).doc(Coleccion)
        //db.collection(Coleccion).orderBy("Descripcion")
        .get(getOptions)
        .then(function(doc) {
        //.then(function(querySnapshot) {
            //querySnapshot.forEach(function(doc) {
                console.log(doc.id, " => ", doc.data());
                //documentos.push(doc.data().Descripcion);
                documentos = doc.get("Descripcion");
            //});

            var sel = document.createElement('select');
            sel.name = IdSelect;
            sel.id = IdSelect;
            sel.className = Class;

            var i = 0;
            for (const val of documentos){
                // if (i = 0){
                //     var docData = {
                //         Descripcion: [val]
                //     };

                //     db.collection("Cat2").doc("Cat2").set(docData);
                // } else {
                //     db.collection("Cat2").doc("Cat2").update({
                //         Descripcion: firebase.firestore.FieldValue.arrayUnion(val)
                //     }).then(function() {
                //         console.log("Document successfully written!");
                //     });
                // }
                // i = i +1;

                var option = document.createElement("option");
                option.value = val;
                option.text = val.charAt(0).toUpperCase() + val.slice(1);
                sel.appendChild(option);
            };

            document.getElementById(Coleccion).appendChild(sel);

        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
}

function llenarComboBox_Descripcion(Coleccion, IdSelect, Class, NombreDocumento){

    var documentos;
    //var documentos = Array();

    var getOptions = {source: 'default'};

        db.collection(Coleccion).doc(NombreDocumento)
        //db.collection(Coleccion).orderBy("Descripcion")
        .get(getOptions)
        .then(function(doc) {
        //.then(function(querySnapshot) {
            //querySnapshot.forEach(function(doc) {
                console.log(doc.id, " => ", doc.data());
                //documentos.push(doc.data().Descripcion);
                documentos = doc.get("Descripcion");
            //});

            var sel = document.createElement('select');
            sel.name = IdSelect;
            sel.id = IdSelect;
            sel.className = Class;

            var i = 0;
            for (const val of documentos){
                // if (i = 0){
                //     var docData = {
                //         Descripcion: [val]
                //     };

                //     db.collection("Cat2").doc("Cat2").set(docData);
                // } else {
                //     db.collection("Cat2").doc("Cat2").update({
                //         Descripcion: firebase.firestore.FieldValue.arrayUnion(val)
                //     }).then(function() {
                //         console.log("Document successfully written!");
                //     });
                // }
                // i = i +1;

                var option = document.createElement("option");
                option.value = val;
                option.text = val.charAt(0).toUpperCase() + val.slice(1);
                sel.appendChild(option);
            };

            document.getElementById(NombreDocumento).appendChild(sel);
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
}

function llenarComboBox_Proveedores(Coleccion, IdSelect, Class, NombreDocumento){

    var documentos;
    //var documentos = Array();

    var getOptions = {source: 'default'};

        db.collection(Coleccion).doc(NombreDocumento)
        //db.collection(Coleccion).orderBy("Descripcion")
        .get(getOptions)
        .then(function(doc) {
        //.then(function(querySnapshot) {
            //querySnapshot.forEach(function(doc) {
                console.log(doc.id, " => ", doc.data());
                //documentos.push(doc.data().Descripcion);
                documentos = doc.get("RazonSocial");
            //});

            var sel = document.createElement('select');
            sel.name = IdSelect;
            sel.id = IdSelect;
            sel.className = Class;

            var i = 0;
            for (const val of documentos){
                // if (i = 0){
                //     var docData = {
                //         Descripcion: [val]
                //     };

                //     db.collection("Cat2").doc("Cat2").set(docData);
                // } else {
                //     db.collection("Cat2").doc("Cat2").update({
                //         Descripcion: firebase.firestore.FieldValue.arrayUnion(val)
                //     }).then(function() {
                //         console.log("Document successfully written!");
                //     });
                // }
                // i = i +1;

                var option = document.createElement("option");
                option.value = val;
                option.text = val.charAt(0).toUpperCase() + val.slice(1);
                sel.appendChild(option);
            };

            document.getElementById(NombreDocumento).appendChild(sel);
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
}

function crearArrayFirestore1Columna(Coleccion, NombreDocumento){

    var documentos = Array();
    var getOptions = {source: 'default'};
        db.collection(Coleccion).orderBy("Descripcion")
        .get(getOptions)
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                console.log(doc.id, " => ", doc.data());
                documentos.push(doc.data().Descripcion);
            });

            var i = 0;
            for (const val of documentos){
                if (i = 0){
                    var docData = {
                        Descripcion: [val]
                    };

                    db.collection(Coleccion).doc(NombreDocumento).set(docData);
                } else {
                    db.collection(Coleccion).doc(NombreDocumento).update({
                        Descripcion: firebase.firestore.FieldValue.arrayUnion(val)
                    }).then(function() {
                        console.log("Document successfully written!");
                    });
                }
                i = i +1;
            };
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
}

function CargarCatalogoo(){
    var tabla = document.getElementById('tabla_catalogo').getElementsByTagName('tbody')[0];
    tabla.innerHTML = '';
    var i = 0;
    db.collection("Catalogo").orderBy("Descripcion")
    .get().then((querySnapshot) => {
        querySnapshot.forEach(function(doc) {
            i = i + 1;
            console.log(doc.id, " => ", doc.data().Descripcion);
            if (doc.id != 'Desc'){
                var msg =
                '<tr><th scope="row">'+i+'</th><td>'+doc.data().CodigoBarras+'</td><td>'+doc.data().Descripcion+'</td><td>'+doc.data().Presentacion+'</td><td>'+doc.data().Categoria1+'</td><td>'+doc.data().Categoria2+'</td><td>'+doc.data().Fabricante+'</td></tr>';
                var newRow  = tabla.insertRow(tabla.rows.length);
                newRow.innerHTML = msg;
            }
        });
        var d = new Date();
        var nombreArchivo = 'Catálogo '+d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+'  '+d.getHours()+':'+d.getMinutes();
        PDFCatalogo(nombreArchivo);
        document.getElementById("cmbDescripcion").selectedIndex = 0;
        document.getElementById("cmbCategoria1").selectedIndex = 0;
        document.getElementById("cmbCategoria2").selectedIndex = 0;
        document.getElementById("cmbFabricante").selectedIndex = 0;
    });
}

function getInfoProducto_agregar_NE(descripcion){
    var CB = document.getElementById('tdCodigoBarras_agregar');
    var ID = document.getElementById('tdIdArticulo_agregar');
    CB.innerHTML = '';
    ID.innerHTML = '';
    //var codigo = tabla.getElementById('tdCodigoBarras_agregar')[0];

    db.collection('Catalogo').where('Descripcion', '==', descripcion).get()
    .then((querySnapshot) => {
        querySnapshot.forEach(function(doc){
            CB.innerHTML = doc.get("CodigoBarras");
            ID.innerHTML = doc.id;
            console.log("ID: "+ doc.id);
            $("#tdCantidad_agregar").focus();
        })
    })
    .catch(function(error){
        alert("Error: "+error);
    });
}

function agregarElementosNE(CB, Id, Des, Can, Cos, Tot, Prov, Fol){
    //alert("Código Barras: "+CB+"Código Barras: "+CB+"Id: "+Id+"Can: "+Can+"Costo: "+Cos+"Total: "+Tot+"Proveedor: "+Prov+"Folio: "+Fol);
    document.getElementById('btnAgregarATabla').disabled = true;
    idNE = $("#folio_Documento").text();
    var fecha = $("#dia").text()+'/'+$("#mes").text()+'/'+$("#anio").text();
    var hora = $("#hora").text()+':'+$("#minutos").text()+':'+$("#segundos").text();

    var docRef = db.collection("NotasEntrada").doc(idNE);

    docRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("Nota Entrada ya existe:", doc.data());
            docRef = db.collection("NotasEntrada").doc(idNE).collection("Articulos");
                docRef.add({
                    CodigoBarras: CB,
                    Id: Id,
                    Descripcion: Des,
                    Cantidad: Can,
                    Costo: Cos,
                    Total: Tot,
                    Creado: firebase.firestore.Timestamp.now(),
                    DocOrigen: idNE
                })
                .then(function(docRef) {
                    console.log("Artículo Agregado a Nota Entrada.", docRef.id);
                    document.getElementById("cmbDescripcion").selectedIndex = 0;
                    document.getElementById('cmbDescripcion').focus();
                    $("#tdCodigoBarras_agregar").text("");
                    $("#tdCantidad_agregar").text("");
                    $("#tdCosto_agregar").text("");
                    $("#tdTotal_agregar").text("");
                    document.getElementById('btnAgregarATabla').disabled = false;

                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                    alert("Ocurrió algún error, reintenta por favor." + error);
                });
        } else {
            console.log("Nota Entrada NO EXISTE, creando");
            firebase.auth().
            onAuthStateChanged(function(user) {
                Usuario = user.email;
                docRef.set({
                    Fecha: fecha,
                    Hora: hora,
                    Folio: Fol,
                    Proveedor: Prov,
                    Usuario: Usuario,
                    Creado: firebase.firestore.Timestamp.now(),
                    Estatus: "No Confirmado"
                })
                .then(function() {
                    console.log("Nota Entrada CREADA con éxito. Agregando artículo.");
                    docRef = db.collection("NotasEntrada").doc(idNE).collection("Articulos");
                    docRef.add({
                        CodigoBarras: CB,
                        Id: Id,
                        Descripcion: Des,
                        Cantidad: Can,
                        Costo: Cos,
                        Total: Tot,
                        Creado: firebase.firestore.Timestamp.now(),
                        DocOrigen: idNE
                    })
                    .then(function(docRef) {
                        console.log("Artículo Agregado a Nota Entrada.", docRef.id);
                        document.getElementById("cmbDescripcion").selectedIndex = 0;
                        document.getElementById('cmbDescripcion').focus();
                        $("#tdCodigoBarras_agregar").text("");
                        $("#tdCantidad_agregar").text("");
                        $("#tdCosto_agregar").text("");
                        $("#tdTotal_agregar").text("");
                        document.getElementById('btnAgregarATabla').disabled = false;


                        db.collection("NotasEntrada").doc(idNE).collection("Articulos").orderBy("Creado")
                        .onSnapshot(function(querySnapshot) {
                            //alert(idNE);
                            var tablaNE = document.getElementById('tablaNE').getElementsByTagName('tbody')[0];
                            tablaNE.innerHTML = '';
                            document.getElementById('btnConfirmar').hidden = true;
                            var i = 0;
                            var articulos = [];
                            var msg2 = "";
                            querySnapshot.forEach(function(doc) {
                                //alert(doc.ref.path);
                                document.getElementById('btnConfirmar').hidden = false;
                                var path = doc.ref.path;
                                var firstIndex = path.indexOf('/');
                                var secondIndex = path.indexOf('/', firstIndex + 1);
                                var extractIdNE = path.slice(firstIndex + 1, secondIndex);
                                //alert(extractIdNE);
                                var x = "";
                                x = doc.data().Descripcion;
                                //alert(doc.id);
                                i += 1;
                                articulos.push(doc.data().Descripcion);
                                msg2 = msg2 + "<tr>"
                                                +"<th scope='row'>"+i+"</th>"
                                                +"<td>"+doc.data().CodigoBarras+"</td>"
                                                +"<td>"+doc.data().Descripcion+"</td>"
                                                +"<td>"+doc.data().Cantidad+"</td>"
                                                +"<td>"+doc.data().Costo+"</td>"
                                                +"<td>"+doc.data().Total+"</td>"
                                                +"<td><button id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=eliminarElementosNE(this);>Eliminar</button></td>"
                                            +"</tr>";
                            });

                            $("#tbodyNE").html(msg2);
                        });
                    })
                    .catch(function(error) {
                        console.error("Error adding document: ", error);
                        alert("Ocurrió algún error, reintenta por favor." + error)
                    });
                })
                .catch(function(error) {
                    console.log("Error adding document: ", error);
                });
                // doc.data() will be undefined in this case
            });
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function confirmarNE(){
  idNE = $("#folio_Documento").text();
  var docRef = db.collection("NotasEntrada").doc(idNE);
  var cambios = {
    Estatus: "Confirmado"
  };

  docRef.set(cambios).then(function(){
    console.log("Nota Confirmada");
  });

}

function editarElementosNE(Id){

}

function eliminarElementosNE(btn) {
    db.collection("NotasEntrada").doc(btn.id).collection("Articulos").doc(btn.name).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}

function CargarCatalogoFiltroDescripcion(criterio){
    var tabla = document.getElementById('tabla_catalogo').getElementsByTagName('tbody')[0];
    tabla.innerHTML = '';
    var i = 0;
    db.collection("Catalogo").where('Descripcion', '==', criterio)
    .get().then((querySnapshot) => {
        querySnapshot.forEach(function(doc) {
            i = i + 1;
            console.log(doc.id, " => ", doc.data().Descripcion);
            if (doc.id != 'Desc'){
                var msg =
                '<tr><th scope="row">'+i+'</th><td>'+doc.data().CodigoBarras+'</td><td>'+doc.data().Descripcion+'</td><td>'+doc.data().Presentacion+'</td><td>'+doc.data().Categoria1+'</td><td>'+doc.data().Categoria2+'</td><td>'+doc.data().Fabricante+'</td></tr>';
                var newRow  = tabla.insertRow(tabla.rows.length);
                newRow.innerHTML = msg;
            }
        });

        document.getElementById("cmbCategoria1").selectedIndex = 0;
        document.getElementById("cmbCategoria2").selectedIndex = 0;
        document.getElementById("cmbFabricante").selectedIndex = 0;
    });
}

function CargarCatalogoFiltroCategoria1(criterio){
    var tabla = document.getElementById('tabla_catalogo').getElementsByTagName('tbody')[0];
    tabla.innerHTML = '';
    var i = 0;
    db.collection("Catalogo").where('Categoria1', '==', criterio).orderBy('Descripcion')
    .get().then((querySnapshot) => {
        querySnapshot.forEach(function(doc) {
            i = i + 1;
            console.log(doc.id, " => ", doc.data().Descripcion);
            if (doc.id != 'Desc'){
                var msg =
                '<tr><th scope="row">'+i+'</th><td>'+doc.data().CodigoBarras+'</td><td>'+doc.data().Descripcion+'</td><td>'+doc.data().Presentacion+'</td><td>'+doc.data().Categoria1+'</td><td>'+doc.data().Categoria2+'</td><td>'+doc.data().Fabricante+'</td></tr>';
                var newRow  = tabla.insertRow(tabla.rows.length);
                newRow.innerHTML = msg;
            }
        });

        document.getElementById("cmbDescripcion").selectedIndex = 0;
        document.getElementById("cmbCategoria2").selectedIndex = 0;
        document.getElementById("cmbFabricante").selectedIndex = 0;
    });
}

function CargarCatalogoFiltroCategoria2(criterio){
    var tabla = document.getElementById('tabla_catalogo').getElementsByTagName('tbody')[0];
    tabla.innerHTML = '';
    var i = 0;
    db.collection("Catalogo").where('Categoria2', '==', criterio).orderBy('Descripcion')
    .get().then((querySnapshot) => {
        querySnapshot.forEach(function(doc) {
            i = i + 1;
            console.log(doc.id, " => ", doc.data().Descripcion);
            if (doc.id != 'Desc'){
                var msg =
                '<tr><th scope="row">'+i+'</th><td>'+doc.data().CodigoBarras+'</td><td>'+doc.data().Descripcion+'</td><td>'+doc.data().Presentacion+'</td><td>'+doc.data().Categoria1+'</td><td>'+doc.data().Categoria2+'</td><td>'+doc.data().Fabricante+'</td></tr>';
                var newRow  = tabla.insertRow(tabla.rows.length);
                newRow.innerHTML = msg;
            }
        });

        document.getElementById("cmbDescripcion").selectedIndex = 0;
        document.getElementById("cmbCategoria1").selectedIndex = 0;
        document.getElementById("cmbFabricante").selectedIndex = 0;
    });
}

function CargarCatalogoFiltroFabricante(criterio){
    var tabla = document.getElementById('tabla_catalogo').getElementsByTagName('tbody')[0];
    tabla.innerHTML = '';
    var i = 0;
    db.collection("Catalogo").where('Fabricante', '==', criterio).orderBy('Descripcion')
    .get().then((querySnapshot) => {
        querySnapshot.forEach(function(doc) {
            i = i + 1;
            console.log(doc.id, " => ", doc.data().Descripcion);
            if (doc.id != 'Desc'){
                var msg =
                '<tr><th scope="row">'+i+'</th><td>'+doc.data().CodigoBarras+'</td><td>'+doc.data().Descripcion+'</td><td>'+doc.data().Presentacion+'</td><td>'+doc.data().Categoria1+'</td><td>'+doc.data().Categoria2+'</td><td>'+doc.data().Fabricante+'</td></tr>';
                var newRow  = tabla.insertRow(tabla.rows.length);
                newRow.innerHTML = msg;
            }
        });

        document.getElementById("cmbDescripcion").selectedIndex = 0;
        document.getElementById("cmbCategoria1").selectedIndex = 0;
        document.getElementById("cmbCategoria2").selectedIndex = 0;
    });
}

function PDFCatalogo(nombreArchivo){
    var element = document.getElementById('body');
    var opt = {
    margin:       0,
    filename:     nombreArchivo,
    image:        { type: 'jpeg', quality: 0.98 },
    //html2canvas:  { scale: 2 },
    html2canvas: {dpi: 96, letterRendering: true },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // New Promise-based usage:
    html2pdf().set(opt).from(element).save();


}

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone debe ir primero porque su UA tambien contiene "Android"
   if (/windows phone/i.test(userAgent)) {
      return "Windows Phone";
   }

   if (/android/i.test(userAgent)) {
      return "Android";
  }

       if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "iOS";
  }

  return "desconocido";
  }
