function emptyStock() {
  return { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: '', qty: '', safety: '', catatanHTML: '' };
}

Vue.component('ba-stock-table', {
  template: '#tpl-stock-table',
  props: { stocks: Array, regions: Array, categories: Array },
  data() {
    return { region: '', category: '', stockFilter: '', sortBy: 'judul', direction: 'asc', form: emptyStock(), editing: null, formOpen: false, errors: [], pendingDelete: null };
  },
  computed: {
    // Computed menyimpan hasil sampai dependensinya berubah.
    regionalStocks() { return this.stocks.filter(item => !this.region || item.upbjj === this.region); },
    availableCategories() { return this.categories.filter(category => this.regionalStocks.some(item => item.kategori === category)); },
    filteredStocks() {
      return this.regionalStocks.filter(item => {
        const categoryMatches = !this.category || item.kategori === this.category;
        const stockMatches = !this.stockFilter || (this.stockFilter === 'low' && item.qty < item.safety) || (this.stockFilter === 'empty' && item.qty === 0);
        return categoryMatches && stockMatches;
      });
    },
    displayedStocks() {
      return this.filteredStocks.slice().sort((a, b) => {
        const result = this.sortBy === 'judul' ? a.judul.localeCompare(b.judul, 'id') : a[this.sortBy] - b[this.sortBy];
        return this.direction === 'asc' ? result : -result;
      });
    }
  },
  watch: {
    // Watcher 1: kategori harus dipilih ulang jika wilayah berubah.
    region() { this.category = ''; }
  },
  methods: {
    resetFilters() { this.region = ''; this.category = ''; this.stockFilter = ''; this.sortBy = 'judul'; this.direction = 'asc'; },
    openForm(item) {
      this.editing = item ? this.stocks.indexOf(item) : null;
      this.form = item ? Object.assign({}, item) : emptyStock();
      this.errors = [];
      this.formOpen = true;
      this.$nextTick(() => { this.$refs.code.focus(); this.$refs.stockForm.scrollIntoView({ block: 'nearest' }); });
    },
    save() {
      this.errors = [];
      ['kode', 'judul', 'kategori', 'upbjj', 'lokasiRak'].forEach(key => {
        this.form[key] = String(this.form[key]).trim();
        if (!this.form[key]) this.errors.push('Kolom ' + key + ' wajib diisi.');
      });
      this.form.kode = this.form.kode.toUpperCase();
      if (this.stocks.some((item, index) => index !== this.editing && item.kode.toUpperCase() === this.form.kode && item.upbjj === this.form.upbjj)) {
        this.errors.push('Kode mata kuliah sudah ada pada UT-Daerah tersebut.');
      }
      ['harga', 'qty', 'safety'].forEach(key => {
        if (this.form[key] === '' || !Number.isFinite(Number(this.form[key])) || Number(this.form[key]) < 0) this.errors.push(key + ' harus berupa angka nol atau lebih.');
      });
      if (!Number.isInteger(Number(this.form.qty)) || !Number.isInteger(Number(this.form.safety))) this.errors.push('Stok dan safety harus bilangan bulat.');
      if (!this.categories.includes(this.form.kategori) || !this.regions.includes(this.form.upbjj)) this.errors.push('Pilih kategori dan UT-Daerah yang tersedia.');
      if (this.errors.length) return;
      const item = Object.assign({}, this.form, { harga: Number(this.form.harga), qty: Number(this.form.qty), safety: Number(this.form.safety) });
      this.$emit('save', { index: this.editing, item });
      this.formOpen = false;
      this.resetFilters();
    },
    remove() {
      this.$emit('remove', this.pendingDelete);
      this.pendingDelete = null;
      this.formOpen = false;
    }
  }
});
