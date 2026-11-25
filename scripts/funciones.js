let conceptos = [];
let mesTramite;
let anoTramite;
let pagos = [];
let gastoTotal = 0;
let resumenMostrado = false;

function mostrarConceptos() {
    let contenedor = document.getElementById("conceptos");

    conceptos.forEach(concepto => {
        let tarjeta = document.createElement("div");
        let imagen = document.createElement("img");
        let nombre = document.createElement("p");
        let importe = document.createElement("input");

        imagen.src = concepto.img;
        imagen.alt = concepto.nombre;
        nombre.textContent = concepto.nombre;
        importe.type = "number";
        importe.min = "0.01";
        importe.step = "0.01";
        importe.setAttribute("aria-label", "Importe de " + concepto.nombre);

        imagen.addEventListener("click", function () {
            registrarPago(concepto, importe.value, importe);
        });

        tarjeta.appendChild(imagen);
        tarjeta.appendChild(nombre);
        tarjeta.appendChild(importe);
        contenedor.appendChild(tarjeta);
    });
}

function iniciarTramite() {
    mesTramite = prompt("Introduce el mes del trámite");
    anoTramite = prompt("Introduce el año del trámite");
}

function cargarConceptos() {
    fetch("http://localhost:3000/conceptos")
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudieron cargar los conceptos");
            }
            return response.json();
        })
        .then(datos => {
            conceptos = datos;
            mostrarConceptos();
            iniciarTramite();
        })
        .catch(error => alert(error.message));
}

cargarConceptos();


function registrarPago(concepto, importe, entradaImporte){
    let precio = Number(importe);

    if (isNaN(precio) || !isFinite(precio) || precio <= 0) {
        alert("No se puede registrar un pago sin un importe mayor que 0");
        return;
    }

    if (resumenMostrado) {
        document.getElementById("resumenGastos").value = "";
        resumenMostrado = false;
    }

    pagos.push({ idConcepto: concepto.id, nombre: concepto.nombre, importe: precio });
    gastoTotal += precio;
    entradaImporte.value = "";
    mostrarPago(concepto, precio);
}

function mostrarPago(concepto, importe) {
    let historial = document.getElementById("historialPagos");
    let linea = document.createElement("li");

    linea.textContent = concepto.nombre + " " + importe.toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + " €";
    linea.setAttribute("data-id-concepto", concepto.id);
    historial.appendChild(linea);

    let lineas = historial.getElementsByTagName("li");

    for (let i = 0; i < lineas.length; i += 1) {
        if (lineas[i].getAttribute("data-id-concepto") === String(concepto.id)) {
            lineas[i].classList.add("destacado");
        } else {
            lineas[i].classList.remove("destacado");
        }
    }
}


function finalizarTramite(){
if (pagos.length === 0) {
        alert("No se ha registrado ningún pago");
        return;
    }
let resumen = [];

    pagos.forEach(pago => {
        let gasto = resumen.find(gasto => gasto.idConcepto === pago.idConcepto);

        if (gasto) {
            gasto.cantidad++;
            gasto.importeTotal += pago.importe;
        } else {
            resumen.push({
                idConcepto: pago.idConcepto,
                nombre: pago.nombre,
                cantidad: 1,
                importeTotal: pago.importe
            });
        }
    });

    resumen.sort((primero, segundo) => {
        if (primero.cantidad !== segundo.cantidad) {
            return segundo.cantidad - primero.cantidad;
        }
        if (primero.nombre > segundo.nombre) {
            return -1;
        }
        if (primero.nombre < segundo.nombre) {
            return 1;
        }
        return 0;
    });

    let texto = "";

    resumen.forEach(gasto => {
    let palabra;
    
    if (gasto.cantidad === 1) {
        palabra = "pago";
    } else {
        palabra = "pagos";
    }

    texto += gasto.nombre + " ---- " + gasto.cantidad + " " + palabra + "\n";
});

    let media = gastoTotal / pagos.length;
        texto += "\nGasto final: " + gastoTotal.toFixed(2) + " €";
        texto += "\nGasto medio: " + media.toFixed(2) + " €/concepto";
        document.getElementById("resumenGastos").value = texto;
    pagos = [];
    gastoTotal = 0;
    resumenMostrado = true;
}
