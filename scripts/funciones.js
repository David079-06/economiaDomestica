let conceptos = [];
let mesTramite;
let anoTramite;

function mostrarConceptos() {
    let contenedor = document.getElementById("conceptos");

    conceptos.forEach(concepto => {
        let tarjeta = document.createElement("div");
        let imagen = document.createElement("img");
        let nombre = document.createElement("p");

        imagen.src = concepto.img;
        imagen.alt = concepto.nombre;
        nombre.textContent = concepto.nombre;

        tarjeta.appendChild(imagen);
        tarjeta.appendChild(nombre);
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
let pagos = [];
let gastoTotal = 0;
let resumenMostrado = false;


function registrarPago(nombre,precio){
 precio = Number(precio);

    if (nombre === ""|| precio <= 0) {
        alert("Los datos del pago no son válidos");
        return;
    }

    if (resumenMostrado) {
        document.getElementById("resumenGastos").value = "";
        resumenMostrado = false;
    }

    pagos.push(nombre);
    gastoTotal += precio;
    console.log(pagos)
     console.log(gastoTotal)
}


function finalizarTramite(){
if (pagos.length === 0) {
        alert("No se ha registrado ningún pago");
        return;
    }
let resumen = [];

    pagos.forEach(nombre => {
        let gasto = resumen.find(gasto => gasto.nombre === nombre);

        if (gasto) {
            gasto.cantidad++;
        } else {
            resumen.push({ nombre: nombre, cantidad: 1 });
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
