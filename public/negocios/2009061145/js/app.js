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
var idNE;
var idVenta;
var listenerTablaNE;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////   FUNCIONES UTILIZADAS  ///////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function calcularTotal(){
    var cantidad = $("#tdCantidad_agregar").text();
    var precio;
    if ($("#tdPrecio_agregar").text() == ""){
        precio = 0;
    } else {
        precio = $("#tdPrecio_agregar").text();
    }
    var total;
    total = (cantidad * precio).toFixed(2);
    $("#tdTotal_agregar").html(total);
    console.log(precio);
    if (parseFloat(precio) > 0){
        var costo = $("#tdCosto_agregar").text();
        var ganancia;
        ganancia = ((precio - costo) * cantidad).toFixed(2);
        $("#tdGanancia_agregar").html(ganancia);
    }
 }

function getInfoProducto_agregar_Ventas_codigo_barras(codigo){
    var idNegocio = getCookie("idNegocio");
    var CB = document.getElementById('tdCodigoBarras_agregar');
    CB.innerHTML = '';
    CB.innerHTML = codigo;
    var DES = document.getElementById('cmbDescripcion');
    var ID = document.getElementById('tdIdArticulo_agregar');
    ID.innerHTML = '';
    var Prec = document.getElementById('tdPrecio_agregar');
    Prec.innerHTML = '';
    var Cos = document.getElementById('tdCosto_agregar');
    Cos.innerHTML = '';
    //var codigo = tabla.getElementById('tdCodigoBarras_agregar')[0];
    var bandera = false;

    db.collection("Negocios").doc(idNegocio).collection('Catalogo').where('CodigoBarras', '==', codigo).get()
    .then((querySnapshot) => {
        querySnapshot.forEach(function(doc){
            // DES.innerHTML='';
            DES.value = doc.get("Descripcion");
            ID.innerHTML = doc.id;
            Prec.innerHTML = doc.get("Precio");
            Cos.innerHTML = doc.get("UltimoCosto");
            console.log("ID: "+ doc.id);
            $("#tdCantidad_agregar").focus();
            bandera = true;
            calcularTotal();
        })
        if (bandera == false){
            alert("Ese código de barras no existe");
        }
    })
    .catch(function(error){
        alert("Error: "+error);
    });


}

function getInfoProducto_agregar_Ventas_descripcion(descripcion){
    var idNegocio = getCookie("idNegocio");
    var CB = document.getElementById('tdCodigoBarras_agregar');
    var ID = document.getElementById('tdIdArticulo_agregar');
    CB.innerHTML = '';
    ID.innerHTML = '';
    var Prec = document.getElementById('tdPrecio_agregar');
    Prec.innerHTML = '';
    var Cos = document.getElementById('tdCosto_agregar');
    Cos.innerHTML = '';
    //var codigo = tabla.getElementById('tdCodigoBarras_agregar')[0];

    db.collection("Negocios").doc(idNegocio).collection('Catalogo').where('Descripcion', '==', descripcion).get()
    .then((querySnapshot) => {
        querySnapshot.forEach(function(doc){
            CB.innerHTML = doc.get("CodigoBarras");
            ID.innerHTML = doc.id;
            Prec.innerHTML = doc.get("Precio");
            Cos.innerHTML = doc.get("UltimoCosto");
            console.log("ID: "+ doc.id);
            $("#tdCantidad_agregar").focus();
            calcularTotal();
        })
    })
    .catch(function(error){
        alert("Error: "+error);
    });
}

function editarClienteVentas(prov){

    var fecha7 = new Date();
    var idNegocio = getCookie("idNegocio");
    var f = $("#docOrigen").html();
    var documentos = Array();

    if (f != ""){
        idVenta = f;
    }

    var docRef = db.collection("Negocios").doc(idNegocio).collection("Ventas").doc(idVenta);
    docRef.update({
        Proveedor: prov
    })
    .then(function(){
        db.collection("Negocios").doc(idNegocio).collection("Ventas").doc(idVenta)
        .get()
        .then(function(doc) {
            documentos.push(doc.data());
            db.collection("Negocios").doc(idNegocio).collection("Ventas").doc("Ventas").collection(fecha7.getFullYear().toString()).doc(validarFecha(fecha7)[1].toString())
            .update({
                [documentos[0]["DocOrigen"]]:{
                    Creado: documentos[0]["Creado"],
                    Fecha: documentos[0]["Fecha"],
                    Folio: documentos[0]["Folio"],
                    Hora: documentos[0]["Hora"],
                    Proveedor: documentos[0]["Proveedor"],
                    Usuario: documentos[0]["Usuario"],
                    DocOrigen: documentos[0]["DocOrigen"],
                    Articulos: documentos[0]["Articulos"],
                    Total: documentos[0]["Total"]
                }
            })
            alert("Proveedor actualizado correctamente.")
        })
    })
    .catch(function(error){
        console.error("Error actualizando Proveedor de NE: ", error);
    });
}

function agregarElementosVentas(CB, Id, Des, Can, Prec, Tot, Cli, Fol, Cos, Gan){
    var creado = firebase.firestore.Timestamp.now();
    var fecha7 = new Date();
    var idNegocio = getCookie("idNegocio");
    var anio = $("#anio").text();
    var mes = $("#mes").text();
    var fecha = $("#anio").text()+$("#mes").text()+$("#dia").text();
    var fecha2 = $("#dia").text()+"-"+$("#mes").text()+"-"+$("#anio").text();
    var hora = $("#hora").text()+$("#minutos").text()+$("#segundos").text();
    var hora2 = $("#hora").text()+":"+$("#minutos").text()+":"+$("#segundos").text();
    idVenta = Fol;
    var f = $("#docOrigen").html();
    var h2 = $("#fecha2").html();
    var f2 = $("#hora2").html();
    if (f != ""){
        idVenta = f;
    }
    if (h2 != ""){
        hora2 = h2;
    }
    if (f2 != ""){
        fecha2 = f2;
    }

    var bandera = false;
    document.getElementById('btnAgregarATabla').disabled = true;
    var docRef = db.collection("Negocios").doc(idNegocio).collection("Ventas").doc(anio).collection(mes).doc(idVenta);

    docRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("Folio de Venta ya existe:", doc.data());

            $("docOrigen").html(idVenta);
            db.collection("Negocios").doc(idNegocio).collection('Ventas').doc(idVenta).collection("Articulos").where('CodigoBarras', '==', CB)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach(function(){
                    bandera = true;
                })
                if (bandera == false){
                    docRef = db.collection("Negocios").doc(idNegocio).collection("Ventas").doc(idVenta).collection("Articulos");
                    docRef.add({
                        CodigoBarras: CB,
                        Id: Id,
                        Descripcion: Des,
                        Cantidad: parseFloat(Can),
                        Precio: parseFloat(Prec),
                        Total: parseFloat(Tot),
                        Costo: parseFloat(Cos),
                        Ganancia: parseFloat(Gan),
                        Creado: creado,
                        DocOrigen: idVenta,
                        Estatus: "No Aplicado"
                    })
                    .then(function(docRef) {
                        console.log("Artículo Agregado a Folio de Venta.", docRef.id);
                        
                        var DES = document.getElementById('tdDescripcion_agregar');
                        DES.innerHTML = '';
                        var node = document.createElement("input");
                        var att = document.createAttribute("id");
                        att.value = "Catalogo";
                        node.setAttributeNode(att);
                        var att2 = document.createAttribute("placeholder");
                        att2.value = "Selecciona...";
                        node.setAttributeNode(att2);
                        document.getElementById('tdDescripcion_agregar').appendChild(node);

                        // $("#cmbDescripcion").text("");
                        $("#tdCodigoBarras_agregar").text("");
                        $("#tdCantidad_agregar").text("");
                        $("#tdPrecio_agregar").text("");
                        $("#tdGanancia_agregar").text("");
                        $("#tdCosto_agregar").text("");
                        $("#tdTotal_agregar").text("");
                        document.getElementById('btnAgregarATabla').disabled = false;

                        llenarComboBox("Catalogo", "cmbDescripcion", "form-control");
    
                        db.collection("Negocios").doc(idNegocio).collection("Ventas").doc(anio).collection(mes).doc(idVenta).collection("Articulos").where('CodigoBarras', '==', CB)
                        .get()
                        .then(function(querySnapshot) {
                            // document.getElementById('tbodyNE').innerHTML = '';
                            querySnapshot.forEach(function(doc) {
                                var docIdCatalogo = doc.data().Id;
                                var docId = doc.id;
                                var costo = doc.data().Costo;
                                var cantidad = doc.data().Cantidad;
                                var updateRef = db.collection("Negocios").doc(idNegocio).collection('Catalogo').doc(doc.data().Id);
                                updateRef.update({
                                    Existencia: firebase.firestore.FieldValue.increment(cantidad * -1),
                                })
                                .then(function(){
                                    console.log("Existencia actualizada.");
                                    updateRef = db.collection("Negocios").doc(idNegocio).collection("Catalogo").doc(docIdCatalogo).collection("HistoricoVentas").doc(anio).collection("Dia");
                                    updateRef.update({
                                        [fecha2]: firebase.firestore.FieldValue.increment(cantidad * -1),
                                    })






                                    db.collection("Negocios").doc(idNegocio).collection("Catalogo").doc(docIdCatalogo).collection("HistoricoVentas").doc(anio).collection("Dia")
                                    .get()
                                    .then(function(doc){
                                        var x = doc.data().idVenta;
                                        if (x != undefined) {
                                            db.collection("Negocios").doc(idNegocio).collection("Catalogo").doc(docIdCatalogo).collection("HistoricoCostos").doc(anio)
                                            .update({
                                                [[idVenta]+".UltModif"]: firebase.firestore.Timestamp.now(),
                                                [[idVenta]+".UltCosto"]: costo,
                                                [[idVenta]+".Estatus"]: "Aplicado"
                                            })
                                            .then(function(){
                                                console.log("Historico Costos ACTUALIZADO correctamente");
                                                updateRef = db.collection("Negocios").doc(idNegocio).collection('Ventas').doc(idVenta).collection("Articulos").doc(docId);
                                                updateRef.update({
                                                    Estatus: "Aplicado"
                                                })
                                                .then(function(){
                                                    console.log("Estatus actualizado.");
                                                    db.collection("Negocios").doc(idNegocio).collection("Ventas").doc(idVenta).collection("Articulos").orderBy("Creado")
                                                    .get()
                                                    .then(function(querySnapshot){
                                                        var tablaNE = document.getElementById('tablaNE').getElementsByTagName('tbody')[0];
                                                        tablaNE.innerHTML = '';
                                                    //   document.getElementById('btnFinalizar').hidden = true;
                                                        var i = 0;
                                                        var msg2 = "";

                                                        var docs = [];
                                                        querySnapshot.forEach(function(doc) {
                                                            docs.push(doc.data().Descripcion);
                                                            i += 1;
                                                            // msg3 = "<script> var docOrigen= '"+ doc.data().DocOrigen +"'; </script>";
                                                            if (doc.data().Estatus == "Aplicado"){
                                                            msg2 = msg2 + "<tr>"
                                                            +"<th scope='row' style='text-align: center' id='"+doc.id+"_Num'>"+i+"</th>"
                                                            +"<td style='text-align: center' id='"+doc.id+"_CodigoBarras'>"+doc.data().CodigoBarras+"</td>"
                                                            +"<td style='text-align: center' id='"+doc.id+"_Descripcion'>"+doc.data().Descripcion+"</td>"
                                                            +"<td style='text-align: center' id='Cantidad'>"+doc.data().Cantidad+"</td>"
                                                            +"<td style='text-align: center' id='"+doc.id+"_Costo'>"+doc.data().Costo+"</td>"
                                                            +"<td style='text-align: center' id='Total'>"+doc.data().Total+"</td>"
                                                            +"<td style='text-align: center'><button class='btn btn-danger btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=eliminarElementosNE(this);>Eliminar</button></td>"
                                                            +"</tr>";
                                                            } else {
                                                            msg2 = msg2 + "<tr>"
                                                            +"<th scope='row' style='text-align: center' id='"+doc.id+"_Num'>"+i+"</th>"
                                                            +"<td style='text-align: center' id='"+doc.id+"_CodigoBarras'>"+doc.data().CodigoBarras+"</td>"
                                                            +"<td style='text-align: center' id='"+doc.id+"_Descripcion'>"+doc.data().Descripcion+"</td>"
                                                            +"<td style='text-align: center' id='Cantidad'>"+doc.data().Cantidad+"</td>"
                                                            +"<td style='text-align: center' id='"+doc.id+"_Costo'>"+doc.data().Costo+"</td>"
                                                            +"<td style='text-align: center' id='Total'>"+doc.data().Total+"</td>"
                                                            +"<td style='text-align: center'><button class='btn btn-danger btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=eliminarElementosNE(this);>Eliminar</button></td>"
                                                            +"<td style='text-align: center'><button class='btn btn-success btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=aplicarElementosNE(this);>Aplicar</button></td>"
                                                            +"</tr>";
                                                            }
                                                        });
                                                    //   if (i>0){
                                                    //       document.getElementById('btnFinalizar').hidden = false;
                                                    //       document.getElementById('btnFinalizar').disabled = false;
                                                    //   }
                                                        $("#tbodyNE").html(msg2);
                                                        // console.log("Current cities in CA: ", docs.join(", "));
                                                        // alert(docs);
                                                        document.getElementById('btnAgregarATabla').disabled = false;
                                                        totalizarNE(Fol);
                                                    });
                                                })
                                                .catch(function(error){
                                                    console.error("Error updating status of document: ", error);
                                                });
                                            })
                                            .catch(function(error){
                                                console.error("Error updating status of document: ", error);
                                            })
                                        } else {
                                            firebase.auth().
                                            onAuthStateChanged(function(user) {
                                                Usuario = user.email;
                                                db.collection("Negocios").doc(idNegocio).collection("Catalogo").doc(docIdCatalogo).collection("HistoricoCostos").doc(anio)
                                                .update({
                                                    [[idVenta]+".Fecha"]: fecha2,
                                                    [[idVenta]+".Hora"]: hora2,
                                                    [[idVenta]+".Folio"]: Fol,
                                                    [[idVenta]+".Proveedor"]: Prov,
                                                    [[idVenta]+".Usuario"]: Usuario,
                                                    [[idVenta]+".Creado"]: firebase.firestore.Timestamp.now(),
                                                    [[idVenta]+".UltModif"]: firebase.firestore.Timestamp.now(),
                                                    [[idVenta]+".DocOrigen"]: idVenta,
                                                    [[idVenta]+".Costo"]: costo,
                                                    [[idVenta]+".UltCosto"]: costo,
                                                    [[idVenta]+".Estatus"]:"Aplicado"
                                                })
                                                .then(function(){
                                                    console.log("Historico Costos ESTABLECIDO correctamente");
                                                    updateRef = db.collection("Negocios").doc(idNegocio).collection('Ventas').doc(idVenta).collection("Articulos").doc(docId);
                                                    updateRef.update({
                                                        Estatus: "Aplicado"
                                                    })
                                                    .then(function(){
                                                        console.log("Estatus actualizado.");
                                                        db.collection("Negocios").doc(idNegocio).collection("Ventas").doc(idVenta).collection("Articulos").orderBy("Creado")
                                                        .get()
                                                        .then(function(querySnapshot){
                                                            var tablaNE = document.getElementById('tablaNE').getElementsByTagName('tbody')[0];
                                                            tablaNE.innerHTML = '';
                                                        //   document.getElementById('btnFinalizar').hidden = true;
                                                            var i = 0;
                                                            var msg2 = "";

                                                            var docs = [];
                                                            querySnapshot.forEach(function(doc) {
                                                                docs.push(doc.data().Descripcion);
                                                                i += 1;
                                                                // msg3 = "<script> var docOrigen= '"+ doc.data().DocOrigen +"'; </script>";
                                                                if (doc.data().Estatus == "Aplicado"){
                                                                msg2 = msg2 + "<tr>"
                                                                +"<th scope='row' style='text-align: center' id='"+doc.id+"_Num'>"+i+"</th>"
                                                                +"<td style='text-align: center' id='"+doc.id+"_CodigoBarras'>"+doc.data().CodigoBarras+"</td>"
                                                                +"<td style='text-align: center' id='"+doc.id+"_Descripcion'>"+doc.data().Descripcion+"</td>"
                                                                +"<td style='text-align: center' id='Cantidad'>"+doc.data().Cantidad+"</td>"
                                                                +"<td style='text-align: center' id='"+doc.id+"_Costo'>"+doc.data().Costo+"</td>"
                                                                +"<td style='text-align: center' id='Total'>"+doc.data().Total+"</td>"
                                                                +"<td style='text-align: center'><button class='btn btn-danger btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=eliminarElementosNE(this);>Eliminar</button></td>"
                                                                +"</tr>";
                                                                } else {
                                                                msg2 = msg2 + "<tr>"
                                                                +"<th scope='row' style='text-align: center' id='"+doc.id+"_Num'>"+i+"</th>"
                                                                +"<td style='text-align: center' id='"+doc.id+"_CodigoBarras'>"+doc.data().CodigoBarras+"</td>"
                                                                +"<td style='text-align: center' id='"+doc.id+"_Descripcion'>"+doc.data().Descripcion+"</td>"
                                                                +"<td style='text-align: center' id='Cantidad'>"+doc.data().Cantidad+"</td>"
                                                                +"<td style='text-align: center' id='"+doc.id+"_Costo'>"+doc.data().Costo+"</td>"
                                                                +"<td style='text-align: center' id='Total'>"+doc.data().Total+"</td>"
                                                                +"<td style='text-align: center'><button class='btn btn-danger btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=eliminarElementosNE(this);>Eliminar</button></td>"
                                                                +"<td style='text-align: center'><button class='btn btn-success btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=aplicarElementosNE(this);>Aplicar</button></td>"
                                                                +"</tr>";
                                                                }
                                                            });
                                                        //   if (i>0){
                                                        //       document.getElementById('btnFinalizar').hidden = false;
                                                        //       document.getElementById('btnFinalizar').disabled = false;
                                                        //   }
                                                            $("#tbodyNE").html(msg2);
                                                            // console.log("Current cities in CA: ", docs.join(", "));
                                                            // alert(docs);
                                                            document.getElementById('btnAgregarATabla').disabled = false;
                                                            totalizarNE(Fol);
                                                        });
                                                    })
                                                    .catch(function(error){
                                                        console.error("Error updating status of document: ", error);
                                                    });
                                                })
                                                .catch(function(error){
                                                    console.log("Historico Costos NO ESTABLECIDO - ERROR");
                                                })
                                            })
                                        }
                                    })
                                })
                                .catch(function(error){
                                    console.error("Error updating existencia of document: ", error);
                                });
                            });
                        })
                    })
                    .catch(function(error) {
                        console.error("Error adding document: ", error);
                        alert("Ocurrió algún error, reintenta por favor." + error);
                    });
                } else {
                    alert("El artículo existe en el documento. Elimínalo primero.");
                    document.getElementById('btnAgregarATabla').disabled = false;
                }
            })
            .catch(function(){

            })
        } else {
            console.log("Folio de Venta NO EXISTE, creando");
            firebase.auth().
            onAuthStateChanged(function(user) {
                Usuario = user.email;
                docRef.set({
                    Fecha: fecha2,
                    Hora: hora2,
                    Folio: Fol,
                    Cliente: Cli,
                    Usuario: Usuario,
                    Creado: firebase.firestore.Timestamp.now(),
                    DocOrigen: idVenta,
                    Anio: anio,
                    Mes: mes
                })
                .then(function() {
                    console.log("Folio de Venta CREADA con éxito. Agregando artículo.");
                    // document.getElementById('timestamp').innerHTML = firebase.firestore.Timestamp.now().toMillis;
                    //alert($("#timestamp").html());
                    document.getElementById('docOrigen').innerHTML = idVenta;
                    db.collection("Negocios").doc(idNegocio).collection('Ventas').doc(anio).collection(mes).doc(idVenta).collection("Articulos").where('CodigoBarras', '==', CB)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach(function(){
                            bandera = true;
                        })
                        if (bandera == false){
                            docRef = db.collection("Negocios").doc(idNegocio).collection("Ventas").doc(anio).collection(mes).doc(idVenta).collection("Articulos");
                            docRef.add({
                                CodigoBarras: CB,
                                Id: Id,
                                Descripcion: Des,
                                Cantidad: parseFloat(Can),
                                Costo: parseFloat(Cos),
                                Total: parseFloat(Tot),
                                Creado: firebase.firestore.Timestamp.now(),
                                DocOrigen: idVenta,
                                Estatus: "No Aplicado"
                            })
                            .then(function(docRef) {
                                console.log("Artículo Agregado a Folio de Venta.", docRef.id);

                                var DES = document.getElementById('tdDescripcion_agregar');
                                DES.innerHTML = '';
                                var node = document.createElement("input");
                                var att = document.createAttribute("id");
                                att.value = "Catalogo";
                                node.setAttributeNode(att);
                                var att2 = document.createAttribute("placeholder");
                                att2.value = "Selecciona...";
                                node.setAttributeNode(att2);
                                document.getElementById('tdDescripcion_agregar').appendChild(node);

                                // $("#cmbDescripcion").text("");
                                $("#tdCodigoBarras_agregar").text("");
                                $("#tdCantidad_agregar").text("");
                                $("#tdCosto_agregar").text("");
                                $("#tdTotal_agregar").text("");
                                $("#tdPrecio_agregar").text("");
                                $("#tdGanancia_agregar").text("");
                                document.getElementById('btnAgregarATabla').disabled = false;

                                llenarComboBox("Catalogo", "cmbDescripcion", "form-control");
    
                                db.collection("Negocios").doc(idNegocio).collection("Ventas").doc(idVenta).collection("Articulos").where('CodigoBarras', '==', CB)
                                .get()
                                .then(function(querySnapshot) {
                                    // document.getElementById('tbodyNE').innerHTML = '';
                                    querySnapshot.forEach(function(doc) {
                                        var docIdCatalogo = doc.data().Id;
                                        var docId = doc.id;
                                        var costo = doc.data().Costo;
                                        var cantidad = doc.data().Cantidad;
                                        var updateRef = db.collection("Negocios").doc(idNegocio).collection('Catalogo').doc(docIdCatalogo);
                                        var margen;
                                        db.collection("Negocios").doc(idNegocio).collection('Catalogo').doc(docIdCatalogo)
                                        .get()
                                        .then(function(doc){
                                            margen = ((doc.data().Precio / costo) - 1) * 100;
                                            var costoPrevio = doc.data().UltimoCosto;
                                            var provPrevio = doc.data().UltimoProveedor;
                                            if (costoPrevio == undefined){costoPrevio=0;}
                                            if (provPrevio == undefined){provPrevio="";}
                                            updateRef.update({
                                                Existencia: firebase.firestore.FieldValue.increment(cantidad),
                                                UltimoCosto: costo,
                                                UltimoProveedor: Prov,
                                                MargenActual: parseFloat(margen.toFixed(1)),
                                                CostoPrevio: costoPrevio,
                                                ProvPrevio: provPrevio
                                            })
                                            .then(function(){
                                                console.log("Existencia actualizada.");
                                                db.collection("Negocios").doc(idNegocio).collection("Catalogo").doc(docIdCatalogo).collection("HistoricoCostos").doc(fecha7.getFullYear().toString())
                                                .update({
                                                    [[idVenta]+".Fecha"]: fecha2,
                                                    [[idVenta]+".Hora"]: hora2,
                                                    [[idVenta]+".Folio"]: Fol,
                                                    [[idVenta]+".Proveedor"]: Prov,
                                                    [[idVenta]+".Usuario"]: Usuario,
                                                    [[idVenta]+".Creado"]: firebase.firestore.Timestamp.now(),
                                                    [[idVenta]+".UltModif"]: firebase.firestore.Timestamp.now(),
                                                    [[idVenta]+".DocOrigen"]: idVenta,
                                                    [[idVenta]+".Costo"]: costo,
                                                    [[idVenta]+".UltCosto"]: costo,
                                                    [[idVenta]+".Estatus"]:"Aplicado"
                                                })
                                                .then(function() {
                                                    console.log("Hisórico de Costos establecido correctamente.");
                                                    console.log(docId);
                                                    updateRef = db.collection("Negocios").doc(idNegocio).collection('Ventas').doc(idVenta).collection("Articulos").doc(docId);
                                                    updateRef.update({
                                                        Estatus: "Aplicado"
                                                    })
                                                    .then(function(){
                                                        console.log("Estatus actualizado.");
                                                        db.collection("Negocios").doc(idNegocio).collection("Ventas").doc(idVenta).collection("Articulos").orderBy("Creado")
                                                        .get()
                                                        .then(function(querySnapshot){
                                                            var tablaNE = document.getElementById('tablaNE').getElementsByTagName('tbody')[0];
                                                            tablaNE.innerHTML = '';
                                                        //   document.getElementById('btnFinalizar').hidden = true;
                                                            var i = 0;
                                                            var msg2 = "";
            
                                                            var docs = [];
                                                            querySnapshot.forEach(function(doc) {
                                                                docs.push(doc.data().Descripcion);
                                                                i += 1;
                                                                // msg3 = "<script> var docOrigen= '"+ doc.data().DocOrigen +"'; </script>";
                                                                if (doc.data().Estatus == "Aplicado"){
                                                                msg2 = msg2 + "<tr>"
                                                                +"<th scope='row' style='text-align: center' id='"+doc.id+"_Num'>"+i+"</th>"
                                                                +"<td style='text-align: center' id='"+doc.id+"_CodigoBarras'>"+doc.data().CodigoBarras+"</td>"
                                                                +"<td style='text-align: center' id='"+doc.id+"_Descripcion'>"+doc.data().Descripcion+"</td>"
                                                                +"<td style='text-align: center' id='Cantidad'>"+doc.data().Cantidad+"</td>"
                                                                +"<td style='text-align: center' id='"+doc.id+"_Costo'>"+doc.data().Costo+"</td>"
                                                                +"<td style='text-align: center' id='Total'>"+doc.data().Total+"</td>"
                                                                +"<td style='text-align: center'><button class='btn btn-danger btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=eliminarElementosNE(this);>Eliminar</button></td>"
                                                                +"</tr>";
                                                                } else {
                                                                msg2 = msg2 + "<tr>"
                                                                +"<th scope='row' style='text-align: center' id='"+doc.id+"_Num'>"+i+"</th>"
                                                                +"<td style='text-align: center' id='"+doc.id+"_CodigoBarras'>"+doc.data().CodigoBarras+"</td>"
                                                                +"<td style='text-align: center' id='"+doc.id+"_Descripcion'>"+doc.data().Descripcion+"</td>"
                                                                +"<td style='text-align: center' id='Cantidad'>"+doc.data().Cantidad+"</td>"
                                                                +"<td style='text-align: center' id='"+doc.id+"_Costo'>"+doc.data().Costo+"</td>"
                                                                +"<td style='text-align: center' id='Total'>"+doc.data().Total+"</td>"
                                                                +"<td style='text-align: center'><button class='btn btn-danger btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=eliminarElementosNE(this);>Eliminar</button></td>"
                                                                +"<td style='text-align: center'><button class='btn btn-success btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=aplicarElementosNE(this);>Aplicar</button></td>"
                                                                +"</tr>";
                                                                }
                                                            });
                                                        //   if (i>0){
                                                        //       document.getElementById('btnFinalizar').hidden = false;
                                                        //       document.getElementById('btnFinalizar').disabled = false;
                                                        //   }
                                                            $("#tbodyNE").html(msg2);
                                                            // console.log("Current cities in CA: ", docs.join(", "));
                                                            // alert(docs);
                                                            document.getElementById('btnAgregarATabla').disabled = false;
                                                            totalizarNE(Fol);
                                                        });
                                                    })
                                                    .catch(function(error){
                                                        console.error("Error updating status of document: ", error);
                                                    });
                                                })
                                                .catch(function(error) {
                                                    console.error("Error writing document: ", error);
                                                });
                                            })
                                            .catch(function(error){
                                                console.error("Error updating existencia of document: ", error);
                                            });
                                        })
                                        .catch(function(error){
                                            console.error("Error retrieving document: ", error);
                                        })                                        
                                    });
                                })
                            })
                            .catch(function(error) {
                                console.error("Error adding document: ", error);
                                alert("Ocurrió algún error, reintenta por favor." + error);
                            });
                        } else {
                            alert("El artículo existe en el documento. Elimínalo primero.");
                        }
                    })
                    .catch(function(){

                    })
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

function editarElementosVentas(btn) {
    var idNegocio = getCookie("idNegocio");

    db.collection("Negocios").doc(idNegocio).collection("Entradas").doc(btn.id)
    .get()
    .then(function(doc){
        document.getElementById('tituloNE').innerHTML = "EDITAR FOLIO DE VENTA";
        document.getElementById('txtFolio').value = doc.data().Folio;
        document.getElementById('anio').innerHTML = doc.data().Anio;
        console.log(document.getElementById('anio').innerHTML);
        document.getElementById('timestamp').innerHTML = doc.data().Creado;
        document.getElementById('fecha2').innerHTML = doc.data().Fecha;
        document.getElementById('hora2').innerHTML = doc.data().Hora;
        //alert($("#timestamp").html());
        document.getElementById('txtFolio').disabled = true;
        idNE = doc.data().DocOrigen;
        // document.getElementById('cmbProveedores').selectedIndex = 0;
        // var length = document.getElementById('cmbProveedores').length;
        // var valueCmb;
        // for (x = 0; x < length; x++){
        //     valueCmb = document.getElementById('cmbProveedores').options[document.getElementById('cmbProveedores').selectedIndex].text;
        //     if (doc.data().Proveedor = valueCmb) {
        //         break;
        //     } else {
        //         document.getElementById('cmbProveedores').selectedIndex = x;
        //     }
        // }
        document.getElementById('cmbClientes').value = doc.data().Cliente;
        document.getElementById('docOrigen').innerHTML = doc.data().DocOrigen;
        var f = $("#docOrigen").html();
        console.log(f);


        db.collection("Negocios").doc(idNegocio).collection("Ventas").doc(btn.id).collection("Articulos").orderBy("Creado")
        .get()
        .then(function(querySnapshot){
            var tablaNE = document.getElementById('tablaVentas').getElementsByTagName('tbody')[0];
            tablaNE.innerHTML = '';
        //   document.getElementById('btnFinalizar').hidden = true;
            var i = 0;
            var msg2 = "";

            var docs = [];
            querySnapshot.forEach(function(doc) {
                docs.push(doc.data().Descripcion);
                i += 1;
                // msg3 = "<script> var docOrigen= '"+ doc.data().DocOrigen +"'; </script>";
                if (doc.data().Estatus == "Aplicado"){
                    msg2 = msg2 + "<tr>"
                    +"<th scope='row' style='text-align: center' id='"+doc.id+"_Num'>"+i+"</th>"
                    +"<td style='text-align: center' id='"+doc.id+"_CodigoBarras'>"+doc.data().CodigoBarras+"</td>"
                    +"<td style='text-align: center' id='"+doc.id+"_Descripcion'>"+doc.data().Descripcion+"</td>"
                    +"<td style='text-align: center' id='Cantidad'>"+doc.data().Cantidad+"</td>"
                    +"<td style='text-align: center' id='"+doc.id+"_Costo'>"+doc.data().Costo+"</td>"
                    +"<td style='text-align: center' id='Total'>"+doc.data().Total+"</td>"
                    +"<td style='text-align: center'><button class='btn btn-danger btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=eliminarElementosVentas(this);>Eliminar</button></td>"
                    +"</tr>";
                } else {
                    msg2 = msg2 + "<tr>"
                    +"<th scope='row' style='text-align: center' id='"+doc.id+"_Num'>"+i+"</th>"
                    +"<td style='text-align: center' id='"+doc.id+"_CodigoBarras'>"+doc.data().CodigoBarras+"</td>"
                    +"<td style='text-align: center' id='"+doc.id+"_Descripcion'>"+doc.data().Descripcion+"</td>"
                    +"<td style='text-align: center' id='Cantidad'>"+doc.data().Cantidad+"</td>"
                    +"<td style='text-align: center' id='"+doc.id+"_Costo'>"+doc.data().Costo+"</td>"
                    +"<td style='text-align: center' id='Total'>"+doc.data().Total+"</td>"
                    +"<td style='text-align: center'><button class='btn btn-danger btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=eliminarElementosVentas(this);>Eliminar</button></td>"
                    +"<td style='text-align: center'><button class='btn btn-success btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=aplicarElementosVentas(this);>Aplicar</button></td>"
                    +"</tr>";
                }
            });
        //   if (i>0){
        //       document.getElementById('btnFinalizar').hidden = false;
        //       document.getElementById('btnFinalizar').disabled = false;
        //   }
            $("#tbodyVentas").html(msg2);
            // console.log("Current cities in CA: ", docs.join(", "));
            // alert(docs);
            document.getElementById('btnAgregarATabla').disabled = false;
            totalizarNE(1);
        });
    })

}

function escuchaVentas(){
    var idNegocio = getCookie("idNegocio");
    var fecha7 = new Date();
    var msg2;
    db.collection("Negocios").doc(idNegocio).collection("Ventas").doc("Ventas").collection(fecha7.getFullYear().toString()).doc(validarFecha(fecha7)[1].toString())
    .onSnapshot(function(doc) {
        // console.log(doc.data());
        var docs = Array();
        docs.push(doc.data());
        // console.log("Array Documentos "+docs[0][1]['Fecha']);
        msg2 = "";
        $("#tbodyRelacionVentas").html(msg2);
        var keys = Object.keys(docs[0]);
        keys.sort();
        console.log("Ordenado:"+keys);
        var bandera;
        for(x = keys.length; x > (keys.length - 10); x--){
            bandera = false;
            try{
                if (docs[0][keys[x-1]]['Fecha'] != undefined){
                bandera = true;
                }
            }
            catch{
                bandera = false;
            }

            if (bandera === true){
                msg2 = msg2 + "<tr>"
                +"<td style='text-align: center' id='Num'>"+(x)+"</td>"
                +"<td style='text-align: center' id='"+doc.id+"_Fecha'>"+docs[0][keys[x-1]]['Fecha']+"</td>"
                +"<td style='text-align: center' id='"+doc.id+"_Hora'>"+docs[0][keys[x-1]]['Hora']+"</td>"
                +"<td style='text-align: center' id='"+doc.id+"_Folio'>"+docs[0][keys[x-1]]['Folio']+"</td>"
                +"<td style='text-align: center' id='"+doc.id+"_Proveedor'>"+docs[0][keys[x-1]]['Cliente']+"</td>"
                +"<td style='text-align: center' id='"+doc.id+"_Usuario'>"+docs[0][keys[x-1]]['Usuario']+"</td>"
                +"<td style='text-align: center' id='"+doc.id+"_DocOrigen' hidden>"+docs[0][keys[x-1]]['DocOrigen']+"</td>"
                +"<td style='text-align: center' id='"+doc.id+"_Articulos'>"+docs[0][keys[x-1]]['Articulos']+"</td>"
                +"<td style='text-align: center' id='"+doc.id+"_Total'>"+docs[0][keys[x-1]]['Total']+"</td>"
                +"<td style='text-align: center'><button class='btn btn-warning btn-sm' id='"+docs[0][keys[x-1]]['DocOrigen']+"' name='"+doc.id+"' onclick=editarElementosVentas(this);>Editar</button></td>"
                +"</tr>";
                $("#tbodyRelacionVentas").html(msg2);
            }
            // controlador += 1;
        }
    })
}

function CargarClientesFiltroRazonSocial(criterio){
    var idNegocio = getCookie("idNegocio");
    var tabla = document.getElementById('tabla_clientes').getElementsByTagName('tbody')[0];
    tabla.innerHTML = '';
    var i = 0;
    db.collection("Negocios").doc(idNegocio).collection("Clientes").where("RazonSocial", "==", criterio)
    .get().then((querySnapshot) => {
        querySnapshot.forEach(function(doc) {
            i = i + 1;
            var Tel = "-";
            console.log(doc.data().Telefono);
            if (!isNaN(doc.data().Telefono)){
                Tel = doc.data().Telefono;
            }
            // console.log(doc.id, " => ", doc.data().RazonSocial);
            if (doc.id != 'Clientes'){
                var msg =
                '<tr><th scope="row" style="text-align: center">'+i+'</th><td style="text-align: center">'+doc.data().RazonSocial+'</td><td style="text-align: center">'+doc.data().RFC+'</td><td style="text-align: center">'+doc.data().Direccion+'</td><td style="text-align: center">'+doc.data().NoExt+'</td><td style="text-align: center">'+doc.data().NoInt+'</td><td style="text-align: center">'+doc.data().Colonia+'</td><td style="text-align: center">'+doc.data().Ciudad+'</td><td style="text-align: center">'+doc.data().Estado+'</td><td style="text-align: center">'+Tel+'</td></tr>';
                var newRow  = tabla.insertRow(tabla.rows.length);
                newRow.innerHTML = msg;
            }
        });
    });
}

function AgregarCliente(){
    document.getElementById('btnAgregar').disabled = true;
    var idNegocio = document.getElementById('idNegocio').innerHTML;
    var Raz = document.getElementById('txtRazonSocial').value;
    var RFC = document.getElementById('txtRFC').value;
    var Dir = document.getElementById('txtDireccion').value;
    var Ciu = document.getElementById('txtCiudad').value;
    var NoInt = document.getElementById('txtNoInt').value;
    var NoExt = document.getElementById('txtNoExt').value;
    var Col = document.getElementById('txtColonia').value;
    var CP = document.getElementById('txtCodigoPostal').value;
    var Tel = parseInt(document.getElementById('txtTelefono').value);
    var cmbEstados = document.getElementById('cmbEstados');
    var Estado = cmbEstados.value;

    if (Raz == "") {
        alert("La razón social es requerida");
        document.getElementById('txtRazonSocial').focus();
        document.getElementById('btnAgregar').disabled = false;
        return;
    }
    var bandera = 0;

    db.collection("Negocios").doc(idNegocio).collection("Clientes").where("RazonSocial", "==", Raz)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
            bandera = 1;
        });

        if (bandera == 0){
            db.collection("Negocios").doc(idNegocio).collection("Clientes").add({
                RazonSocial: Raz,
                RFC: RFC,
                Direccion: Dir,
                Ciudad: Ciu,
                NoExt: NoExt,
                NoInt: NoInt,
                Colonia: Col,
                Estado: Estado,
                CodigoPostal: CP,
                Telefono: parseInt(Tel)
            })
            .then(function(docRef) {
                db.collection("Negocios").doc(idNegocio).collection("Clientes").doc("Clientes").update({
                    Descripcion: firebase.firestore.FieldValue.arrayUnion(Raz)
                }).then(function() {
                    console.log("Document written with ID: ", docRef.id);
                    alert("¡Agregado correctamente!");
                    location.reload();
                }).catch(function(error) {
                    alert("Ocurrió algún error, reintenta por favor." + error)
                    document.getElementById('txtRazonSocial').focus();
                });
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
                alert("Ocurrió algún error, reintenta por favor.")
                document.getElementById('txtRazonSocial').focus();
            });
        } else {
            alert("¡Esa razón social ya existe!");
            document.getElementById('txtRazonSocial').focus();
        }
        document.getElementById('btnAgregar').disabled = false;
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
        alert("Ocurrió algún error, reintenta por favor.")
        document.getElementById('txtRazonSocial').focus();
        document.getElementById('btnAgregar').disabled = false;
    });
}

function validateToken(){
    const messaging = firebase.messaging();
    messaging.usePublicVapidKey("BKRctGZ_vXXp45kRfB9_pPXSdgOuJv7tAvv_7ro4oszbWmR82Xy9XTcFwv3mhNKg3qpn9Z7l4Wf5ZJAhb7rgN3Q");
    // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    messaging.getToken().then((currentToken) => {
        if (currentToken) {
        sendTokenToServer(currentToken);
        updateUIForPushEnabled(currentToken);
        } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
        // Show permission UI.
        updateUIForPushPermissionRequired();
        setTokenSentToServer(false);
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        showToken('Error retrieving Instance ID token. ', err);
        setTokenSentToServer(false);
    });
}

function actualizarPrecio(CB, row, precio, margen){
    if (confirm("El margen será del "+ parseFloat(margen).toFixed(1) + "%. \n\n ¿Es correcto?")) {
        var idNegocio = getCookie("idNegocio");
        db.collection("Negocios").doc(idNegocio).collection('Catalogo').where('CodigoBarras', '==', CB).get()
        .then((querySnapshot) => {
            querySnapshot.forEach(function(doc){
                db.collection("Negocios").doc(idNegocio).collection("Catalogo").doc(doc.id).update({
                    Precio: parseFloat(precio),
                    MargenActual: parseFloat(margen)
                })
                .then(function() {
                    $("#"+row+"_precioProducto").text(parseFloat(precio).toFixed(1));
                    $("#"+row+"_margenProducto").text(parseFloat(margen).toFixed(1)+" %");
                    alert("Precio Actualizado Correctamente");
                    $("#modalActualizarPrecio").modal('toggle');
                })
                .catch(function(error){
                    console.log("Error actualizando precio: \n" + error);
                })
            })
        })
    } else {
        $("#precioProducto").text(precioOriginal);
    }
}

function aplicarElementosNE(){
  alert("Éxito");
}

function editarProveedorNE(prov){
    var fecha7 = new Date();
    var idNegocio = getCookie("idNegocio");
    var f = $("#docOrigen").html();
    var documentos = Array();

    if (f != ""){
        idNE = f;
    }

    var docRef = db.collection("Negocios").doc(idNegocio).collection("Entradas").doc(idNE);
    docRef.update({
        Proveedor: prov
    })
    .then(function(){
        db.collection("Negocios").doc(idNegocio).collection("Entradas").doc(idNE)
        .get()
        .then(function(doc) {
            documentos.push(doc.data());
            db.collection("Negocios").doc(idNegocio).collection("Entradas").doc("Entradas").collection(fecha7.getFullYear().toString()).doc(validarFecha(fecha7)[1].toString())
            .update({
                [documentos[0]["DocOrigen"]]:{
                    Creado: documentos[0]["Creado"],
                    Fecha: documentos[0]["Fecha"],
                    Folio: documentos[0]["Folio"],
                    Hora: documentos[0]["Hora"],
                    Proveedor: documentos[0]["Proveedor"],
                    Usuario: documentos[0]["Usuario"],
                    DocOrigen: documentos[0]["DocOrigen"],
                    Articulos: documentos[0]["Articulos"],
                    Total: documentos[0]["Total"]
                }
            })
            alert("Proveedor actualizado correctamente.")
        })
    })
    .catch(function(error){
        console.error("Error actualizando Proveedor de NE: ", error);
    });
}

function editarElementosNE(btn) {
    var idNegocio = getCookie("idNegocio");

    db.collection("Negocios").doc(idNegocio).collection("Entradas").doc(btn.id)
    .get()
    .then(function(doc){
        document.getElementById('tituloNE').innerHTML = "EDITAR NOTA DE ENTRADA";
        document.getElementById('txtFolio').value = doc.data().Folio;
        document.getElementById('anio').innerHTML = doc.data().Anio;
        console.log(document.getElementById('anio').innerHTML);
        document.getElementById('timestamp').innerHTML = doc.data().Creado;
        document.getElementById('fecha2').innerHTML = doc.data().Fecha;
        document.getElementById('hora2').innerHTML = doc.data().Hora;
        //alert($("#timestamp").html());
        document.getElementById('txtFolio').disabled = true;
        idNE = doc.data().DocOrigen;
        // document.getElementById('cmbProveedores').selectedIndex = 0;
        // var length = document.getElementById('cmbProveedores').length;
        // var valueCmb;
        // for (x = 0; x < length; x++){
        //     valueCmb = document.getElementById('cmbProveedores').options[document.getElementById('cmbProveedores').selectedIndex].text;
        //     if (doc.data().Proveedor = valueCmb) {
        //         break;
        //     } else {
        //         document.getElementById('cmbProveedores').selectedIndex = x;
        //     }
        // }
        document.getElementById('cmbProveedores').value = doc.data().Proveedor;
        document.getElementById('docOrigen').innerHTML = doc.data().DocOrigen;
        var f = $("#docOrigen").html();
        console.log(f);


        db.collection("Negocios").doc(idNegocio).collection("Entradas").doc(btn.id).collection("Articulos").orderBy("Creado")
        .get()
        .then(function(querySnapshot){
            var tablaNE = document.getElementById('tablaNE').getElementsByTagName('tbody')[0];
            tablaNE.innerHTML = '';
        //   document.getElementById('btnFinalizar').hidden = true;
            var i = 0;
            var msg2 = "";

            var docs = [];
            querySnapshot.forEach(function(doc) {
                docs.push(doc.data().Descripcion);
                i += 1;
                // msg3 = "<script> var docOrigen= '"+ doc.data().DocOrigen +"'; </script>";
                if (doc.data().Estatus == "Aplicado"){
                    msg2 = msg2 + "<tr>"
                    +"<th scope='row' style='text-align: center' id='"+doc.id+"_Num'>"+i+"</th>"
                    +"<td style='text-align: center' id='"+doc.id+"_CodigoBarras'>"+doc.data().CodigoBarras+"</td>"
                    +"<td style='text-align: center' id='"+doc.id+"_Descripcion'>"+doc.data().Descripcion+"</td>"
                    +"<td style='text-align: center' id='Cantidad'>"+doc.data().Cantidad+"</td>"
                    +"<td style='text-align: center' id='"+doc.id+"_Costo'>"+doc.data().Costo+"</td>"
                    +"<td style='text-align: center' id='Total'>"+doc.data().Total+"</td>"
                    +"<td style='text-align: center'><button class='btn btn-danger btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=eliminarElementosNE(this);>Eliminar</button></td>"
                    +"</tr>";
                } else {
                    msg2 = msg2 + "<tr>"
                    +"<th scope='row' style='text-align: center' id='"+doc.id+"_Num'>"+i+"</th>"
                    +"<td style='text-align: center' id='"+doc.id+"_CodigoBarras'>"+doc.data().CodigoBarras+"</td>"
                    +"<td style='text-align: center' id='"+doc.id+"_Descripcion'>"+doc.data().Descripcion+"</td>"
                    +"<td style='text-align: center' id='Cantidad'>"+doc.data().Cantidad+"</td>"
                    +"<td style='text-align: center' id='"+doc.id+"_Costo'>"+doc.data().Costo+"</td>"
                    +"<td style='text-align: center' id='Total'>"+doc.data().Total+"</td>"
                    +"<td style='text-align: center'><button class='btn btn-danger btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=eliminarElementosNE(this);>Eliminar</button></td>"
                    +"<td style='text-align: center'><button class='btn btn-success btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=aplicarElementosNE(this);>Aplicar</button></td>"
                    +"</tr>";
                }
            });
        //   if (i>0){
        //       document.getElementById('btnFinalizar').hidden = false;
        //       document.getElementById('btnFinalizar').disabled = false;
        //   }
            $("#tbodyNE").html(msg2);
            // console.log("Current cities in CA: ", docs.join(", "));
            // alert(docs);
            document.getElementById('btnAgregarATabla').disabled = false;
            totalizarNE(1);
        });
    })

}

function totalizarNE(Fol){
    var fecha7 = new Date();
    var idNegocio = getCookie("idNegocio");
    var fecha = $("#anio").text()+$("#mes").text()+$("#dia").text();
    var hora = $("#hora").text()+$("#minutos").text()+$("#segundos").text();
    idNE = fecha + "_" + hora + "_" + Fol;
    var f = $("#docOrigen").html();
    if (f != ""){
        idNE = f;
    }
  var cantidadTotal = 0;
  var cantidadArticulos = 0;
  $('#tablaNE tr').each(function(){
    $(this).find('#Total').each(function(){
        cantidadTotal += parseFloat($(this).text());
    })
    $(this).find('#Cantidad').each(function(){
        cantidadArticulos += parseFloat($(this).text());
    })
  })
  var documentos = Array();
    document.getElementById('cantidadTotal').innerHTML = parseFloat(cantidadTotal).toFixed(2);
    document.getElementById('cantidadArticulos').innerHTML = cantidadArticulos;
    var docRef = db.collection("Negocios").doc(idNegocio).collection("Entradas").doc(idNE);
    docRef.update({
        Total: parseFloat(cantidadTotal).toFixed(2),
        Articulos: parseFloat(cantidadArticulos)
    })
    .then(function(){
        db.collection("Negocios").doc(idNegocio).collection("Entradas").doc(idNE)
        .get()
        .then(function(doc) {
            documentos.push(doc.data());
            db.collection("Negocios").doc(idNegocio).collection("Entradas").doc("Entradas").collection(fecha7.getFullYear().toString()).doc(validarFecha(fecha7)[1].toString())
            .update({
                [documentos[0]["DocOrigen"]]:{
                    Creado: documentos[0]["Creado"],
                    Fecha: documentos[0]["Fecha"],
                    Folio: documentos[0]["Folio"],
                    Hora: documentos[0]["Hora"],
                    Proveedor: documentos[0]["Proveedor"],
                    Usuario: documentos[0]["Usuario"],
                    DocOrigen: documentos[0]["DocOrigen"],
                    Articulos: documentos[0]["Articulos"],
                    Total: parseFloat(documentos[0]["Total"]).toFixed(2),
                    Anio: documentos[0]["Anio"]
                }
            })
            
        })
    })
    .catch(function(error){
        console.error("Error totalizando NE: ", error);
    });
}

function escuchaNE(){
    var idNegocio = getCookie("idNegocio");
    var fecha7 = new Date();
    var msg2;
    db.collection("Negocios").doc(idNegocio).collection("Entradas").doc("Entradas").collection(fecha7.getFullYear().toString()).doc(validarFecha(fecha7)[1].toString())
    .onSnapshot(function(doc) {
        // console.log(doc.data());
        var docs = Array();
        docs.push(doc.data());
        // console.log("Array Documentos "+docs[0][1]['Fecha']);
        msg2 = "";
        $("#tbodyRelacionNE").html(msg2);
        var keys = Object.keys(docs[0]);
        console.log(keys);
        
        // var keys_ordenadas = Array();
        // var o1 = "";
        // var o2 = "";
        // var oComodin = "";
        // for (x = 0; x > keys.length; x++){
        //     console.log(keys[x]);
        //     console.log(keys[x+1]);
        //     o1 = keys[x];
        //     o2 = keys[x+1];
        //     if (o1 > o2){
        //         o1;
        //     }
        // }
        keys.sort();
        console.log("Ordenado:"+keys);
        var bandera;
        for(x = keys.length; x > (keys.length - 10); x--){
            bandera = false;
            try{
                if (docs[0][keys[x-1]]['Fecha'] != undefined){
                bandera = true;
                }
            }
            catch{
                bandera = false;
            }

            if (bandera === true){
                msg2 = msg2 + "<tr>"
                +"<td style='text-align: center' id='Num'>"+(x)+"</td>"
                +"<td style='text-align: center' id='"+doc.id+"_Fecha'>"+docs[0][keys[x-1]]['Fecha']+"</td>"
                +"<td style='text-align: center' id='"+doc.id+"_Hora'>"+docs[0][keys[x-1]]['Hora']+"</td>"
                +"<td style='text-align: center' id='"+doc.id+"_Folio'>"+docs[0][keys[x-1]]['Folio']+"</td>"
                +"<td style='text-align: center' id='"+doc.id+"_Proveedor'>"+docs[0][keys[x-1]]['Proveedor']+"</td>"
                +"<td style='text-align: center' id='"+doc.id+"_Usuario'>"+docs[0][keys[x-1]]['Usuario']+"</td>"
                +"<td style='text-align: center' id='"+doc.id+"_DocOrigen' hidden>"+docs[0][keys[x-1]]['DocOrigen']+"</td>"
                +"<td style='text-align: center' id='"+doc.id+"_Articulos'>"+docs[0][keys[x-1]]['Articulos']+"</td>"
                +"<td style='text-align: center' id='"+doc.id+"_Total'>"+docs[0][keys[x-1]]['Total']+"</td>"
                +"<td style='text-align: center'><button class='btn btn-warning btn-sm' id='"+docs[0][keys[x-1]]['DocOrigen']+"' name='"+doc.id+"' onclick=editarElementosNE(this);>Editar</button></td>"
                +"</tr>";
                $("#tbodyRelacionNE").html(msg2);
            }
            // controlador += 1;
        }
    })
}

function eliminarElementosNE(btn) {
    var idNegocio = getCookie("idNegocio");

    db.collection("Negocios").doc(idNegocio).collection("Entradas").doc(idNE).collection("Articulos").doc(btn.name)
    .get()
    .then(function(doc) {
        var docIdCatalogo = doc.data().Id;
        var cantidad = doc.data().Cantidad;
        var costoEliminar = doc.data().Costo;
        db.collection("Negocios").doc(idNegocio).collection('Catalogo').doc(docIdCatalogo)
        .get()
        .then(function(doc){
            var provPrevio = doc.data().ProvPrevio;
            var costoPrevio = doc.data().CostoPrevio;
            //console.log("ProvPrevio: "+provPrevio);
            // if (costoPrevio == ""){
            //     costoPrevio = 0;
            // }
            // if (provPrevio == ""){
            //     provPrevio = "";
            // }
            if (costoEliminar == doc.data().UltimoCosto){
                var updateRef = db.collection("Negocios").doc(idNegocio).collection('Catalogo').doc(docIdCatalogo);
                updateRef.update({
                    Existencia: firebase.firestore.FieldValue.increment((cantidad * -1)),
                    UltimoCosto: costoPrevio,
                    UltimoProveedor: provPrevio
                })
                .then(function(){
                    console.log("Existencia actualizada.");
                    db.collection("Negocios").doc(idNegocio).collection("Catalogo").doc(docIdCatalogo).collection("HistoricoCostos").doc($("#anio").text())
                    .update({
                        [[idNE]+".Estatus"]:"Cancelado"
                    })


                    db.collection("Negocios").doc(idNegocio).collection("Entradas").doc(btn.id).collection("Articulos").doc(btn.name).delete().then(function() {
                        console.log("Document successfully deleted!");
                        db.collection("Negocios").doc(idNegocio).collection("Entradas").doc(idNE).collection("Articulos").orderBy("Creado")
                        .get()
                        .then(function(querySnapshot){
                            var tablaNE = document.getElementById('tablaNE').getElementsByTagName('tbody')[0];
                            tablaNE.innerHTML = '';
                        //   document.getElementById('btnFinalizar').hidden = true;
                            var i = 0;
                            var msg2 = "";

                            var docs = [];
                            querySnapshot.forEach(function(doc) {
                                docs.push(doc.data().Descripcion);
                                i += 1;
                                // msg3 = "<script> var docOrigen= '"+ doc.data().DocOrigen +"'; </script>";
                                if (doc.data().Estatus == "Aplicado"){
                                msg2 = msg2 + "<tr>"
                                +"<th scope='row' style='text-align: center' id='"+doc.id+"_Num'>"+i+"</th>"
                                +"<td style='text-align: center' id='"+doc.id+"_CodigoBarras'>"+doc.data().CodigoBarras+"</td>"
                                +"<td style='text-align: center' id='"+doc.id+"_Descripcion'>"+doc.data().Descripcion+"</td>"
                                +"<td style='text-align: center' id='Cantidad'>"+doc.data().Cantidad+"</td>"
                                +"<td style='text-align: center' id='"+doc.id+"_Costo'>"+doc.data().Costo+"</td>"
                                +"<td style='text-align: center' id='Total'>"+doc.data().Total+"</td>"
                                +"<td style='text-align: center'><button class='btn btn-danger btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=eliminarElementosNE(this);>Eliminar</button></td>"
                                +"</tr>";
                                } else {
                                msg2 = msg2 + "<tr>"
                                +"<th scope='row' style='text-align: center' id='"+doc.id+"_Num'>"+i+"</th>"
                                +"<td style='text-align: center' id='"+doc.id+"_CodigoBarras'>"+doc.data().CodigoBarras+"</td>"
                                +"<td style='text-align: center' id='"+doc.id+"_Descripcion'>"+doc.data().Descripcion+"</td>"
                                +"<td style='text-align: center' id='Cantidad'>"+doc.data().Cantidad+"</td>"
                                +"<td style='text-align: center' id='"+doc.id+"_Costo'>"+doc.data().Costo+"</td>"
                                +"<td style='text-align: center' id='Total'>"+doc.data().Total+"</td>"
                                +"<td style='text-align: center'><button class='btn btn-danger btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=eliminarElementosNE(this);>Eliminar</button></td>"
                                +"<td style='text-align: center'><button class='btn btn-success btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=aplicarElementosNE(this);>Aplicar</button></td>"
                                +"</tr>";
                                }
                            });
                        //   if (i>0){
                        //       document.getElementById('btnFinalizar').hidden = false;
                        //       document.getElementById('btnFinalizar').disabled = false;
                        //   }
                            $("#tbodyNE").html(msg2);
                            // console.log("Current cities in CA: ", docs.join(", "));
                            // alert(docs);
                            document.getElementById('btnAgregarATabla').disabled = false;
                            totalizarNE(1);
                        });
                    }).catch(function(error) {
                        console.error("Error removing document: ", error);
                    });
                })
                .catch(function(error){
                    console.error("Error updating existencia of document: ", error);
                });
            } else {
                var updateRef = db.collection("Negocios").doc(idNegocio).collection('Catalogo').doc(docIdCatalogo);
                updateRef.update({
                    Existencia: firebase.firestore.FieldValue.increment((cantidad * -1))
                })
                .then(function(){
                    console.log("Existencia actualizada.");
                    db.collection("Negocios").doc(idNegocio).collection("Catalogo").doc(docIdCatalogo).collection("HistoricoCostos").doc($("#anio").text())
                    .update({
                        [[idNE]+".Estatus"]:"Cancelado"
                    })


                    db.collection("Negocios").doc(idNegocio).collection("Entradas").doc(btn.id).collection("Articulos").doc(btn.name).delete().then(function() {
                        console.log("Document successfully deleted!");
                        db.collection("Negocios").doc(idNegocio).collection("Entradas").doc(idNE).collection("Articulos").orderBy("Creado")
                        .get()
                        .then(function(querySnapshot){
                            var tablaNE = document.getElementById('tablaNE').getElementsByTagName('tbody')[0];
                            tablaNE.innerHTML = '';
                        //   document.getElementById('btnFinalizar').hidden = true;
                            var i = 0;
                            var msg2 = "";

                            var docs = [];
                            querySnapshot.forEach(function(doc) {
                                docs.push(doc.data().Descripcion);
                                i += 1;
                                // msg3 = "<script> var docOrigen= '"+ doc.data().DocOrigen +"'; </script>";
                                if (doc.data().Estatus == "Aplicado"){
                                msg2 = msg2 + "<tr>"
                                +"<th scope='row' style='text-align: center' id='"+doc.id+"_Num'>"+i+"</th>"
                                +"<td style='text-align: center' id='"+doc.id+"_CodigoBarras'>"+doc.data().CodigoBarras+"</td>"
                                +"<td style='text-align: center' id='"+doc.id+"_Descripcion'>"+doc.data().Descripcion+"</td>"
                                +"<td style='text-align: center' id='Cantidad'>"+doc.data().Cantidad+"</td>"
                                +"<td style='text-align: center' id='"+doc.id+"_Costo'>"+doc.data().Costo+"</td>"
                                +"<td style='text-align: center' id='Total'>"+doc.data().Total+"</td>"
                                +"<td style='text-align: center'><button class='btn btn-danger btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=eliminarElementosNE(this);>Eliminar</button></td>"
                                +"</tr>";
                                } else {
                                msg2 = msg2 + "<tr>"
                                +"<th scope='row' style='text-align: center' id='"+doc.id+"_Num'>"+i+"</th>"
                                +"<td style='text-align: center' id='"+doc.id+"_CodigoBarras'>"+doc.data().CodigoBarras+"</td>"
                                +"<td style='text-align: center' id='"+doc.id+"_Descripcion'>"+doc.data().Descripcion+"</td>"
                                +"<td style='text-align: center' id='Cantidad'>"+doc.data().Cantidad+"</td>"
                                +"<td style='text-align: center' id='"+doc.id+"_Costo'>"+doc.data().Costo+"</td>"
                                +"<td style='text-align: center' id='Total'>"+doc.data().Total+"</td>"
                                +"<td style='text-align: center'><button class='btn btn-danger btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=eliminarElementosNE(this);>Eliminar</button></td>"
                                +"<td style='text-align: center'><button class='btn btn-success btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=aplicarElementosNE(this);>Aplicar</button></td>"
                                +"</tr>";
                                }
                            });
                        //   if (i>0){
                        //       document.getElementById('btnFinalizar').hidden = false;
                        //       document.getElementById('btnFinalizar').disabled = false;
                        //   }
                            $("#tbodyNE").html(msg2);
                            // console.log("Current cities in CA: ", docs.join(", "));
                            // alert(docs);
                            document.getElementById('btnAgregarATabla').disabled = false;
                            totalizarNE(1);
                        });
                    }).catch(function(error) {
                        console.error("Error removing document: ", error);
                    });
                })
                .catch(function(error){
                    console.error("Error updating existencia of document: ", error);
                });
            }
        })
    })
}

function finalizarNE(Fol){
    var fecha7 = new Date();
    var idNegocio = getCookie("idNegocio");
    // document.getElementById('btnFinalizar').disabled = true;
    var fecha = $("#anio").text()+$("#mes").text()+$("#dia").text();
    var hora = $("#hora").text()+$("#minutos").text()+$("#segundos").text();
    var total = document.getElementById('cantidadTotal').innerHTML;
    var articulos = document.getElementById('cantidadArticulos').innerHTML;
    idNE = fecha + "_" + hora + "_" + Fol;
    var f = $("#docOrigen").html();
    //alert(f);
    if (f != ""){
        idNE = f;
    }
    var documentos = Array();

    var docRef = db.collection("Negocios").doc(idNegocio).collection("Entradas").doc(idNE);
    docRef.update({
        Estatus: "Finalizado",
        Total: parseFloat(total),
        Articulos: parseFloat(articulos)
    })
    .then(function(){
        db.collection("Negocios").doc(idNegocio).collection("Entradas").doc(idNE).collection("Articulos")
        .get()
        .then(function(querySnapshot) {
            try{
                listenerTablaNE();
            }
            catch{

            }
            listenerTablaNE = null;
            document.getElementById('tbodyNE').innerHTML = '';
            querySnapshot.forEach(function(doc) {

                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                var updateRef = db.collection("Negocios").doc(idNegocio).collection('Catalogo').doc(doc.data().Id);

                // Atomically increment the population of the city by 50.
                updateRef.update({
                    Existencia: firebase.firestore.FieldValue.increment(doc.data().Cantidad)
                })
                .then(function(){
                    
                    console.log("Existencia actualizada.");
                    updateRef = db.collection("Negocios").doc(idNegocio).collection('Entradas').doc(idNE).collection("Articulos").doc(doc.id);

                    // Atomically increment the population of the city by 50.
                    updateRef.update({
                        Estatus: "Aplicado"
                    })
                    .then(function(){
                        console.log("Estatus actualizado.");
                    })
                    .catch(function(error){
                        console.error("Error updating document: ", error);
                    });
                    // location.reload();
                })
                .catch(function(error){
                    console.error("Error updating document: ", error);
                });
            });

            document.getElementById("cmbProveedores").selectedIndex = 0;
            var a = document.getElementById("txtFolio");
            a.value = "";
            a.disabled = false;


            // var new_tbody = document.createElement('tbody');
            // populate_with_new_rows(new_tbody);
            // old_tbody.parentNode.replaceChild(new_tbody, old_tbody);

            $("#cantidadArticulos").html("0");
            $("#cantidadTotal").html("0");

            db.collection("Negocios").doc(idNegocio).collection("Entradas").doc("Entradas").collection(fecha7.getFullYear().toString()).doc(validarFecha(fecha7)[1].toString())
            .get()
            .then(function(doc){
                var index = doc.data().Index;
                db.collection("Negocios").doc(idNegocio).collection("Entradas").doc(idNE)
                .get()
                .then(function(doc) {
                    documentos.push(doc.data());
                    db.collection("Negocios").doc(idNegocio).collection("Entradas").doc("Entradas").collection(fecha7.getFullYear().toString()).doc(validarFecha(fecha7)[1].toString())
                    .update({
                        [documentos[0]["DocOrigen"]]:{
                            Creado: documentos[0]["Creado"],
                            Estatus: documentos[0]["Estatus"],
                            Fecha: documentos[0]["Fecha"],
                            Folio: documentos[0]["Folio"],
                            Hora: documentos[0]["Hora"],
                            Proveedor: documentos[0]["Proveedor"],
                            Usuario: documentos[0]["Usuario"],
                            DocOrigen: documentos[0]["DocOrigen"],
                            Articulos: documentos[0]["Articulos"],
                            Total: documentos[0]["Total"]
                        }
                    })

                    var updateRef = db.collection("Negocios").doc(idNegocio).collection("Entradas").doc("Entradas").collection(fecha7.getFullYear().toString()).doc(validarFecha(fecha7)[1].toString());

                    // Atomically increment the population of the city by 50.
                    updateRef.update({
                        Index: firebase.firestore.FieldValue.increment(1)
                    })
                })
            })
        })

    })
    .catch(function(error){
        console.error("Error finalizando NE: ", error);
    });
}

function agregarElementosNE(CB, Id, Des, Can, Cos, Tot, Prov, Fol){
    var fecha7 = new Date();
    var idNegocio = getCookie("idNegocio");
    var anio = $("#anio").text();
    console.log("Anio: "+anio);
    var fecha = $("#anio").text()+$("#mes").text()+$("#dia").text();
    var fecha2 = $("#dia").text()+"-"+$("#mes").text()+"-"+$("#anio").text();
    var hora = $("#hora").text()+$("#minutos").text()+$("#segundos").text();
    var hora2 = $("#hora").text()+":"+$("#minutos").text()+":"+$("#segundos").text();
    idNE = fecha + "_" + hora + "_" + Fol;
    var f = $("#docOrigen").html();
    var h2 = $("#fecha2").html();
    var f2 = $("#hora2").html();
    if (f != ""){
        idNE = f;
    }
    if (h2 != ""){
        hora2 = h2;
    }
    if (f2 != ""){
        fecha2 = f2;
    }

    var bandera = false;
    document.getElementById('btnAgregarATabla').disabled = true;
    var docRef = db.collection("Negocios").doc(idNegocio).collection("Entradas").doc(idNE);

    docRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("Nota Entrada ya existe:", doc.data());

            $("docOrigen").html(idNE);
            db.collection("Negocios").doc(idNegocio).collection('Entradas').doc(idNE).collection("Articulos").where('CodigoBarras', '==', CB)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach(function(){
                    bandera = true;
                })
                if (bandera == false){
                    docRef = db.collection("Negocios").doc(idNegocio).collection("Entradas").doc(idNE).collection("Articulos");
                    docRef.add({
                        CodigoBarras: CB,
                        Id: Id,
                        Descripcion: Des,
                        Cantidad: parseFloat(Can),
                        Costo: parseFloat(Cos),
                        Total: parseFloat(Tot),
                        Creado: firebase.firestore.Timestamp.now(),
                        DocOrigen: idNE,
                        Estatus: "No Aplicado"
                    })
                    .then(function(docRef) {
                        console.log("Artículo Agregado a Nota Entrada.", docRef.id);
                        
                        var DES = document.getElementById('tdDescripcion_agregar');
                        DES.innerHTML = '';
                        var node = document.createElement("input");
                        var att = document.createAttribute("id");
                        att.value = "Catalogo";
                        node.setAttributeNode(att);
                        var att2 = document.createAttribute("placeholder");
                        att2.value = "Selecciona...";
                        node.setAttributeNode(att2);
                        document.getElementById('tdDescripcion_agregar').appendChild(node);

                        // $("#cmbDescripcion").text("");
                        $("#tdCodigoBarras_agregar").text("");
                        $("#tdCantidad_agregar").text("");
                        $("#tdCosto_agregar").text("");
                        $("#tdTotal_agregar").text("");
                        document.getElementById('btnAgregarATabla').disabled = false;

                        llenarComboBox("Catalogo", "cmbDescripcion", "form-control");
    
                        db.collection("Negocios").doc(idNegocio).collection("Entradas").doc(idNE).collection("Articulos").where('CodigoBarras', '==', CB)
                        .get()
                        .then(function(querySnapshot) {
                            // document.getElementById('tbodyNE').innerHTML = '';
                            querySnapshot.forEach(function(doc) {
                                var docIdCatalogo = doc.data().Id;
                                var docId = doc.id;
                                var costo = doc.data().Costo;
                                var cantidad = doc.data().Cantidad;
                                var updateRef = db.collection("Negocios").doc(idNegocio).collection('Catalogo').doc(doc.data().Id);
                                var margen;
                                db.collection("Negocios").doc(idNegocio).collection('Catalogo').doc(doc.data().Id)
                                .get()
                                .then(function(doc){
                                    margen = ((doc.data().Precio / costo) - 1) * 100;
                                    var costoPrevio = doc.data().UltimoCosto;
                                    var provPrevio = doc.data().UltimoProveedor;
                                    if (costoPrevio == undefined){costoPrevio=0;}
                                    if (provPrevio == undefined){provPrevio="";}
                                    updateRef.update({
                                        Existencia: firebase.firestore.FieldValue.increment(cantidad),
                                        UltimoCosto: costo,
                                        UltimoProveedor: Prov,
                                        MargenActual: parseFloat(margen.toFixed(1)),
                                        CostoPrevio: costoPrevio,
                                        ProvPrevio: provPrevio
                                    })
                                    .then(function(){
                                        console.log("Existencia actualizada.");
                                        db.collection("Negocios").doc(idNegocio).collection("Catalogo").doc(docIdCatalogo).collection("HistoricoCostos").doc(anio)
                                        .get()
                                        .then(function(doc){
                                            var x = doc.data().idNE;
                                            if (x != undefined) {
                                                db.collection("Negocios").doc(idNegocio).collection("Catalogo").doc(docIdCatalogo).collection("HistoricoCostos").doc(anio)
                                                .update({
                                                    [[idNE]+".UltModif"]: firebase.firestore.Timestamp.now(),
                                                    [[idNE]+".UltCosto"]: costo,
                                                    [[idNE]+".Estatus"]: "Aplicado"
                                                })
                                                .then(function(){
                                                    console.log("Historico Costos ACTUALIZADO correctamente");
                                                    updateRef = db.collection("Negocios").doc(idNegocio).collection('Entradas').doc(idNE).collection("Articulos").doc(docId);
                                                    updateRef.update({
                                                        Estatus: "Aplicado"
                                                    })
                                                    .then(function(){
                                                        console.log("Estatus actualizado.");
                                                        db.collection("Negocios").doc(idNegocio).collection("Entradas").doc(idNE).collection("Articulos").orderBy("Creado")
                                                        .get()
                                                        .then(function(querySnapshot){
                                                            var tablaNE = document.getElementById('tablaNE').getElementsByTagName('tbody')[0];
                                                            tablaNE.innerHTML = '';
                                                        //   document.getElementById('btnFinalizar').hidden = true;
                                                            var i = 0;
                                                            var msg2 = "";

                                                            var docs = [];
                                                            querySnapshot.forEach(function(doc) {
                                                                docs.push(doc.data().Descripcion);
                                                                i += 1;
                                                                // msg3 = "<script> var docOrigen= '"+ doc.data().DocOrigen +"'; </script>";
                                                                if (doc.data().Estatus == "Aplicado"){
                                                                msg2 = msg2 + "<tr>"
                                                                +"<th scope='row' style='text-align: center' id='"+doc.id+"_Num'>"+i+"</th>"
                                                                +"<td style='text-align: center' id='"+doc.id+"_CodigoBarras'>"+doc.data().CodigoBarras+"</td>"
                                                                +"<td style='text-align: center' id='"+doc.id+"_Descripcion'>"+doc.data().Descripcion+"</td>"
                                                                +"<td style='text-align: center' id='Cantidad'>"+doc.data().Cantidad+"</td>"
                                                                +"<td style='text-align: center' id='"+doc.id+"_Costo'>"+doc.data().Costo+"</td>"
                                                                +"<td style='text-align: center' id='Total'>"+doc.data().Total+"</td>"
                                                                +"<td style='text-align: center'><button class='btn btn-danger btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=eliminarElementosNE(this);>Eliminar</button></td>"
                                                                +"</tr>";
                                                                } else {
                                                                msg2 = msg2 + "<tr>"
                                                                +"<th scope='row' style='text-align: center' id='"+doc.id+"_Num'>"+i+"</th>"
                                                                +"<td style='text-align: center' id='"+doc.id+"_CodigoBarras'>"+doc.data().CodigoBarras+"</td>"
                                                                +"<td style='text-align: center' id='"+doc.id+"_Descripcion'>"+doc.data().Descripcion+"</td>"
                                                                +"<td style='text-align: center' id='Cantidad'>"+doc.data().Cantidad+"</td>"
                                                                +"<td style='text-align: center' id='"+doc.id+"_Costo'>"+doc.data().Costo+"</td>"
                                                                +"<td style='text-align: center' id='Total'>"+doc.data().Total+"</td>"
                                                                +"<td style='text-align: center'><button class='btn btn-danger btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=eliminarElementosNE(this);>Eliminar</button></td>"
                                                                +"<td style='text-align: center'><button class='btn btn-success btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=aplicarElementosNE(this);>Aplicar</button></td>"
                                                                +"</tr>";
                                                                }
                                                            });
                                                        //   if (i>0){
                                                        //       document.getElementById('btnFinalizar').hidden = false;
                                                        //       document.getElementById('btnFinalizar').disabled = false;
                                                        //   }
                                                            $("#tbodyNE").html(msg2);
                                                            // console.log("Current cities in CA: ", docs.join(", "));
                                                            // alert(docs);
                                                            document.getElementById('btnAgregarATabla').disabled = false;
                                                            totalizarNE(Fol);
                                                        });
                                                    })
                                                    .catch(function(error){
                                                        console.error("Error updating status of document: ", error);
                                                    });
                                                })
                                                .catch(function(error){
                                                    console.error("Error updating status of document: ", error);
                                                })
                                            } else {
                                                firebase.auth().
                                                onAuthStateChanged(function(user) {
                                                    Usuario = user.email;
                                                    db.collection("Negocios").doc(idNegocio).collection("Catalogo").doc(docIdCatalogo).collection("HistoricoCostos").doc(anio)
                                                    .update({
                                                        [[idNE]+".Fecha"]: fecha2,
                                                        [[idNE]+".Hora"]: hora2,
                                                        [[idNE]+".Folio"]: Fol,
                                                        [[idNE]+".Proveedor"]: Prov,
                                                        [[idNE]+".Usuario"]: Usuario,
                                                        [[idNE]+".Creado"]: firebase.firestore.Timestamp.now(),
                                                        [[idNE]+".UltModif"]: firebase.firestore.Timestamp.now(),
                                                        [[idNE]+".DocOrigen"]: idNE,
                                                        [[idNE]+".Costo"]: costo,
                                                        [[idNE]+".UltCosto"]: costo,
                                                        [[idNE]+".Estatus"]:"Aplicado"
                                                    })
                                                    .then(function(){
                                                        console.log("Historico Costos ESTABLECIDO correctamente");
                                                        updateRef = db.collection("Negocios").doc(idNegocio).collection('Entradas').doc(idNE).collection("Articulos").doc(docId);
                                                        updateRef.update({
                                                            Estatus: "Aplicado"
                                                        })
                                                        .then(function(){
                                                            console.log("Estatus actualizado.");
                                                            db.collection("Negocios").doc(idNegocio).collection("Entradas").doc(idNE).collection("Articulos").orderBy("Creado")
                                                            .get()
                                                            .then(function(querySnapshot){
                                                                var tablaNE = document.getElementById('tablaNE').getElementsByTagName('tbody')[0];
                                                                tablaNE.innerHTML = '';
                                                            //   document.getElementById('btnFinalizar').hidden = true;
                                                                var i = 0;
                                                                var msg2 = "";

                                                                var docs = [];
                                                                querySnapshot.forEach(function(doc) {
                                                                    docs.push(doc.data().Descripcion);
                                                                    i += 1;
                                                                    // msg3 = "<script> var docOrigen= '"+ doc.data().DocOrigen +"'; </script>";
                                                                    if (doc.data().Estatus == "Aplicado"){
                                                                    msg2 = msg2 + "<tr>"
                                                                    +"<th scope='row' style='text-align: center' id='"+doc.id+"_Num'>"+i+"</th>"
                                                                    +"<td style='text-align: center' id='"+doc.id+"_CodigoBarras'>"+doc.data().CodigoBarras+"</td>"
                                                                    +"<td style='text-align: center' id='"+doc.id+"_Descripcion'>"+doc.data().Descripcion+"</td>"
                                                                    +"<td style='text-align: center' id='Cantidad'>"+doc.data().Cantidad+"</td>"
                                                                    +"<td style='text-align: center' id='"+doc.id+"_Costo'>"+doc.data().Costo+"</td>"
                                                                    +"<td style='text-align: center' id='Total'>"+doc.data().Total+"</td>"
                                                                    +"<td style='text-align: center'><button class='btn btn-danger btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=eliminarElementosNE(this);>Eliminar</button></td>"
                                                                    +"</tr>";
                                                                    } else {
                                                                    msg2 = msg2 + "<tr>"
                                                                    +"<th scope='row' style='text-align: center' id='"+doc.id+"_Num'>"+i+"</th>"
                                                                    +"<td style='text-align: center' id='"+doc.id+"_CodigoBarras'>"+doc.data().CodigoBarras+"</td>"
                                                                    +"<td style='text-align: center' id='"+doc.id+"_Descripcion'>"+doc.data().Descripcion+"</td>"
                                                                    +"<td style='text-align: center' id='Cantidad'>"+doc.data().Cantidad+"</td>"
                                                                    +"<td style='text-align: center' id='"+doc.id+"_Costo'>"+doc.data().Costo+"</td>"
                                                                    +"<td style='text-align: center' id='Total'>"+doc.data().Total+"</td>"
                                                                    +"<td style='text-align: center'><button class='btn btn-danger btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=eliminarElementosNE(this);>Eliminar</button></td>"
                                                                    +"<td style='text-align: center'><button class='btn btn-success btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=aplicarElementosNE(this);>Aplicar</button></td>"
                                                                    +"</tr>";
                                                                    }
                                                                });
                                                            //   if (i>0){
                                                            //       document.getElementById('btnFinalizar').hidden = false;
                                                            //       document.getElementById('btnFinalizar').disabled = false;
                                                            //   }
                                                                $("#tbodyNE").html(msg2);
                                                                // console.log("Current cities in CA: ", docs.join(", "));
                                                                // alert(docs);
                                                                document.getElementById('btnAgregarATabla').disabled = false;
                                                                totalizarNE(Fol);
                                                            });
                                                        })
                                                        .catch(function(error){
                                                            console.error("Error updating status of document: ", error);
                                                        });
                                                    })
                                                    .catch(function(error){
                                                        console.log("Historico Costos NO ESTABLECIDO - ERROR");
                                                    })
                                                })
                                            }
                                        })
                                    })
                                    .catch(function(error){
                                        console.error("Error updating existencia of document: ", error);
                                    });
                                })
                                .catch(function(error){
                                    console.error("Error retrieving document: ", error);
                                })
                                .catch(function(error){
                                    console.error("Error updating existencia of document: ", error);
                                });
                            });
                        })
                    })
                    .catch(function(error) {
                        console.error("Error adding document: ", error);
                        alert("Ocurrió algún error, reintenta por favor." + error);
                    });
                } else {
                    alert("El artículo existe en el documento. Elimínalo primero.");
                    document.getElementById('btnAgregarATabla').disabled = false;
                }
            })
            .catch(function(){

            })
        } else {
            console.log("Nota Entrada NO EXISTE, creando");
            firebase.auth().
            onAuthStateChanged(function(user) {
                Usuario = user.email;
                docRef.set({
                    Fecha: fecha2,
                    Hora: hora2,
                    Folio: Fol,
                    Proveedor: Prov,
                    Usuario: Usuario,
                    Creado: firebase.firestore.Timestamp.now(),
                    DocOrigen: idNE,
                    Anio: $("#anio").text()
                })
                .then(function() {
                    console.log("Nota Entrada CREADA con éxito. Agregando artículo.");
                    document.getElementById('timestamp').innerHTML = firebase.firestore.Timestamp.now().toMillis;
                    //alert($("#timestamp").html());
                    document.getElementById('docOrigen').innerHTML = idNE;
                    db.collection("Negocios").doc(idNegocio).collection('Entradas').doc(idNE).collection("Articulos").where('CodigoBarras', '==', CB)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach(function(){
                            bandera = true;
                        })
                        if (bandera == false){
                            docRef = db.collection("Negocios").doc(idNegocio).collection("Entradas").doc(idNE).collection("Articulos");
                            docRef.add({
                                CodigoBarras: CB,
                                Id: Id,
                                Descripcion: Des,
                                Cantidad: parseFloat(Can),
                                Costo: parseFloat(Cos),
                                Total: parseFloat(Tot),
                                Creado: firebase.firestore.Timestamp.now(),
                                DocOrigen: idNE,
                                Estatus: "No Aplicado"
                            })
                            .then(function(docRef) {
                                console.log("Artículo Agregado a Nota Entrada.", docRef.id);

                                var DES = document.getElementById('tdDescripcion_agregar');
                                DES.innerHTML = '';
                                var node = document.createElement("input");
                                var att = document.createAttribute("id");
                                att.value = "Catalogo";
                                node.setAttributeNode(att);
                                var att2 = document.createAttribute("placeholder");
                                att2.value = "Selecciona...";
                                node.setAttributeNode(att2);
                                document.getElementById('tdDescripcion_agregar').appendChild(node);

                                // $("#cmbDescripcion").text("");
                                $("#tdCodigoBarras_agregar").text("");
                                $("#tdCantidad_agregar").text("");
                                $("#tdCosto_agregar").text("");
                                $("#tdTotal_agregar").text("");
                                document.getElementById('btnAgregarATabla').disabled = false;

                                llenarComboBox("Catalogo", "cmbDescripcion", "form-control");
    
                                db.collection("Negocios").doc(idNegocio).collection("Entradas").doc(idNE).collection("Articulos").where('CodigoBarras', '==', CB)
                                .get()
                                .then(function(querySnapshot) {
                                    // document.getElementById('tbodyNE').innerHTML = '';
                                    querySnapshot.forEach(function(doc) {
                                        var docIdCatalogo = doc.data().Id;
                                        var docId = doc.id;
                                        var costo = doc.data().Costo;
                                        var cantidad = doc.data().Cantidad;
                                        var updateRef = db.collection("Negocios").doc(idNegocio).collection('Catalogo').doc(docIdCatalogo);
                                        var margen;
                                        db.collection("Negocios").doc(idNegocio).collection('Catalogo').doc(docIdCatalogo)
                                        .get()
                                        .then(function(doc){
                                            margen = ((doc.data().Precio / costo) - 1) * 100;
                                            var costoPrevio = doc.data().UltimoCosto;
                                            var provPrevio = doc.data().UltimoProveedor;
                                            if (costoPrevio == undefined){costoPrevio=0;}
                                            if (provPrevio == undefined){provPrevio="";}
                                            updateRef.update({
                                                Existencia: firebase.firestore.FieldValue.increment(cantidad),
                                                UltimoCosto: costo,
                                                UltimoProveedor: Prov,
                                                MargenActual: parseFloat(margen.toFixed(1)),
                                                CostoPrevio: costoPrevio,
                                                ProvPrevio: provPrevio
                                            })
                                            .then(function(){
                                                console.log("Existencia actualizada.");
                                                db.collection("Negocios").doc(idNegocio).collection("Catalogo").doc(docIdCatalogo).collection("HistoricoCostos").doc(fecha7.getFullYear().toString())
                                                .update({
                                                    [[idNE]+".Fecha"]: fecha2,
                                                    [[idNE]+".Hora"]: hora2,
                                                    [[idNE]+".Folio"]: Fol,
                                                    [[idNE]+".Proveedor"]: Prov,
                                                    [[idNE]+".Usuario"]: Usuario,
                                                    [[idNE]+".Creado"]: firebase.firestore.Timestamp.now(),
                                                    [[idNE]+".UltModif"]: firebase.firestore.Timestamp.now(),
                                                    [[idNE]+".DocOrigen"]: idNE,
                                                    [[idNE]+".Costo"]: costo,
                                                    [[idNE]+".UltCosto"]: costo,
                                                    [[idNE]+".Estatus"]:"Aplicado"
                                                })
                                                .then(function() {
                                                    console.log("Hisórico de Costos establecido correctamente.");
                                                    console.log(docId);
                                                    updateRef = db.collection("Negocios").doc(idNegocio).collection('Entradas').doc(idNE).collection("Articulos").doc(docId);
                                                    updateRef.update({
                                                        Estatus: "Aplicado"
                                                    })
                                                    .then(function(){
                                                        console.log("Estatus actualizado.");
                                                        db.collection("Negocios").doc(idNegocio).collection("Entradas").doc(idNE).collection("Articulos").orderBy("Creado")
                                                        .get()
                                                        .then(function(querySnapshot){
                                                            var tablaNE = document.getElementById('tablaNE').getElementsByTagName('tbody')[0];
                                                            tablaNE.innerHTML = '';
                                                        //   document.getElementById('btnFinalizar').hidden = true;
                                                            var i = 0;
                                                            var msg2 = "";
            
                                                            var docs = [];
                                                            querySnapshot.forEach(function(doc) {
                                                                docs.push(doc.data().Descripcion);
                                                                i += 1;
                                                                // msg3 = "<script> var docOrigen= '"+ doc.data().DocOrigen +"'; </script>";
                                                                if (doc.data().Estatus == "Aplicado"){
                                                                msg2 = msg2 + "<tr>"
                                                                +"<th scope='row' style='text-align: center' id='"+doc.id+"_Num'>"+i+"</th>"
                                                                +"<td style='text-align: center' id='"+doc.id+"_CodigoBarras'>"+doc.data().CodigoBarras+"</td>"
                                                                +"<td style='text-align: center' id='"+doc.id+"_Descripcion'>"+doc.data().Descripcion+"</td>"
                                                                +"<td style='text-align: center' id='Cantidad'>"+doc.data().Cantidad+"</td>"
                                                                +"<td style='text-align: center' id='"+doc.id+"_Costo'>"+doc.data().Costo+"</td>"
                                                                +"<td style='text-align: center' id='Total'>"+doc.data().Total+"</td>"
                                                                +"<td style='text-align: center'><button class='btn btn-danger btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=eliminarElementosNE(this);>Eliminar</button></td>"
                                                                +"</tr>";
                                                                } else {
                                                                msg2 = msg2 + "<tr>"
                                                                +"<th scope='row' style='text-align: center' id='"+doc.id+"_Num'>"+i+"</th>"
                                                                +"<td style='text-align: center' id='"+doc.id+"_CodigoBarras'>"+doc.data().CodigoBarras+"</td>"
                                                                +"<td style='text-align: center' id='"+doc.id+"_Descripcion'>"+doc.data().Descripcion+"</td>"
                                                                +"<td style='text-align: center' id='Cantidad'>"+doc.data().Cantidad+"</td>"
                                                                +"<td style='text-align: center' id='"+doc.id+"_Costo'>"+doc.data().Costo+"</td>"
                                                                +"<td style='text-align: center' id='Total'>"+doc.data().Total+"</td>"
                                                                +"<td style='text-align: center'><button class='btn btn-danger btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=eliminarElementosNE(this);>Eliminar</button></td>"
                                                                +"<td style='text-align: center'><button class='btn btn-success btn-sm' id='"+doc.data().DocOrigen+"' name='"+doc.id+"' onclick=aplicarElementosNE(this);>Aplicar</button></td>"
                                                                +"</tr>";
                                                                }
                                                            });
                                                        //   if (i>0){
                                                        //       document.getElementById('btnFinalizar').hidden = false;
                                                        //       document.getElementById('btnFinalizar').disabled = false;
                                                        //   }
                                                            $("#tbodyNE").html(msg2);
                                                            // console.log("Current cities in CA: ", docs.join(", "));
                                                            // alert(docs);
                                                            document.getElementById('btnAgregarATabla').disabled = false;
                                                            totalizarNE(Fol);
                                                        });
                                                    })
                                                    .catch(function(error){
                                                        console.error("Error updating status of document: ", error);
                                                    });
                                                })
                                                .catch(function(error) {
                                                    console.error("Error writing document: ", error);
                                                });
                                            })
                                            .catch(function(error){
                                                console.error("Error updating existencia of document: ", error);
                                            });
                                        })
                                        .catch(function(error){
                                            console.error("Error retrieving document: ", error);
                                        })                                        
                                    });
                                })
                            })
                            .catch(function(error) {
                                console.error("Error adding document: ", error);
                                alert("Ocurrió algún error, reintenta por favor." + error);
                            });
                        } else {
                            alert("El artículo existe en el documento. Elimínalo primero.");
                        }
                    })
                    .catch(function(){

                    })
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

function getInfoProducto_agregar_NE_codigo_barras(codigo){
    var idNegocio = getCookie("idNegocio");
    var CB = document.getElementById('tdCodigoBarras_agregar');
    CB.innerHTML = '';
    CB.innerHTML = codigo;
    var DES = document.getElementById('cmbDescripcion');
    var ID = document.getElementById('tdIdArticulo_agregar');
    ID.innerHTML = '';
    //var codigo = tabla.getElementById('tdCodigoBarras_agregar')[0];
    var bandera = false;

    db.collection("Negocios").doc(idNegocio).collection('Catalogo').where('CodigoBarras', '==', codigo).get()
    .then((querySnapshot) => {
        querySnapshot.forEach(function(doc){
            // DES.innerHTML='';
            DES.value = doc.get("Descripcion");
            ID.innerHTML = doc.id;
            console.log("ID: "+ doc.id);
            $("#tdCantidad_agregar").focus();
            bandera = true;
        })
        if (bandera == false){
            alert("Ese código de barras no existe");
        }
    })
    .catch(function(error){
        alert("Error: "+error);
    });


}

function getInfoProducto_agregar_NE_descripcion(descripcion){
    var idNegocio = getCookie("idNegocio");
    var CB = document.getElementById('tdCodigoBarras_agregar');
    var ID = document.getElementById('tdIdArticulo_agregar');
    CB.innerHTML = '';
    ID.innerHTML = '';
    //var codigo = tabla.getElementById('tdCodigoBarras_agregar')[0];

    db.collection("Negocios").doc(idNegocio).collection('Catalogo').where('Descripcion', '==', descripcion).get()
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

function CargarProveedoresFiltroRazonSocial(criterio){
    var idNegocio = getCookie("idNegocio");
    var tabla = document.getElementById('tabla_proveedores').getElementsByTagName('tbody')[0];
    tabla.innerHTML = '';
    var i = 0;
    db.collection("Negocios").doc(idNegocio).collection("Proveedores").where("RazonSocial", "==", criterio)
    .get().then((querySnapshot) => {
        querySnapshot.forEach(function(doc) {
            i = i + 1;
            // console.log(doc.id, " => ", doc.data().RazonSocial);
            if (doc.id != 'Proveedores'){
                var msg =
                '<tr><th scope="row" style="text-align: center">'+i+'</th><td style="text-align: center">'+doc.data().RazonSocial+'</td><td style="text-align: center">'+doc.data().RFC+'</td><td style="text-align: center">'+doc.data().Direccion+'</td><td style="text-align: center">'+doc.data().NoExt+'</td><td style="text-align: center">'+doc.data().NoInt+'</td><td style="text-align: center">'+doc.data().Colonia+'</td><td style="text-align: center">'+doc.data().Ciudad+'</td><td style="text-align: center">'+doc.data().Estado+'</td><td style="text-align: center">'+doc.data().Telefono+'</td></tr>';
                var newRow  = tabla.insertRow(tabla.rows.length);
                newRow.innerHTML = msg;
            }
        });
    });
}

function AgregarProveedor(){
    document.getElementById('btnAgregar').disabled = true;
    var idNegocio = document.getElementById('idNegocio').innerHTML;
    var Raz = document.getElementById('txtRazonSocial').value;
    var RFC = document.getElementById('txtRFC').value;
    var Dir = document.getElementById('txtDireccion').value;
    var Ciu = document.getElementById('txtCiudad').value;
    var NoInt = document.getElementById('txtNoInt').value;
    var NoExt = document.getElementById('txtNoExt').value;
    var Col = document.getElementById('txtColonia').value;
    var CP = document.getElementById('txtCodigoPostal').value;
    var Tel = parseInt(document.getElementById('txtTelefono').value);
    var cmbEstados = document.getElementById('cmbEstados');
    var Estado = cmbEstados.value;

    if (Raz == "") {
        alert("La razón social es requerida");
        document.getElementById('txtRazonSocial').focus();
        document.getElementById('btnAgregar').disabled = false;
        return;
    }
    var bandera = 0;

    db.collection("Negocios").doc(idNegocio).collection("Proveedores").where("RazonSocial", "==", Raz)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
            bandera = 1;
        });

        if (bandera == 0){
            db.collection("Negocios").doc(idNegocio).collection("Proveedores").add({
                RazonSocial: Raz,
                RFC: RFC,
                Direccion: Dir,
                Ciudad: Ciu,
                NoExt: NoExt,
                NoInt: NoInt,
                Colonia: Col,
                Estado: Estado,
                CodigoPostal: CP,
                Telefono: parseInt(Tel)
            })
            .then(function(docRef) {
                db.collection("Negocios").doc(idNegocio).collection("Proveedores").doc("Proveedores").update({
                    Descripcion: firebase.firestore.FieldValue.arrayUnion(Raz)
                }).then(function() {
                    console.log("Document written with ID: ", docRef.id);
                    alert("¡Agregado correctamente!");
                    location.reload();
                }).catch(function(error) {
                    alert("Ocurrió algún error, reintenta por favor." + error)
                    document.getElementById('txtRazonSocial').focus();
                });
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
                alert("Ocurrió algún error, reintenta por favor.")
                document.getElementById('txtRazonSocial').focus();
            });
        } else {
            alert("¡Esa razón social ya existe!");
            document.getElementById('txtRazonSocial').focus();
        }
        document.getElementById('btnAgregar').disabled = false;
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
        alert("Ocurrió algún error, reintenta por favor.")
        document.getElementById('txtRazonSocial').focus();
        document.getElementById('btnAgregar').disabled = false;
    });
}

function validarFecha(d){
    var dia, mes;
    if (d.getDate()<10){dia = '0'+d.getDate();}else{dia = d.getDate()};
    if ((d.getMonth()+1)<10){mes = '0'+(d.getMonth()+1);}else{mes = (d.getMonth()+1)};
    return [dia, mes];
}

function getNum(val) {
    val = +val || 0
    return val;
 }

function loadIndexGraphs(){
    var idNegocio = document.getElementById('idNegocio').innerHTML;

    var fecha7 = new Date();
    var fecha7String = validarFecha(fecha7)[0] + "/" + validarFecha(fecha7)[1] + "/" + fecha7.getFullYear();
    var fecha6 = new Date(fecha7 - 86400000);
    var fecha6String = validarFecha(fecha6)[0] + "/" + validarFecha(fecha6)[1] + "/" + fecha6.getFullYear();
    var fecha5 = new Date(fecha6 - 86400000);
    var fecha5String = validarFecha(fecha5)[0] + "/" + validarFecha(fecha5)[1] + "/" + fecha5.getFullYear();
    var fecha4 = new Date(fecha5 - 86400000);
    var fecha4String = validarFecha(fecha4)[0] + "/" + validarFecha(fecha4)[1] + "/" + fecha4.getFullYear();
    var fecha3 = new Date(fecha4 - 86400000);
    var fecha3String = validarFecha(fecha3)[0] + "/" + validarFecha(fecha3)[1] + "/" + fecha3.getFullYear();
    var fecha2 = new Date(fecha3 - 86400000);
    var fecha2String = validarFecha(fecha2)[0] + "/" + validarFecha(fecha2)[1] + "/" + fecha2.getFullYear();
    var fecha1 = new Date(fecha2 - 86400000);
    var fecha1String = validarFecha(fecha1)[0] + "/" + validarFecha(fecha1)[1] + "/" + fecha1.getFullYear();

    var documentos = Array();

    var getOptions = {source: 'default'};

    db.collection("Negocios").doc(idNegocio).collection("KPI").doc("VentaTotal").collection(fecha7.getFullYear().toString()).doc(validarFecha(fecha7)[1].toString())
    .get(getOptions)
    .then(function(doc) {
        console.log(doc.id, " => ", doc.get("VentaTotal"));
        documentos.push(doc.get("VentaTotal"));
        console.log(documentos[0][fecha7String]);


        $("#graphVentaTotal").sparkline([getNum(documentos[0][fecha1String]), getNum(documentos[0][fecha2String]),
        getNum(documentos[0][fecha3String]), getNum(documentos[0][fecha4String]), getNum(documentos[0][fecha5String]), getNum(documentos[0][fecha6String]), getNum(documentos[0][fecha7String])], {
            type: 'line',
            width: '99.5%',
            height: '100',
            lineColor: '#5969ff',
            fillColor: '#dbdeff',
            lineWidth: 2,
            spotColor: undefined,
            minSpotColor: undefined,
            maxSpotColor: undefined,
            highlightSpotColor: 'deeppink',
            highlightLineColor: undefined,
            resize: true
        });

        document.getElementById('totalVentaTotal').innerHTML = "$"+(getNum(documentos[0][fecha1String])+getNum(documentos[0][fecha2String])+getNum(documentos[0][fecha3String])+getNum(documentos[0][fecha4String])+
        getNum(documentos[0][fecha5String])+getNum(documentos[0][fecha6String])+getNum(documentos[0][fecha7String])).toString();
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}



function RegistrarVentaHistorico(){
    document.getElementById('btnRegistrarVenta').disabled = true;
    var idNegocio = document.getElementById('idNegocio').innerHTML;
    var Cod = document.getElementById('txtCodigoBarras').value;

    if (Cod == "") {
        alert("¡Escribe algo! ¬¬");
        document.getElementById('txtCodigoBarras').focus();
        document.getElementById('btnRegistrarVenta').disabled = false;
        return;
    }
    var bandera = 0;

    db.collection("Negocios").doc(idNegocio).collection("Catalogo").where("CodigoBarras", "==", Cod)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            bandera = 1;
        });

        if (bandera == 0){
            db.collection("Negocios").doc(idNegocio).collection("Catalogo").add({
                CodigoBarras: Cod,
                Descripcion: Des,
                Unidades: Uni,
                Presentacion: Pres,
                Categoria1: Cat1,
                Categoria2: Cat2,
                Precio: Prec
            })
            .then(function(docRef) {
                db.collection("Negocios").doc(idNegocio).collection("Catalogo").doc("Catalogo").update({
                    Descripcion: firebase.firestore.FieldValue.arrayUnion(Des)
                }).then(function() {
                    console.log("Document written with ID: ", docRef.id);
                    alert("¡Agregado correctamente!");
                    document.getElementById('txtCodigoBarras').focus();
                    var x = document.getElementById("txtCodigoBarras");
                    x.value = "";
                    var y = document.getElementById("txtDescripcion");
                    y.value = "";
                    var w = document.getElementById("txtUnidades");
                    w.value = "";
                    var z = document.getElementById("txtPrecio");
                    z.value = "";
                    document.getElementById("cmbPresentacion").selectedIndex = 0;
                    document.getElementById("cmbCategoria1").selectedIndex = 0;
                    document.getElementById("cmbCategoria2").selectedIndex = 0;
                }).catch(function() {
                    alert("Ocurrió algún error, reintenta por favor.")
                    document.getElementById('txtDescripcion').focus();
                });
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
                alert("Ocurrió algún error, reintenta por favor.")
                document.getElementById('txtCodigoBarras').focus();
            });
        } else {
            alert("¡Ese código de barras ya existe!");
            document.getElementById('txtCodigoBarras').focus();
        }
        document.getElementById('btnAgregar').disabled = false;
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
        alert("Ocurrió algún error, reintenta por favor.")
        document.getElementById('txtCodigoBarras').focus();
        document.getElementById('btnAgregar').disabled = false;
    });
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

function CargarCatalogo(){
    var idNegocio = getCookie("idNegocio");
    var tabla = document.getElementById('tabla_catalogo').getElementsByTagName('tbody')[0];
    tabla.innerHTML = '';
    var i = 0;
    db.collection("Negocios").doc(idNegocio).collection("Catalogo").orderBy("Descripcion")
    .get().then((querySnapshot) => {
        querySnapshot.forEach(function(doc) {
            i = i + 1;
            // console.log(doc.id, " => ", doc.data().Descripcion);
            if (doc.id != 'Catalogo'){
                var existencia = "-";
                if (doc.data().Existencia != undefined){
                    existencia = doc.data().Existencia;
                }
                var UltimoCosto = "-";
                if (doc.data().UltimoCosto != undefined){
                    UltimoCosto = doc.data().UltimoCosto;
                }
                var UltimoProveedor = "-";
                if (doc.data().UltimoProveedor != undefined){
                    UltimoProveedor = doc.data().UltimoProveedor;
                }
                var MargenActual = "-";
                if (doc.data().MargenActual != undefined){
                    MargenActual = doc.data().MargenActual;
                }
                var msg =
                '<tr><th scope="row" style="text-align: center">'+i+'</th><td style="text-align: center" id="codigoBarras">'+doc.data().CodigoBarras+'</td><td style="text-align: center">'+doc.data().Descripcion+'</td><td style="text-align: center">'+doc.data().Unidades+'</td><td style="text-align: center">'+doc.data().Presentacion+'</td><td style="text-align: center">'+doc.data().Categoria1+'</td><td style="text-align: center">'+doc.data().Categoria2+'</td><td style="text-align: center" id="precioProducto">$'+doc.data().Precio+'</td><td style="text-align: center">'+existencia+'</td><td style="text-align: center">$'+UltimoCosto+'</td><td style="text-align: center">'+UltimoProveedor+'</td><td style="text-align: center">'+MargenActual+' %</td></tr>';
                var newRow  = tabla.insertRow(tabla.rows.length);
                newRow.innerHTML = msg;
            }
        });
        var d = new Date();
        var minutos, horas, dia, mes;
        if (d.getMinutes()<10){minutos = '0'+d.getMinutes();}else{minutos = d.getMinutes()};
        if (d.getHours()<10){horas = '0'+d.getHours();}else{horas = d.getHours()};
        if (d.getDate()<10){dia = '0'+d.getDate();}else{dia = d.getDate()};
        if (d.getMonth()<10){mes = '0'+(d.getMonth()+1);}else{mes = (d.getMonth()+1)};

        var nombreArchivo = 'Catálogo '+dia+'/'+mes+'/'+d.getFullYear()+'  '+horas+':'+minutos;
        PDF_Prueba(nombreArchivo);
        document.getElementById("cmbDescripcion").selectedIndex = 0;
        document.getElementById("cmbCategoria1").selectedIndex = 0;
        document.getElementById("cmbCategoria2").selectedIndex = 0;
        // document.getElementById("cmbFabricante").selectedIndex = 0;
    });
}

function PDFCatalogoCalcularNombreArchivo(){
    var d = new Date();
    var minutos, horas, dia, mes;
    if (d.getMinutes()<10){minutos = '0'+d.getMinutes();}else{minutos = d.getMinutes()};
    if (d.getHours()<10){horas = '0'+d.getHours();}else{horas = d.getHours()};
    if (d.getDate()<10){dia = '0'+d.getDate();}else{dia = d.getDate()};
    if (d.getMonth()<10){mes = '0'+(d.getMonth()+1);}else{mes = (d.getMonth()+1)};

    var nombreArchivo = 'Catálogo '+dia+'/'+mes+'/'+d.getFullYear()+'  '+horas+':'+minutos;
    PDF_Prueba(nombreArchivo);
}

function PDF_Prueba(nombreArchivo){
    var doc = new jsPDF('landscape')
    var img = new Image()
        // try{

    // } catch {
    //     img.src = "/negocios/img/logo_editado.png"
    img.src = "./img/x.png"
    img.onload = function() {
        var totalPagesExp = '{total_pages_count_ string}'

        doc.autoTable({
            html: '#tabla_catalogo',
            didDrawPage: function (data) {
            // Header
            doc.setFontSize(8)
            doc.setTextColor(40)
            doc.setFontStyle('Helvetica')

            doc.addImage(img, 'PNG', 8, 10, 45, 14)
            doc.text(nombreArchivo, data.settings.margin.left + 250, data.settings.margin.top - 5)

            // Footer
            var str = 'Página ' + doc.internal.getNumberOfPages()
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
                str = str + ' de ' + totalPagesExp
            }
            doc.setFontSize(5)

            // jsPDF 1.4+ uses getWidth, <1.4 uses .width
            var pageSize = doc.internal.pageSize
            var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
            doc.text(str, data.settings.margin.left, pageHeight - 10)
            },
            margin: { top: 35, left: 6, right: 6, bottom: 15 },
        })

        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp)
        }

        doc.save(nombreArchivo+'.pdf')

        var SistemaOP = getMobileOperatingSystem();
        if (SistemaOP == "Android"){
            alert("¡Revisa tu carpeta de descargas!");
        } else if (SistemaOP == "iOS"){
            alert("Presiona 'Compartir' y 'Guardar en 'Archivos' por favor.");
        } else {
            alert("¡Revisa tu carpeta de descargas!");
        }

        return doc
    }
}

function CargarCatalogoFiltroDescripcion(criterio){
    var idNegocio = getCookie("idNegocio");
    var tabla = document.getElementById('tabla_catalogo').getElementsByTagName('tbody')[0];
    tabla.innerHTML = '';
    var i = 0;
    db.collection("Negocios").doc(idNegocio).collection("Catalogo").where("Descripcion", "==", criterio)
    .get().then((querySnapshot) => {
        querySnapshot.forEach(function(doc) {
            i = i + 1;
            // console.log(doc.id, " => ", doc.data().Descripcion);
            if (doc.id != 'Desc'){
                var existencia = "-";
                if (doc.data().Existencia != undefined){
                    existencia = doc.data().Existencia;
                }
                var UltimoCosto = "-";
                if (doc.data().UltimoCosto != undefined){
                    UltimoCosto = doc.data().UltimoCosto;
                }
                var UltimoProveedor = "-";
                if (doc.data().UltimoProveedor != undefined){
                    UltimoProveedor = doc.data().UltimoProveedor;
                }
                var MargenActual = "-";
                if (doc.data().MargenActual != undefined){
                    MargenActual = doc.data().MargenActual;
                }
                var msg = "<tr>"
                +"<th scope='row' style='text-align: center'>"+i+"</th>"
                +"<td style='text-align: center' id='"+i+"_codigoBarrasProducto'>"+doc.data().CodigoBarras+"</td>"
                +"<td style='text-align: center' id='"+i+"_descripcionProducto'><a href='#' style='color: blue' data-toggle='modal' data-target='#modalInfoAdicionalProducto'>"+doc.data().Descripcion+"</a></td>"
                +"<td style='text-align: center'>"+doc.data().Unidades+"</td>"
                +"<td style='text-align: center'>"+doc.data().Presentacion+"</td>"
                +"<td style='text-align: center'>"+doc.data().Categoria1+"</td>"
                +"<td style='text-align: center'>"+doc.data().Categoria2+"</td>"
                +"<td style='text-align: center' id='"+i+"_precioProducto' contenteditable='true' onclick='index(this)'>"+doc.data().Precio+"</td>"
                +"<td style='text-align: center'>"+existencia+"</td>"
                +"<td style='text-align: center' id='"+i+"_costoProducto'>"+UltimoCosto+"</td>"
                +"<td style='text-align: center'>"+UltimoProveedor+"</td>"
                +"<td style='text-align: center' id='"+i+"_margenProducto'>"+MargenActual+" %</td>"
                +"</tr>";
                var newRow  = tabla.insertRow(tabla.rows.length);
                newRow.innerHTML = msg;
            }
        });

        var x = document.getElementById("cmbCategoria1");
        x.value = "";
        x = document.getElementById("cmbCategoria2");
        x.value = "";
        //document.getElementById("cmbFabricante").selectedIndex = 0;
    });
}

function CargarCatalogoFiltroCategoria1(criterio){
    var idNegocio = getCookie("idNegocio");
    var tabla = document.getElementById('tabla_catalogo').getElementsByTagName('tbody')[0];
    tabla.innerHTML = '';
    var i = 0;
    db.collection("Negocios").doc(idNegocio).collection("Catalogo").where("Categoria1", "==", criterio).orderBy('Descripcion')
    .get().then((querySnapshot) => {
        querySnapshot.forEach(function(doc) {
            i = i + 1;
            // console.log(doc.id, " => ", doc.data().Descripcion);
            if (doc.id != 'Desc'){
                var existencia = "-";
                if (doc.data().Existencia != undefined){
                    existencia = doc.data().Existencia;
                }
                var UltimoCosto = "-";
                if (doc.data().UltimoCosto != undefined){
                    UltimoCosto = doc.data().UltimoCosto;
                }
                var UltimoProveedor = "-";
                if (doc.data().UltimoProveedor != undefined){
                    UltimoProveedor = doc.data().UltimoProveedor;
                }
                var MargenActual = "-";
                if (doc.data().MargenActual != undefined){
                    MargenActual = doc.data().MargenActual;
                }
                var msg = "<tr>"
                +"<th scope='row' style='text-align: center'>"+i+"</th>"
                +"<td style='text-align: center' id='"+i+"_codigoBarrasProducto'>"+doc.data().CodigoBarras+"</td>"
                +"<td style='text-align: center' id='"+i+"_descripcionProducto'>"+doc.data().Descripcion+"</td>"
                +"<td style='text-align: center'>"+doc.data().Unidades+"</td>"
                +"<td style='text-align: center'>"+doc.data().Presentacion+"</td>"
                +"<td style='text-align: center'>"+doc.data().Categoria1+"</td>"
                +"<td style='text-align: center'>"+doc.data().Categoria2+"</td>"
                +"<td style='text-align: center' id='"+i+"_precioProducto' contenteditable='true' onclick='index(this)'>"+doc.data().Precio+"</td>"
                +"<td style='text-align: center'>"+existencia+"</td>"
                +"<td style='text-align: center' id='"+i+"_costoProducto'>"+UltimoCosto+"</td>"
                +"<td style='text-align: center'>"+UltimoProveedor+"</td>"
                +"<td style='text-align: center' id='"+i+"_margenProducto'>"+MargenActual+" %</td>"
                +"</tr>";
                var newRow  = tabla.insertRow(tabla.rows.length);
                newRow.innerHTML = msg;
            }
        });

        var x = document.getElementById("cmbDescripcion");
        x.value = "";
        x = document.getElementById("cmbCategoria2");
        x.value = "";
    });
}

function CargarCatalogoFiltroCategoria2(criterio){
    var idNegocio = getCookie("idNegocio");
    var tabla = document.getElementById('tabla_catalogo').getElementsByTagName('tbody')[0];
    tabla.innerHTML = '';
    var i = 0;
    db.collection("Negocios").doc(idNegocio).collection("Catalogo").where("Categoria2", "==", criterio).orderBy('Descripcion')
    .get().then((querySnapshot) => {
        querySnapshot.forEach(function(doc) {
            i = i + 1;
            // console.log(doc.id, " => ", doc.data().Descripcion);
            if (doc.id != 'Desc'){
                var existencia = "-";
                if (doc.data().Existencia != undefined){
                    existencia = doc.data().Existencia;
                }
                var UltimoCosto = "-";
                if (doc.data().UltimoCosto != undefined){
                    UltimoCosto = doc.data().UltimoCosto;
                }
                var UltimoProveedor = "-";
                if (doc.data().UltimoProveedor != undefined){
                    UltimoProveedor = doc.data().UltimoProveedor;
                }
                var MargenActual = "-";
                if (doc.data().MargenActual != undefined){
                    MargenActual = doc.data().MargenActual;
                }
                var msg = "<tr>"
                +"<th scope='row' style='text-align: center'>"+i+"</th>"
                +"<td style='text-align: center' id='"+i+"_codigoBarrasProducto'>"+doc.data().CodigoBarras+"</td>"
                +"<td style='text-align: center' id='"+i+"_descripcionProducto'>"+doc.data().Descripcion+"</td>"
                +"<td style='text-align: center'>"+doc.data().Unidades+"</td>"
                +"<td style='text-align: center'>"+doc.data().Presentacion+"</td>"
                +"<td style='text-align: center'>"+doc.data().Categoria1+"</td>"
                +"<td style='text-align: center'>"+doc.data().Categoria2+"</td>"
                +"<td style='text-align: center' id='"+i+"_precioProducto' contenteditable='true' onclick='index(this)'>"+doc.data().Precio+"</td>"
                +"<td style='text-align: center'>"+existencia+"</td>"
                +"<td style='text-align: center' id='"+i+"_costoProducto'>"+UltimoCosto+"</td>"
                +"<td style='text-align: center'>"+UltimoProveedor+"</td>"
                +"<td style='text-align: center' id='"+i+"_margenProducto'>"+MargenActual+" %</td>"
                +"</tr>";
                var newRow  = tabla.insertRow(tabla.rows.length);
                newRow.innerHTML = msg;
            }
        });

        var x = document.getElementById("cmbDescripcion");
        x.value = "";
        x = document.getElementById("cmbCategoria1");
        x.value = "";
    });
}

function validarPrecioDescripcion(desc){
    document.getElementById('btnValidarPrecio').disabled = true;
    var idNegocio = document.getElementById('idNegocio').innerHTML;
    var Des = desc;

    if (Des == "") {
        alert("¡Escribe algo! ¬¬");
        document.getElementById('txtCodigoBarrasValidarPrecio').focus();
        document.getElementById('btnValidarPrecio').disabled = false;
        return;
    }
    var bandera = 0;

    db.collection("Negocios").doc(idNegocio).collection("Catalogo").where("Descripcion", "==", Des)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            var y = document.getElementById('descripcionPrecioValidado');
            y.innerHTML = doc.data().Descripcion;
            var x = document.getElementById('precioValidado');
            x.innerHTML = '<i class="fa fa-dollar-sign" style="margin-right: 5px;"></i>' + doc.data().Precio + ' pesos.';
            $("#toastPrecioValidado").toast('show');
            document.getElementById('btnValidarPrecio').disabled = false;
            bandera = 1;
        });

        if (bandera == 0){
            alert("¡Ese código de barras no existe!");
            document.getElementById('txtCodigoBarrasValidarPrecio').focus();
            document.getElementById('btnValidarPrecio').disabled = false;
        } else {

        }
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
        alert("Ocurrió algún error, reintenta por favor.")
        document.getElementById('txtCodigoBarrasValidarPrecio').focus();
        document.getElementById('btnValidarPrecio').disabled = false;
    });
}

function validarPrecioCodigoBarras(){
    document.getElementById('btnValidarPrecio').disabled = true;
    var idNegocio = document.getElementById('idNegocio').innerHTML;
    var Cod = document.getElementById('txtCodigoBarrasValidarPrecio').value;

    if (Cod == "") {
        alert("¡Escribe algo! ¬¬");
        document.getElementById('txtCodigoBarrasValidarPrecio').focus();
        document.getElementById('btnValidarPrecio').disabled = false;
        return;
    }
    var bandera = 0;

    db.collection("Negocios").doc(idNegocio).collection("Catalogo").where("CodigoBarras", "==", Cod)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // console.log(doc.id, " => ", doc.get("CodigoBarras"));
            var y = document.getElementById('descripcionPrecioValidado');
            y.innerHTML = doc.get("Descripcion")
            var x = document.getElementById('precioValidado');
            x.innerHTML = '<i class="fa fa-dollar-sign" style="margin-right: 5px;"></i>' + doc.get("Precio") + ' pesos.';
            $("#toastPrecioValidado").toast('show');
            document.getElementById('btnValidarPrecio').disabled = false;
            bandera = 1;
        })

        if (bandera == 0){
            alert("¡Ese código de barras no existe!");
            document.getElementById('txtCodigoBarrasValidarPrecio').focus();
            document.getElementById('btnValidarPrecio').disabled = false;
        } else {

        }
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
        alert("Ocurrió algún error, reintenta por favor.")
        document.getElementById('txtCodigoBarrasValidarPrecio').focus();
        document.getElementById('btnValidarPrecio').disabled = false;
    });

}

function llenarComboBox(Coleccion, IdSelect, Class){
    var idNegocio = getCookie("idNegocio");
    var documentos;

    var getOptions = {source: 'default'};

    db.collection("Negocios").doc(idNegocio).collection(Coleccion).doc(Coleccion)
    .get(getOptions)
    .then(function(doc) {
        console.log(doc.id, " => ", doc.data());
        documentos = doc.get("Descripcion");
        var container = document.getElementById(Coleccion);
        var dlist = document.createElement('datalist');
        container.setAttribute('list', IdSelect+"_list");
        dlist.id = IdSelect+"_list";
        container.className = Class;

        for (const val of documentos){
            var option = document.createElement("option");
            option.value = val;
            option.text = val.charAt(0).toUpperCase() + val.slice(1);
            dlist.appendChild(option);
        };


        document.getElementById(Coleccion).appendChild(dlist);
        container.id = IdSelect;
        ordenarCmb(IdSelect+"_list");
        //document.getElementById(Coleccion).id = Coleccion+"2";
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

    // db.collection("Negocios").doc(idNegocio).collection(Coleccion).doc(Coleccion)
    // .get(getOptions)
    // .then(function(doc) {
    //     console.log(doc.id, " => ", doc.data());
    //     documentos = doc.get("Descripcion");
    //     var sel = document.createElement('select');
    //     sel.name = IdSelect;
    //     sel.id = IdSelect;
    //     sel.className = Class;

    //     for (const val of documentos){
    //         var option = document.createElement("option");
    //         option.value = val;
    //         option.text = val.charAt(0).toUpperCase() + val.slice(1);
    //         sel.appendChild(option);
    //     };


    //     document.getElementById(Coleccion).appendChild(sel);
    //     ordernarCmb(IdSelect);
    //     document.getElementById(Coleccion).id = Coleccion+"2";
    // })
    // .catch(function(error) {
    //     console.log("Error getting documents: ", error);
    // });
}

function ordenarCmb(id) {
    var elemento_option = "#"+id + " option";
    var elemento = "#"+id;
    var options = $(elemento_option);
    options.detach().sort(function(a, b) {
        var at = $(a).text();
        var bt = $(b).text();
        return (at > bt) ? 1 : ((at < bt) ? -1 : 0);
    });
    options.appendTo(elemento);
    //document.getElementById(id).selectedIndex = 0;
}

function AgregarCategoria2(){
    document.getElementById('btnAgregarCat2').disabled = true;
    var idNegocio = document.getElementById('idNegocio').innerHTML;
    console.log(idNegocio);
    var Descripcion = document.getElementById('txtDescripcionCategoria2').value;
    if (Descripcion == "") {
        alert("¡Escribe algo! ¬¬");
        document.getElementById('txtDescripcionCategoria2').focus();
        document.getElementById('btnAgregarCat2').disabled = false;
        return;
    }

    db.collection("Negocios").doc(idNegocio).collection("Cat2").doc("Cat2").update({
        Descripcion: firebase.firestore.FieldValue.arrayUnion(Descripcion)
    }).then(function() {
        alert("¡Agregado correctamente!");
        document.getElementById('txtDescripcionCategoria2').focus();
        var x = document.getElementById("txtDescripcionCategoria2");
        x.value = "";
    }).catch(function() {
        alert("Ocurrió algún error, reintenta por favor.")
        document.getElementById('txtDescripcionCategoria2').focus();
    });
    document.getElementById('btnAgregarCat2').disabled = false;
}

function AgregarProducto(){
    document.getElementById('btnAgregar').disabled = true;
    var idNegocio = document.getElementById('idNegocio').innerHTML;
    var Cod = document.getElementById('txtCodigoBarras').value;
    var Des = document.getElementById('txtDescripcion').value;
    var Uni = document.getElementById('txtUnidades').value;
    var cmbPres = document.getElementById('cmbPresentacion');
    var Pres = cmbPres.value;
    var cmbCat1 = document.getElementById('cmbCategoria1');
    var Cat1 = cmbCat1.value;
    var cmbCat2 = document.getElementById('cmbCategoria2');
    var Cat2 = cmbCat2.value;
    var Prec = parseFloat(document.getElementById('txtPrecio').value);


    if (Cod == "" || Des == "" || Uni == "" || Prec == "") {
        alert("Todos los campos son requeridos");
        document.getElementById('txtCodigoBarras').focus();
        document.getElementById('btnAgregar').disabled = false;
        return;
    }
    var bandera = 0;

    db.collection("Negocios").doc(idNegocio).collection("Catalogo").where("CodigoBarras", "==", Cod)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            bandera = 1;
        });

        if (bandera == 0){
            db.collection("Negocios").doc(idNegocio).collection("Catalogo").add({
                CodigoBarras: Cod,
                Descripcion: Des,
                Unidades: Uni,
                Presentacion: Pres,
                Categoria1: Cat1,
                Categoria2: Cat2,
                Precio: Prec
            })
            .then(function(docRef) {
                db.collection("Negocios").doc(idNegocio).collection("Catalogo").doc("Catalogo").update({
                    Descripcion: firebase.firestore.FieldValue.arrayUnion(Des)
                }).then(function() {
                    console.log("Document written with ID: ", docRef.id);
                    alert("¡Agregado correctamente!");
                    document.getElementById('txtCodigoBarras').focus();
                    var x = document.getElementById("txtCodigoBarras");
                    x.value = "";
                    var y = document.getElementById("txtDescripcion");
                    y.value = "";
                    var w = document.getElementById("txtUnidades");
                    w.value = "";
                    var z = document.getElementById("txtPrecio");
                    z.value = "";
                    document.getElementById("cmbPresentacion").selectedIndex = 0;
                    document.getElementById("cmbCategoria1").selectedIndex = 0;
                    document.getElementById("cmbCategoria2").selectedIndex = 0;
                }).catch(function() {
                    alert("Ocurrió algún error, reintenta por favor.")
                    document.getElementById('txtDescripcion').focus();
                });
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
                alert("Ocurrió algún error, reintenta por favor.")
                document.getElementById('txtCodigoBarras').focus();
            });
        } else {
            alert("¡Ese código de barras ya existe!");
            document.getElementById('txtCodigoBarras').focus();
        }
        document.getElementById('btnAgregar').disabled = false;
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
        alert("Ocurrió algún error, reintenta por favor.")
        document.getElementById('txtCodigoBarras').focus();
        document.getElementById('btnAgregar').disabled = false;
    });
}

function getNombreNegocio(){
    var nombreNegocio = getCookie("nombreNegocio");
    var idNegocio = getCookie("idNegocio");
    var user = getCookie("username");
    if (nombreNegocio){
        $('#nombreNegocio').html(nombreNegocio + "   -   " + user + "<span style='margin-left: 5px;'><i class='fas fa-user'></i></span>");
        $('#idNegocio').html(idNegocio);
    }
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

function checkCookie() {
    var user = getCookie("username");
    console.log(user);
    if (user != "") {
        $('#msgBienvenidoDeNuevo').html('¡Bienvenido, ' + user + '!');
        var nombreNegocio = getCookie("NombreNegocio");
        if (nombreNegocio){
            $('#nombreNegocio').html(nombreNegocio);
        }
    } else {
        alert("¡Por favor inicia sesión!");
        window.location.href="../index.html";
    }

}

function CerrarSesion(){
    firebase.auth().signOut().then(function() {
        window.location.href="/DewisMarket/public/negocios/index.html";
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "idNegocio=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "nombreNegocio=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        alert('Sesión cerrada exitosamente');
      }).catch(function() {
        alert('Imposible cerrar sesión. Contacta al administrador.');
      });
}
