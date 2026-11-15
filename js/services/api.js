// Akses JSON, template, dan penyimpanan lokal dipisahkan dari komponen.
window.Api = {
  storageKey: 'sitta-tugas3-v1',
  async loadJson() {
    const response = await fetch('data/dataBahanAjar.json');
    if (!response.ok) throw new Error('Data bahan ajar tidak dapat dimuat.');
    return response.json();
  },
  async loadTemplates() {
    const names = ['stock-table', 'do-tracking', 'order-form', 'status-badge', 'app-modal'];
    await Promise.all(names.map(async name => {
      const response = await fetch('templates/' + name + '.html');
      if (!response.ok) throw new Error('Template ' + name + ' tidak dapat dimuat.');
      const template = document.createElement('script');
      template.type = 'text/x-template';
      template.id = 'tpl-' + name;
      template.textContent = await response.text();
      document.body.appendChild(template);
    }));
  },
  normalizeTracking(tracking) {
    // JSON soal memuat DO yang sama dua kali. Nomor DO menjadi kunci unik.
    const unique = {};
    tracking.forEach(group => {
      Object.keys(group).forEach(nomor => {
        unique[nomor] = Object.assign({ nomor: nomor }, group[nomor]);
      });
    });
    return Object.values(unique);
  },
  readSaved() {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!Array.isArray(data.stocks) || !Array.isArray(data.orders)) {
      throw new Error('Data tersimpan tidak valid.');
    }
    return data;
  },
  save(stocks, orders) {
    localStorage.setItem(this.storageKey, JSON.stringify({ stocks, orders }));
  },
  localDate(date = new Date()) {
    const pad = value => String(value).padStart(2, '0');
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
  },
  localTimestamp(date = new Date()) {
    const pad = value => String(value).padStart(2, '0');
    return this.localDate(date) + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].map(pad).join(':');
  },
  nextOrderNumber(orders, year = new Date().getFullYear()) {
    const prefix = 'DO' + year + '-';
    const sequence = orders.reduce((max, order) => {
      const suffix = order.nomor.slice(prefix.length);
      return order.nomor.startsWith(prefix) && /^\d+$/.test(suffix) ? Math.max(max, Number(suffix)) : max;
    }, 0);
    return prefix + String(sequence + 1).padStart(3, '0');
  },
  // Hanya tag format sederhana yang diizinkan untuk catatan v-html.
  safeNote(html) {
    const source = document.createElement('template');
    source.innerHTML = html;
    const output = document.createElement('div');
    const allowed = ['EM', 'STRONG', 'U', 'I', 'B', 'BR'];
    function copy(node, target) {
      if (node.nodeType === 3) target.appendChild(document.createTextNode(node.textContent));
      else if (node.nodeType === 1) {
        if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT'].includes(node.tagName)) return;
        const element = allowed.includes(node.tagName) ? document.createElement(node.tagName) : document.createDocumentFragment();
        node.childNodes.forEach(child => copy(child, element));
        target.appendChild(element);
      }
    }
    source.content.childNodes.forEach(node => copy(node, output));
    return output.innerHTML;
  }
};
