// Filter Vue 2 digunakan langsung pada template: {{ nilai | namaFilter }}.
Vue.filter('rupiah', value => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value) || 0));
Vue.filter('buah', value => value + ' buah');
Vue.filter('tanggal', value => {
  if (!value) return '-';
  const date = new Date(value + 'T00:00:00');
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
});
Vue.filter('waktu', value => {
  const date = new Date(value.replace(' ', 'T'));
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
});

async function startApp() {
  await Api.loadTemplates();
  new Vue({
    el: '#app',
    data: {
      tab: 'stok', menus: { stok: 'Stok Bahan Ajar', tracking: 'Tracking DO', order: 'Pemesanan' },
      loading: true, error: '', notice: '', stocks: [], orders: [], regions: [], categories: [], packages: [], shipping: []
    },
    async created() {
      try {
        const data = await Api.loadJson();
        this.regions = data.upbjjList;
        this.categories = data.kategoriList;
        this.packages = data.paket;
        this.shipping = data.pengirimanList;
        let saved = null;
        try { saved = Api.readSaved(); } catch (error) { this.notice = 'Penyimpanan lokal tidak tersedia atau rusak. Aplikasi menggunakan data awal.'; }
        this.stocks = saved ? saved.stocks : data.stok;
        this.orders = saved ? saved.orders : Api.normalizeTracking(data.tracking);
      } catch (error) { this.error = error.message; }
      finally { this.loading = false; }
    },
    methods: {
      persist(message) {
        try { Api.save(this.stocks, this.orders); this.notice = message; }
        catch (error) { this.notice = message + ' Perubahan hanya berlaku selama halaman terbuka karena penyimpanan lokal tidak tersedia.'; }
      },
      saveStock(payload) {
        if (payload.index === null) this.stocks.push(payload.item);
        else this.$set(this.stocks, payload.index, payload.item);
        this.persist('Data bahan ajar berhasil disimpan.');
      },
      removeStock(item) {
        const index = this.stocks.indexOf(item);
        if (index !== -1) this.stocks.splice(index, 1);
        this.persist('Data bahan ajar berhasil dihapus.');
      },
      createOrder(order) {
        // Hitung lagi dari daftar terbaru agar sequence tidak bertabrakan.
        order.nomor = Api.nextOrderNumber(this.orders);
        this.orders.push(order);
        this.persist('Delivery order berhasil disimpan.');
      },
      addProgress(payload) {
        const order = this.orders.find(item => item.nomor === payload.nomor);
        if (!order) return;
        order.perjalanan.push(payload.entry);
        order.status = payload.status;
        this.persist('Progres pengiriman berhasil disimpan.');
      }
    }
  });
  document.getElementById('startup-message').hidden = true;
}
startApp();