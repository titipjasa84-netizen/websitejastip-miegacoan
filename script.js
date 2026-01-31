document.addEventListener("DOMContentLoaded", function () {
  const cart = [];
  const cartList = document.getElementById("cart-list");
  const totalPriceEl = document.getElementById("total-price");
  const addToCartBtn = document.getElementById("add-to-cart");
  const orderBtn = document.getElementById("order-button");
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  const buktiPembayaran = document.getElementById("bukti-pembayaran");
  const testimoniForm = document.getElementById("testimoni-form");
  const testimoniList = document.getElementById("testimoni-list");

  // Harga menu (fiktif berdasarkan Mie Gacoan)
  const prices = {
    "Mie Suit": 16000,
    "Mie Hompimpa LV 1-4": 16000,
    "Mie Hompimpa LV 6-8": 17500,
    "Mie Gacoan LV 0-4": 16000,
    "Mie Gacoan LV 6-8": 17500,
    Siomay: 14500,
    "Udang Rambutan": 14500,
    "Udang Keju": 14500,
    "Lumpia Udang": 14500,
    "Pangsit Goreng": 15500,
    "Es Grobak Sodor": 14500,
    "Es Telek": 11500,
    "Es Sluku Bathok": 11500,
    "Es Petak Umpet": 14500,
    "Air Mineral": 6000,
    "Lemon Tea": 10500,
    Chocoan: 13500,
    Orage: 9500,
    Teh: 7000,
    "Teh Tarik": 10500,
    "Vanilla Latte": 14000,
    "Thai Tea": 14500,
    "Green Thai Tea": 14500,
  };

  // Tampilkan field bukti untuk semua metode kecuali COD
  paymentRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      if (this.value !== "COD") {
        buktiPembayaran.style.display = "block";
      } else {
        buktiPembayaran.style.display = "none";
      }
    });
  });

  // Tambah ke keranjang
  addToCartBtn.addEventListener("click", function () {
    const menu = document.getElementById("menu").value;
    const quantity = parseInt(document.getElementById("quantity").value);
    const price = prices[menu.split(" (")[0]] * quantity;

    cart.push({ menu, quantity, price });
    updateCart();
  });

  function updateCart() {
    cartList.innerHTML = "";
    let total = 0;
    cart.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.menu} x ${item.quantity} - Rp ${item.price}`;
      cartList.appendChild(li);
      total += item.price;
    });
    totalPriceEl.textContent = total;
  }

  // Pesan dan alihkan ke WhatsApp
  orderBtn.addEventListener("click", function () {
    const payment = document.querySelector('input[name="payment"]:checked');
    const nama = document.getElementById("nama").value;
    const whatsapp = document.getElementById("whatsapp").value;
    const email = document.getElementById("email").value;
    const alamat = document.getElementById("alamat").value;
    const catatan = document.getElementById("catatan").value;
    const buktiFile = document.getElementById("bukti-file").files[0];

    if (cart.length === 0) {
      alert("Keranjang kosong! Tambahkan menu terlebih dahulu.");
      return;
    }
    if (!payment) {
      alert("Pilih metode pembayaran!");
      return;
    }
    if (!nama || !whatsapp || !email || !alamat) {
      alert("Lengkapi semua data pembeli dan lokasi!");
      return;
    }
    if (payment.value !== "COD" && !buktiFile) {
      alert("Upload bukti pembayaran untuk metode ini!");
      return;
    }

    // Buat pesan WhatsApp
    let message = `Pesanan Mie Gacoan dari ${nama}:\n`;
    message += `WhatsApp: ${whatsapp}\n`;
    message += `Email: ${email}\n\n`;
    message += "Detail Pesanan:\n";
    cart.forEach((item) => {
      message += `- ${item.menu} x ${item.quantity} (Rp ${item.price})\n`;
    });
    message += `Total: Rp ${totalPriceEl.textContent}\n`;
    message += `Sudah termasuk Biaya jasa titip + ppn dan lain-lainya: Rp 5.000\n\n`;
    message += `Metode Pembayaran: ${payment.value}\n`;
    if (payment.value !== "COD") {
      message += "Bukti pembayaran akan dikirim terpisah via WhatsApp.\n";
    }
    message += `Alamat Pengantaran: ${alamat}\n`;
    message += `Catatan: ${catatan || "Tidak ada"}\n`;

    // Ganti dengan nomor WhatsApp penjual (contoh: 6281234567890)
    const whatsappUrl = `https://wa.me/628568147815?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    // Jika ada bukti, beri instruksi
    if (buktiFile) {
      alert(
        "Bukti pembayaran telah dipilih. Kirim file bukti secara manual ke WhatsApp penjual setelah pesan dikirim.",
      );
    }
  });

  // Testimoni
  testimoniForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const rating = document.getElementById("rating").value;
    const ulasan = document.getElementById("ulasan").value;

    if (!ulasan) {
      alert("Masukkan ulasan!");
      return;
    }

    const testimoni = { rating, ulasan, date: new Date().toLocaleString() };
    const testimonis = JSON.parse(localStorage.getItem("testimonis")) || [];
    testimonis.push(testimoni);
    localStorage.setItem("testimonis", JSON.stringify(testimonis));

    loadTestimonis();
    testimoniForm.reset();
    alert("Testimoni dikirim!");
  });

  function loadTestimonis() {
    const testimonis = JSON.parse(localStorage.getItem("testimonis")) || [];
    testimoniList.innerHTML = "<h3>Ulasan Pembeli:</h3>";
    testimonis.forEach((t) => {
      const div = document.createElement("div");
      div.className = "testimoni-item";
      div.innerHTML = `
                <div class="stars">${"★".repeat(t.rating)}${"☆".repeat(5 - t.rating)}</div>
                <p>${t.ulasan}</p>
                <small>${t.date}</small>
            `;
      testimoniList.appendChild(div);
    });
  }

  loadTestimonis(); // Load ulasan saat halaman dimuat
});
