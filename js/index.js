let designers = []; 
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyDBrMrjSrqTbg7BdXap5iQIJEuU-PUTwZfBbbb0aU7Z5mPS7OjWM4VxATiDBAyosxj/exec';
const listContainer = document.getElementById('designers-list');
const filterDropdown = document.getElementById('filter');

//carga datos de diseñadores desde spreadsheet
async function loadDesigners(){
    try {
        const response = await fetch(WEB_APP_URL);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        //almacena los datos y renderiza
        designers = data;
        renderDesigners(designers); 

    } catch (error) {
        console.error("Error al cargar los diseñadores:", error);
        listContainer.innerHTML = `<li class="designer-item error-item">
                                     ${error.message}
                                   </li>`;
    }
}

//designerArray: array de objetos diseñadores
function renderDesigners(designerArray){
    listContainer.innerHTML = '';
    designerArray.forEach(designer => {
        const listItem = document.createElement('li');
        listItem.className = 'designer-item';
        //almacena las especialidades como un atributo de datos para el filtrado rápido
        listItem.dataset.specialties = designer.specialties.join(',');
        
        const fullName = `${designer.name} ${designer.lastname}`;

        listItem.innerHTML = `
            <div>
                <strong>${fullName}</strong><br>
                <span class="specialties">Especialidades: ${designer.specialties.join(', ')}</span>
            </div>`;
        listContainer.appendChild(listItem);
    });
}

function filterDesigners(){
    const selectedSpecialty = filterDropdown.value;
    const listItems = document.querySelectorAll('.designer-item');
    listItems.forEach(item => {
        const specialtiesString = item.dataset.specialties;
        if (selectedSpecialty === 'todos' || specialtiesString.includes(selectedSpecialty)) {
            item.style.display = 'flex'; //muestra el elemento
        } else {
            item.style.display = 'none'; //oculta el elemento
        }
    });
}

//llama a la función de carga cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    loadDesigners(); 
});