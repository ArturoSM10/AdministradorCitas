import { form, etiquetaUl, mascotaInput, propietarioInput, telefonoInput, fechaInput, horaInput, sintomasInput, } from './selectores.js';
import { citasVet, ui } from './variables.js';

let editarCitaObj; 

export function leerEventos() {
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
        } else {
            nueva.id = Date.now();
            ui.crearAlerta(`Cita creada con éxito`, `correcto`);
            citasVet.agregarCita(nueva);
        }

        ui.render(etiquetaUl, citasVet.citas);
}