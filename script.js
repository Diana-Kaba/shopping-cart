let itemBox = document.querySelectorAll(".item_box"); // блок каждого товара
let cartCont = document.getElementById("cart_content"); // блок вывода данных корзины

function count() {
  let count = 0;
  if (getCartData()) {
    let cartData = getCartData();
    console.log(cartData);
    for (const key in cartData) {
      count += cartData[key][2];
      //  console.log(cartData[key]);
    }
  }
  return count;
}

function price() {
  let price = 0;
  if (getCartData()) {
    let cartData = getCartData();
    for (const key in cartData) {
      cartData[key][1] *= cartData[key][2];
      price += cartData[key][1];
    }
  }
  return price;
}

// count();

function removeItem(minus) {
  if (getCartData()) {
    let cartData = getCartData();
    let item = minus.getAttribute("data-id");
    cartData[item][2] = cartData[item][2] - 1;
    if (cartData[item][2] == 0) {
      delete cartData[item];
    }
    setCartData(cartData);

    let length = Object.getOwnPropertyNames(cartData);
    if (length == 0) {
      clearCart();
    }

    openCart(cartData);
  }
}

function addItem(plus) {
  if (getCartData()) {
    let cartData = getCartData();
    let item = plus.getAttribute("data-id");
    cartData[item][2] = cartData[item][2] + 1;
    setCartData(cartData);
    openCart(cartData);
  }
}

// Записываем данные в LocalStorage
function setCartData(o) {
  localStorage.setItem("cart", JSON.stringify(o));
}
// Получаем данные из LocalStorage
function getCartData() {
  return JSON.parse(localStorage.getItem("cart"));
}

// Добавляем товар в корзину
function addToCart(e) {
  let button = e.target;
  button.disabled = true; // блокируем кнопку на время операции с корзиной
  let cartData = getCartData() || {}; // получаем данные корзины или создаём новый объект, если данных еще нет
  let parentBox = button.parentNode; // родительский элемент кнопки "Добавить в корзину";
  let itemId = button.getAttribute("data-id"); // ID товара
  let itemTitle = parentBox.querySelector(".item_title").innerHTML; // название товара
  let itemPrice = parentBox.querySelector(".item_price").innerHTML; // стоимость товара
  console.log(cartData);
  if (cartData.hasOwnProperty(itemId)) {
    // если такой товар уже в корзине, то добавляем +1 к его количеству
    cartData[itemId][2] += 1;
  } else {
    // если товара в корзине еще нет, то добавляем в объект
    cartData[itemId] = [itemTitle, itemPrice, 1];
  }
  // Обновляем данные в LocalStorage
  setCartData(cartData);
  button.disabled = false; // разблокируем кнопку после обновления
  cartCont.innerHTML = "Товар добавлен в корзину.";
  setTimeout(function () {
    cartCont.innerHTML = "Продолжить покупки...";
  }, 1000);
}

// Генериурем корзину со списком добавленных товаров
function openCart(e) {
  let cartData = getCartData(); // вытаскиваем все данные корзины
  console.log(JSON.stringify(cartData));
  // если что-то в корзине уже есть, формируем таблицу
  if (cartData !== null) {
    let cardTable = "";
    cardTable = `<table class="shopping_list"><tr><th>Наименование</th><th>Цена</th><th>Кол-во</th><th>Удалить товар</th><th>Добавить товар</th></tr>`;
    for (let items in cartData) {
      cardTable += "<tr>";
      for (let i = 0; i < cartData[items].length; i++) {
        cardTable += "<td>" + cartData[items][i] + "</td>";
      }
      cardTable += `<td><span class="minus" onclick="removeItem(this)" data-id="${items}">-</span></td><td><span class="plus" onclick="addItem(this)" data-id="${items}">+</span></td></tr>`;
    }
    cardTable += `<tr>
      <td>Итого</td>
      <td>${price()}</td>
      <td> ${count()}</td><td></td><td></td>
      </tr>`;
    cardTable += "<table>";
    cartCont.innerHTML = cardTable;
  } else {
    // если в корзине пусто, то сигнализируем об этом
    cartCont.innerHTML = "В корзине пусто!";
  }
}

// Функция очистки корзины
function clearCart(e) {
  localStorage.removeItem("cart");
  cartCont.innerHTML = "Корзина очишена.";
}

// Обработчик события на каждую кнопку "Добавить в корзину"
for (let i = 0; i < itemBox.length; i++) {
  itemBox[i].querySelector(".add_item").addEventListener("click", addToCart);
}
// Обработчик события на кнопку Открыть корзину
document.getElementById("checkout").addEventListener("click", openCart);
// Обработчик события на кнопку Очистить корзину
document.getElementById("clear_cart").addEventListener("click", clearCart);
