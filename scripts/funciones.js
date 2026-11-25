let conceptos = [];
let mesTramite;
let anoTramite;
let pagos = [];
let resumenMostrado = false;
let categorias = {
    CULT: "Cultura",
    ALI: "Alimentación",
    DEP: "Deportes",
    OC: "Ocio",
    S_BAS: "Servicios básicos"
};

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

function mostrarDetalles(resumen) {
    let ventana = document.getElementById("detalleConceptos");
    let lista = document.getElementById("listaDetalles");

    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }

    resumen.forEach(gasto => {
        let concepto = conceptos.find(item => item.id === gasto.idConcepto);
        let detalle = document.createElement("li");
        let tipo = "prescindible";
        let categoria = categorias[concepto.categoria];

        if (concepto.imprescindible) {
            tipo = "imprescindible";
        }

        detalle.textContent = concepto.nombre + " es un gasto " + tipo + " de categoría " + categoria + ".";
        lista.appendChild(detalle);
    });

    ventana.showModal();
}


function finalizarTramite() {
    if (pagos.length === 0) {
        alert("No se ha registrado ningún pago");
        return;
    }

    let resumen = [];

    pagos.forEach(pago => {
        let gasto = resumen.find(item => item.idConcepto === pago.idConcepto);

        if (gasto) {
            gasto.cantidad += 1;
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

    resumen.sort((primero, segundo) => segundo.cantidad - primero.cantidad);

    let texto = "Fecha: " + new Date().toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).replace(",", "") + "\n";
    let totalCentimos = 0;

    resumen.forEach(gasto => {
        let palabra = "pagos";

        if (gasto.cantidad === 1) {
            palabra = "pago";
        }

        let importeMedio = gasto.importeTotal / gasto.cantidad;
        texto += gasto.nombre + " ---- " + gasto.cantidad + " " + palabra + " ---- ";
        texto += importeMedio.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " € ---- ";
        texto += gasto.importeTotal.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €\n";
        totalCentimos += Math.round(gasto.importeTotal * 100);
    });

    let total = totalCentimos / 100;
    let gastoMedio = total / resumen.length;
    texto += "Gasto final: " + Math.floor(total).toLocaleString("es-ES") + " €";
    texto += "\nGasto medio: " + gastoMedio.toLocaleString("es-ES", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
    }) + " €/concepto";

    document.getElementById("resumenGastos").value = texto;
    mostrarDetalles(resumen);
    pagos = [];
    resumenMostrado = true;
}

document.getElementById("cerrarDetalle").addEventListener("click", function () {
    document.getElementById("detalleConceptos").close();
});
