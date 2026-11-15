Vue.component('app-modal', {
  template: '#tpl-app-modal',
  props: { open: Boolean, title: String },
  watch: {
    open(value) {
      if (value) {
        this.previousFocus = document.activeElement;
        this.$nextTick(() => this.$refs.cancel.focus());
      } else if (this.previousFocus) this.previousFocus.focus();
    }
  },
  methods: {
    trapFocus(event) {
      const buttons = this.$el.querySelectorAll('button');
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }
});
