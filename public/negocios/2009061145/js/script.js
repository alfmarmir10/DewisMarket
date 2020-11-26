function loadScanner(){
	// const $resultados = document.querySelector("#txtCodigoBarras");
	Quagga.init({
		inputStream: {
			constraints: {
				width: 1920,
				height: 1080,
			},
			name: "Live",
			type: "LiveStream",
			id: "codigoCanvas",
			target: document.querySelector('#contenedor'), // Pasar el elemento del DOM
		},
		decoder: {
			readers: ['upc_reader', 'ean_reader']
			//readers: ["ean_extended_reader"]
		}
	}, function (err) {
		if (err) {
			console.log(err);
			return
		}
		console.log("Iniciado correctamente");
		Quagga.start();
	});

	Quagga.onDetected((data) => {
		// $resultados.textContent = data.codeResult.code;
		// Imprimimos todo el data para que puedas depurar
		var x = document.getElementById("txtCodigoBarras");
		x.value = data.codeResult.code;
		document.getElementById('txtDescripcion').focus();
		DisponibilidadCB();
		$('#modalScanner').modal('hide');
		console.log(data);
		Quagga.stop();
		var nodes = document.getElementsByTagName("Canvas");

		for (var i = 0, len = nodes.length; i != len; ++i) {
			nodes[0].parentNode.removeChild(nodes[0]);
		}

		var nodes = document.getElementsByTagName("video");

		for (var i = 0, len = nodes.length; i != len; ++i) {
			nodes[0].parentNode.removeChild(nodes[0]);
		}
	});

	Quagga.onProcessed(function (result) {
		var drawingCtx = Quagga.canvas.ctx.overlay,
			drawingCanvas = Quagga.canvas.dom.overlay;

		if (result) {
			if (result.boxes) {
				drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
				result.boxes.filter(function (box) {
					return box !== result.box;
				}).forEach(function (box) {
					Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
				});
			}

			if (result.box) {
				Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
			}

			if (result.codeResult && result.codeResult.code) {
				Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
			}
		}
	});
}

function StopScanner(){
	Quagga.stop();
}