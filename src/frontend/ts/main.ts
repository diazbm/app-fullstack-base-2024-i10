// Interfaces
interface DeviceInt {
    id: number;
    name: string;
    description: string;
    state: number;
    type: number;
    room_id: number;
}

interface RoomInt {
    id: number;
    name: string;
}

interface DevicesByRoomsInt {
    id: number;
    name: string;
    devices: DeviceInt[];
}

interface ResponseListener {
    handleResponse(method: string, response: string, url: string): void;
}

// Clase Main: implementa la interfaz ResponseListener para handlear las respuestas de los api-call que se van a hacer desde el cliente
// Centraliza la lógica de negocio del frontend, utiliza atributos para controlar estados de formularios y guardar urls
class Main implements ResponseListener {
    
    // Instanciar clases auxiliares
    api = new API(); // Clase para hacer llamadas http
    view = new ViewMainPage(); // Clase para escribir html sobre la vista principal
    
    // Variables de estado
    formState = "CREATE"
    selectedDevice: any = null;
    devicesByRoom: DevicesByRoomsInt[];

    // URLS
    devicesURL: string = "devices"
    roomsURL: string = "rooms"
    devicesByRoomsURL: string = "rooms/devices/list"

    constructor() {

    }

    refreshScreen() {
        this.formState = "CREATE";
        this.selectedDevice = null;
        this.api.requestFetcher(this.devicesByRoomsURL, this);
    }

    handleResponse(method: string, response: string, url: string): void {
        // Obtener toda la lista de ambientes y dispositivos
        if (method === "GET" && url == this.devicesByRoomsURL) {
            this.devicesByRoom = JSON.parse(response);
            this.view.showRoomsAndDevices(this.devicesByRoom, this);
            this.view.createRoomsinForm(this.devicesByRoom, this);
            this.handleEvents();
        }

        // Actualización de lista de dispositivos ante creación, actualización o eliminación
        if ((method === "POST" || method === "PUT" || method === "DELETE") && url.includes("devices")) {
            // Refrescamos la página
            this.refreshScreen()
        }
    }
   
    handleEvents(): void {
        // Este metodo suma los event listener a los elementos html de la página
        const list = this.devicesByRoom;
        // Controles por dispositivo
        list.forEach(room => {
            room.devices.forEach(device => {
                document.getElementById(`device-switch-${device.id}`).addEventListener("click", (evt: Event) => { this.handleDeviceSwitch(evt, device) });
                document.getElementById(`device-edit-${device.id}`).addEventListener("click", (evt: Event) => { this.handleDeviceEdit(evt, device) });
                document.getElementById(`device-delete-${device.id}`).addEventListener("click", (evt: Event) => { this.handleDeviceDelete(evt, device) });

            });
        });
        // Crear dispositivo
        document.getElementById('add-item-btn').addEventListener("click", (evt: Event) => {
            this.formState = "CREATE"
            this.selectedDevice = null;
            this.handleToggleDeviceForm(evt, true);
        });
        // Cerrar formulario
        document.getElementById('exit-new-device').addEventListener("click", (evt: Event) => {
            this.formState = "CREATE"
            this.selectedDevice = null;
            this.handleToggleDeviceForm(evt, false);
        });
        // Guardar
        document.getElementById('save-new-device').addEventListener("click", (evt: Event) => { this.handleSaveDevice(evt) });

    }

    handleDeviceSwitch(evt: Event, device: DeviceInt): void {
        let target = <any>evt.target;
        let checked = target.checked;
        let deviceToUpdate: DeviceInt = device;
        // Solo cambiamos el atributo state
        if (checked) {
            deviceToUpdate.state = 1;
        } else {
            deviceToUpdate.state = 0;
        }
        // Actualizamos el dispositivo mediante PUT
        this.api.requestSender('PUT', `/devices/${deviceToUpdate.id}`, deviceToUpdate, this)
    }

    handleDeviceEdit(evt: Event, device: DeviceInt): void {
        // Seteamos los valores de dispositivo seleccionado y estado del formulario:
        this.formState = "UPDATE"
        this.selectedDevice = device

        // Obtenemos los elementos html para reemplazar con los valores del dispositivo
        const inputName: any = document.getElementById('device-name')
        const inputDescription: any = document.getElementById('device-description')
        const inputRoom: any = document.getElementsByClassName('form-rooms-selector') // obtener por clase retorna una lista de elementos
        const inputType: any = document.getElementsByClassName('form-types-selector') // obtener por clase retorna una lista de elementos
        const inputState: any = document.getElementById('device-state')
        // Seteamos los valores de texto
        inputName.value = device.name;
        inputDescription.value = device.description;
        inputState.checked = device.state ? true : false;

        // Recorremos los valores de selector de habitación y seteamos en checked solo el que corresponda con el room_id
        for (let index = 0; index < inputRoom.length; index++) {
            const element = inputRoom[index];
            const elementId = element.id;
            if (parseInt(elementId.split('-').pop()) === device.room_id) {
                element.checked = true;
            }
        }

        // Recorremos los valores de selector de tipo de dispositivo y seteamos en checked solo al que corresponda con el type
        for (let index = 0; index < inputType.length; index++) {
            const element = inputType[index];
            const elementId = element.id;
            if (parseInt(elementId.split('-').pop()) === device.type) {
                element.checked = true;
            }
        }

        // Hacemos visible el formulario
        this.handleToggleDeviceForm(evt, true);
    }

    handleDeviceDelete(evt: Event, device: DeviceInt): void {
        evt.preventDefault();
        if (window.confirm(`¿Eliminar definitivamente el dispositivo ${device.name}?`)) {
            this.api.requestSender('DELETE', `devices/${device.id}`, {}, this);
        }

    }

    handleToggleDeviceForm(evt: Event, visibility: Boolean): void {
        evt.preventDefault() // Previene que el guardar recargue la página
        // Controlamos la visibilidad del formulario a través de css usando el atributo display
        if (visibility) {
            document.getElementById('device-form-container').style.display = "block";
        } else {
            this.clearForm(); // Limpieza del formulario cada vez que se cierra
            document.getElementById('device-form-container').style.display = "none";
        }
        // Ocultamos el mensaje de datos incorrectos
        document.getElementById('input-validations').style.display = "none";
    }

    handleSaveDevice(evt: Event): void {
        evt.preventDefault() // Previene que el guardar recargue la página
        // Ocultamos el mensaje de datos incorrectos
        document.getElementById('input-validations').style.display = "none";

         // Obtener los elementos HTML del formulario
        const inputName: any = document.getElementById('device-name')
        const inputDescription: any = document.getElementById('device-description')
        const inputRoom: any = document.querySelector('input[name="room"]:checked')
        const inputType: any = document.querySelector('input[name="device-type"]:checked')
        const inputState: any = document.getElementById('device-state')
        const name = inputName.value;
        const description = inputDescription.value;

        // Validamos si seleccionó algún ambiente y algún tipo de dispositivo
        if (name != "" && description != "" && inputType && inputState) {
            const room_id = parseInt(inputRoom.id.split('-').pop()); // Obtener el ID del ambiente.
            const type = parseInt(inputType.id.split('-').pop()); // Obtener el ID del tipo de dispositivo.
            const state = inputState.checked ? 1 : 0;
            const data = {
                name,
                description,
                room_id,
                type,
                state
            };
            // Dependiendo del caso de uso, podemos crear un nuevo dispositivo o actualizar todos los atributos de uno ya existente
            if (this.formState === "CREATE") {
                this.api.requestSender('POST', 'devices', data, this);
            }
            if (this.formState === "UPDATE" && this.selectedDevice) {
                this.api.requestSender('PUT', `devices/${this.selectedDevice.id}`, data, this);
            }

            // Ocultamos el formulario
            this.handleToggleDeviceForm(evt, false);
        } else {
            // Mostramos el mensaje de datos incorrectos
            document.getElementById('input-validations').style.display = "block";
        }
    }

    clearForm(): void {
        // Obtener los elementos HTML del formulario
        const inputName: any = document.getElementById('device-name')
        const inputDescription: any = document.getElementById('device-description')
        const inputRoom: any = document.getElementsByClassName('form-rooms-selector') // obtener por clase retorna una lista de elementos
        const inputType: any = document.getElementsByClassName('form-types-selector') // obtener por clase retorna una lista de elementos
        const inputState: any = document.getElementById('device-state')
        // Seteamos los valores de texto
        inputName.value = "";
        inputDescription.value = "";
        inputState.checked = false;

        // Recorremos los valores de selector de habitación y seteamos todo en checked false
        for (let index = 0; index < inputRoom.length; index++) {
            inputRoom[index].checked = false;
        }

        // Recorremos los valores de selector de tipo de dispositivo y seteamos todo en checked false
        for (let index = 0; index < inputType.length; index++) {
            inputType[index].checked = false;
        }
    }

    main(): void {
        // Obtener la lista de ambientes y sus devices al cargar la página
        this.refreshScreen()
    }
}

window.onload = function () {
    let main: Main = new Main();
    main.main()
};
