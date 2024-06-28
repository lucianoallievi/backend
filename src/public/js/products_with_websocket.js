const socket = io();

/* ********************** ELEMENTOS HTML *********************** */
const ulProductsList = document.getElementById("products-list");
const productsForm = document.getElementById("products-form");
const inputProductId = document.getElementById("input-product-id");
const btnDeleteProduct = document.getElementById("btn-delete-product");

/* ************************** EVENTOS ************************** */
productsForm.onsubmit = (event) => {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  form.reset();

  socket.emit("insert-product", {
    name: formData.get("name"),
    description: formData.get("description"),
  });
};

btnDeleteProduct.onclick = () => {
  const id = Number(inputProductId.value);
  inputProductId.value = "";

  if (id > 0) {
    socket.emit("delete-product", { id });
  }
};

socket.on("products-list", (data) => {
  const productsList = data.products ?? [];
  ulProductsList.innerText = "";

  productsList.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `<i>Id:</i> ${product.id} - <i>Nombre:</i> ${product.name}`;
    ulProductsList.append(li);
  });
});
