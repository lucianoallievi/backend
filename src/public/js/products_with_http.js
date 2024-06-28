/* ********************** ELEMENTOS HTML ************************ */
const ulProductsList = document.getElementById("products-list");
const btnRefreshProductsList = document.getElementById(
  "btn-refresh-products-list"
);
const productsForm = document.getElementById("products-form");
const inputProductId = document.getElementById("input-product-id");
const btnDeleteProduct = document.getElementById("btn-delete-product");

/* ************************ OPERACIONES ************************ */
const loadProductsList = async () => {
  const response = await fetch("/api/products", { method: "GET" });
  const data = await response.json();
  const productsList = data.payload;
  console.log("productsList", productsList);
  ulProductsList.innerText = "";

  productsList.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `<i>Id:</i> ${product.id} - <i>Nombre:</i> ${product.name}`;
    ulProductsList.append(li);
  });
};

const createProduct = async (data) => {
  await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  await loadProductsList();
};

const deleteProduct = async (id) => {
  await fetch(`/api/products/${id}`, { method: "DELETE" });
  loadProductsList();
};

/* ************************** EVENTOS ************************** */
btnRefreshProductsList.onclick = () => {
  loadProductsList();
};

productsForm.onsubmit = (event) => {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  form.reset();

  createProduct({
    name: formData.get("name"),
    description: formData.get("description"),
  });
};

btnDeleteProduct.onclick = () => {
  const id = Number(inputProductId.value);
  inputProductId.value = "";

  if (id > 0) {
    deleteProduct(id);
  }
};

// Se ejecuta para cargar la lista de productes al ingresar o refrescar
loadProductsList();
