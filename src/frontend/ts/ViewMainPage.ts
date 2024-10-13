// Clase ViewMainPage: Implementa métodos para escribir html dinámico sobre la vista.
class ViewMainPage {
    getDeviceHtml(device: DeviceInt): any {
        const value = device.state ? true : false;
        const html = `<div class="row device-item">
                        <div class="col s8">
                            <strong>${device.name}</strong>
                            <p class="device-description">${device.description}</p>
                        </div>
                        <div class="col s2 right-align">
                            <div class="switch">
                                <label>
                                    Off
                                    <input id="device-switch-${device.id}" type="checkbox" ${value ? 'checked' : ''}>
                                    <span class="lever"></span>
                                    On
                                </label>
                            </div>
                        </div>
                        <div class="col s2 right-align">
                            <div class="col s6">
                                <a class="waves-effect waves-light btn" id="device-edit-${device.id}"><i class="material-icons">edit</i></a>
                            </div>
                            <div class="col s6 right-align">
                                <a class="waves-effect waves-light btn" id="device-delete-${device.id}"><i class="material-icons">delete</i></a>
                            </div>
                        </div>
                    </div>`;
        return html;

    }

    showRoomsAndDevices(list: DevicesByRoomsInt[], element: Main): void {

        let e: HTMLElement = document.getElementById("rooms-list");
        e.innerHTML = "";

        for (let room of list) {
            let devicesListByRoom = ""
            for (let device of room.devices) {
                devicesListByRoom += this.getDeviceHtml(device);
            }

            e.innerHTML += `<div class="room-container">
                                <div class="room-header" >
                                    <h5 class="room-name">${room.name}</h5>
                                </div>
                                <div class="container devices-container">
                                    ${devicesListByRoom}
                                </div>
                            </div> `;
        }
    }

    createRoomsinForm(list: DevicesByRoomsInt[], element: Main): void {
        let e: HTMLElement = document.getElementById("input-radios-rooms");
        e.innerHTML = "";
        let roomsHtml = '<span>Ambiente*</span> <div class="room-types">'
        for (let room of list) {
            roomsHtml += `<p>
                                <label>
                                    <input id="room-living-${room.id}" class="form-rooms-selector with-gap" name="room" type="radio" />
                                    <span>${room.name}</span>
                                </label>
                            </p>`;
        }
        roomsHtml += '</div>'
        e.innerHTML = roomsHtml;
    }
}