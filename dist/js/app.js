class Cita {
    constructor() {
        this.citas = [];
    }

    agregarCita(objeto) {
        this.citas = [...this.citas, objeto];
    }

    eliminarCita(id) {
        const citasActualizadas = this.citas.filter(cita => cita.id !== id);
        this.citas = citasActualizadas;
    }

    editarCita(actualizado, original) {
        this.citas = this.citas.map(cita => {
        if (cita.id === original.id) {
            return { ...cita, ...actualizado };
        }
        return cita;
        });
    }
}

class UI {
    crearAlerta(texto, tipo) {
        const siExiste = [...document.querySelectorAll('.alerta')];

        if (siExiste.some(existe => existe.textContent === texto)) return;

        const alerta = document.createElement(`P`);
        alerta.classList.add(`alerta`, `${tipo}`);
        alerta.textContent = texto;
        main.insertBefore(alerta, document.querySelector(`.main__contenedor`));
        setTimeout(()=>{
            alerta.remove()
        },3000);

    }

    limpiarHtml(element) {
        while(element.firstChild) {
            element.firstChild.remove();
        }
    }

    crearHtml(arr) {
        arr.forEach((objeto)=>{
            const { mascota, propietario, telefono, fecha, hora, sintomas, id} = objeto;

        const elementoLi = document.createElement(`LI`);
        elementoLi.classList.add(`administrador__li`);
        elementoLi.dataset.id = `${id}`;

        elementoLi.innerHTML = `
            <h3 class="nombre">${mascota}</h3>
            <p>Nombre: <span class="propietario">${propietario}</span></p>
            <p>Telefono: <span class="telefono">${telefono}</span></p>
            <p>Fecha: <span class="fecha">${fecha}</span></p>
            <p>Hora: <span class="hora">${hora}</span></p>
            <p>Sintomas: <span class="sintomas">${sintomas}</span></p>

            <div class="btn-container">
                <a class="btn btn-eliminar" href="#">Eliminar 
                    <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </a>
                <a class="btn btn-editar" href="#">Editar 
                    <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </a>
            </div>
        `;
        etiquetaUl.appendChild(elementoLi);
        });
    }

    render(element, arr) {
        this.limpiarHtml(element);
        this.crearHtml(arr);
    }

    editarCitaHtml(objeto) {
        const {mascota, propietario, telefono, fecha, hora, sintomas} = objeto;
        mascotaInput.value = mascota; 
        propietarioInput.value = propietario; 
        telefonoInput.value = telefono; 
        fechaInput.value = fecha; 
        horaInput.value = hora; 
        sintomasInput.value = sintomas;
    }

    editarBtnTexto(texto) {
        editarBtnSubmit.textContent = texto;
    } 
}

const form = document.querySelector(`.form`);
const mascotaInput = document.querySelector(`#mascota`);
const propietarioInput = document.querySelector(`#propietario`);
const telefonoInput = document.querySelector(`#telefono`);
const fechaInput = document.querySelector(`#fecha`);
const horaInput = document.querySelector(`#hora`);
const sintomasInput = document.querySelector(`#sintomas`);
const main = document.querySelector(`.main`);
const etiquetaUl = document.querySelector(`.administrador__ul`);
const editarBtnSubmit = document.querySelector(`.submit`);

let editarCitaObj; 
const ui = new UI();
const citasVet = new Cita();

document.addEventListener(`DOMContentLoaded`, leerEventos);

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
    const { id ,...datos } = citaValidaciones;
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

    editarCitaObj = undefined;
}

function leerBtns(e) {
    e.preventDefault();
    const id = Number(e.target.closest(`li`).dataset.id);

    if (e.target.classList.contains(`btn-eliminar`)) {
        if (editarCitaObj) {
            ui.crearAlerta(`No se puede eliminar cita cuando se esta editando`, `incorrecto`);
            return;
        }
        citasVet.eliminarCita(id);

        editarCitaObj = undefined;
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
        if(editarCitaObj) {
            const { id } = original;
            citasVet.editarCita(nueva, original);
        } else {
            nueva.id = Date.now();
            citasVet.agregarCita(nueva);
        }

        ui.render(etiquetaUl, citasVet.citas);
}