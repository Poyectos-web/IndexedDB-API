(function() {
    let DB;

    
    document.addEventListener('DOMContentLoaded', () => {
        crearDB();
        
        leerDB();
    })

    function crearDB() {
        const crearDB = window.indexedDB.open('Base de datos', 1);

        crearDB.onerror = () => {
            console.log('Ocurrió un error al crear la base de datos');
        }

        crearDB.onsuccess = () => {
            console.log('Base de datos creada correctamente');
        }

        crearDB.onupgradeneeded = function(e) {
            const db = e.target.result;
            const objectStore = db.createObjectStore('info', {
                keyPath: 'id',
                autoIncrement: true
            })

            objectStore.createIndex('nombre', 'nombre', {unique: false});
            objectStore.createIndex('email', 'email', {unique: true});
            objectStore.createIndex('telefono', 'telefono', {unique: false});
        }
    }

    function leerDB() {
        const listadoClientes = document.querySelector('#listado-clientes');
        const abrirConexion = window.indexedDB.open('Base de datos', 1);

        listadoClientes.addEventListener('click', eliminarRegistro);

        abrirConexion.onerror = function() {
            console.log('Hubo un error');
        }

        abrirConexion.onsuccess = function() {
            console.log('Conectado a la base de datos');
            DB = abrirConexion.result;

            const objectStore = DB.transaction('info').objectStore('info');

            objectStore.openCursor().onsuccess = function(e) {
                const cursor = e.target.result;

                if(cursor) {
                    const {nombre, email, telefono, id} = cursor.value

                    listadoClientes.innerHTML += `
                    <tr>
                        <td data-label="Nombre Cliente">${nombre}</td>
                        <td data-label="Correo">${email}</td>
                        <td data-label="Teléfono">${telefono}</td>
                        <td data-label="Acciones" class="acciones">
                            <a href="#" id="${id}" class="eliminar">Eliminar</a>
                            <a href="editar-cliente.html?id=${id}" class="editar">Editar</a>
                        </td>
                    </tr>`;
                    cursor.continue();
                }
            }
        }


    }

    function eliminarRegistro(e) {
        if(e.target.classList.contains('eliminar')){

            //Eliminar de la base de datos
            const idCliente = Number(e.target.id);
            
            const transaction = DB.transaction('info', 'readwrite');

            const objectStore = transaction.objectStore('info');

            objectStore.delete(idCliente);

            //Eliminar del HTML
            
            e.target.parentElement.parentElement.remove();
        }
    }



















})()