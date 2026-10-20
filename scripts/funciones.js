let pagos = [];
let gastoTotal = 0;
let resumenMostrado = false;
function regristarPago(nombre,precio){
 precio = Number(precio);

    if (!nombre || precio < 0) {
        alert("Los datos del pago no son válidos");
        return;
    }

    if (resumenMostrado) {
        document.getElementById("resumenGastos").value = "";
        resumenMostrado = false;
    }

    pagos.push(nombre);
    gastoTotal += precio;
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
}
