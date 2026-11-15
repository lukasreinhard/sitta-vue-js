Vue.component('status-badge', {
  template: '#tpl-status-badge',
  props: { qty: Number, safety: Number, note: String },
  data() { return { showNote: false }; },
  computed: {
    safeNote() { return Api.safeNote(this.note || 'Tidak ada catatan.'); }
  }
});
