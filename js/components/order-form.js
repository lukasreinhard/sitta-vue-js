Vue.component('order-form', {
  template: '#tpl-order-form',
  props: { orders: Array, packages: Array, shipping: Array, stocks: Array },
  data() {
    return { form: { nim: '', nama: '', ekspedisi: '', paket: '', tanggalKirim: Api.localDate() }, errors: [], success: '', packageHint: '' };
  },
  computed: {
    nextNumber() { return Api.nextOrderNumber(this.orders); },
    selectedPackage() { return this.packages.find(item => item.kode === this.form.paket); }
  },
  watch: {
    // Watcher 2: perubahan paket memperbarui informasi jumlah bahan ajar.
    'form.paket'(code) {
      const selected = this.packages.find(item => item.kode === code);
      this.packageHint = selected ? selected.isi.length + ' mata kuliah dalam paket ini.' : '';
    }
  },
  methods: {
    courseTitle(code) {
      const stock = this.stocks.find(item => item.kode === code);
      return stock ? stock.judul : 'Bahan ajar ' + code;
    },
    shippingName(item) { return item.kode === 'REG' ? 'JNE Regular' : item.kode === 'EXP' ? 'JNE Express' : item.nama; },
    save() {
      this.errors = [];
      this.success = '';
      if (!/^\d+$/.test(this.form.nim)) this.errors.push('NIM wajib diisi dengan angka.');
      if (!this.form.nama.trim()) this.errors.push('Nama mahasiswa wajib diisi.');
      const shipping = this.shipping.find(item => item.kode === this.form.ekspedisi);
      if (!shipping) this.errors.push('Pilih ekspedisi pengiriman.');
      if (!this.selectedPackage) this.errors.push('Pilih paket bahan ajar.');
      const date = new Date(this.form.tanggalKirim + 'T00:00:00');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(this.form.tanggalKirim) || Number.isNaN(date.getTime()) || Api.localDate(date) !== this.form.tanggalKirim) this.errors.push('Tanggal kirim harus valid.');
      if (this.errors.length) return;
      const order = {
        nomor: Api.nextOrderNumber(this.orders), nim: this.form.nim, nama: this.form.nama.trim(),
        ekspedisi: this.shippingName(shipping), paket: this.selectedPackage.kode,
        tanggalKirim: this.form.tanggalKirim, total: this.selectedPackage.harga,
        status: 'Diproses', perjalanan: []
      };
      this.$emit('create', order);
      this.success = order.nomor + ' berhasil dibuat. Buka tab Tracking DO untuk melihat dan menambah progres.';
      this.form = { nim: '', nama: '', ekspedisi: '', paket: '', tanggalKirim: Api.localDate() };
    }
  }
});
