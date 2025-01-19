// Sepet bilgileri ve başlangıç bakiyesi
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let balance = 200; // Başlangıç bakiyesi

// Navbar'daki sepet sayısını güncelleme
function updateCartCount() {
    const cartCountSpans = document.querySelectorAll('#cart-count');
    cartCountSpans.forEach(span => (span.textContent = cart.length));
}

// Ürün sepete ekleme
function addToCart(product, price) {
    const existingItem = cart.find(item => item.product === product);
    if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalPrice += price;
    } else {
        cart.push({ product, price, quantity: 1, totalPrice: price });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product} sepete eklendi!`);
    updateCartCount();
}

// Sepet sayfasında ürünleri listeleme
function displayCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const checkoutButton = document.getElementById('checkout-button');

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Sepetiniz boş.</p>';
        if (checkoutButton) checkoutButton.classList.add('d-none');
    } else {
        const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
        cartItemsDiv.innerHTML = `
            <table class="table table-dark">
                <thead>
                    <tr>
                        <th>Ürün</th>
                        <th>Adet</th>
                        <th>Birim Fiyat</th>
                        <th>Toplam</th>
                        <th>İşlem</th>
                    </tr>
                </thead>
                <tbody>
                    ${cart
                        .map(
                            (item, index) => `
                        <tr>
                            <td>${item.product}</td>
                            <td>${item.quantity}</td>
                            <td>${item.price} TL</td>
                            <td>${item.totalPrice} TL</td>
                            <td>
                                <button class="btn btn-success btn-sm" onclick="incrementItem(${index})">Ekle</button>
                                <button class="btn btn-danger btn-sm" onclick="decrementItem(${index})">Sil</button>
                            </td>
                        </tr>`
                        )
                        .join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <th colspan="3">Genel Toplam</th>
                        <th>${total} TL</th>
                        <th></th>
                    </tr>
                </tfoot>
            </table>`;
        if (checkoutButton) checkoutButton.classList.remove('d-none');
    }
}

// Ürün sayısını artırma
function incrementItem(index) {
    cart[index].quantity += 1;
    cart[index].totalPrice += cart[index].price;
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// Ürün sayısını azaltma
function decrementItem(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        cart[index].totalPrice -= cart[index].price;
    } else {
        cart.splice(index, 1); // Miktar 1 ise ürünü tamamen kaldır
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// Ödeme sürecine geçiş
document.getElementById('checkout-button').addEventListener('click', () => {
    document.getElementById('checkout-section').classList.remove('d-none');
});

// Şifre doğrulama
document.getElementById('validate-password').addEventListener('click', () => {
    const password = document.getElementById('password').value;
    if (password === '0202') {
        document.getElementById('checkout-section').classList.add('d-none');
        document.getElementById('balance-section').classList.remove('d-none');
    } else {
        alert('Hatalı şifre! Tekrar deneyin.');
    }
});

// Ödeme işlemi
document.getElementById('make-payment').addEventListener('click', () => {
    const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    if (balance >= total) {
        balance -= total;
        document.getElementById('balance-amount').textContent = `${balance} TL`;
        alert('Ödeme başarılı!');
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        document.getElementById('balance-section').classList.add('d-none');
    } else {
        alert('Yetersiz bakiye!');
    }
});

// Sayfa yüklendiğinde
window.onload = () => {
    updateCartCount();
    displayCart();
};
