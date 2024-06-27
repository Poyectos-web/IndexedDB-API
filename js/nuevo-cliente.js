(function() {

    let DB;
    const formulario = document.querySelector('#formulario');
    const alerta = document.querySelector('.alerta');

    formulario.addEventListener('submit', leerDatos);
    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();
    })

    function conectarDB() {
        const conectarDB = window.indexedDB.open('Base de datos', 1);

        conectarDB.onerror = () => {
            console.log('Ocurrió un error al conectar con la DB');
        }

        conectarDB.onsuccess = () => {
            console.log('Conectado correctamente');
            DB = conectarDB.result;
        }

    }

    function leerDatos(e) {
        e.preventDefault();

        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
    

        if(nombre === '' || email === '' || telefono === '') {
            imprimirAlerta('Debe llenar todos los campos', 'error');
            return
        }

        const cliente = {nombre, email, telefono, id: Date.now()}

        crearNuevoCliente(cliente);

    }

    function imprimirAlerta(mensaje, tipo) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('mensaje');

        if(tipo) {
            divMensaje.classList.add('error');
        }else {
            divMensaje.classList.add('success');
        }

        divMensaje.textContent = mensaje;
        alerta.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 2000);

    }

    function crearNuevoCliente(cliente) {
        const transaction = DB.transaction('info', 'readwrite');
        const objectStore = transaction.objectStore('info');

        objectStore.add(cliente);
        transaction.oncomplete = () => {
            imprimirAlerta('Agregado Correctamente');

            setTimeout(() => {
                window.location.href = 'index.html'
            }, 1500);
        }
        transaction.onerror = () => {
            imprimirAlerta('Ocurrió un error', 'error')
        }
    }


})();