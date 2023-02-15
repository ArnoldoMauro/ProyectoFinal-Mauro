const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}


document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if(localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

// escuchar clic de los botones comprar de las cards
cards.addEventListener('click', e => {
    addCarrito(e)
})

// escuchar clic de los botones aumentar y disminuir cantidad
items.addEventListener('click', e => {
    btnAccion(e)
})

// definimos la funcion fetch que llamará a los objetos Json
const fetchData = async () => {
    try {
        const res = await fetch ('api.json')
        const data = await res.json()
        pintarCards(data)
    } catch (error) {
        console.log(error)
    }
}

//definimos la variable pintarCards e iteramos el objeto productos.
const pintarCards = data => {
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.nombre
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute("src", producto.imagen)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)

    });
    cards.appendChild(fragment)
}

const addCarrito = e => {   
    //console.log(e.target.classList.contains('btn-dark')) // true o false
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation() // detiene cualquier otro evento que pueda generarse en nuestro cards
}

//desectructuramos el objeto que recibio el evento comprar
const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        nombre: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1 
    }
    //verificamos si el producto que recibio el evento comprar ya está en carrito y sumamos 1 a cantidad 
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    // como no entró al if() el producto no está en el carrito y lo metemos adentro del carrito
    carrito[producto.id] = { ...producto }
    pintarCarrito()
    //accion de mostrar el total de productos comprados sobre el icono del carrito
    cantidadTotal()
}

//funcion para mostrar el total de productos comprados en el icono del carrito
function cantidadTotal () {
    var t = document.querySelector('#template');
    var clone0 = document.importNode(t.content, true);
    clone0.querySelector('div').innerHTML = producto.cantidad;
    document.body.appendChild(clone0);
}

//definimos la funcion pintarCarrito() que usaremos para mostrar los productos comprados en pantalla 
const pintarCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        items.innerHTML = ''
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    //mostramos el detalle de la compra llamando a la funcion pintarFooter()
    pintarFooter()
    //guardamos el carrito en localstorage
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

//funcion pintarFooter -> muestra el carrito en pantalla como lista
const pintarFooter = () => {
    footer.innerHTML = ""
    if(Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan = 5>Carrito vacío - comience a comprar</th>
        `
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    //accion de vaciar el carrito  
    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
}

const btnAccion = e => {
    //Accion de Aumentar cantidad
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }
    //Accion de Disminuir cantidad
    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        // si cantidad = 0 debe eliminar el objeto del carrito
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
            pintarCarrito()
        }
        pintarCarrito()
    }
    e.stopPropagation(); // detiene cualquier otro evento que pueda generarse 
}

