import { 
    formulario
} from "../index.js";
import { datos } from "../data/contactos.js";
// Contacto se exporta de index por que lo obtenemos de localStorage
import { contactos } from '../index.js';
export const validarFormulario = (e) => {
    e.preventDefault();
    // Destruturing de Objetos
    const { nombre, telefono, correo, mensaje } = datos; 
    if(!nombre || !telefono || !correo || !mensaje){
        mostrarAlerta("Todos los campos son obligatorios", true);
        return;
    }
     // Generar un ID único
    let id = generarId();
    contactos.push({id, nombre, telefono, correo, mensaje});  
    sincronizarStorage(contactos);  
    mostrarAlerta("Enviando la informacion a la base de datos");
    formulario.reset();
    resetDatos(datos);
};
export const leerTexto = (e) => {
    datos[e.target.id] = e.target.value;
    console.log(datos);
};
export const listarContactos = (contactos) =>{
    limpiarHTML();
    contactos.forEach( (contacto ) => {
        const { nombre, telefono, correo, mensaje, id } = contacto;
        const listadoContactos = document.querySelector('#listado-contactos');
        if(listadoContactos){
            listadoContactos.innerHTML += `
                                <tr>
                                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                        <p class="text-gray-600 font-bold"> ${nombre} </p>
                                    </td>
                                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                        <p class="text-gray-600">${telefono}</p>
                                    </td>
                                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-600">    
                                        <p class="text-gray-600">${correo}</p>
                                    </td>
                                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                        <p class="text-gray-600">${mensaje}</p>
                                    </td>
                                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                        <a id="editar" href="editar-contacto.html?id=${id}" data-contacto="${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                                        <a id="eliminar" href="#" data-contacto="${id}" class="eliminar text-red-600 hover:text-red-900">Eliminar</a>
                                    </td>
                                </tr>
                            `;
        };
    });
    // Asignar el evento click acada registro de contactos para eliminarlo
    addEventListenerEliminar();   
    addEventListenerEditar();   
};
const mostrarAlerta = (mensaje, error = null) => {
    const alerta = document.createElement('p');
    alerta.textContent = mensaje;
    if(error){
        alerta.classList.add('error');
    }else{
        alerta.classList.add('correcto');
    };
    formulario.appendChild(alerta);
    setTimeout(() => {
        alerta.remove();
    }, 3000);
};
const resetDatos = (datos) =>{
    datos.nombre = "" ;
    datos.telefono = "";
    datos.correo = "";
    datos.mensaje = "";
};
const sincronizarStorage = (contactos) => {
    localStorage.setItem('contactos', JSON.stringify(contactos));
    location.reload();
    //listarContactos(contactos)
};
const generarId = () =>{
    const randon = Math.random().toString(36).substr(2);
    const fecha = Date.now().toString(36);
    return randon + fecha;
};
const eliminarContacto = (e) => {
    const confir = confirm("¿Quiere eliminar el Contacto?");
    const id = e.target.dataset.contacto;
    if(confir){
        limpiarHTML('#listado-contactos');
        console.log('eliminar contacto ID = ', id);
        sincronizarStorage(contactos.filter( contacto => contacto.id !== id ));
    }else{
        return;
    };
};
const editarContacto = (e) => {
    e.preventDefault();
    const confir = confirm("¿Quiere eliminar el Contacto?");
    
    if(confir){
        limpiarHTML('#resultados');
        edicionHTML('#resultados');
        const id = e.target.dataset.contacto;
        const contactoEditar = contactos.find((contacto => contacto.id === id));

        const nombre = document.querySelector('.nombre');
        nombre.value = contactoEditar.nombre;
        const telefono = document.querySelector('#telefono');
        telefono.value = contactoEditar.telefono;
        const correo = document.querySelector('#correo');
        correo.value = contactoEditar.correo;
        const mensaje = document.querySelector('#mensaje');
        mensaje.value = contactoEditar.mensaje;
        const editarBtn = document.querySelector('#editar');
        console.log(editarBtn);
        
        editarBtn.addEventListener('submit', (e)=>{
            e.preventDefault();
            // Destruturing de Objetos
            const { nombre, telefono, correo, mensaje } = datos; 
            console.log(datos);
            console.log(nombre, telefono, correo, mensaje);
            if(!nombre || !telefono || !correo || !mensaje){
                mostrarAlerta("Todos los campos son obligatorios", true);
                return;
            }
            /*// Generar un ID único
            let id = generarId();
            contactos.push({id, nombre, telefono, correo, mensaje});  
            sincronizarStorage(contactos);  
            mostrarAlerta("Enviando la informacion a la base de datos");
            formulario.reset();
            resetDatos(datos);
            //console.log(contactos);*/
        });
    }
    return; 
};
const addEventListenerEliminar =  () => {
    const eliminarBtn = document.querySelectorAll("#eliminar");
    eliminarBtn.forEach((contacto) =>{
        contacto.addEventListener("click",eliminarContacto);
    });
};
const addEventListenerEditar = () =>{
    const editarBtn = document.querySelectorAll("#editar");
    editarBtn.forEach((contacto) =>{
        contacto.addEventListener("click",editarContacto);
    });    
};
const limpiarHTML = (listado) => {
    const listadoContactos = document.querySelector(`${listado}`);
    if(listadoContactos){
        while(listadoContactos.firstChild){
            listadoContactos.removeChild(listadoContactos.firstChild);
        };
    };
};
const edicionHTML = (listado) => {
    const edicionContactos = document.querySelector(`${listado}`);
    console.log(edicionContactos);
    edicionContactos.innerHTML = `
                                    <section>   
                                        <h2>Editar Contactos</h2>

                                        <form action="" 
                                                method="POST"
                                                class="formulario"
                                                name="formRegistro"
                                            >
                                            <fieldset>
                                                <legend>Editar los campos requeridos</legend>
                                                <div class="contenedor-campos">
                                                    <div class="campos">
                                                        <label>Nombre</label>
                                                        <input id="nombre" name="nombre" type="text" placeholder="Tu nombre" class="nombre input-text">
                                                    </div>
                                                    <div class="campos">
                                                        <label>Telefono</label>
                                                        <input id="telefono" type="tel" placeholder="Tu telefono" class="input-text">
                                                    </div>
                                                    <div class="campos">
                                                        <label>Correo</label>
                                                        <input id="correo" type="email" placeholder="Tu Email" class="input-text">
                                                    </div>
                                                    <div class="campos">
                                                        <label>Mensaje</label>
                                                        <textarea id="mensaje" name="mensaje" class="input-text"></textarea>
                                                    </div>
                                                </div>    
                                                <div class="alinear-derecha flex">
                                                    <input id="editar" class="boton w-100" type="submit" value="Guardar">
                                                </div>
                                            </fieldset>
                                        </form>
                                    </section>
    `;
};
