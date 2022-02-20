import { 
    formulario,
} from "../index.js";
import { datos } from "../data/contactos.js";
// Contacto se exporta de index por que lo obtenemos de localStorage
import { contactos } from '../index.js';
export const validarFormulario = (e) => {
    e.preventDefault();
    // Destruturing de Objetos
    const { nombre, telefono, correo, mensaje } = datos; 
    if(!nombre || !telefono || !correo || !mensaje){
        mostrarAlerta(formulario, "Todos los campos son obligatorios", true);
        return;
    }
     // Generar un ID único
    let id = generarId();
    contactos.push({id, nombre, telefono, correo, mensaje});  
    sincronizarStorage(contactos);  
    mostrarAlerta(formulario, "Enviando la informacion a la base de datos");
    formulario.reset();
    resetDatos(datos);
};
export const leerTexto = (e) => {
    datos[e.target.id] = e.target.value;
    //console.log(datos);
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
const mostrarAlerta = (formulario, mensaje, error = null) => {
    const alerta = document.createElement('p');
    alerta.textContent = mensaje;
    if(error){
        console.log("Error")
        alerta.classList.add('error');
    }else{
        console.log("correcto")
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
    const confir = confirm("¿Quiere editar el Contacto?");
    if(confir){
        limpiarHTML('#resultados');
        edicionHTML('#resultados');
        const formularioEdicion = document.querySelector('.formulario');
        const edicionTexto = (e) => {
            contactoEditar[e.target.id] = e.target.value;
        };

        const id = e.target.dataset.contacto;
        const contactoEditar = contactos.find((contacto => contacto.id === id));
        console.log(contactoEditar);
        const nombre = document.querySelector('.nombre');
        nombre.value = contactoEditar.nombre;
        const telefono = document.querySelector('#telefono');
        telefono.value = contactoEditar.telefono;
        const correo = document.querySelector('#correo');
        correo.value = contactoEditar.correo;
        const mensaje = document.querySelector('#mensaje');
        mensaje.value = contactoEditar.mensaje;
        const editarForm = document.querySelector('.formulario');
        
         // Activar el evento input para campos nombre, telefono, correo, mensaje
        if(nombre && telefono && correo && mensaje){
            nombre.addEventListener('input', edicionTexto);
            telefono.addEventListener('input', edicionTexto);
            correo.addEventListener('input', edicionTexto);
            mensaje.addEventListener('input', edicionTexto);
        };
        // Asignar el escuchador de evento al boton guardar la edicion del contactos
        editarForm.addEventListener('submit', (evento)=>{
            evento.preventDefault();
            // Destruturing de Objetos
            const { id, nombre, telefono, correo, mensaje } = contactoEditar; 
            console.log(nombre, telefono, correo, mensaje);
            console.log(formulario);
            if(!nombre || !telefono || !correo || !mensaje){
                mostrarAlerta(formularioEdicion, "Todos los campos son obligatorios", true);
                return;
            }
            mostrarAlerta(formularioEdicion, "Enviando la informacion a la base de datos");
            // Lo eliminamos
            sincronizarStorage(contactos.filter( contacto => contacto.id !== id ));
            // Lo agregamos nuevamente con la edicion
            //contactos.push({id, nombre, telefono, correo, mensaje});  
            sincronizarStorage(contactos);  
            resetDatos(datos);
        });
    };
    return; 
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
    edicionContactos.innerHTML = `
                            <main main-edicion class="contenedor sombra">
                                    <section>   
                                        <h2>Editar Contactos</h2>

                                        <form action="" 
                                                class="formulario"
                                                name="formRegistro"
                                            >
                                            <fieldset class="px-5 py-10">
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
                                </main>
    `;
};