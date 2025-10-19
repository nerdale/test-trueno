const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyDBrMrjSrqTbg7BdXap5iQIJEuU-PUTwZfBbbb0aU7Z5mPS7OjWM4VxATiDBAyosxj/exec'; 
const SERVER_URL = "https://spreadsheet-websocket-server.onrender.com"; 

let designers = []; 
const listContainer = document.getElementById('designers-list');
const filterDropdown = document.getElementById('filter');
const statusMessage = document.createElement('p'); 
statusMessage.id = 'status-message';
document.body.appendChild(statusMessage);

//carga datos de diseñadores desde spreadsheet
async function loadDesigners(){
    try {
        statusMessage.textContent = "Cargando datos...";

        const response = await fetch(WEB_APP_URL);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        // Almacena los datos y renderiza
        designers = data;
        renderDesigners(designers); 
        statusMessage.textContent = `Datos actualizados en: ${new Date().toLocaleTimeString()}`;

    } catch (error) {
        console.error("Error al cargar los diseñadores:", error);
        listContainer.innerHTML = `<li class="designer-item error-item">
                                     Error al cargar los datos: ${error.message}
                                   </li>`;
        statusMessage.textContent = `❌ Error: ${error.message}`;
    }
}

// designerArray: array de objetos diseñadores
function renderDesigners(designerArray){
    listContainer.innerHTML = '';
    designerArray.forEach(designer => {
        const listItem = document.createElement('li');
        listItem.className = 'designer-item';
        listItem.dataset.specialties = designer.specialties.join(',');
        
        const fullName = `${designer.name} ${designer.lastname}`;

        listItem.innerHTML = `
            <div>
                <strong>${fullName}</strong><br>
                <span class="specialties">Especialidades: ${designer.specialties.join(', ')}</span>
            </div>`;
        listContainer.appendChild(listItem);
    });
    filterDesigners(); 
}

function filterDesigners(){
    const selectedSpecialty = filterDropdown.value;
    const listItems = document.querySelectorAll('.designer-item');
    listItems.forEach(item => {
        const specialtiesString = item.dataset.specialties;
        if (selectedSpecialty === 'todos' || specialtiesString.includes(selectedSpecialty)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

filterDropdown.addEventListener('change', filterDesigners);

const socket = io(SERVER_URL);

socket.on('connect', () => {
    console.log("Conexión con el servidor de Render establecida.");
    statusMessage.textContent = "Conectado. Esperando actualizaciones...";
});

socket.on('spreadsheet-updated', () => {
    console.log("Señal de actualización recibida desde Render!");
    loadDesigners(); 
});

socket.on('disconnect', () => {
    console.warn("Conexión con el servidor de Render perdida.");
    statusMessage.textContent = "Desconectado del servidor de actualizaciones.";
});

loadDesigners();