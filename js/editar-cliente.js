(function() {
    let DB;

    let idCliente;

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    
    const alerta = document.querySelector('.alerta');
    const formulario = document.querySelector('#formulario');
    formulario.addEventListener('submit', leerDatos);

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');
        if(idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 100);
        }
    })

    function conectarDB() {
        const conectarDB = window.indexedDB.open('Base de datos', 1);

        conectarDB.onerror = () => {
            console.log('Ocurrió un error');
        }
        
        conectarDB.onsuccess = () => {
            console.log('conectado...')
            DB = conectarDB.result;
        }
    }

    function obtenerCliente(id) {
        const transaction = DB.transaction(['info'], 'readonly');
        const objectStore = transaction.objectStore('info');

        objectStore.openCursor().onsuccess = function(e) {
            const cursor = e.target.result;

            if(cursor) {
                if(cursor.value.id === Number(id)) {
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        }
    }

    function llenarFormulario(cliente) {
        const {nombre, email, telefono} = cliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
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

        const cliente = {nombre, email, telefono, id: Number(idCliente)}
        console.log(nombre, email, telefono);
        actualizarCliente(cliente);

    }


    function actualizarCliente(cliente) {
        const transaction = DB.transaction('info', 'readwrite');
        const objectStore = transaction.objectStore('info');

        objectStore.put(cliente);

        transaction.onerror = (e) => {
            console.log(e.target);
            imprimirAlerta('Este correo ya está registrado', 'error');
        }

        transaction.oncomplete = () => {
            imprimirAlerta('Editado correctamente');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
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
        }, 3000);

    }


})();