import { form, etiquetaUl, mascotaInput, propietarioInput, telefonoInput, fechaInput, horaInput, sintomasInput, } from './selectores.js';
import { citasVet, ui } from './variables.js';

let editarCitaObj; 
let db;
let i = 0;

export function cargarPagina() {
    iniciarBaseDeDatos();
    leerEventos();
}

function leerEventos() {
    form.addEventListener(`submit`, validacionFormulario);
    etiquetaUl.addEventListener(`click`, leerBtns);

}

function validacionFormulario(e) {
    e.preventDefault();

    const citaValidaciones = {
    mascota: mascotaInput.value,
    propietario: propietarioInput.value,
    telefono: telefonoInput.value,
    fecha: fechaInput.value,
    hora: horaInput.value,
    sintomas: sintomasInput.value
}
    const { ...datos } = citaValidaciones;
    if (Object.values(datos).some(citaDatos => citaDatos.trim()===``)) {
        ui.crearAlerta(`Todos los campos son obligatorios.`, `incorrecto`);
        return;
    }
    const { telefono } = citaValidaciones;

    if (!/^\d+$/.test(telefono)) {
        ui.crearAlerta(`Campo telefono incorrecto`, `incorrecto`);
        return;
    }

    ui.editarBtnTexto(`Crear cita`);
    gestionarCitas({...citaValidaciones}, editarCitaObj);
    form.reset();

    editarCitaObj = null;
}

function leerBtns(e) {
    e.preventDefault();
    const id = Number(e.target.closest(`li`).dataset.id);

    if (e.target.classList.contains(`btn-eliminar`)) {
        if (editarCitaObj) {
            ui.crearAlerta(`No se puede eliminar cita cuando se esta editando`, `incorrecto`);
            return;
        }
        ui.crearAlerta(`Cita eliminada con éxito`, `correcto`);
        citasVet.eliminarCita(id);
        eliminarBaseDeDatos(id);

        editarCitaObj = null;
        form.reset();
    }

    if (e.target.closest(`.btn-editar`)) {
        ui.editarBtnTexto(`editar cita`);
        editarCitaObj = citasVet.citas.find(cita => cita.id === id);
        ui.editarCitaHtml(editarCitaObj);
    }

    ui.render(etiquetaUl, citasVet.citas);
}

function gestionarCitas(nueva, original) {
        if(original) {
            ui.crearAlerta(`Cita editada con éxito`, `correcto`);
            citasVet.editarCita(nueva, original);
            editarBaseDeDatos(nueva, original);
        } else {
            nueva.id = Date.now();
            ui.crearAlerta(`Cita creada con éxito`, `correcto`);
            citasVet.agregarCita(nueva);
            almacenarBaseDeDatos(nueva);
        }

        ui.render(etiquetaUl, citasVet.citas);
}

function iniciarBaseDeDatos() {
    const abrirBase = window.indexedDB.open(`AdminCitas`, 1);

    abrirBase.onerror = (e) =>{
        console.log(`tenemos un error ${e.error.code} / ${e.error.message}`);
    };

    abrirBase.onsuccess = (e)=>{
        db = e.target.result;
        cargarInfo();
    };

    abrirBase.onupgradeneeded = (e) =>{
        const baseDeDatos = e.target.result;
        const almacen = baseDeDatos.createObjectStore(`Citas`, { keyPath: `id`});

        almacen.createIndex(`mascota`, `mascota`, {unique: false});
        almacen.createIndex(`nombre`, `nombre`, {unique: false});
        almacen.createIndex(`telefono`, `telefono`, {unique: false});
        almacen.createIndex(`hora`, `hora`, {unique: false});
        almacen.createIndex(`fecha`, `fecha`, {unique: false});
        almacen.createIndex(`sintomas`, `sintomas`, {unique: false});
        almacen.createIndex(`id`, `id`, {unique: true});
    };
}

function almacenarBaseDeDatos(objeto) {
    const transaccion = db.transaction([`Citas`], `readwrite`);
    const almacen = transaccion.objectStore(`Citas`);
    almacen.add(objeto);
}

function cargarInfo() {
    const transaccion = db.transaction([`Citas`]);
    const almacen = transaccion.objectStore(`Citas`);

    const puntero = almacen.openCursor();
    puntero.onsuccess = (e)=>{
        const puntero = e.target.result;
        if(puntero) {
            citasVet.agregarCita(puntero.value);
            puntero.continue();
        }
        else {
            ui.render(etiquetaUl, citasVet.citas);
        }
    };
}

function editarBaseDeDatos(nueva, original) {
    const transaccion = db.transaction([`Citas`], `readwrite`);
    const almacen = transaccion.objectStore(`Citas`); 
    almacen.put({ ...original, ...nueva });
}

function eliminarBaseDeDatos(id) {
    const transaccion = db.transaction([`Citas`], `readwrite`);
    const almacen = transaccion.objectStore(`Citas`); 
    almacen.delete(id);
}