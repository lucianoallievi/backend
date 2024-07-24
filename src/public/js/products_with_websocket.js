const socket = io();

/* ********************** ELEMENTOS HTML *********************** */
const productsTableRows = document.getElementById("products-table-rows");
const productsForm = document.getElementById("products-form");
const inputproductId = document.getElementById("input-product-id");
const btnDeleteproduct = document.getElementById("btn-delete-product");

/* ************************** EVENTOS ************************** */
productsForm.onsubmit = async (event) => {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  form.reset();

  socket.emit("insert-product", {
    name: formData.get("name"),
    description: formData.get("description"),
    code: formData.get("code"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    category: formData.get("category"),
  });
};

btnDeleteproduct.onclick = () => {
  const id = inputproductId.value;
  inputproductId.value = "";
  if (id) {
    socket.emit("delete-product", { id });
  }
};

socket.on("products-list", (data) => {
  const productsList = data.response.docs ?? [];
  productsTableRows.innerText = "";

  productsList.forEach((product) => {
    const trproduct = `
            <td>${product.id}</td>
            <td>${product.name}</td>
        `;

    const tr = document.createElement("tr");
    tr.innerHTML = trproduct;
    productsTableRows.append(tr);
  });
});
