export class Cita {
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