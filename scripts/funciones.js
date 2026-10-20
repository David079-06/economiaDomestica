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
}
