console.log("Conectado..");
import { validarFormulario, 
    leerTexto, 
    listarContactos 
} from  './funciones/funciones.js';
export let contactos = [];


export const formulario = document.querySelector('.formulario');


// Al cargar el documento verificamos si en localStorage ya hay informacion de los contactos
document.addEventListener('DOMContentLoaded', () =>{
    contactos = JSON.parse( localStorage.getItem('contactos') ) || [];
    console.log(contactos);
    listarContactos(contactos);
    
    // Activar el evento submit para el formulario
    formulario.addEventListener('submit', validarFormulario);
    const nombre =  document.querySelector('#nombre');
    const telefono = document.querySelector('#telefono');
    const correo = document.querySelector('#correo');
    const mensaje = document.querySelector('#mensaje');

    // Activar el evento input para campos nombre, telefono, correo, mensaje
    if(nombre && telefono && correo && mensaje){
        nombre.addEventListener('input', leerTexto);
        telefono.addEventListener('input', leerTexto);
        correo.addEventListener('input', leerTexto);
        mensaje.addEventListener('input', leerTexto);
    };
});