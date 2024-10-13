// Clase API: Implementa métodos para comunicarse con el backend
class API {
    // Requests del tipo "obtener datos", no llevan body ni content-type
    requestFetcher(url: string, listener: ResponseListener): void {
        const method = 'GET'
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    listener.handleResponse(method, xhr.responseText, url);
                } else {
                    listener.handleResponse(method, null, url);
                }
            }
        };
        xhr.open(method, url, true);
        xhr.send(null);
    }

    // Requests del tipo "enviar datos"
    requestSender(method: string, url: string, data: any, listener: ResponseListener): void {
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    listener.handleResponse(method, xhr.responseText, url);
                } else {
                    listener.handleResponse(method, null, url);
                }
            }
        };
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        const jsonData = JSON.stringify(data);
        xhr.send(jsonData);
    }
}
