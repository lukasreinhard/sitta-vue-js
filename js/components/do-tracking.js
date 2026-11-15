Vue.component('do-tracking', {
  template: '#tpl-do-tracking',
  props: { orders: Array, packages: Array },
  data() { return { query: '', search: '', notes: {}, statuses: {}, error: '', message: '' }; },
  computed: {
    results() {
      const keyword = this.search.toLowerCase();
      return this.orders.filter(order => !keyword || order.nomor.toLowerCase() === keyword || order.nim === this.search);
    }
  },
  methods: {
    find() { this.search = this.query.trim(); this.error = ''; this.message = ''; },
    clear() { this.query = ''; this.search = ''; this.error = ''; this.message = ''; },
    packageName(code) { const item = this.packages.find(item => item.kode === code); return item ? item.nama : code; },
    addProgress(order) {
      this.error = ''; this.message = '';
      const note = (this.notes[order.nomor] || '').trim();
      if (!note) { this.error = 'Keterangan perjalanan untuk ' + order.nomor + ' wajib diisi.'; return; }
      this.$emit('progress', { nomor: order.nomor, status: this.statuses[order.nomor] || order.status, entry: { waktu: Api.localTimestamp(), keterangan: note } });
      this.$set(this.notes, order.nomor, '');
      this.message = 'Progres perjalanan ' + order.nomor + ' berhasil ditambahkan.';
    }
  }
});
